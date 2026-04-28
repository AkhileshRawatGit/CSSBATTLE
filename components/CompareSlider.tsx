'use client';

import { useState, useRef, useEffect } from 'react';

interface CompareSliderProps {
  userOutput: React.ReactNode;
  targetSrc: string;
  className?: string;
}

export default function CompareSlider({ userOutput, targetSrc, className = '' }: CompareSliderProps) {
  const [position, setPosition] = useState(50);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setPosition(percent);
  };

  const handleMouseEnter = () => {
    setIsDraggingState(true);
  };
  
  const handleMouseLeave = () => {
    setIsDraggingState(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  // Pixel position for the bubble (assuming 400px width)
  const pixelPos = Math.round((position / 100) * 400);

  return (
    <div 
      ref={containerRef}
      className={`relative w-[400px] h-[300px] bg-white overflow-hidden select-none cursor-ew-resize border border-white/10 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
    >
      {/* ─── Layer 1: Target Image (Bottom) ─── */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <img 
          src={targetSrc} 
          alt="Target" 
          className="w-full h-full object-cover" 
          draggable={false}
        />
      </div>

      {/* ─── Layer 2: User Output (Top, Clipped) ─── */}
      <div 
        className="absolute inset-0 z-20 w-full h-full overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <div className="w-full h-full pointer-events-auto">
          {userOutput}
        </div>
      </div>

      {/* ─── Drag Overlay ─── */}
      {/* This invisible layer prevents the iframe from swallowing mouse moves during drag */}
      {isDraggingState && (
        <div className="absolute inset-0 z-40 bg-transparent cursor-ew-resize" />
      )}

      {/* ─── Slider Hub (Line & Handle) ─── */}
      <div 
        className="absolute top-0 bottom-0 z-30 flex flex-col items-center pointer-events-none"
        style={{ left: `${position}%` }}
      >
        {/* Line */}
        <div className="w-[2px] h-full bg-[#ff4444] shadow-[0_0_10px_rgba(255,68,68,0.5)]" />
        
        {/* Red Bubble Handle */}
        <div className="slider-handle">
          {pixelPos}
        </div>
      </div>

      {/* Labels */}
      {!isDraggingState && (
        <>
          <div className="absolute top-2 left-2 z-40 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white uppercase font-bold tracking-wider backdrop-blur-sm pointer-events-none">
            Output
          </div>
          <div className="absolute top-2 right-2 z-40 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white uppercase font-bold tracking-wider backdrop-blur-sm pointer-events-none">
            Target
          </div>
        </>
      )}
    </div>
  );
}
