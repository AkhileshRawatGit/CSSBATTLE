'use client';

import React from 'react';

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  challengeTitle: string;
}

export default function InstructionModal({ isOpen, onClose, onConfirm, challengeTitle }: InstructionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in" 
        onClick={onClose}
      />
      
      {/* ModalContent */}
      <div className="relative bg-battle-card border border-battle-border rounded-2xl w-full max-w-lg overflow-hidden animate-slide-up shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-battle-border">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <span className="text-battle-accent">⚡</span> {challengeTitle}
          </h2>
          <p className="text-battle-muted text-sm mt-1">Review the instructions before starting</p>
        </div>

        {/* Instructions */}
        <div className="p-6 py-4 space-y-6">
          <section>
            <h3 className="text-battle-text font-bold text-sm mb-3 uppercase tracking-wider">Helpful Instructions</h3>
            <ul className="space-y-2">
              <li className="flex gap-3 text-sm text-battle-muted">
                <span className="text-battle-accent font-bold">•</span>
                Use purely HTML and CSS to replicate the target image.
              </li>
              <li className="flex gap-3 text-sm text-battle-muted">
                <span className="text-battle-accent font-bold">•</span>
                The target canvas size is exactly 400x300 pixels.
              </li>
              <li className="flex gap-3 text-sm text-battle-muted">
                <span className="text-battle-accent font-bold">•</span>
                All colors and shapes must match perfectly for a high score.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-battle-text font-bold text-sm mb-3 uppercase tracking-wider">Marks Evaluation</h3>
            <div className="bg-battle-surface rounded-xl p-4 border border-battle-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-battle-text">Visual Match</span>
                <span className="text-sm font-bold text-battle-accent">90%</span>
              </div>
              <div className="w-full bg-black/30 h-1.5 rounded-full mb-4">
                <div className="bg-battle-accent h-full rounded-full" style={{ width: '90%' }} />
              </div>
              
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-battle-text">Code Efficiency (Length)</span>
                <span className="text-sm font-bold text-battle-purple">10%</span>
              </div>
              <div className="w-full bg-black/30 h-1.5 rounded-full">
                <div className="bg-battle-purple h-full rounded-full" style={{ width: '10%' }} />
              </div>

              <p className="text-[10px] text-battle-muted mt-4 italic">
                * Perfect 100% matches receive a significant point bonus.
              </p>
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="p-6 pt-2 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl bg-battle-surface text-battle-text font-bold hover:bg-battle-surface/80 transition-all border border-battle-border"
          >
            Cancel
          </button>
          <button 
            onClick={onConfirm}
            className="flex-2 px-8 py-3 rounded-xl bg-battle-accent text-white font-black hover:scale-105 transition-all shadow-lg glow-accent"
          >
            Start Coding
          </button>
        </div>
      </div>
    </div>
  );
}
