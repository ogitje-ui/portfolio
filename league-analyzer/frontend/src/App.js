import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Trophy,
  Target,
  Eye,
  Swords,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Info,
  Clock,
  Play,
  Loader2,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  BarChart3,
  Shield,
  Crosshair
} from 'lucide-react';

const API_BASE = 'http://localhost:5000/api';

// Region options for the dropdown
const REGIONS = [
  { value: 'na1', label: 'NA (North America)' },
  { value: 'euw1', label: 'EUW (Europe West)' },
  { value: 'eun1', label: 'EUNE (Europe Nordic & East)' },
  { value: 'kr', label: 'KR (Korea)' },
  { value: 'br1', label: 'BR (Brazil)' },
  { value: 'la1', label: 'LAN (Latin America North)' },
  { value: 'la2', label: 'LAS (Latin America South)' },
  { value: 'oc1', label: 'OCE (Oceania)' },
  { value: 'jp1', label: 'JP (Japan)' },
  { value: 'tr1', label: 'TR (Turkey)' },
  { value: 'ru', label: 'RU (Russia)' }
];

// Role icons mapping
const ROLE_ICONS = {
  TOP: Shield,
  JUNGLE: Activity,
  MIDDLE: Zap,
  BOTTOM: Crosshair,
  UTILITY: Eye,
  UNKNOWN: Target
};

// Stats Card Component
function StatsCard({ icon: Icon, label, value, subValue, color = 'amber' }) {
  const colorClasses = {
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
    purple: 'from-purple-500/20 to-violet-500/20 border-purple-500/30',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-4 backdrop-blur-sm animate-fade-in`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-5 h-5 text-${color}-400`} />
        </div>
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {subValue && <p className="text-xs text-slate-500">{subValue}</p>}
        </div>
      </div>
    </div>
  );
}

