'use client';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

const cssTopics = [
  {
    title: 'Flexbox',
    icon: '📦',
    color: 'from-blue-600 to-blue-400',
    tips: [
      'display: flex — enables flexbox layout',
      'justify-content: center — horizontal centering',
      'align-items: center — vertical centering',
      'flex-direction: column — stacks items vertically',
      'gap: 10px — adds space between items',
    ],
    example: `div { display: flex; align-items: center; justify-content: center; }`,
  },
  {
    title: 'CSS Shapes',
    icon: '🔵',
    color: 'from-purple-600 to-purple-400',
    tips: [
      'border-radius: 50% — makes a circle',
      'clip-path: polygon() — custom polygon shapes',
      'border tricks — triangles with borders',
      'aspect-ratio: 1 — force square proportions',
    ],
    example: `.circle { width: 100px; height: 100px; border-radius: 50%; background: red; }`,
  },
  {
    title: 'CSS Grid',
    icon: '🔲',
    color: 'from-green-600 to-green-400',
    tips: [
      'display: grid — enables grid layout',
      'grid-template-columns: repeat(3, 1fr)',
      'place-items: center — centers all items',
      'grid-gap / gap — spaces between cells',
    ],
    example: `div { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }`,
  },
  {
    title: 'Gradients',
    icon: '🌈',
    color: 'from-pink-600 to-orange-400',
    tips: [
      'linear-gradient(direction, color1, color2)',
      'radial-gradient(shape, color1, color2)',
      'conic-gradient() — pie chart style',
      'background-image for gradients',
    ],
    example: `div { background: linear-gradient(135deg, #667eea, #764ba2); }`,
  },
  {
    title: 'Transforms',
    icon: '🔄',
    color: 'from-yellow-600 to-yellow-400',
    tips: [
      'transform: rotate(45deg) — rotates element',
      'transform: scale(1.5) — scales up',
      'transform: translate(x, y) — moves position',
      'transform: skew() — skews the element',
      'transform-origin — pivot point',
    ],
    example: `div { transform: rotate(45deg) scale(0.7); }`,
  },
  {
    title: 'Pseudo-elements',
    icon: '✨',
    color: 'from-red-600 to-rose-400',
    tips: [
      '::before and ::after — virtual elements',
      'content: "" — required for pseudo-elements',
      'position: absolute — position freely',
      'Great for decorative shapes',
    ],
    example: `.box::before { content: ""; display: block; width: 50px; height: 50px; }`,
  },
];

export default function LearnPage() {
  return (
    <div className="min-h-screen bg-battle-bg">
      <Navbar />
      <Sidebar />

      <main className="pl-16 pt-14">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-white mb-1">📚 Learn CSS</h1>
            <p className="text-battle-muted text-sm">Master CSS techniques to dominate the battles</p>
          </div>

          {/* Scoring formula callout */}
          <div className="glass border border-battle-accent/30 rounded-xl p-5 mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="text-3xl">⚡</div>
            <div>
              <h3 className="text-white font-bold mb-1">Scoring Formula</h3>
              <p className="text-battle-muted text-sm">
                <code className="text-battle-accent font-mono">Score = (Similarity% × 10) − Code Length</code>
              </p>
              <p className="text-battle-muted text-xs mt-1">
                Higher similarity and shorter code = higher score. Write efficient CSS!
              </p>
            </div>
          </div>

          {/* CSS Tips Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {cssTopics.map((topic) => (
              <div key={topic.title} className="card p-5 hover:border-battle-purple/50 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-xl`}>
                    {topic.icon}
                  </div>
                  <h3 className="text-white font-bold text-lg">{topic.title}</h3>
                </div>

                <ul className="flex flex-col gap-2 mb-4">
                  {topic.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-battle-muted">
                      <span className="text-battle-accent mt-0.5 flex-shrink-0">›</span>
                      <code className="text-xs text-battle-text/80 leading-relaxed">{tip}</code>
                    </li>
                  ))}
                </ul>

                {/* Code example */}
                <div className="bg-battle-surface border border-battle-border rounded-lg p-3 mt-auto">
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="w-2 h-2 rounded-full bg-red-400" />
                    <div className="w-2 h-2 rounded-full bg-yellow-400" />
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-battle-muted text-xs ml-1">example.css</span>
                  </div>
                  <code className="text-xs text-green-400 font-mono whitespace-pre-wrap leading-relaxed break-all">
                    {topic.example}
                  </code>
                </div>
              </div>
            ))}
          </div>

          {/* Quick tips */}
          <div className="mt-10 card p-6">
            <h2 className="text-xl font-bold text-white mb-5">💡 Battle Tips</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { tip: 'Minimize whitespace', desc: 'Extra spaces count towards your character limit. Minify before submitting.' },
                { tip: 'Use shorthand properties', desc: 'margin: 0 auto is shorter than margin-top, margin-bottom, etc.' },
                { tip: 'body as canvas', desc: 'Use body as your main element — no need to create wrappers every time.' },
                { tip: 'CSS variables win', desc: 'Reuse colors with variables when the same value appears multiple times.' },
                { tip: 'clip-path is powerful', desc: 'Create complex shapes without multiple divs using clip-path.' },
                { tip: 'box-shadow stacking', desc: 'Multiple box-shadows on one element can create patterns and layered shapes.' },
              ].map((item) => (
                <div key={item.tip} className="flex gap-3">
                  <div className="w-5 h-5 rounded-full bg-battle-accent/20 border border-battle-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-battle-accent" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{item.tip}</div>
                    <div className="text-battle-muted text-xs mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
