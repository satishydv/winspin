import React, { useState } from 'react';

interface Props {
  src: string;
  alt: string;
  className?: string;
}

export default function FallbackImage({ src, alt, className = "" }: Props) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-[#1a1c24] to-[#0a0b0f] text-center border border-white/5 overflow-hidden relative ${className}`}>
        {/* Placeholder decorative elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-[#f7d365]/10 blur-xl pointer-events-none" />
        
        <span className="text-[#f7d365] font-display font-black tracking-tight leading-tight uppercase drop-shadow-md break-words line-clamp-3 p-1 px-2 z-10 text-[0.65rem] sm:text-xs text-center w-full">
          {alt || 'Game'}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
