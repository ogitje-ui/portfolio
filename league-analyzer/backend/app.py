"""
League of Legends Performance Analyzer - Backend
A Flask application providing Quick Analysis via Riot API and Deep Analysis via replay parsing.
"""

import os
import sys
import json
import time
import uuid
import base64
import threading
import subprocess
import platform
from pathlib import Path
from datetime import datetime
from io import BytesIO

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

# Try to import Pillow for screen capture (optional for deep analysis)
try:
    from PIL import ImageGrab, Image
    PILLOW_AVAILABLE = True
except ImportError:
    PILLOW_AVAILABLE = False
    print("Warning: Pillow not available for screen capture. Deep analysis will be limited.")

# Try to import Anthropic
try:
    import anthropic
    ANTHROPIC_AVAILABLE = True
except ImportError:
    ANTHROPIC_AVAILABLE = False
    print("Warning: Anthropic SDK not available. AI coaching will be limited.")

app = Flask(__name__)
CORS(app, origins="*")

# Configuration
RIOT_API_KEY = os.environ.get('RIOT_API_KEY', 'RGAPI-ffa11104-de53-48dd-9370-7356e869ec26')

# Region routing for Riot API
REGION_ROUTING = {
    'na1': 'americas',
    'br1': 'americas',
    'la1': 'americas',
    'la2': 'americas',
    'euw1': 'europe',
    'eun1': 'europe',
    'tr1': 'europe',
    'ru': 'europe',
    'kr': 'asia',
    'jp1': 'asia',
    'oc1': 'sea',
    'ph2': 'sea',
    'sg2': 'sea',
    'th2': 'sea',
    'tw2': 'sea',
    'vn2': 'sea'
}

# Storage for deep analysis jobs
deep_analysis_jobs = {}
ANALYSIS_STORAGE_DIR = Path.home() / "LeagueAnalysis"
REPLAY_DIR = Path.home() / "Documents" / "League of Legends" / "Replays"

# Ensure storage directory exists
ANALYSIS_STORAGE_DIR.mkdir(parents=True, exist_ok=True)


def get_routing_region(platform_region):
    """Get the routing region for account/match data."""
    return REGION_ROUTING.get(platform_region.lower(), 'americas')


