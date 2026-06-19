'use client';
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-3 bg-white border-b border-gray-200 sticky top-0 z-50">
      <a href="/" className="text-lg sm:text-2xl font-bold text-red-500">YourDramaClub</a>

      <div className="hidden sm:flex gap-6 text-sm font-medium text-gray-600">
        <a href="/KDrama" className="hover:text-red-500">KDrama</a>
        <a href="/Cdrama" className="hover:text-red-500">CDrama</a>
        <a href="/coming-soon" className="hover:text-red-500">Coming Soon</a>
        <a href="/blog" className="hover:text-red-500">Blog</a>
        <a href="/watchlist" className="hover:text-red-500">❤️ Watchlist</a>
      </div>

      <div className="flex items-center gap-2">
        <button className="bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-white">Sign In</button>
        <button onClick={() => setMenuOpen(!menuOpen)} className="sm:hidden p-1.5" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg sm:hidden">
          <div className="flex flex-col px-4 py-2">
            <a href="/KDrama" className="py-3 border-b border-gray-100 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>🇰🇷 KDrama</a>
            <a href="/Cdrama" className="py-3 border-b border-gray-100 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>🇨🇳 CDrama</a>
            <a href="/coming-soon" className="py-3 border-b border-gray-100 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>🗓️ Coming Soon</a>
            <a href="/blog" className="py-3 text-gray-700 font-medium" onClick={() => setMenuOpen(false)}>📝 Blog</a>
          </div>
        </div>
      )}
    </nav>
  );
}