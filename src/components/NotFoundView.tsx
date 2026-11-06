import React, { useState } from 'react';
import { motion } from 'motion/react';
import { sound } from '../utils/audio';
import Footer from './Footer';

interface NotFoundViewProps {
  setView: (view: any) => void;
}

export default function NotFoundView({ setView }: NotFoundViewProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(['4', '0', '4']);
  const [leverPulled, setLeverPulled] = useState(false);

  // Trigger slot machine reel spin easter egg
  const handleSpin = () => {
    if (isSpinning) return;
    
    // Play sound effects if available
    try {
      if (sound && typeof sound.playSpin === 'function') {
        sound.playSpin();
      } else if (sound && typeof sound.playClick === 'function') {
        sound.playClick();
      }
    } catch (e) {
      console.log('Audio error:', e);
    }

    setIsSpinning(true);
    setLeverPulled(true);

    // Pull down the lever, release after 400ms
    setTimeout(() => {
      setLeverPulled(false);
    }, 400);

    // Let's cycle symbols a few times
    const symbols = ['7', '💎', '🍒', '🔔', '👑', '🎰', '🍋', '🍇', '4', '0', '4'];
    let count = 0;
    const interval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)]
      ]);
      count++;
      
      if (count > 15) {
        clearInterval(interval);
        // Land on 4 - 0 - 4
        setReels(['4', '0', '4']);
        setIsSpinning(false);
        
        // Play win sound
        try {
          if (sound && typeof sound.playWin === 'function') {
            sound.playWin();
          }
        } catch (e) {
          console.log(e);
        }
      }
    }, 120);
  };

  // Reusable 3D Poker Chip SVG generator
  const renderPokerChip = (className: string, delay: number, duration: number, rotateAngle: number, scale: number = 1) => {
    return (
      <motion.div
        className={`absolute pointer-events-none select-none ${className}`}
        initial={{ y: 0, rotate: rotateAngle, scale: scale }}
        animate={{ 
          y: [-12, 12, -12],
          rotate: [rotateAngle, rotateAngle + 5, rotateAngle - 5, rotateAngle]
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }}
      >
        <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)]">
          {/* Bottom thickness/shadow for 3D effect */}
          <ellipse cx="30" cy="23" rx="28" ry="13" fill="#0c0d10" />
          <ellipse cx="30" cy="22" rx="28" ry="13" fill="#1b1c22" />
          
          {/* Main face */}
          <ellipse cx="30" cy="20" rx="28" ry="13" fill="#131418" stroke="#374151" strokeWidth="1" />
          
          {/* Striped Ring border (White stripes) */}
          <ellipse cx="30" cy="20" rx="24" ry="11" fill="none" stroke="#d1d5db" strokeWidth="2.5" strokeDasharray="6,4" />
          
          {/* Inner details (Secondary dark ring) */}
          <ellipse cx="30" cy="20" rx="18" ry="8" fill="#181a1f" stroke="#4b5563" strokeWidth="0.5" />
          <ellipse cx="30" cy="20" rx="12" ry="5.5" fill="#0f1013" />
        </svg>
      </motion.div>
    );
  };

  return (
    <div id="not_found_page" className="relative flex flex-col min-h-screen justify-between bg-[#050507] text-white overflow-hidden select-none">
      
      {/* Floating Poker Chips Background Layer (arranged closely to matches user screenshot) */}
      {renderPokerChip("top-[10%] left-[28%]", 0, 7, -15, 0.85)}   {/* Top-left chip, tilted left */}
      {renderPokerChip("top-[6%] right-[32%]", 1.5, 6, 20, 0.9)}   {/* Top-right chip, tilted right */}
      {renderPokerChip("top-[13%] right-[18%]", 3, 8, 45, 1.0)}   {/* Far top-right, tilted far right */}
      
      {renderPokerChip("top-[35%] left-[16%]", 0.8, 6.5, -45, 0.75)} {/* Left middle chip, tilted left */}
      {renderPokerChip("top-[30%] right-[12%]", 2.2, 7.5, 15, 0.8)} {/* Far right chip */}
      
      {renderPokerChip("bottom-[36%] left-[22%]", 4, 8, -10, 1.15)} {/* Bottom-left-mid large chip */}
      {renderPokerChip("bottom-[32%] right-[28%]", 1, 6.8, 35, 1.0)} {/* Bottom-right-mid chip */}
      {renderPokerChip("bottom-[40%] right-[16%]", 2.8, 7.2, -25, 0.9)} {/* Bottom right outer chip */}

      {/* Main Content Centered Wrapper */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 z-10">
        {/* Main Container */}
        <div className="flex flex-col items-center max-w-xl text-center">
        
        {/* ================= SLOT MACHINE 404 GRAPHIC ================= */}
        <div 
          onClick={handleSpin}
          className="relative w-72 h-64 cursor-pointer group flex items-center justify-center mb-8 transform hover:scale-[1.02] transition-transform duration-300"
          title="Click to spin the lever!"
        >
          {/* Glowing Aura Background */}
          <div className="absolute w-52 h-44 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-500" />
          
          <svg width="280" height="240" viewBox="0 0 280 240" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.9)]">
            <defs>
              {/* Metallic Gradients */}
              <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f3f4f6" />
                <stop offset="25%" stopColor="#d1d5db" />
                <stop offset="50%" stopColor="#9ca3af" />
                <stop offset="75%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#1f2937" />
              </linearGradient>

              <linearGradient id="machineBody" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1e2025" />
                <stop offset="40%" stopColor="#111215" />
                <stop offset="100%" stopColor="#07080a" />
              </linearGradient>

              <linearGradient id="bezel" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9ca3af" />
                <stop offset="50%" stopColor="#f9fafb" />
                <stop offset="100%" stopColor="#4b5563" />
              </linearGradient>

              <radialGradient id="lightGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="60%" stopColor="#e5e7eb" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#9ca3af" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* ================= SLOT MACHINE LEVER (RIGHT SIDE) ================= */}
            {/* Lever Base Socket */}
            <rect x="206" y="95" width="16" height="22" rx="4" fill="#1f2937" stroke="#4b5563" strokeWidth="1" />
            <circle cx="214" cy="106" r="6" fill="#111827" />

            {/* Animated Lever Shaft */}
            <motion.g
              animate={leverPulled ? { rotate: [0, 40, 0] } : {}}
              style={{ originX: "214px", originY: "106px" }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              {/* Silver Rod */}
              <line x1="214" y1="106" x2="228" y2="40" stroke="url(#chrome)" strokeWidth="6" strokeLinecap="round" />
              {/* Red/Black Ball Handle */}
              <circle cx="228" cy="38" r="13" fill="#000000" />
              <circle cx="228" cy="38" r="11" fill="#111111" />
              <circle cx="225" cy="34" r="4" fill="#444444" opacity="0.6" />
            </motion.g>

            {/* ================= MAIN MACHINE CHASSIS ================= */}
            {/* Background casing (Back cover) */}
            <rect x="36" y="44" width="176" height="152" rx="16" fill="url(#machineBody)" stroke="#111" strokeWidth="2.5" />
            
            {/* Glossy top detail */}
            <path d="M 46,44 Q 124,50 202,44" fill="none" stroke="#374151" strokeWidth="1.5" />

            {/* Top Light Dome (White Glow Bulb) */}
            <g transform="translate(124, 21)">
              {/* Glow backdrop when spinning */}
              {isSpinning && (
                <circle cx="0" cy="8" r="18" fill="#ffffff" className="animate-ping opacity-30" />
              )}
              {/* Outer bulb */}
              <path d="M -16,10 C -16,-6 16,-6 16,10 Z" fill="url(#lightGlow)" stroke="#9ca3af" strokeWidth="1" />
              {/* Base socket */}
              <rect x="-12" y="10" width="24" height="6" fill="#374151" rx="1" />
              <rect x="-8" y="15" width="16" height="2" fill="#1f2937" />
            </g>

            {/* ================= FRONT CHROME BEZEL ================= */}
            {/* Main Outer Bezel frame */}
            <rect x="42" y="66" width="164" height="110" rx="10" fill="url(#chrome)" stroke="#111" strokeWidth="2" />
            
            {/* Inner screen frame */}
            <rect x="48" y="72" width="152" height="98" rx="6" fill="#16181e" stroke="#000000" strokeWidth="3" />

            {/* Individual Reel Slots dividers */}
            {/* Reel 1 Bezel */}
            <rect x="54" y="78" width="44" height="86" rx="4" fill="#000000" />
            {/* Reel 2 Bezel */}
            <rect x="102" y="78" width="44" height="86" rx="4" fill="#000000" />
            {/* Reel 3 Bezel */}
            <rect x="150" y="78" width="44" height="86" rx="4" fill="#000000" />

            {/* Inner shadows on slots */}
            <path d="M 54,78 H 98 V 82 H 54 Z" fill="#111" opacity="0.8" />
            <path d="M 102,78 H 146 V 82 H 102 Z" fill="#111" opacity="0.8" />
            <path d="M 150,78 H 194 V 82 H 150 Z" fill="#111" opacity="0.8" />
          </svg>

          {/* ================= REACT-RENDERED REELS (OVERLAYED PRECISELY) ================= */}
          <div className="absolute inset-0 flex items-center justify-center gap-[4px] pr-[32px] pt-[20px] pointer-events-none select-none">
            {/* Reel Column 1 */}
            <div className="w-[41px] h-[80px] bg-gradient-to-b from-[#f9fafb] via-white to-[#f3f4f6] rounded-[3px] border border-black/80 flex items-center justify-center shadow-[inset_0_8px_16px_rgba(0,0,0,0.85),inset_0_-8px_16px_rgba(0,0,0,0.85)] overflow-hidden">
              <motion.span 
                key={`reel1-${reels[0]}`}
                initial={isSpinning ? { y: -25, opacity: 0.3 } : { y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="text-4xl font-sans font-black text-[#1e232d] tracking-tighter"
              >
                {reels[0]}
              </motion.span>
            </div>

            {/* Reel Column 2 */}
            <div className="w-[41px] h-[80px] bg-gradient-to-b from-[#f9fafb] via-white to-[#f3f4f6] rounded-[3px] border border-black/80 flex items-center justify-center shadow-[inset_0_8px_16px_rgba(0,0,0,0.85),inset_0_-8px_16px_rgba(0,0,0,0.85)] overflow-hidden">
              <motion.span 
                key={`reel2-${reels[1]}`}
                initial={isSpinning ? { y: -25, opacity: 0.3 } : { y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="text-4xl font-sans font-black text-[#1e232d] tracking-tighter"
              >
                {reels[1]}
              </motion.span>
            </div>

            {/* Reel Column 3 */}
            <div className="w-[41px] h-[80px] bg-gradient-to-b from-[#f9fafb] via-white to-[#f3f4f6] rounded-[3px] border border-black/80 flex items-center justify-center shadow-[inset_0_8px_16px_rgba(0,0,0,0.85),inset_0_-8px_16px_rgba(0,0,0,0.85)] overflow-hidden">
              <motion.span 
                key={`reel3-${reels[2]}`}
                initial={isSpinning ? { y: -25, opacity: 0.3 } : { y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="text-4xl font-sans font-black text-[#1e232d] tracking-tighter"
              >
                {reels[2]}
              </motion.span>
            </div>
          </div>
        </div>

        {/* ================= TEXT CONTENT ================= */}
        <h1 className="text-2xl sm:text-3xl font-sans font-bold text-white tracking-tight mb-2.5">
          Oops... Page is not found.
        </h1>
        <p className="text-xs sm:text-sm text-[#8e92a2] font-sans max-w-[360px] leading-relaxed mb-8">
          But don't cry! We have something to surprise you with on other pages.
        </p>

        {/* ================= BACK TO HOME BUTTON ================= */}
        <button
          onClick={() => {
            sound.playClick();
            setView('home');
          }}
          className="px-8 py-3.5 bg-[#f4db56] hover:bg-[#e4cb46] active:scale-95 transition-all duration-200 text-[#0e0c06] font-sans font-bold text-[13px] rounded-full shadow-[0_4px_24px_rgba(244,219,86,0.2)]"
        >
          Back to home page
        </button>

        </div>
      </div>

      {/* High-Fidelity Footer Component */}
      <Footer setView={setView} />
    </div>
  );
}