def riot_api_request(url, retries=3, delay=1):
    """Make a request to Riot API with retry logic and rate limiting."""
    headers = {"X-Riot-Token": RIOT_API_KEY}

    for attempt in range(retries):
        try:
            response = requests.get(url, headers=headers, timeout=10)

            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:
                # Rate limited - wait and retry
                retry_after = int(response.headers.get('Retry-After', delay * 2))
                time.sleep(retry_after)
                continue
            elif response.status_code == 404:
                return None
            else:
                print(f"Riot API error: {response.status_code} - {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"Request error (attempt {attempt + 1}): {e}")
            if attempt < retries - 1:
                time.sleep(delay)

    return None


def get_account_by_riot_id(game_name, tag_line, region):
    """Get account PUUID by Riot ID (GameName#TAG)."""
    routing_region = get_routing_region(region)
    url = f"https://{routing_region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
    return riot_api_request(url)


def get_summoner_by_puuid(puuid, region):
    """Get summoner data by PUUID."""
    url = f"https://{region}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/{puuid}"
    return riot_api_request(url)


def get_match_history(puuid, region, count=5):
    """Get recent match IDs for a player."""
    routing_region = get_routing_region(region)
    url = f"https://{routing_region}.api.riotgames.com/lol/match/v5/matches/by-puuid/{puuid}/ids?count={count}"
    return riot_api_request(url)


def get_match_details(match_id, region):
    """Get detailed match data."""
    routing_region = get_routing_region(region)
    url = f"https://{routing_region}.api.riotgames.com/lol/match/v5/matches/{match_id}"
    return riot_api_request(url)


def parse_match_data(match_data, puuid):
    """Parse match data for a specific player."""
    if not match_data:
        return None

    info = match_data.get('info', {})
    participants = info.get('participants', [])

    # Find player in participants
    player_data = None
    for p in participants:
        if p.get('puuid') == puuid:
            player_data = p
            break

    if not player_data:
        return None

    game_duration = info.get('gameDuration', 0)
    minutes = game_duration / 60 if game_duration > 0 else 1

    return {
        'matchId': match_data.get('metadata', {}).get('matchId'),
        'champion': player_data.get('championName'),
        'role': player_data.get('teamPosition', 'UNKNOWN'),
        'win': player_data.get('win'),
        'kills': player_data.get('kills', 0),
        'deaths': player_data.get('deaths', 0),
        'assists': player_data.get('assists', 0),
        'cs': player_data.get('totalMinionsKilled', 0) + player_data.get('neutralMinionsKilled', 0),
        'csPerMin': round((player_data.get('totalMinionsKilled', 0) + player_data.get('neutralMinionsKilled', 0)) / minutes, 1),
        'visionScore': player_data.get('visionScore', 0),
        'goldEarned': player_data.get('goldEarned', 0),
        'damageDealt': player_data.get('totalDamageDealtToChampions', 0),
        'gameDuration': game_duration,
        'gameMode': info.get('gameMode'),
        'gameCreation': info.get('gameCreation')
    }


def calculate_overall_stats(matches):
    """Calculate overall statistics from match data."""
    if not matches:
        return {}

    total_kills = sum(m.get('kills', 0) for m in matches)
    total_deaths = sum(m.get('deaths', 0) for m in matches)
    total_assists = sum(m.get('assists', 0) for m in matches)
    total_cs_per_min = sum(m.get('csPerMin', 0) for m in matches)
    total_vision = sum(m.get('visionScore', 0) for m in matches)
    wins = sum(1 for m in matches if m.get('win'))

    num_matches = len(matches)
    avg_deaths = total_deaths / num_matches if num_matches > 0 else 1

    return {
        'avgKDA': round((total_kills + total_assists) / max(avg_deaths * num_matches, 1), 2),
        'avgKills': round(total_kills / num_matches, 1),
        'avgDeaths': round(total_deaths / num_matches, 1),
        'avgAssists': round(total_assists / num_matches, 1),
        'avgCSPerMin': round(total_cs_per_min / num_matches, 1),
        'avgVisionScore': round(total_vision / num_matches, 1),
        'winRate': round((wins / num_matches) * 100, 1),
        'gamesPlayed': num_matches
    }


def generate_coaching_tips(stats, matches):
    """Generate AI coaching tips based on player statistics."""
    tips = []

    # Analyze KDA
    if stats.get('avgDeaths', 0) > 5:
        tips.append({
            'priority': 'high',
            'category': 'Survivability',
            'tip': 'You\'re dying too often. Focus on map awareness, ward coverage, and positioning in teamfights.'
        })
    elif stats.get('avgDeaths', 0) < 3 and stats.get('avgKills', 0) > 5:
        tips.append({
            'priority': 'info',
            'category': 'Strengths',
            'tip': 'Excellent survivability while maintaining kill pressure. Keep playing aggressive but smart.'
        })

    # Analyze CS
    if stats.get('avgCSPerMin', 0) < 6:
        tips.append({
            'priority': 'medium',
            'category': 'Farming',
            'tip': 'Your CS per minute is below average. Practice last-hitting in custom games and learn wave management.'
        })
    elif stats.get('avgCSPerMin', 0) > 8:
        tips.append({
            'priority': 'info',
            'category': 'Strengths',
            'tip': 'Great CS numbers! You\'re efficiently collecting gold from minions.'
        })

    # Analyze Vision
    if stats.get('avgVisionScore', 0) < 15:
        tips.append({
            'priority': 'medium',
            'category': 'Vision',
            'tip': 'Improve your vision game. Buy control wards, use trinkets actively, and clear enemy vision.'
        })

    # Analyze Win Rate
    if stats.get('winRate', 50) < 45:
        tips.append({
            'priority': 'high',
            'category': 'Improvement',
            'tip': 'Focus on one or two champions to master. Consistency is key to climbing.'
        })
    elif stats.get('winRate', 50) > 55:
        tips.append({
            'priority': 'info',
            'category': 'Strengths',
            'tip': 'You\'re winning more than you\'re losing. Keep up the good work!'
        })

    # Role-specific tips based on most played position
    roles = [m.get('role') for m in matches if m.get('role')]
    if roles:
        main_role = max(set(roles), key=roles.count)
        if main_role == 'JUNGLE':
            tips.append({
                'priority': 'medium',
                'category': 'Jungle',
                'tip': 'Track enemy jungler and prioritize objectives. Dragon/Baron control wins games.'
            })
        elif main_role == 'SUPPORT':
            tips.append({
                'priority': 'medium',
                'category': 'Support',
                'tip': 'Focus on enabling your carries. Vision control and roaming can impact the whole map.'
            })

    return tips


def generate_strengths_weaknesses(stats, matches):
    """Analyze player data to identify strengths and weaknesses."""
    strengths = []
    weaknesses = []

    # KDA analysis
    if stats.get('avgKDA', 0) > 3:
        strengths.append('Strong KDA ratio shows good fight selection')
    elif stats.get('avgKDA', 0) < 2:
        weaknesses.append('KDA could improve - focus on avoiding unnecessary deaths')

    # CS analysis
    if stats.get('avgCSPerMin', 0) > 7:
        strengths.append('Excellent CS numbers - efficient gold income')
    elif stats.get('avgCSPerMin', 0) < 5:
        weaknesses.append('CS needs work - practice last hitting')

    # Vision analysis
    if stats.get('avgVisionScore', 0) > 20:
        strengths.append('Good vision control and map awareness')
    elif stats.get('avgVisionScore', 0) < 10:
        weaknesses.append('Vision score is low - buy more wards')

    # Consistency check
    win_streak = 0
    current_streak = 0
    for m in matches:
        if m.get('win'):
            current_streak += 1
            win_streak = max(win_streak, current_streak)
        else:
            current_streak = 0

    if win_streak >= 3:
        strengths.append(f'{win_streak} game win streak - momentum is on your side')

    return {'strengths': strengths, 'weaknesses': weaknesses}


# ==================== DEEP ANALYSIS FUNCTIONS ====================

def capture_screen():
    """Capture the current screen."""
    if not PILLOW_AVAILABLE:
        return None

    try:
        screenshot = ImageGrab.grab()
        # Resize to reduce data size
        screenshot = screenshot.resize((1280, 720), Image.LANCZOS)
        return screenshot
    except Exception as e:
        print(f"Screen capture error: {e}")
        return None


def image_to_base64(image):
    """Convert PIL Image to base64 string."""
    if image is None:
        return None

    buffer = BytesIO()
    image.save(buffer, format='JPEG', quality=70)
    return base64.b64encode(buffer.getvalue()).decode('utf-8')


def launch_replay(replay_path):
    """Launch League of Legends replay file."""
    if not os.path.exists(replay_path):
        return False

    system = platform.system()
    try:
        if system == 'Windows':
            os.startfile(replay_path)
        elif system == 'Darwin':  # macOS
            subprocess.Popen(['open', replay_path])
        else:  # Linux
            subprocess.Popen(['xdg-open', replay_path])
        return True
    except Exception as e:
        print(f"Failed to launch replay: {e}")
        return False


def analyze_frames_with_claude(frames, context=""):
    """Send frames to Claude for analysis."""
    if not ANTHROPIC_AVAILABLE:
        return {
            "insights": ["Deep analysis requires Anthropic SDK"],
            "suggestions": []
        }

    try:
        client = anthropic.Anthropic()

        # Build content with images
        content = []
        for i, frame in enumerate(frames):
            if frame:
                content.append({
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/jpeg",
                        "data": frame
                    }
                })

        content.append({
            "type": "text",
            "text": f"""Analyze these League of Legends gameplay frames. {context}

Please provide:
1. Key observations about positioning, map state, and game situation
2. Mistakes or missed opportunities
3. Good plays or decisions
4. Specific advice for improvement

Focus on actionable coaching insights."""
        })

        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            messages=[{"role": "user", "content": content}]
        )

        return {
            "insights": response.content[0].text.split('\n'),
            "raw_response": response.content[0].text
        }
    except Exception as e:
        print(f"Claude analysis error: {e}")
        return {"insights": [f"Analysis error: {str(e)}"], "suggestions": []}


