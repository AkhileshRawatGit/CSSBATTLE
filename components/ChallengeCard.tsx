'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import InstructionModal from './InstructionModal';

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

interface ChallengeCardProps {
  challenge: Challenge;
  index: number;
  isFinished?: boolean;
}

const difficultyConfig = {
  easy: { label: 'Easy', class: 'badge-easy' },
  medium: { label: 'Medium', class: 'badge-medium' },
  hard: { label: 'Hard', class: 'badge-hard' },
};

export default function ChallengeCard({ challenge, index, isFinished }: ChallengeCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const diff = difficultyConfig[challenge.difficulty];

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // If finished, do nothing (no popup, no entry)
    if (isFinished && !user?.isAdmin) {
      return;
    }
    if (!challenge.isActive && !user?.isAdmin) {
      alert('🔒 This battle is locked by the Admin.');
      return;
    }
    setShowModal(true);
  };

  const handleStartCoding = () => {
    document.documentElement.requestFullscreen().catch(err => {
      console.warn("Fullscreen request failed", err);
    });
    router.push(`/editor/${challenge._id}`);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="card-hover group rounded-xl overflow-hidden flex flex-col animate-fade-in cursor-pointer relative"
        style={{ animationDelay: `${index * 80}ms` }}
      >
        {/* Thumbnail */}
        <div className="relative aspect-[4/3] bg-white overflow-hidden">
          <img
            src={challenge.image}
            alt={challenge.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!challenge.isActive ? 'grayscale opacity-60' : ''}`}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect width='400' height='300' fill='%231a1a26'/%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='%2364748b' text-anchor='middle' dominant-baseline='middle'%3ENo Preview%3C/text%3E%3C/svg%3E";
            }}
          />
          
          {/* Finished Overlay (Locked Appearance) */}
          {isFinished && !user?.isAdmin && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-[2px] z-20">
              <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center border border-white/20 mb-2">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded">Locked (Finished)</span>
            </div>
          )}

          {/* Locked Overlay */}
          {!challenge.isActive && !isFinished && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center border border-white/20 mb-2">
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-black/50 px-2 py-0.5 rounded">Locked</span>
            </div>
          )}

          {/* Number badge */}
          <div className="absolute top-2 left-2 w-7 h-7 bg-black/70 backdrop-blur-sm rounded-lg flex items-center justify-center text-xs font-bold text-white z-10">
            #{index + 1}
          </div>

          {/* Play overlay (only if unlocked/admin and not finished) */}
          {(challenge.isActive || user?.isAdmin) && !isFinished && (
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-battle-accent flex items-center justify-center shadow-lg glow-accent">
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`font-semibold transition-colors text-sm leading-snug ${isFinished ? 'text-green-500' : challenge.isActive ? 'text-battle-text group-hover:text-white' : 'text-battle-muted'}`}>
              {challenge.title}
            </h3>
            <span className={isFinished ? 'badge-easy bg-green-900/20 text-green-400' : challenge.isActive ? diff.class : 'badge-easy grayscale'}>
              {isFinished ? 'Finished' : diff.label}
            </span>
          </div>

          {challenge.tags && challenge.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {challenge.tags.slice(0, 3).map((tag) => (
                <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${isFinished ? 'text-green-500/60 bg-green-500/10' : 'text-battle-muted bg-battle-surface'}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-battle-muted">
              {new Date(challenge.createdAt).toLocaleDateString()}
            </span>
            <span className={`text-xs font-semibold group-hover:underline ${isFinished ? 'text-green-400' : challenge.isActive ? 'text-battle-accent' : 'text-battle-muted'}`}>
              {isFinished ? 'View Results' : (challenge.isActive || user?.isAdmin ? 'Play →' : 'Locked')}
            </span>
          </div>
        </div>
      </div>

      <InstructionModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleStartCoding}
        challengeTitle={challenge.title}
      />
    </>
  );
}
