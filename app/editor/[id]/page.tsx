'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import CountdownTimer from '@/components/CountdownTimer';
import ScoreModal from '@/components/ScoreModal';
import Preview from '@/components/Preview';
import { useAuth } from '@/components/AuthProvider';
import CompareSlider from '@/components/CompareSlider';
import ColorPalette from '@/components/ColorPalette';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

interface Challenge {
  _id: string;
  title: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description?: string;
  colors: string[];
  timeLimit: number;
}



const DEFAULT_CODE = `<style>
  body {
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .shape {
    width: 100px;
    height: 100px;
    background: royalblue;
    border-radius: 50%;
  }
</style>

<div class="shape"></div>`;

// const TIMER_DURATION = 30 * 60; // Removed as durations are now challenge-specific

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();

  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [scoreData, setScoreData] = useState<{ score: number; similarity: number; codeLength: number } | null>(null);
  const [highScore, setHighScore] = useState<{ score: number; codeLength: number } | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [isFinalSubmission, setIsFinalSubmission] = useState(false);
  const [activeTab, setActiveTab] = useState<'your' | 'global'>('your');

  const previewRef = useRef<HTMLIFrameElement>(null);
  const targetRef = useRef<HTMLImageElement>(null);

  // Redirect if not authenticated
  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) router.push('/auth/login');
    }, 500);
    return () => clearTimeout(t);
  }, [user, router]);

  // Fetch challenge and progress
  useEffect(() => {
    if (!params.id) return;

    if (!token) return;

    const fetchData = async () => {
      try {
        const [cRes, pRes, sRes] = await Promise.all([
          fetch(`/api/challenge/${params.id}`, { cache: 'no-store' }),
          fetch(`/api/progress?challengeId=${params.id}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
          }),
          fetch(`/api/submit?challengeId=${params.id}&sort=score&limit=1`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store'
          })
        ]);

        const cData = await cRes.json();
        const pData = await pRes.json();
        const sData = await sRes.json();

        if (cData.challenge) {
          const ch = cData.challenge;
          const prog = pData.progress;

          if (prog && prog.isFinished && !user?.isAdmin) {
            alert('🏆 You have already submitted this challenge.');
            router.push('/battles');
            return;
          }

          setChallenge(ch);
          setTabSwitches(prog?.tabSwitches || 0);

          // Calculate remaining time
          const startTime = new Date(prog.startTime).getTime();
          const limitMs = (ch.timeLimit || 30) * 60 * 1000;
          const elapsedMs = Date.now() - startTime;
          const remainingSec = Math.max(0, Math.floor((limitMs - elapsedMs) / 1000));

          setDuration(remainingSec);
          setTimerStarted(true);

          if (sData.submissions && sData.submissions.length > 0) {
            const top = sData.submissions[0];
            setHighScore({ score: top.score, codeLength: top.codeLength });
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, token, user, router]);

  const handleSubmit = useCallback(async (autoSubmit = false, isFinal = true) => {
    if (submitted || submitting) return;
    if (!user || !token || !challenge) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId: challenge._id,
          code,
          isFinal: isFinal || autoSubmit // Auto-submit is always final
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setScoreData({
          score: data.score,
          similarity: data.similarity,
          codeLength: data.submission.codeLength,
        });

        setIsFinalSubmission(isFinal || autoSubmit);
        setShowScoreModal(true);

        if (isFinal || autoSubmit) {
          setSubmitted(true);
          // Update local high score if this is better
          if (!highScore || data.score > highScore.score) {
            setHighScore({ score: data.score, codeLength: data.submission.codeLength });
          }
          // Delay redirect slightly so they see the modal
          setTimeout(() => {
            setShowScoreModal(false);
            router.push('/battles');
          }, 10000); // 10 seconds to look at score
        }
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch (err) {
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [submitted, submitting, user, token, challenge, code, router]);

  // Anti-Cheat: Tab switching detection
  useEffect(() => {
    if (submitted || !timerStarted || !challenge || user?.isAdmin) return;

    const handleVisibilityChange = async () => {
      if (document.hidden) {
        const newSwitches = tabSwitches + 1;
        setTabSwitches(newSwitches);
        
        try {
          await fetch('/api/progress', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              challengeId: challenge._id,
              tabSwitches: newSwitches
            })
          });

          if (newSwitches >= 3) {
            alert('🚫 Tab switching limit exceeded! (3/3) Auto-submitting...');
            handleSubmit(true, true);
          }
        } catch (err) {
          console.error('Update switches error:', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [submitted, timerStarted, challenge, user, token, tabSwitches, handleSubmit]);

  const handleTimeUp = useCallback(() => {
    if (!submitted && !user?.isAdmin) {
      alert('⏰ Time is up! Auto-submitting...');
      handleSubmit(true, true);
    }
  }, [submitted, handleSubmit, user]);

  const charCount = code.replace(/\s+/g, ' ').trim().length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="spinner w-8 h-8 border-2" />
        </div>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="h-screen bg-[#111] flex flex-col overflow-hidden">
      <Navbar />
      
      {/* Timer Bar */}
      <div className="h-10 bg-[#0a0a0f] border-b border-white/5 flex items-center justify-between px-6 fixed top-14 left-0 right-0 z-40">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-black text-white">{challenge.title}</h2>
          <div className="h-4 w-[1px] bg-white/10" />
            {!user?.isAdmin && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest">Tab Switches:</span>
                <span className={`text-xs font-mono font-bold ${tabSwitches >= 2 ? 'text-red-500' : 'text-battle-text'}`}>
                  {tabSwitches} / 3
                </span>
              </div>
            )}
          </div>
          <CountdownTimer 
            durationSeconds={duration} 
            onTimeUp={handleTimeUp} 
            started={timerStarted && !submitted && !user?.isAdmin} 
          />
      </div>

      {/* ─── Main 3-Column Content ─── */}
      <div className="flex flex-1 pt-24 overflow-hidden relative">

        {/* Column 1: Editor */}
        <div className="w-[45%] flex flex-col border-r border-white/5 bg-[#1a1a1a]">
          {/* Header */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-black/20">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#888888] uppercase tracking-widest">Editor</span>
              <div className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] font-bold text-[#666666] border border-white/5 uppercase">CTRL SHIFT E</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#888888]">
                <span className="text-white">{charCount}</span>
                <span className="uppercase tracking-widest opacity-60">characters</span>
              </div>
              <button className="text-[#888888] hover:text-white transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.532 1.532 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.532 1.532 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 relative bg-[#1e1e1e]">
            <Editor
              value={code}
              onChange={setCode}
              readOnly={submitted}
            />
          </div>

          {/* Footer */}
          <div className="h-[72px] flex items-center justify-between px-6 bg-black/40 border-t border-white/5">
            <button
              onClick={() => handleSubmit(false, false)}
              disabled={submitting || submitted}
              className="px-6 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs font-bold hover:bg-white/10 transition-all disabled:opacity-50"
            >
              Check Score
            </button>
            <button
              onClick={() => handleSubmit(false, true)}
              disabled={submitting || submitted}
              className="btn-primary"
            >
              {submitting ? 'Scoring...' : submitted ? 'Submitted' : 'Final Submit'}
            </button>
          </div>
        </div>

        {/* Column 2: Output */}
        <div className="w-[30%] flex flex-col border-r border-white/5 bg-[#111]">
          {/* Header */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-black/20">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-widest">Code output</span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <input type="checkbox" checked={compareMode} onChange={() => setCompareMode(!compareMode)} className="w-3 h-3 rounded border-white/10 bg-[#1a1a1a] accent-[#1e88e5]" />
                <span className="text-[10px] font-bold text-white uppercase select-none cursor-pointer" onClick={() => setCompareMode(!compareMode)}>Slide & Compare</span>
              </div>
              <div className="flex items-center gap-1.5">
                <input type="checkbox" className="w-3 h-3 rounded border-white/10 bg-[#1a1a1a] accent-[#1e88e5]" />
                <span className="text-[10px] font-bold text-[#888888] uppercase opacity-50">Diff</span>
              </div>
            </div>
          </div>

          {/* Content (Canvas Area) */}
          <div className="flex-1 flex flex-col items-center pt-8 bg-[#0a0a0f]">
            <div className="w-[400px] h-[300px] shadow-2xl relative mb-12">
              {compareMode ? (
                <CompareSlider
                  targetSrc={challenge.image}
                  userOutput={<Preview code={code} />}
                />
              ) : (
                <Preview code={code} />
              )}
            </div>

            {/* Stats Section */}
            <div className="w-full px-6">
              {/* Tabs */}
              <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/5 mb-6">
                <button
                  onClick={() => setActiveTab('your')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-full transition-all ${activeTab === 'your' ? 'bg-[#242424] text-white shadow-lg' : 'text-[#888888] hover:text-[#bbb]'}`}
                >
                  Your stats
                </button>
                <button
                  onClick={() => setActiveTab('global')}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-full transition-all ${activeTab === 'global' ? 'bg-[#242424] text-white shadow-lg' : 'text-[#888888] hover:text-[#bbb]'}`}
                >
                  Global stats
                </button>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex flex-col items-center">
                  <svg className="w-4 h-4 text-yellow-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{scoreData?.score || '-'}</span>
                    <span className="text-[10px] text-[#888888] font-bold">({scoreData?.similarity || 0}% match)</span>
                    <span className="text-sm">🧐</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#666666] uppercase mt-1">Last score</span>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/5 flex flex-col items-center">
                  <svg className="w-4 h-4 text-yellow-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{highScore?.score || '-'}</span>
                    <span className="text-[10px] text-[#888888] font-bold">({highScore?.codeLength || '-'})</span>
                  </div>
                  <span className="text-[9px] font-bold text-[#666666] uppercase mt-1">High score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="h-[72px] flex items-center justify-center px-6 bg-black/40 border-t border-white/5">
            <button className="flex items-center gap-2 px-6 py-2 bg-[#242424] border border-white/10 rounded-full text-white text-xs font-bold hover:bg-[#2a2a2a] transition-all">
              <svg className="w-4 h-4 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Challenge
              <svg className="w-3 h-3 text-[#888888]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Column 3: Target */}
        <div className="flex-1 flex flex-col bg-[#111]">
          {/* Header */}
          <div className="h-10 flex items-center justify-between px-4 border-b border-white/5 bg-black/20">
            <span className="text-[11px] font-bold text-[#888888] uppercase tracking-widest">Recreate this target</span>
            <span className="text-[11px] font-mono font-bold text-[#666666]">400px x 300px</span>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col items-center">
            <div className="w-[400px] h-[300px] bg-white shadow-2xl overflow-hidden rounded-sm mb-8">
              <img src={challenge.image} alt="Target" className="w-full h-full object-cover" />
            </div>

            <div className="w-full max-w-[400px]">
              <ColorPalette colors={challenge.colors} />

              <div className="mt-8 pt-8 border-t border-white/5">
                <h3 className="text-[11px] font-bold text-[#666666] uppercase tracking-widest mb-4">Target Sponsor</h3>
                <div className="w-full h-20 bg-black/20 rounded-xl border border-white/5 flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer">
                  <span className="text-white font-black text-xl italic tracking-tighter uppercase">Web Maker</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Score modal */}
      {showScoreModal && scoreData && (
        <ScoreModal
          score={scoreData.score}
          similarity={scoreData.similarity}
          codeLength={scoreData.codeLength}
          isFinal={isFinalSubmission}
          onClose={() => setShowScoreModal(false)}
          onPlayAgain={() => {
            setShowScoreModal(false);
            setSubmitted(false);
          }}
          onFinalSubmit={() => {
            setShowScoreModal(false);
            handleSubmit(false, true);
          }}
        />
      )}
    </div>
  );
}
