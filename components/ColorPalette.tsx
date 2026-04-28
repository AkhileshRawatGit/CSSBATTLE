'use client';

import { useState } from 'react';

interface ColorPaletteProps {
  colors: string[];
}

export default function ColorPalette({ colors }: ColorPaletteProps) {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  if (!colors || colors.length === 0) return null;

  return (
    <div className="flex flex-col gap-3 mt-6">
      <div className="flex items-center gap-2">
        <h3 className="text-[11px] font-bold text-[#888888] uppercase tracking-widest">Colors</h3>
        <div className="px-1.5 py-0.5 bg-white/5 rounded text-[9px] font-bold text-[#666666] border border-white/5 uppercase">CTRL SHIFT C</div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => copyToClipboard(color)}
            className="group relative flex items-center gap-3 bg-[#1a1a1a] border border-white/5 rounded-full pl-1.5 pr-4 py-1.5 transition-all hover:bg-white/5 hover:border-white/20"
          >
            {/* Color preview circle */}
            <div 
              className="w-5 h-5 rounded-full border border-white/10 shadow-inner"
              style={{ backgroundColor: color }}
            />
            
            {/* Hex code */}
            <span className="font-mono text-[11px] font-bold text-[#888888] group-hover:text-white transition-colors">{color.toUpperCase()}</span>

            {/* Copy indicator */}
            <div className={`absolute inset-0 bg-[#1e88e5] rounded-full flex items-center justify-center transition-all duration-200 ${copiedColor === color ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
              <span className="text-white text-[9px] font-bold uppercase tracking-tighter">Copied!</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
