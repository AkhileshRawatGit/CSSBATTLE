'use client';

import React, { useEffect, useState } from 'react';

interface ScoreModalProps {
  score: number;
  similarity: number;
  codeLength: number;
  isFinal: boolean;
  onClose: () => void;
  onPlayAgain?: () => void;
  onFinalSubmit?: () => void;
}

export default function ScoreModal({ 
  score, 
  similarity, 
  codeLength, 
  isFinal, 
  onClose, 
  onPlayAgain,
  onFinalSubmit 
}: ScoreModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (similarity > 50) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [similarity]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Confetti Container */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-5%`,
                backgroundColor: ['#ffd700', '#ff0000', '#00ff00', '#0000ff', '#ff00ff'][Math.floor(Math.random() * 5)],
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 2 + 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <div className="relative bg-[#1a1a1b] border border-white/10 rounded-2xl p-8 max-w-[500px] w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.5)] animate-in zoom-in duration-300">
        
        {/* Star Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <svg className="w-20 h-20 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 animate-ping opacity-20 text-yellow-400">
               <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        </div>

        <h2 className="text-white text-3xl font-black tracking-tight mb-2">
          {isFinal ? 'Final Score!' : 'Check Result'}
        </h2>
        <div className="text-white/80 text-xl font-medium mb-2">
          You scored <span className="text-yellow-400 font-black">{similarity.toFixed(2)}%</span>
        </div>
        {isFinal && (
          <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-8 animate-pulse">
            Redirecting to home in 5 seconds...
          </div>
        )}
        {!isFinal && <div className="mb-8" />}

        {/* Benefits/Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-10 text-left">
          <div className="bg-[#242426] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
            <div className="text-[#888] text-[10px] font-bold uppercase tracking-widest mb-1">Visual Match</div>
            <div className="text-white text-lg font-black">{similarity.toFixed(1)}% Match</div>
          </div>
          <div className="bg-[#242426] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
            <div className="text-[#888] text-[10px] font-bold uppercase tracking-widest mb-1">Character Count</div>
            <div className="text-white text-lg font-black">{codeLength} Chars</div>
          </div>
          <div className="bg-[#242426] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
            <div className="text-[#888] text-[10px] font-bold uppercase tracking-widest mb-1">Battle Status</div>
            <div className="text-white text-lg font-black">{isFinal ? 'Completed' : 'Checking...'}</div>
          </div>
          <div className="bg-[#242426] border border-white/5 rounded-xl p-4 hover:border-white/10 transition-colors">
            <div className="text-[#888] text-[10px] font-bold uppercase tracking-widest mb-1">XP Gained</div>
            <div className="text-white text-lg font-black">{score.toLocaleString()} Points</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-4 bg-[#323234] hover:bg-[#3e3e40] text-white font-bold rounded-xl transition-all"
          >
            {isFinal ? 'Close' : 'Cancel'}
          </button>
          {!isFinal ? (
            <button 
              onClick={onFinalSubmit}
              className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all"
            >
              Final Submit
            </button>
          ) : (
             <button 
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all"
            >
              Continue
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti {
          animation-name: confetti;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
}
