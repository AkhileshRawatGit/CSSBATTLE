'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function Editor({ value, onChange, readOnly = false }: EditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="spinner" />
          <span className="text-battle-muted text-sm">Loading editor…</span>
        </div>
      </div>
    );
  }

  return (
    <MonacoEditor
      height="100%"
      defaultLanguage="html"
      value={value}
      onChange={(v) => onChange(v || '')}
      theme="vs-dark"
      options={{
        fontSize: 14,
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        fontLigatures: true,
        lineHeight: 22,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap: 'on',
        readOnly,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: 'gutter',
        cursorBlinking: 'smooth',
        smoothScrolling: true,
        cursorSmoothCaretAnimation: 'on',
        tabSize: 2,
        insertSpaces: true,
        autoIndent: 'full',
        formatOnPaste: true,
        formatOnType: true,
        bracketPairColorization: { enabled: true },
        guides: {
          bracketPairs: true,
          indentation: true,
        },
        suggest: {
          showKeywords: true,
          showSnippets: true,
        },
        quickSuggestions: {
          other: true,
          comments: false,
          strings: true,
        },
        scrollbar: {
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
        },
      }}
      loading={
        <div className="w-full h-full bg-[#1e1e1e] flex items-center justify-center">
          <div className="spinner" />
        </div>
      }
    />
  );
}
