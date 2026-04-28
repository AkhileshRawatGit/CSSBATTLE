'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/components/AuthProvider';

interface Challenge {
  _id: string;
  title: string;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  timeLimit: number;
  createdAt: string;
}

export default function AdminPage() {
  const { user, token } = useAuth();
  const router = useRouter();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isLeaderboardLocked, setIsLeaderboardLocked] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [timeLimit, setTimeLimit] = useState('30');
  const [tags, setTags] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    const t = setTimeout(() => {
      if (!user) router.push('/auth/login');
      else if (!user.isAdmin) router.push('/');
    }, 500);
    return () => clearTimeout(t);
  }, [user, router]);

  useEffect(() => {
    fetch('/api/challenge')
      .then((r) => r.json())
      .then((d) => {
        setChallenges(d.challenges || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Fetch global settings
    fetch('/api/settings')
      .then(r => r.json())
      .then(data => setIsLeaderboardLocked(data.isLeaderboardLocked))
      .catch(() => {});
  }, [message]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !title) {
      setMessage('❌ Title and image are required');
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('difficulty', difficulty);
      formData.append('tags', tags);
      formData.append('timeLimit', timeLimit);
      formData.append('image', imageFile);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Challenge created successfully!');
        setTitle('');
        setDescription('');
        setTags('');
        setDifficulty('medium');
        setImageFile(null);
        setPreview('');
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage('❌ Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this challenge?')) return;
    await fetch(`/api/challenge/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessage('Challenge deleted');
    setChallenges((prev) => prev.filter((c) => c._id !== id));
  };

  const toggleLeaderboardLock = async () => {
    const newValue = !isLeaderboardLocked;
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ key: 'isLeaderboardLocked', value: newValue }),
      });
      if (res.ok) {
        setIsLeaderboardLocked(newValue);
        setMessage(`✅ Leaderboard is now ${newValue ? 'LOCKED' : 'UNLOCKED'}`);
      }
    } catch {
      setMessage('❌ Failed to update settings');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-battle-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-white font-bold text-xl mb-2">Access Denied</h2>
          <p className="text-battle-muted">Admin access required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-battle-bg">
      <Navbar />
      <Sidebar />

      <main className="pl-16 pt-14">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-battle-purple/20 border border-battle-purple/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Admin Panel</h1>
              <p className="text-battle-muted text-sm">Manage challenges and content</p>
            </div>
          </div>

          {/* ─── Global Settings ─── */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="card p-5 border-battle-purple/20 bg-battle-purple/5 flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${isLeaderboardLocked ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                  {isLeaderboardLocked ? (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Leaderboard Logic</h3>
                  <p className="text-battle-muted text-[11px] mt-0.5">{isLeaderboardLocked ? 'Participants cannot see rankings' : 'Rankings are visible to everyone'}</p>
                </div>
              </div>
              <button
                onClick={toggleLeaderboardLock}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isLeaderboardLocked ? 'bg-red-500' : 'bg-green-500'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLeaderboardLocked ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
            
            {/* Add more settings cards here as needed */}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* ─── Add Challenge Form ─── */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span className="text-battle-accent">+</span> Add New Challenge
              </h2>

              {message && (
                <div className={`text-sm px-4 py-3 rounded-lg mb-4 ${message.startsWith('✅')
                    ? 'bg-green-900/30 border border-green-500/40 text-green-400'
                    : 'bg-red-900/30 border border-red-500/40 text-red-400'
                  }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-battle-text">Challenge Title *</label>
                  <input
                    id="admin-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Red Circle"
                    className="input"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-battle-text">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Challenge description (optional)"
                    className="input resize-none h-20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-battle-text">Difficulty</label>
                    <select
                      id="admin-difficulty"
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                      className="input"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-battle-text">Tags</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="css, shapes, flex"
                      className="input"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-battle-text">Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(e.target.value)}
                    placeholder="e.g. 30"
                    className="input"
                    min="1"
                  />
                </div>

                {/* Image upload */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-battle-text">Target Image *</label>
                  <label
                    htmlFor="admin-image"
                    className={`flex flex-col items-center justify-center h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${preview
                        ? 'border-battle-purple/50 bg-battle-purple/10'
                        : 'border-battle-border hover:border-battle-purple/50 bg-battle-surface/50'
                      }`}
                  >
                    {preview ? (
                      <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-xl p-2" />
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-battle-muted mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-battle-muted text-sm">Click to upload target image</span>
                        <span className="text-battle-muted text-xs mt-1">PNG, JPG, WebP — 400×300 recommended</span>
                      </>
                    )}
                    <input
                      id="admin-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <button
                  id="admin-submit"
                  type="submit"
                  disabled={uploading}
                  className="btn-primary w-full py-3 rounded-xl disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="spinner" /> Uploading…
                    </span>
                  ) : (
                    '+ Add Challenge'
                  )}
                </button>
              </form>
            </div>

            {/* ─── Challenge List ─── */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-white mb-5">
                Existing Challenges
                <span className="ml-2 text-sm text-battle-muted font-normal">({challenges.length})</span>
              </h2>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="spinner w-6 h-6 border-2" />
                </div>
              ) : challenges.length === 0 ? (
                <div className="text-center py-10 text-battle-muted text-sm">
                  No challenges yet. Add the first one!
                </div>
              ) : (
                <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-1">
                  {challenges.map((c) => (
                    <div key={c._id} className="flex items-center gap-3 bg-battle-surface rounded-lg p-3 border border-battle-border group">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-12 h-9 object-cover rounded bg-white flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-white text-sm font-medium truncate">{c.title}</div>
                        <div className="text-battle-muted text-xs capitalize">{c.difficulty}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            const newStatus = !c.isActive;
                            try {
                              const res = await fetch(`/api/challenge/${c._id}`, {
                                method: 'PATCH',
                                headers: { 
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}` 
                                },
                                body: JSON.stringify({ isActive: newStatus }),
                              });
                              if (res.ok) {
                                setChallenges(prev => prev.map(ch => ch._id === c._id ? { ...ch, isActive: newStatus } : ch));
                                setMessage(`✅ ${c.title} is now ${newStatus ? 'Unlocked' : 'Locked'}`);
                              }
                            } catch (err) {
                              setMessage('❌ Failed to toggle status');
                            }
                          }}
                          className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${c.isActive 
                            ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20' 
                            : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                          }`}
                        >
                          {c.isActive ? (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                              </svg>
                              Unlocked
                            </>
                          ) : (
                            <>
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Locked
                            </>
                          )}
                        </button>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                          <button
                            onClick={() => router.push(`/editor/${c._id}`)}
                            className="text-xs text-battle-purple hover:text-purple-300 transition-colors"
                            title="Preview"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="text-xs text-red-400 hover:text-red-300 transition-colors"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
