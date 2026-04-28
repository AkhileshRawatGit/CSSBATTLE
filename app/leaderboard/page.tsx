'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';

interface LeaderboardEntry {
  userId: string;
  name: string;
  email: string;
  score: number;
  similarity: number;
  codeLength: number;
  submittedAt: string;
  challengeTitle?: string;
}

const medals = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [challenges, setChallenges] = useState<{ _id: string; title: string }[]>([]);
  const [selectedChallenge, setSelectedChallenge] = useState('');

  useEffect(() => {
    // Check lock status
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setIsLocked(data.isLeaderboardLocked))
      .catch(() => setIsLocked(false));
  }, []);

  useEffect(() => {
    fetch('/api/challenge')
      .then((r) => r.json())
      .then((d) => setChallenges(d.challenges || []));
  }, []);

  useEffect(() => {
    if (isLocked && !user?.isAdmin) return;

    const url = selectedChallenge
      ? `/api/leaderboard?challengeId=${selectedChallenge}`
      : '/api/leaderboard';
    setLoading(true);
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        setEntries(d.leaderboard || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedChallenge, isLocked, user]);

  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  // If locked and not admin, show locked UI
  if (isLocked && !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-battle-bg">
        <Navbar />
        <Sidebar />
        <main className="pl-16 pt-14 h-[calc(100vh-56px)] flex items-center justify-center">
          <div className="max-w-md w-full text-center p-8 animate-fade-in">
            <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-white mb-4">Leaderboard Locked</h1>
            <p className="text-battle-muted mb-8 leading-relaxed">
              The rankings are currently hidden by the administrator. Access will be granted once the battle evaluation is complete.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="px-8 py-3 bg-battle-card border border-battle-border text-white font-bold rounded-xl hover:bg-battle-surface transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-battle-bg">
      <Navbar />
      <Sidebar />

      <main className="pl-16 pt-14">
        <div className="max-w-5xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-black text-white">🏆 Leaderboard</h1>
              <p className="text-battle-muted text-sm mt-1">Top players ranked by best score</p>
            </div>

            {/* Challenge filter */}
            <select
              value={selectedChallenge}
              onChange={(e) => setSelectedChallenge(e.target.value)}
              className="input w-56 text-sm"
            >
              <option value="">All Challenges</option>
              {challenges.map((c) => (
                <option key={c._id} value={c._id}>{c.title}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="spinner w-8 h-8 border-2" />
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🏜️</div>
              <h3 className="text-white font-bold text-xl mb-2">No submissions yet</h3>
              <p className="text-battle-muted mb-6">Be the first to submit a solution!</p>
              <Link href="/battles" className="btn-primary">
                Start a Battle →
              </Link>
            </div>
          ) : (
            <>
              {/* Podium (top 3) */}
              {topThree.length > 0 && (
                <div className="flex items-end justify-center gap-4 mb-10">
                  {/* 2nd place */}
                  {topThree[1] && (
                    <div className="flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
                      <div className="text-3xl">🥈</div>
                      <div className="glass border border-silver-500/30 rounded-xl p-5 text-center w-36 h-32 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white font-bold mb-2">
                          {topThree[1].name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-white font-bold text-sm truncate w-full text-center">{topThree[1].name}</div>
                        <div className="text-yellow-400 font-black">{topThree[1].score.toLocaleString()}</div>
                      </div>
                      <div className="w-36 h-20 bg-slate-700/50 border border-slate-600/30 rounded-t-lg" />
                    </div>
                  )}
                  {/* 1st place */}
                  {topThree[0] && (
                    <div className="flex flex-col items-center gap-2 animate-fade-in">
                      <div className="text-4xl">🥇</div>
                      <div className="glass border border-yellow-500/40 rounded-xl p-5 text-center w-40 h-36 flex flex-col items-center justify-center glow-accent">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg mb-2">
                          {topThree[0].name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-white font-bold truncate w-full text-center">{topThree[0].name}</div>
                        <div className="text-yellow-400 font-black text-lg">{topThree[0].score.toLocaleString()}</div>
                      </div>
                      <div className="w-40 h-28 bg-yellow-900/30 border border-yellow-700/30 rounded-t-lg" />
                    </div>
                  )}
                  {/* 3rd place */}
                  {topThree[2] && (
                    <div className="flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
                      <div className="text-3xl">🥉</div>
                      <div className="glass border border-orange-800/30 rounded-xl p-5 text-center w-36 h-28 flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-700 to-amber-900 flex items-center justify-center text-white font-bold mb-2">
                          {topThree[2].name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-white font-bold text-sm truncate w-full text-center">{topThree[2].name}</div>
                        <div className="text-yellow-400 font-black">{topThree[2].score.toLocaleString()}</div>
                      </div>
                      <div className="w-36 h-14 bg-amber-900/30 border border-amber-800/30 rounded-t-lg" />
                    </div>
                  )}
                </div>
              )}

              {/* Full table */}
              <div className="card overflow-hidden">
                <div className="grid grid-cols-[40px_1fr_120px_80px_100px_130px] gap-4 px-5 py-3 border-b border-battle-border bg-battle-surface text-xs text-battle-muted font-semibold uppercase tracking-wider">
                  <span>#</span>
                  <span>Player</span>
                  <span>Challenge</span>
                  <span className="text-right">Score</span>
                  <span className="text-right">Similarity</span>
                  <span className="text-right">Time</span>
                </div>

                {entries.map((entry, i) => (
                  <div
                    key={`${entry.userId}-${i}`}
                    className={`grid grid-cols-[40px_1fr_120px_80px_100px_130px] gap-4 px-5 py-3.5 border-b border-battle-border/50 hover:bg-battle-surface/50 transition-colors text-sm animate-fade-in ${i < 3 ? 'bg-battle-surface/30' : ''
                      }`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <span className="flex items-center font-bold text-battle-muted">
                      {i < 3 ? medals[i] : `${i + 1}`}
                    </span>
                    <span className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 ${i === 0
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                            : i === 1
                              ? 'bg-gradient-to-br from-slate-400 to-slate-600'
                              : i === 2
                                ? 'bg-gradient-to-br from-orange-700 to-amber-900'
                                : 'bg-battle-border'
                          }`}
                      >
                        {entry.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-white font-medium truncate">{entry.name}</span>
                    </span>
                    <span className="flex items-center text-battle-muted truncate text-xs">
                      {entry.challengeTitle || '—'}
                    </span>
                    <span className="flex items-center justify-end font-black text-battle-accent">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="flex items-center justify-end text-green-400 font-semibold">
                      {entry.similarity?.toFixed(1)}%
                    </span>
                    <span className="flex items-center justify-end text-battle-muted text-xs">
                      {new Date(entry.submittedAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