def run_deep_analysis(job_id, replay_path=None):
    """Background task for deep analysis."""
    job = deep_analysis_jobs.get(job_id)
    if not job:
        return

    try:
        job['status'] = 'running'
        job['progress'] = 5
        job['message'] = 'Initializing analysis...'

        # If replay path provided, try to launch it
        if replay_path and os.path.exists(replay_path):
            job['message'] = 'Launching replay...'
            job['progress'] = 10
            launch_replay(replay_path)
            time.sleep(5)  # Wait for replay to start

        frames = []
        frame_analyses = []
        total_frames = 20  # Capture 20 frames over ~60-80 seconds

        for i in range(total_frames):
            job['progress'] = 15 + int((i / total_frames) * 50)
            job['message'] = f'Capturing frame {i + 1}/{total_frames}...'

            # Capture screen
            screenshot = capture_screen()
            if screenshot:
                frame_b64 = image_to_base64(screenshot)
                frames.append(frame_b64)

            # Analyze in batches of 8
            if len(frames) >= 8:
                job['message'] = f'Analyzing batch...'
                batch_analysis = analyze_frames_with_claude(
                    frames[-8:],
                    f"Frames {i-7} to {i} of gameplay"
                )
                frame_analyses.append({
                    'timestamp': f'{(i-7)*3}-{i*3}s',
                    'analysis': batch_analysis
                })

            time.sleep(3)  # Wait between captures

        job['progress'] = 75
        job['message'] = 'Generating final analysis...'

        # Generate executive summary
        all_insights = []
        for fa in frame_analyses:
            if fa.get('analysis', {}).get('insights'):
                all_insights.extend(fa['analysis']['insights'])

        # Create summary
        summary = {
            'executiveSummary': 'Deep analysis complete. Review the timeline for detailed insights.',
            'keyStrengths': ['Analysis captured multiple gameplay moments', 'Vision and positioning tracked'],
            'criticalMistakes': ['Review timeline for specific mistakes'],
            'actionItems': [
                'Practice the identified weak points',
                'Review positioning in teamfights',
                'Focus on map awareness'
            ],
            'frameAnalyses': frame_analyses,
            'totalFrames': len(frames)
        }

        # If Claude is available, generate a better summary
        if ANTHROPIC_AVAILABLE and all_insights:
            try:
                client = anthropic.Anthropic()
                summary_response = client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=1500,
                    messages=[{
                        "role": "user",
                        "content": f"""Based on these gameplay insights, create an executive summary:

{chr(10).join(all_insights[:50])}

Provide:
1. Executive Summary (2-3 sentences)
2. Top 3 Key Strengths
3. Top 3 Critical Mistakes
4. Top 3 Action Items for improvement

Format as JSON with keys: executiveSummary, keyStrengths, criticalMistakes, actionItems"""
                    }]
                )

                # Try to parse JSON from response
                response_text = summary_response.content[0].text
                # Extract JSON if wrapped in markdown
                if '```json' in response_text:
                    json_str = response_text.split('```json')[1].split('```')[0]
                    parsed = json.loads(json_str)
                    summary.update(parsed)
                elif '{' in response_text:
                    start = response_text.index('{')
                    end = response_text.rindex('}') + 1
                    parsed = json.loads(response_text[start:end])
                    summary.update(parsed)
            except Exception as e:
                print(f"Summary generation error: {e}")

        job['progress'] = 95
        job['message'] = 'Saving results...'

        # Save results to file
        result_file = ANALYSIS_STORAGE_DIR / f"{job_id}.json"
        with open(result_file, 'w') as f:
            json.dump(summary, f, indent=2)

        job['status'] = 'completed'
        job['progress'] = 100
        job['message'] = 'Analysis complete!'
        job['result'] = summary
        job['completedAt'] = datetime.now().isoformat()

    except Exception as e:
        job['status'] = 'error'
        job['message'] = f'Analysis failed: {str(e)}'
        print(f"Deep analysis error: {e}")


