'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const terminalSteps = [
  'INITIALIZING ACM_CORE...',
  'AUTHENTICATING SRHU_SERVER...',
  'CONNECTING TO BATTLE_NODE...',
  'SYNCING CHALLENGES...',
  'ARENA_READY.'
];

export default function Preloader() {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Progress through terminal text
    const textInterval = setInterval(() => {
      setStep((prev) => {
        if (prev < terminalSteps.length - 1) return prev + 1;
        clearInterval(textInterval);
        return prev;
      });
    }, 700); // Slower text appearance

    // Hide preloader after animation sequence
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5500); // Longer duration: 5.5 seconds

    return () => {
      clearInterval(textInterval);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] preloader-overlay overflow-hidden">
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none hero-grid" />

      <div className="relative flex flex-col items-center max-w-lg w-full px-6">

        {/* ─── Stage 1: ACM Intro ─── */}
        <div className="flex flex-col items-center mb-10 animate-[terminalFade_0.8s_ease_forwards]">
          <div className="relative mb-6 group">
            <div className="absolute inset-0 bg-[#5b9bd5]/20 blur-3xl rounded-full scale-150 animate-pulse" />
              <Image
                src="/acm-logo.png"
                alt="ACM Logo"
                width={100}
                height={100}
                className="relative z-10 brightness-110 contrast-125"
                style={{ filter: 'brightness(0.8)' }}
              />
          </div>
          <div className="text-center">
            <span className="block text-[#5b9bd5] text-xs uppercase tracking-[0.4em] font-black mb-2 opacity-70">Organized by</span>
            <h2 className="text-white text-2xl font-black tracking-[0.15em] uppercase md:text-3xl">
              SRHU ACM STUDENT CHAPTER
            </h2>
          </div>
        </div>

        {/* ─── Stage 2: "Presents" & Battle Logo ─── */}
        <div className="flex flex-col items-center gap-4 opacity-0 animate-[terminalFade_0.8s_ease_forwards] [animation-delay:1.5s]">
          <span className="text-[10px] text-white/30 font-mono tracking-[0.5em] uppercase italic">p r e s e n t s</span>

          <div className="relative">
            <svg width="90" height="90" viewBox="0 0 120 120" fill="none">
              <defs>
                <linearGradient id="loadGradV2" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffed00" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
              <path
                d="M60 10L103 35V85L60 110L17 85V35L60 10Z"
                stroke="url(#loadGradV2)"
                strokeWidth="3"
                className="animate-draw"
                style={{ animationDelay: '1.5s' }}
              />
              <text
                x="60"
                y="72"
                textAnchor="middle"
                className="fill-[#ffed00] font-black text-2xl opacity-0 animate-[logoPop_0.4s_ease_forwards] [animation-delay:2.8s]"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                &lt;/&gt;
              </text>
            </svg>
            <div className="absolute inset-x-0 -bottom-2 h-1 bg-yellow-500/20 blur-xl translate-y-1 opacity-0 animate-[terminalFade_0.5s_ease_forwards] [animation-delay:2.5s]" />
          </div>
        </div>

        {/* ─── Terminal Text (Branded) ─── */}
        <div className="w-full max-w-sm mt-8 space-y-1.5 font-mono text-sm opacity-0 animate-[terminalFade_0.5s_ease_forwards] [animation-delay:0.5s]">
          {terminalSteps.slice(0, step + 1).map((text, i) => (
            <div key={i} className="flex gap-3 terminal-line">
              <span className="text-[#5b9bd5] font-black">{'>'}</span>
              <span className={i === terminalSteps.length - 1 ? "text-green-400 font-black" : "text-white/50"}>
                {text}
                {i === step && <span className="inline-block w-1.5 h-4 bg-[#5b9bd5] animate-[cursorBlink_1s_infinite] ml-1.5 align-middle" />}
              </span>
            </div>
          ))}
        </div>

        {/* Global Progress Line */}
        <div className="absolute bottom-10 left-10 right-10 h-[1px] bg-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-[#5b9bd5] to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>

      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