// Match Card Component
function MatchCard({ match, onDeepAnalyze, isAnalyzing }) {
  const RoleIcon = ROLE_ICONS[match.role] || Target;
  const kda = match.deaths > 0
    ? ((match.kills + match.assists) / match.deaths).toFixed(2)
    : (match.kills + match.assists).toFixed(2);

  return (
    <div
      className={`bg-slate-800/50 border rounded-xl p-4 transition-all hover:scale-[1.02] animate-slide-up ${
        match.win
          ? 'border-green-500/30 hover:border-green-500/50'
          : 'border-red-500/30 hover:border-red-500/50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Champion & Result */}
          <div className="text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
              match.win ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              {match.champion?.substring(0, 2) || '??'}
            </div>
            <p className={`text-xs mt-1 font-semibold ${match.win ? 'text-green-400' : 'text-red-400'}`}>
              {match.win ? 'WIN' : 'LOSS'}
            </p>
          </div>

          {/* Champion Name & Role */}
          <div>
            <p className="text-white font-semibold">{match.champion || 'Unknown'}</p>
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <RoleIcon className="w-3 h-3" />
              <span>{match.role || 'Unknown'}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-white font-bold">
              {match.kills}/{match.deaths}/{match.assists}
            </p>
            <p className="text-slate-500 text-xs">{kda} KDA</p>
          </div>

          <div className="text-center">
            <p className="text-amber-400 font-bold">{match.cs}</p>
            <p className="text-slate-500 text-xs">{match.csPerMin} CS/m</p>
          </div>

          <div className="text-center">
            <p className="text-purple-400 font-bold">{match.visionScore}</p>
            <p className="text-slate-500 text-xs">Vision</p>
          </div>

          {/* Deep Analyze Button */}
          <button
            onClick={() => onDeepAnalyze(match)}
            disabled={isAnalyzing}
            className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400
                     hover:bg-purple-500/30 hover:border-purple-500/50 transition-all flex items-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Deep Analyze
          </button>
        </div>
      </div>
    </div>
  );
}

// Coaching Tip Component
function CoachingTip({ tip }) {
  const priorityConfig = {
    high: { icon: AlertCircle, color: 'red', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    medium: { icon: Info, color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    info: { icon: CheckCircle, color: 'green', bg: 'bg-green-500/10', border: 'border-green-500/30' }
  };

  const config = priorityConfig[tip.priority] || priorityConfig.info;
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 animate-fade-in`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 text-${config.color}-400 mt-0.5 flex-shrink-0`} />
        <div>
          <p className={`font-semibold text-${config.color}-400 text-sm`}>{tip.category}</p>
          <p className="text-slate-300 text-sm mt-1">{tip.tip}</p>
        </div>
      </div>
    </div>
  );
}

// Deep Analysis Progress Component
function DeepAnalysisProgress({ status, progress, message }) {
  return (
    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
        <h3 className="text-lg font-semibold text-purple-400">Deep Analysis in Progress</h3>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-slate-400">{message}</span>
          <span className="text-purple-400 font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-violet-500 h-full rounded-full transition-all duration-500 progress-pulse"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <p className="text-slate-500 text-xs mt-3">
        Status: <span className="text-purple-400 uppercase">{status}</span>
      </p>
    </div>
  );
}

// Deep Analysis Results Component
function DeepAnalysisResults({ result }) {
  const [showTimeline, setShowTimeline] = useState(false);

  if (!result) return null;

  return (
    <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/30 rounded-xl p-6 animate-fade-in glow-purple">
      <div className="flex items-center gap-3 mb-6">
        <BarChart3 className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-bold text-purple-400">Deep Analysis Results</h3>
      </div>

      {/* Executive Summary */}
      <div className="bg-slate-800/50 rounded-lg p-4 mb-6">
        <h4 className="text-amber-400 font-semibold mb-2">Executive Summary</h4>
        <p className="text-slate-300 text-sm">{result.executiveSummary}</p>
      </div>

      {/* Key Strengths */}
      <div className="mb-6">
        <h4 className="text-green-400 font-semibold mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Key Strengths
        </h4>
        <div className="space-y-2">
          {result.keyStrengths?.map((strength, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-300 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <span>{strength}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Mistakes */}
      <div className="mb-6">
        <h4 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
          <TrendingDown className="w-4 h-4" /> Critical Mistakes
        </h4>
        <div className="space-y-2">
          {result.criticalMistakes?.map((mistake, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-300 text-sm">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
              <span>{mistake}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Items */}
      <div className="mb-6">
        <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
          <Target className="w-4 h-4" /> Top Action Items
        </h4>
        <div className="space-y-2">
          {result.actionItems?.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-300 text-sm bg-amber-500/10 rounded-lg p-3">
              <span className="text-amber-400 font-bold">{i + 1}.</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Timeline */}
      {result.frameAnalyses && result.frameAnalyses.length > 0 && (
        <div>
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            {showTimeline ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="font-semibold">
              {showTimeline ? 'Hide' : 'Show'} Frame-by-Frame Timeline ({result.frameAnalyses.length} segments)
            </span>
          </button>

          {showTimeline && (
            <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
              {result.frameAnalyses.map((frame, i) => (
                <div key={i} className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-slate-400 text-sm font-mono">{frame.timestamp}</span>
                  </div>
                  <div className="text-slate-300 text-sm">
                    {frame.analysis?.raw_response || frame.analysis?.insights?.join('\n') || 'No analysis available'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Main App Component
function App() {
  const [summonerName, setSummonerName] = useState('');
  const [region, setRegion] = useState('na1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  // Deep analysis state
  const [deepAnalysisJobId, setDeepAnalysisJobId] = useState(null);
  const [deepAnalysisStatus, setDeepAnalysisStatus] = useState(null);
  const [deepAnalysisResult, setDeepAnalysisResult] = useState(null);

  // Poll for deep analysis status
  useEffect(() => {
    if (!deepAnalysisJobId || deepAnalysisStatus?.status === 'completed' || deepAnalysisStatus?.status === 'error') {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`${API_BASE}/deep-analyze/status/${deepAnalysisJobId}`);
        const data = await response.json();
        setDeepAnalysisStatus(data);

        if (data.status === 'completed') {
          // Fetch the result
          const resultResponse = await fetch(`${API_BASE}/deep-analyze/result/${deepAnalysisJobId}`);
          const resultData = await resultResponse.json();
          setDeepAnalysisResult(resultData);
        }
      } catch (err) {
        console.error('Error polling deep analysis status:', err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [deepAnalysisJobId, deepAnalysisStatus?.status]);

  // Quick analysis handler
  const handleAnalyze = useCallback(async () => {
    if (!summonerName.trim()) {
      setError('Please enter a Summoner Name');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisData(null);
    setDeepAnalysisJobId(null);
    setDeepAnalysisStatus(null);
    setDeepAnalysisResult(null);

    try {
      const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summonerName, region })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setAnalysisData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [summonerName, region]);

  // Deep analysis handler
  const handleDeepAnalyze = useCallback(async (match) => {
    setDeepAnalysisResult(null);
    setDeepAnalysisStatus({ status: 'starting', progress: 0, message: 'Initializing...' });

    try {
      const response = await fetch(`${API_BASE}/deep-analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId: match.matchId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start deep analysis');
      }

      setDeepAnalysisJobId(data.jobId);
    } catch (err) {
      setError(err.message);
      setDeepAnalysisStatus(null);
    }
  }, []);

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900/50 border-b border-slate-700/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center glow-amber">
                <Swords className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gradient">LoL Performance Analyzer</h1>
                <p className="text-slate-500 text-xs">AI-Powered Coaching</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 mb-8 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-slate-300 mb-4">Quick Analysis</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Enter Riot ID (e.g., PlayerName#TAG)"
                  value={summonerName}
                  onChange={(e) => setSummonerName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl
                           text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50
                           focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white
                       focus:outline-none focus:border-amber-500/50 cursor-pointer"
            >
              {REGIONS.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-amber-400 to-orange-600 rounded-xl font-semibold
                       text-slate-900 hover:from-amber-300 hover:to-orange-500 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2
                       glow-amber"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Analyze
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysisData && (
          <div className="space-y-8 animate-fade-in">
            {/* Summoner Info */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-slate-900">
                {analysisData.summoner?.name?.charAt(0) || '?'}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{analysisData.summoner?.name}</h2>
                <p className="text-slate-400">Level {analysisData.summoner?.level || 'N/A'}</p>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                icon={Swords}
                label="Avg KDA"
                value={analysisData.stats?.avgKDA || 'N/A'}
                subValue={`${analysisData.stats?.avgKills || 0}/${analysisData.stats?.avgDeaths || 0}/${analysisData.stats?.avgAssists || 0}`}
                color="amber"
              />
              <StatsCard
                icon={Activity}
                label="CS/min"
                value={analysisData.stats?.avgCSPerMin || 'N/A'}
                color="blue"
              />
              <StatsCard
                icon={Eye}
                label="Vision Score"
                value={analysisData.stats?.avgVisionScore || 'N/A'}
                color="purple"
              />
              <StatsCard
                icon={Trophy}
                label="Win Rate"
                value={`${analysisData.stats?.winRate || 0}%`}
                subValue={`${analysisData.stats?.gamesPlayed || 0} games`}
                color="green"
              />
            </div>

            {/* Recent Matches */}
            <div>
              <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                Recent Matches
              </h3>
              <div className="space-y-3">
                {analysisData.matches?.map((match, i) => (
                  <MatchCard
                    key={match.matchId || i}
                    match={match}
                    onDeepAnalyze={handleDeepAnalyze}
                    isAnalyzing={deepAnalysisStatus && deepAnalysisStatus.status !== 'completed' && deepAnalysisStatus.status !== 'error'}
                  />
                ))}
              </div>
            </div>

            {/* Deep Analysis Section */}
            {deepAnalysisStatus && deepAnalysisStatus.status !== 'completed' && deepAnalysisStatus.status !== 'error' && (
              <DeepAnalysisProgress
                status={deepAnalysisStatus.status}
                progress={deepAnalysisStatus.progress}
                message={deepAnalysisStatus.message}
              />
            )}

            {deepAnalysisResult && (
              <DeepAnalysisResults result={deepAnalysisResult} />
            )}

            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Strengths */}
              {analysisData.strengths && analysisData.strengths.length > 0 && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Strengths
                  </h3>
                  <div className="space-y-2">
                    {analysisData.strengths.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses */}
              {analysisData.weaknesses && analysisData.weaknesses.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5" />
                    Areas to Improve
                  </h3>
                  <div className="space-y-2">
                    {analysisData.weaknesses.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                        <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Coaching Tips */}
            {analysisData.coachingTips && analysisData.coachingTips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-400" />
                  AI Coaching Tips
                </h3>
                <div className="grid gap-3">
                  {analysisData.coachingTips.map((tip, i) => (
                    <CoachingTip key={i} tip={tip} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && !analysisData && !error && (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-600/20
                          flex items-center justify-center border border-amber-500/30">
              <Swords className="w-10 h-10 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-300 mb-2">Ready to Analyze</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Enter your Riot ID above to get instant performance analysis, AI coaching tips,
              and access to deep replay analysis.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-slate-600 text-sm">
            LoL Performance Analyzer is not endorsed by Riot Games and does not reflect the views or opinions
            of Riot Games or anyone officially involved in producing or managing Riot Games properties.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
