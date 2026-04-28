'use client';

import { useEffect, useState, useCallback } from 'react';

interface CountdownTimerProps {
  durationSeconds: number;
  onTimeUp: () => void;
  started: boolean;
}

export default function CountdownTimer({ durationSeconds, onTimeUp, started }: CountdownTimerProps) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (!started || expired) return;

    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setExpired(true);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [started, expired, onTimeUp]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;

  const pct = (remaining / durationSeconds) * 100;
  const isWarning = pct <= 25;
  const isCritical = pct <= 10;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold transition-colors ${
        isCritical
          ? 'bg-red-900/30 border-red-500/50 text-red-400 animate-pulse'
          : isWarning
          ? 'bg-yellow-900/30 border-yellow-500/50 text-yellow-400'
          : 'bg-battle-card border-battle-border text-battle-text'
      }`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
}
