import React, { useState } from 'react';
import { Copy, Check, Headphones, ExternalLink } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  setView: (view: any) => void;
}

export default function Footer({ setView }: FooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      sound.playClick();
    } catch (err) {}
    
    navigator.clipboard.writeText('support@betkin.com');
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleLinkClick = (viewName: any) => {
    try {
      sound.playClick();
    } catch (err) {}
    setView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSupportClick = () => {
    try {
      sound.playClick();
    } catch (err) {}
    // Trigger the chats view or show an action
    setView('chats');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="betkin_footer" className="w-full bg-[#07080a] border-t border-[#16181e] pt-12 pb-8 px-6 sm:px-12 mt-auto select-none font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Four Column Navigation Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
          
          {/* Column 1: Casino */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-sans font-bold text-sm tracking-wider uppercase mb-1">Casino</h3>
            <button 
              onClick={() => handleLinkClick('home')} 
              className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5"
            >
              Home
            </button>
            <button 
              onClick={() => handleLinkClick('slots')} 
              className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5"
            >
              Slots
            </button>
            <button 
              onClick={() => handleLinkClick('casino')} 
              className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5"
            >
              Live Games
            </button>
            <button 
              onClick={() => handleLinkClick('promo')} 
              className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5"
            >
              VIP Club
            </button>
          </div>

          {/* Column 2: Support */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-sans font-bold text-sm tracking-wider uppercase mb-1">Support</h3>
            <button 
              onClick={handleSupportClick} 
              className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5"
            >
              Live Support
            </button>
            
            {/* Clickable email copying option with copy feedback */}
            <div className="flex items-center gap-1.5 group relative">
              <a 
                href="mailto:support@betkin.com"
                className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5 break-all"
              >
                support@betkin.com
              </a>
              <button 
                onClick={handleCopyEmail}
                className="p-1 text-[#8e92a2] hover:text-[#e3ff36] hover:bg-[#12141a] rounded transition-all duration-150 shrink-0"
                title="Copy support email address"
              >
                {copied ? <Check size={11} className="text-[#e3ff36]" /> : <Copy size={11} />}
              </button>

              {/* Toast/Tooltip info overlay */}
              {copied && (
                <span className="absolute left-0 -top-7 bg-[#1a1c23] border border-yellow-500/20 text-[#e3ff36] text-[10px] font-bold px-2 py-0.5 rounded shadow-lg animate-fade-in pointer-events-none">
                  Copied to clipboard!
                </span>
              )}
            </div>
          </div>

          {/* Column 3: Community */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-sans font-bold text-sm tracking-wider uppercase mb-1">Community</h3>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8e92a2] hover:text-white text-xs font-medium transition-colors duration-150 py-0.5 flex items-center gap-1.5"
            >
              Instagram <ExternalLink size={10} className="opacity-40" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8e92a2] hover:text-white text-xs font-medium transition-colors duration-150 py-0.5 flex items-center gap-1.5"
            >
              Twitter <ExternalLink size={10} className="opacity-40" />
            </a>
            <a 
              href="https://discord.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8e92a2] hover:text-white text-xs font-medium transition-colors duration-150 py-0.5 flex items-center gap-1.5"
            >
              Discord <ExternalLink size={10} className="opacity-40" />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#8e92a2] hover:text-white text-xs font-medium transition-colors duration-150 py-0.5 flex items-center gap-1.5"
            >
              Facebook <ExternalLink size={10} className="opacity-40" />
            </a>
          </div>

          {/* Column 4: Other */}
          <div className="flex flex-col gap-3">
            <h3 className="text-white font-sans font-bold text-sm tracking-wider uppercase mb-1">Other</h3>
            <button className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5">
              Terms & Conditions
            </button>
            <button className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5">
              Privacy Policy
            </button>
            <button className="text-[#8e92a2] hover:text-white text-xs text-left font-medium transition-colors duration-150 py-0.5">
              AML-KYC policy
            </button>
          </div>

        </div>

        {/* Bottom Logo & Copyright Layout matching user uploaded screenshot exactly */}
        <div className="relative border-t border-[#12141a] pt-8 flex flex-col items-center justify-center gap-4">
          
          {/* Styled BETKIN Logo */}
          <div className="flex flex-col items-center">
            <div className="relative inline-flex items-center justify-center font-sans tracking-wide">
              {/* Outer logo block with double yellow outline effect matching screen */}
              <div className="border-t-[3.5px] border-b-[3.5px] border-[#e3ff36] px-5 py-0.5 text-[#e3ff36] font-extrabold text-xl sm:text-2xl tracking-[0.2em] transform skew-x-[-10deg] uppercase font-sans select-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                BETKIN
              </div>
            </div>
          </div>

          {/* Copyright notice text */}
          <p className="text-[10.5px] font-sans text-[#5c6170] tracking-wide text-center">
            &copy; {new Date().getFullYear()} betkin.com | All Rights Reserved.
          </p>

          {/* Support Headphone floating circle helper exactly like image in bottom-right area */}
          <div className="absolute right-0 bottom-0 md:-bottom-2 pr-2">
            <button 
              onClick={handleSupportClick}
              className="h-10 w-10 rounded-full bg-[#1b1e25] border border-[#2b303d] text-[#8e92a2] hover:text-white hover:bg-[#252a36] hover:border-yellow-500/35 transition-all duration-200 flex items-center justify-center shadow-lg active:scale-95"
              title="Open Live Chat Support"
            >
              <Headphones size={16} />
            </button>
          </div>

        </div>

      </div>
    </footer>
  );
}
