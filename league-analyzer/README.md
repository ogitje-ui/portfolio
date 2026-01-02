# League of Legends Performance Analyzer

An AI-powered performance analysis tool for League of Legends players. Get instant coaching tips, identify strengths and weaknesses, and improve your gameplay.

## Features

### Quick Analysis
- Instant stats from your recent matches via Riot API
- AI-generated coaching tips based on your performance
- KDA, CS/min, Vision Score, and Win Rate tracking
- Strengths and weaknesses identification

### Deep Analysis (Beta)
- Frame-by-frame replay analysis
- Timestamped insights and recommendations
- Executive summary with action items
- Minimal storage (~50KB per game vs 500MB video)

## Tech Stack

**Backend:**
- Python 3.8+ with Flask
- Riot Games API integration
- Anthropic Claude API for AI coaching
- Pillow for screen capture (deep analysis)

**Frontend:**
- React 18
- Tailwind CSS
- Lucide React icons
- Rajdhani font

## Quick Start

### Prerequisites
- Python 3.8 or higher
- Node.js 16 or higher
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd league-analyzer
   ```

2. **Start the backend:**

   **Linux/Mac:**
   ```bash
   chmod +x start-backend.sh
   ./start-backend.sh
   ```

   **Windows:**
   ```batch
   start-backend.bat
   ```

3. **Start the frontend (in a new terminal):**

   **Linux/Mac:**
   ```bash
   chmod +x start-frontend.sh
   ./start-frontend.sh
   ```

   **Windows:**
   ```batch
   start-frontend.bat
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## Manual Setup

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate
# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
python app.py
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

## Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Riot API Key (get yours from https://developer.riotgames.com)
RIOT_API_KEY=your-riot-api-key

# Optional: Anthropic API Key (for AI coaching)
ANTHROPIC_API_KEY=your-anthropic-key

# Server settings
PORT=5000
FLASK_ENV=development
```

### API Keys

1. **Riot Games API Key:**
   - Visit https://developer.riotgames.com
   - Log in with your Riot account
   - Generate a Development API Key
   - Note: Development keys expire every 24 hours

2. **Anthropic API Key (Optional):**
   - Visit https://console.anthropic.com
   - Create an account and generate an API key
   - This enables enhanced AI coaching features

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/analyze` | POST | Quick analysis of recent games |
| `/api/deep-analyze` | POST | Start deep analysis job |
| `/api/deep-analyze/status/{jobId}` | GET | Check deep analysis progress |
| `/api/deep-analyze/result/{jobId}` | GET | Get completed analysis |
| `/api/available-replays` | GET | List available replay files |

### Quick Analysis Request

```json
POST /api/analyze
{
  "summonerName": "PlayerName#TAG",
  "region": "na1"
}
```

### Quick Analysis Response

```json
{
  "summoner": {
    "name": "PlayerName#TAG",
    "level": 150
  },
  "stats": {
    "avgKDA": 3.5,
    "avgCSPerMin": 7.2,
    "avgVisionScore": 18,
    "winRate": 55.0
  },
  "matches": [...],
  "coachingTips": [...],
  "strengths": [...],
  "weaknesses": [...]
}
```

## Deep Analysis

The deep analysis feature captures gameplay frames and uses AI to provide detailed insights.

### How It Works:
1. Click "Deep Analyze" on any recent match
2. If a replay file is available, it will be launched
3. The system captures screenshots every 3-4 seconds
4. Frames are analyzed in batches using Claude AI
5. Results include timestamped insights and an executive summary

### Requirements:
- League of Legends client installed
- Replay files located in `~/Documents/League of Legends/Replays/`
- Pillow library for screen capture
- Anthropic API key for AI analysis

## Troubleshooting

### "Player not found" error
- Ensure you're using the correct Riot ID format: `GameName#TAG`
- Verify the region is correct
- Check if your Riot API key is valid

### Backend won't start
- Ensure Python 3.8+ is installed
- Check if port 5000 is available
- Verify all dependencies are installed

### Frontend won't start
- Ensure Node.js 16+ is installed
- Check if port 3000 is available
- Try deleting `node_modules` and running `npm install` again

### Deep analysis not working
- Ensure Pillow is installed (`pip install Pillow`)
- Check if League of Legends is running
- Verify Anthropic API key is set

### Rate limiting (429 errors)
- Riot API has rate limits (20 requests/second for dev keys)
- Wait a few seconds between requests
- Consider applying for a production API key

## Project Structure

```
league-analyzer/
├── backend/
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment template
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── App.js          # Main React component
│   │   ├── index.js        # Entry point
│   │   └── index.css       # Tailwind styles
│   ├── package.json        # Node dependencies
│   └── tailwind.config.js  # Tailwind configuration
├── start-backend.sh        # Backend start script (Unix)
├── start-backend.bat       # Backend start script (Windows)
├── start-frontend.sh       # Frontend start script (Unix)
├── start-frontend.bat      # Frontend start script (Windows)
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Supported Regions

| Code | Region |
|------|--------|
| na1 | North America |
| euw1 | Europe West |
| eun1 | Europe Nordic & East |
| kr | Korea |
| br1 | Brazil |
| la1 | Latin America North |
| la2 | Latin America South |
| oc1 | Oceania |
| jp1 | Japan |
| tr1 | Turkey |
| ru | Russia |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Legal Notice

This project is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc.

## License

MIT License - See LICENSE file for details.
