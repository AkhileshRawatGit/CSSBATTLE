'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ChallengeCard from '@/components/ChallengeCard';

interface Challenge {
  _id: string;
  title: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  description?: string;
  tags?: string[];
  createdAt: string;
}



export default function BattlesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Fetch challenges, user submissions (to keep compatibility), and progress
    Promise.all([
      fetch('/api/challenge').then(r => r.json()),
      fetch('/api/submit').then(r => r.json()).catch(() => ({ submissions: [] })),
      fetch('/api/progress').then(r => r.json()).catch(() => ({ progress: [] }))
    ]).then(([challengeData, submissionData, progressData]) => {
      const fetched = challengeData.challenges || [];
      setChallenges(fetched);

      // Combine both sources to ensure we catch all finished challenges
      const completed = new Set<string>();
      
      // From submissions
      (submissionData.submissions || []).forEach((s: any) => {
        const id = typeof s.challengeId === 'string' ? s.challengeId : s.challengeId._id;
        completed.add(id);
      });

      // From progress (most reliable for "locked" state)
      (progressData.progress || []).forEach((p: any) => {
        if (p.isFinished) {
          completed.add(p.challengeId);
        }
      });

      setCompletedIds(completed);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  const filtered = challenges
    .filter((c) => filter === 'all' || c.difficulty === filter)
    .filter((c) => c.title.toLowerCase().includes(search.toLowerCase()));

  const counts = {
    all: challenges.length,
    easy: challenges.filter((c) => c.difficulty === 'easy').length,
    medium: challenges.filter((c) => c.difficulty === 'medium').length,
    hard: challenges.filter((c) => c.difficulty === 'hard').length,
  };

  return (
    <div className="min-h-screen bg-battle-bg">
      <Navbar />
      <Sidebar />

      <main className="pl-16 pt-14">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-1">⚡ Battles</h1>
            <p className="text-battle-muted text-sm">Choose a target and start coding</p>
          </div>

          {/* Search + Filter row */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1 max-w-sm">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-battle-muted"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search challenges…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-9 text-sm"
              />
            </div>

            {/* Difficulty tabs */}
            <div className="flex gap-2">
              {(Object.entries(counts) as [typeof filter, number][]).map(([d, cnt]) => (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold capitalize transition-all flex items-center gap-1.5 ${filter === d
                      ? 'bg-battle-purple text-white'
                      : 'bg-battle-card text-battle-muted hover:text-white border border-battle-border'
                    }`}
                >
                  {d}
                  <span className={`text-xs rounded-full px-1.5 py-0.5 ${filter === d ? 'bg-white/20' : 'bg-battle-surface'}`}>
                    {cnt}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="card rounded-xl overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-battle-surface" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-battle-surface rounded w-3/4" />
                    <div className="h-3 bg-battle-surface rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((c, i) => (
                <ChallengeCard 
                  key={c._id} 
                  challenge={c} 
                  index={i} 
                  isFinished={completedIds.has(c._id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-white font-bold text-xl mb-2">No challenges found</h3>
              <p className="text-battle-muted">Try a different filter or search term.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
