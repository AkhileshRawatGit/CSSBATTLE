'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import ChallengeCard from '@/components/ChallengeCard';
import { useAuth } from '@/components/AuthProvider';

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


export default function Home() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  useEffect(() => {
    fetch('/api/challenge', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => {
        setChallenges(d.challenges || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? challenges : challenges.filter((c) => c.difficulty === filter);

  return (
    <div className="min-h-screen bg-battle-bg">
      <Navbar />
      <Sidebar />

      {/* Main content — offset for sidebar (64px) and navbar (56px) */}
      <main className="pl-16 pt-14">
        {/* ─── Hero ─── */}
        <section className="relative overflow-hidden hero-grid">
          {/* Glowing orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-battle-purple/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-battle-accent/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
            {/* Live badge */}
            <div className="flex items-center gap-2 glass px-3 py-1.5 rounded-full mb-6 border border-green-500/30">
              <div className="pulse-dot" />
              <span className="text-green-400 text-xs font-semibold">College Coding Event — Live Now</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-4">
              <span className="text-white">Welcome to </span>
              <br />
              <span className="gradient-text">CSSBattle</span>
            </h1>
            <p className="text-battle-muted text-lg md:text-xl max-w-2xl mb-8 leading-relaxed">
              Replicate beautiful target designs using <strong className="text-white">only HTML &amp; CSS</strong>.
              The shorter your code, the higher your score. Compete, learn, and dominate! 🔥
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-12">
              <Link href="/battles" className="btn-primary text-base px-7 py-3 rounded-xl glow-accent">
                🎮 Play Game
              </Link>
              <Link href="/learn" className="btn-secondary text-base px-7 py-3 rounded-xl">
                📚 Learn CSS
              </Link>
            </div>

            {/* ─── Arena Command Center ─── */}
            <div className="w-full max-w-5xl mt-12 relative">
              <div className="glass p-2 rounded-xl border border-white/10 overflow-hidden shadow-2xl relative">
                {/* Header Control Bar */}
                <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10 rounded-t-lg mb-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">ARENA_COMMAND_CENTER :: v1.0.4</span>
                  </div>
                  <div className="w-10 h-1 bg-white/10 rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-64 md:h-80">

                  {/* Column 1: Live Terminal Log */}
                  <div className="md:col-span-4 bg-black/60 rounded-lg p-4 font-mono text-[10px] relative overflow-hidden group">
                    <div className="absolute top-2 right-2 text-[8px] text-white/20 uppercase">Live_Feed</div>
                    <div className="flex flex-col gap-1.5 animate-terminal-scroll whitespace-nowrap">
                      {[
                        'Initializing connection...', 'SRHU_ACM_NODE established.', 'Fetching arena assets...',
                        'Scoring engine: ONLINE', 'Database: SYNCED', 'Waiting for input...',
                        '> User_402 solved Target #1', '> Similarity: 98.4%', '> Rank: #12',
                        'Analyzing code patterns...', 'Loading challenges...', 'Arena buffer: 100%',
                        'Updating leaderboard...', 'Security check: PASSED', 'System stable.',
                        'Initializing connection...', 'SRHU_ACM_NODE established.', 'Fetching arena assets...',
                        'Scoring engine: ONLINE', 'Database: SYNCED', 'Waiting for input...',
                        '> User_402 solved Target #1', '> Similarity: 98.4%', '> Rank: #12',
                        'Analyzing code patterns...', 'Loading challenges...', 'Arena buffer: 100%'
                      ].map((log, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-green-500/50">[{new Date().getHours()}:{new Date().getMinutes()}:{10 + i}]</span>
                          <span className="text-white/60">{log}</span>
                        </div>
                      ))}
                    </div>
                    {/* Dark gradient overlay to fix bottom fade */}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
                  </div>

                  {/* Column 2: Target Aperture / Battle Scanner */}
                  <div className="md:col-span-5 bg-white/5 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-battle-purple/5 opacity-20" />

                    {/* Aperture SVG */}
                    <div className="relative w-48 h-48 md:w-56 md:h-56">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Outer rotating ring */}
                        <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-white/10 animate-aperture-slow" strokeDasharray="10 5" />
                        {/* Middle rotating ring */}
                        <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" fill="none" className="text-battle-accent/20 animate-aperture-fast" strokeDasharray="40 10" />
                        {/* Inner static ring */}
                        <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" fill="none" className="text-[#5b9bd5]/40" />

                        {/* Crosshair */}
                        <line x1="50" y1="20" x2="50" y2="30" stroke="currentColor" strokeWidth="1" className="text-white/20" />
                        <line x1="50" y1="70" x2="50" y2="80" stroke="currentColor" strokeWidth="1" className="text-white/20" />
                        <line x1="20" y1="50" x2="30" y2="50" stroke="currentColor" strokeWidth="1" className="text-white/20" />
                        <line x1="70" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="1" className="text-white/20" />
                      </svg>

                      {/* Central Core */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 bg-battle-accent/20 rounded-full flex items-center justify-center border border-battle-accent/30 animate-pulse">
                          <span className="text-battle-accent text-xl font-black">⚡</span>
                        </div>
                      </div>

                      {/* Laser scanning line */}
                      <div className="absolute left-0 right-0 h-[2px] bg-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-laser pointer-events-none" />
                    </div>

                    <div className="absolute bottom-4 text-[9px] font-mono text-white/30 tracking-widest uppercase">Targeting_Active</div>
                  </div>

                  {/* Column 3: System Status & Stats Readout */}
                  <div className="md:col-span-3 flex flex-col gap-2">
                    {/* Status Bars */}
                    <div className="flex-1 bg-white/5 rounded-lg p-4 flex flex-col justify-between">
                      <div className="text-[9px] font-mono text-white/30 uppercase mb-4 tracking-widest">System_Health</div>
                      <div className="flex items-end gap-3 h-24 mb-4 px-2">
                        {[0.7, 0.4, 0.9, 0.6, 0.5, 0.8].map((h, i) => (
                          <div key={i} className="flex-1 bg-white/5 rounded-full relative group/bar">
                            <div
                              className="absolute bottom-0 left-0 right-0 bg-[#5b9bd5]/30 rounded-full transition-all duration-1000 group-hover/bar:bg-[#5b9bd5]/60"
                              style={{ height: `${h * 100}%`, animation: `barGrow ${2 + i * 0.5}s ease-in-out infinite` }}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: 'DB_SYNC', status: 'OK', color: 'text-green-500' },
                          { label: 'ARENA_IO', status: '94%', color: 'text-blue-500' },
                          { label: 'NODE_X', status: 'BALANCED', color: 'text-yellow-500' }
                        ].map(s => (
                          <div key={s.label} className="flex justify-between font-mono text-[9px]">
                            <span className="text-white/40">{s.label}</span>
                            <span className={s.color}>{s.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats Blips */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-lg font-black text-white font-mono leading-none tracking-tighter">50+</div>
                        <div className="text-[8px] text-white/30 uppercase mt-1">Targets</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-3 text-center">
                        <div className="text-lg font-black text-white font-mono leading-none tracking-tighter">1K+</div>
                        <div className="text-[8px] text-white/30 uppercase mt-1">Elite</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Status Line */}
                <div className="mt-2 h-6 flex items-center px-4 bg-battle-accent/10 border border-battle-accent/20 rounded-b-lg">
                  <div className="flex-1 flex gap-4 text-[8px] font-mono text-battle-accent uppercase font-bold tracking-widest overflow-hidden">
                    <span className="animate-pulse"> LIVE_SESSIONS_OPTIMIZED</span>
                    <span className="opacity-40"> SUBMISSIONS_COUNT: 10,482</span>
                    <span className="opacity-40"> AVG_ARENA_SCORE: 742</span>
                  </div>
                  <div className="text-[8px] text-battle-accent/50 font-mono font-bold">NODE_SRHU_ACM</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Daily Targets ─── */}
        <section className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-white">Daily Targets</h2>
              <p className="text-battle-muted text-sm mt-1">Pick a challenge and start battling</p>
            </div>

            {/* Difficulty filter */}
            <div className="flex gap-2">
              {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setFilter(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === d
                    ? 'bg-battle-purple text-white'
                    : 'bg-battle-card text-battle-muted hover:text-white border border-battle-border'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

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
                <ChallengeCard key={c._id} challenge={c} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-white font-bold text-xl mb-2">No challenges yet</h3>
              <p className="text-battle-muted mb-6">Add challenges from the admin panel to get started.</p>
              {user?.isAdmin && (
                <Link href="/admin" className="btn-primary">
                  Go to Admin Panel →
                </Link>
              )}
            </div>
          )}
        </section>

        {/* ─── CTA Banner ─── */}
        <section className="max-w-6xl mx-auto px-6 py-20 mb-12">
          <div className="relative group">
            {/* Background Decorative Elements */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-battle-purple/10 rounded-full blur-3xl group-hover:bg-battle-purple/20 transition-all duration-700" />
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-battle-accent/10 rounded-full blur-3xl group-hover:bg-battle-accent/20 transition-all duration-700" />
            
            {/* The Main Box */}
            <div className="relative glass-strong p-10 md:p-16 text-center rounded-3xl border border-white/5 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-battle-accent/30 rounded-tl-3xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-battle-accent/30 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-battle-accent/30 rounded-bl-3xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-battle-accent/30 rounded-br-3xl" />

              {/* Grid Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none hero-grid" />
              
              <div className="relative z-10">
                <div className="inline-block px-3 py-1 rounded-full bg-battle-accent/10 border border-battle-accent/20 text-battle-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-6 animate-pulse">
                  Ready to compete?
                </div>
                
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6 leading-tight">
                  <span className="block">Join the Elite</span>
                  <span className="gradient-text italic">Arena</span>
                </h2>
                
                <p className="text-battle-muted mb-10 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                  Join thousands of developers in the most competitive CSS challenge platform. 
                  Save your progress, earn points, and climb to the top of the leaderboard.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    href={user ? '/battles' : '/auth/signup'} 
                    className="group/btn relative px-10 py-4 bg-battle-accent text-white font-black rounded-2xl glow-accent transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                  >
                    <span className="uppercase tracking-widest">{user ? 'Enter Arena' : 'Sign Up Free'}</span>
                    <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  
                  {!user && (
                    <Link href="/auth/login" className="px-10 py-4 text-white/60 hover:text-white font-bold transition-colors">
                      Already have an account? Log In
                    </Link>
                  )}
                </div>
              </div>

              {/* Decorative scan line */}
              <div className="absolute left-0 right-0 h-[1px] bg-white/5 top-1/4" />
              <div className="absolute left-0 right-0 h-[1px] bg-white/5 top-3/4" />
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="max-w-5xl mx-auto px-8 pb-12 flex flex-col items-center gap-4">
          <div className="w-full h-px bg-white/5" />
          <a
            href="https://srhu.acm.org"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-6 group mt-8"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/acm-logo.png"
              alt="ACM Logo"
              className="w-20 h-20 object-contain transition-all duration-300 group-hover:scale-110"
              style={{ filter: 'brightness(0.8) drop-shadow(0 0 10px rgba(91,155,213,0.4))' }}
            />
            <div className="flex flex-col items-start gap-1">
              <span className="text-[12px] text-[#555] uppercase tracking-widest font-bold">Organized by</span>
              <span className="text-[#7ba3d4] group-hover:text-[#a8c9f0] transition-colors font-black text-xl tracking-tight">
                SRHU ACM Student Chapter
              </span>
              <span className="text-sm text-[#555] group-hover:text-[#7ba3d4] transition-colors font-medium">srhu.acm.org</span>
            </div>
          </a>
          <p className="text-[#444] text-xs mt-2">© 2026 CSSBattle · All rights reserved</p>
        </footer>

      </main>
    </div>
  );
}