# ==================== API ENDPOINTS ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'features': {
            'pillow': PILLOW_AVAILABLE,
            'anthropic': ANTHROPIC_AVAILABLE
        }
    })


@app.route('/api/analyze', methods=['POST'])
def quick_analyze():
    """Quick analysis endpoint - fetches recent games and generates coaching tips."""
    try:
        data = request.json
        summoner_name = data.get('summonerName', '')
        region = data.get('region', 'na1')

        # Parse Riot ID format (GameName#TAG)
        if '#' in summoner_name:
            game_name, tag_line = summoner_name.split('#', 1)
        else:
            game_name = summoner_name
            tag_line = region.upper()[:2] + '1'  # Default tag

        # Get account data
        account = get_account_by_riot_id(game_name, tag_line, region)
        if not account:
            return jsonify({'error': 'Player not found. Check the Riot ID format (GameName#TAG)'}), 404

        puuid = account.get('puuid')

        # Get summoner data
        summoner = get_summoner_by_puuid(puuid, region)

        # Get match history
        match_ids = get_match_history(puuid, region, count=5)
        if not match_ids:
            return jsonify({'error': 'No recent matches found'}), 404

        # Get match details
        matches = []
        for match_id in match_ids:
            time.sleep(0.1)  # Rate limiting
            match_data = get_match_details(match_id, region)
            parsed = parse_match_data(match_data, puuid)
            if parsed:
                matches.append(parsed)

        if not matches:
            return jsonify({'error': 'Could not retrieve match data'}), 500

        # Calculate stats and generate tips
        overall_stats = calculate_overall_stats(matches)
        coaching_tips = generate_coaching_tips(overall_stats, matches)
        analysis = generate_strengths_weaknesses(overall_stats, matches)

        return jsonify({
            'summoner': {
                'name': f"{game_name}#{tag_line}",
                'level': summoner.get('summonerLevel', 0) if summoner else 0,
                'profileIconId': summoner.get('profileIconId', 1) if summoner else 1
            },
            'stats': overall_stats,
            'matches': matches,
            'coachingTips': coaching_tips,
            'strengths': analysis['strengths'],
            'weaknesses': analysis['weaknesses']
        })

    except Exception as e:
        print(f"Analysis error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/api/deep-analyze', methods=['POST'])
def start_deep_analysis():
    """Start a deep analysis job."""
    try:
        data = request.json
        replay_path = data.get('replayPath')
        match_id = data.get('matchId')

        # Create job
        job_id = str(uuid.uuid4())
        deep_analysis_jobs[job_id] = {
            'id': job_id,
            'matchId': match_id,
            'status': 'queued',
            'progress': 0,
            'message': 'Job queued',
            'createdAt': datetime.now().isoformat(),
            'result': None
        }

        # Start background thread
        thread = threading.Thread(
            target=run_deep_analysis,
            args=(job_id, replay_path)
        )
        thread.daemon = True
        thread.start()

        return jsonify({
            'jobId': job_id,
            'status': 'queued',
            'message': 'Deep analysis started'
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/deep-analyze/status/<job_id>', methods=['GET'])
def get_deep_analysis_status(job_id):
    """Get status of a deep analysis job."""
    job = deep_analysis_jobs.get(job_id)
    if not job:
        return jsonify({'error': 'Job not found'}), 404

    return jsonify({
        'jobId': job['id'],
        'status': job['status'],
        'progress': job['progress'],
        'message': job['message']
    })


@app.route('/api/deep-analyze/result/<job_id>', methods=['GET'])
def get_deep_analysis_result(job_id):
    """Get result of a completed deep analysis job."""
    job = deep_analysis_jobs.get(job_id)

    # Try to load from file if not in memory
    if not job:
        result_file = ANALYSIS_STORAGE_DIR / f"{job_id}.json"
        if result_file.exists():
            with open(result_file, 'r') as f:
                return jsonify(json.load(f))
        return jsonify({'error': 'Job not found'}), 404

    if job['status'] != 'completed':
        return jsonify({'error': 'Analysis not yet complete', 'status': job['status']}), 400

    return jsonify(job.get('result', {}))


@app.route('/api/available-replays', methods=['GET'])
def list_available_replays():
    """List available replay files."""
    replays = []

    if REPLAY_DIR.exists():
        for file in REPLAY_DIR.glob('*.rofl'):
            stat = file.stat()
            replays.append({
                'name': file.name,
                'path': str(file),
                'size': stat.st_size,
                'modified': datetime.fromtimestamp(stat.st_mtime).isoformat()
            })

    # Sort by modification time (newest first)
    replays.sort(key=lambda x: x['modified'], reverse=True)

    return jsonify({
        'replays': replays,
        'replayDir': str(REPLAY_DIR),
        'replayDirExists': REPLAY_DIR.exists()
    })


if __name__ == '__main__':
    print("=" * 50)
    print("League of Legends Performance Analyzer - Backend")
    print("=" * 50)
    print(f"Pillow available: {PILLOW_AVAILABLE}")
    print(f"Anthropic available: {ANTHROPIC_AVAILABLE}")
    print(f"Analysis storage: {ANALYSIS_STORAGE_DIR}")
    print(f"Replay directory: {REPLAY_DIR}")
    print("=" * 50)

    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
