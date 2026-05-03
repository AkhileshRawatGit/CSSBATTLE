'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Preview from '@/components/Preview';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

export default function TargetGenerator() {
  const [code, setCode] = useState(`<style>
  body {
    background: #0f172a;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .circle {
    width: 150px;
    height: 150px;
    background: #61dafb;
    border-radius: 50%;
  }
</style>
<div class="circle"></div>`);
  const [generating, setGenerating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result;
        if (!base64) return;

        const res = await fetch('/api/image-to-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 })
        });
        
        const data = await res.json();
        if (data.code) {
          setCode(data.code);
        } else {
          alert(data.error || 'Failed to generate code from image');
        }
        setAnalyzing(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Error analyzing image');
      setAnalyzing(false);
    }
    // Clear input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await res.json();
      
      if (data.image) {
        // Trigger download
        const a = document.createElement('a');
        a.href = data.image;
        a.download = `target-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert(data.error || 'Failed to generate');
      }
    } catch (e) {
      alert('Error generating image');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111] flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-6xl w-full mx-auto pt-24 p-6 flex flex-col">
        <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Target Image Generator</h1>
        <p className="text-battle-muted mb-8">Write your CSS here and download the exact 400x300 PNG generated directly by Chrome. Use this downloaded image as the Target Image for new challenges to ensure a 100% possible score.</p>
        
        <div className="flex gap-6 flex-1">
          {/* Editor Area */}
          <div className="flex-1 flex flex-col gap-4">
            {/* AI Image to Code Uploader */}
            <div className="bg-[#1a1a1a] p-4 rounded-xl border border-battle-accent/30 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold mb-1">🤖 AI Image-to-Code</h3>
                <p className="text-xs text-battle-muted">Upload an image and let AI write the CSS for you. (Requires GEMINI_API_KEY in .env.local)</p>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={analyzing}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : 'Upload Image'}
              </button>
            </div>

            <div className="flex-1 flex flex-col bg-[#1a1a1a] border border-white/10 rounded-xl overflow-hidden">
              <div className="h-10 bg-black/40 border-b border-white/10 flex items-center px-4">
                <span className="text-[11px] font-bold text-[#888] uppercase tracking-widest">Editor</span>
              </div>
              <div className="flex-1 relative">
                <Editor value={code} onChange={setCode} />
              </div>
            </div>
          </div>
          
          {/* Preview & Download */}
          <div className="w-[400px] flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-[#888] uppercase tracking-widest">Live Preview</span>
              <div className="w-[400px] h-[300px] bg-white rounded overflow-hidden shadow-2xl ring-1 ring-white/10">
                <Preview code={code} />
              </div>
            </div>
            
            <button 
              onClick={handleGenerate}
              disabled={generating}
              className="w-full py-4 bg-battle-accent text-white rounded-xl font-black uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(255,237,0,0.2)] disabled:opacity-50 disabled:hover:scale-100"
            >
              {generating ? 'Generating...' : 'Download Exact PNG'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
