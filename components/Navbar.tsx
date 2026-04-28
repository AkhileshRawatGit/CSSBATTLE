'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a] border-b border-white/5 h-14 select-none">
      <div className="mx-auto px-4 h-full flex items-center justify-between">

        {/* ── Left Side ── */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#888888] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* ── CSSBattle Unique Logo ── */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="CSSBattle Home">
            {/* Animated SVG badge */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0 drop-shadow-[0_0_8px_rgba(255,237,0,0.6)] group-hover:drop-shadow-[0_0_14px_rgba(255,237,0,0.9)] transition-all duration-300"
            >
              <defs>
                <linearGradient id="hexGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#ffe500" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="hexStroke" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#fff176" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              {/* Hexagon */}
              <path
                d="M18 2L33 10V26L18 34L3 26V10L18 2Z"
                fill="url(#hexGrad)"
                stroke="url(#hexStroke)"
                strokeWidth="1.5"
              />
              {/* Code symbol — dark on bright yellow */}
              <text
                x="18"
                y="23"
                textAnchor="middle"
                fontSize="12"
                fontWeight="900"
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                fill="#1a1200"
                letterSpacing="-0.5"
              >
                &lt;/&gt;
              </text>
            </svg>

            {/* Wordmark */}
            <span className="font-black text-[17px] leading-none tracking-tight flex items-baseline gap-[1px]">
              <span
                style={{
                  background: 'linear-gradient(135deg, #ffe500 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CSS
              </span>
              <span className="text-white">Battle</span>
              <span className="text-[#ffe500] text-[8px] mb-2 ml-0.5">●</span>
            </span>
          </Link>

          {/* Daily targets breadcrumb */}
          <div className="hidden md:flex items-center gap-2 ml-2 text-[13px] text-[#888888]">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4h12v12H4V4z" />
            </svg>
            <span className="hover:text-white cursor-pointer transition-colors"></span>
            <svg className="w-3 h-3 mx-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-white font-semibold"></span>
          </div>
        </div>

        {/* ── Right Side ── */}
        <div className="flex items-center gap-4">

          {/* ── ACM Logo — clicking opens srhu.acm.org ── */}
          <a
            href="https://srhu.acm.org"
            target="_blank"
            rel="noopener noreferrer"
            title="SRHU ACM Student Chapter — srhu.acm.org"
            className="flex items-center group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/acm-logo.png"
              alt="ACM Student Chapter"
              className="h-12 w-12 object-contain transition-all duration-200 group-hover:scale-110"
              style={{ filter: 'brightness(0.9) contrast(1.1) drop-shadow(0 0 8px rgba(91,155,213,0.6))' }}
            />
          </a>

          <div className="w-px h-5 bg-white/10" />

          {/* Online indicator */}
          <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/5">
            <div className="pulse-dot" />

          </div>

          {/* Theme toggle */}
          <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 transition-colors text-[#888888] hover:text-[#ffed00]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121-10.607a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.121 10.607a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
            </svg>
          </button>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-white hidden sm:inline">{user.name}</span>
              <button
                onClick={handleLogout}
                className="text-[12px] font-bold text-[#888888] hover:text-white uppercase tracking-widest"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-5 py-2.5 rounded-lg border border-white/20 text-white text-[13px] font-bold hover:bg-white/5 transition-all"
            >
              Sign In / Sign Up
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
