'use client';

import Image from 'next/image';

interface TargetImageProps {
  src: string;
  title: string;
  compareMode?: boolean;
  overlayCode?: string;
}

export default function TargetImage({ src, title, compareMode = false, overlayCode }: TargetImageProps) {
  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      {!compareMode ? (
        /* Normal mode — show target image */
        <div className="w-full h-full flex items-center justify-center bg-white">
          <img
            src={src}
            alt={`Target: ${title}`}
            className="max-w-full max-h-full object-contain"
            style={{ imageRendering: 'pixelated' }}
          />
        </div>
      ) : (
        /* Compare mode — 50/50 split overlay */
        <div className="relative w-full h-full overflow-hidden">
          {/* Target image (right half) */}
          <img
            src={src}
            alt={`Target: ${title}`}
            className="absolute inset-0 w-full h-full object-fill"
            style={{ imageRendering: 'pixelated' }}
          />
          {/* User output (left half via iframe) */}
          <div className="absolute inset-0 w-1/2 overflow-hidden border-r-2 border-battle-accent">
            <iframe
              srcDoc={`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box}html,body{width:400px;height:300px;overflow:hidden;background:#fff}</style></head><body>${overlayCode || ''}</body></html>`}
              sandbox="allow-same-origin"
              className="w-full h-full border-0"
              style={{ background: '#fff' }}
              title="Compare overlay"
            />
          </div>
          {/* Divider label */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-battle-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
            COMPARE
          </div>
          <div className="absolute bottom-3 left-3 text-white text-xs bg-black/60 px-2 py-1 rounded">
            Your code
          </div>
          <div className="absolute bottom-3 right-3 text-white text-xs bg-black/60 px-2 py-1 rounded">
            Target
          </div>
        </div>
      )}
    </div>
  );
}
