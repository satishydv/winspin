import React from 'react';

export default function SportsPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-white px-4">
      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 border-4 border-gray-700 shadow-xl shadow-black/50">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
          <circle cx="12" cy="12" r="10" />
          <path d="M5.6 5.6c2.5 2.5 6.5 2.5 9 0" />
          <path d="M18.4 18.4c-2.5-2.5-6.5-2.5-9 0" />
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
        </svg>
      </div>
      <h2 className="text-2xl font-black font-display text-white uppercase tracking-wider mb-3">Sports Betting</h2>
      <p className="text-gray-400 text-center text-sm font-sans max-w-[280px]">
        Our new Sportsbook section is currently under construction. Get ready to place your bets soon!
      </p>
    </div>
  );
}
