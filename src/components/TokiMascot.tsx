import React from 'react';

export type TokiMood = 'idle' | 'happy' | 'thinking' | 'celebrate' | 'boss' | 'coaching';

interface TokiMascotProps {
  mood?: TokiMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  bubbleText?: string;
  onClick?: () => void;
  className?: string;
}

export const TokiMascot: React.FC<TokiMascotProps> = ({
  mood = 'idle',
  size = 'md',
  bubbleText,
  onClick,
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-28 h-28',
    xl: 'w-36 h-36',
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center select-none ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Speech Bubble if present */}
      {bubbleText && (
        <div className="relative mb-2 px-3 py-1.5 bg-white/95 border border-amber-200 shadow-md rounded-2xl text-xs md:text-sm text-slate-700 font-medium max-w-[200px] text-center animate-bounce-gentle">
          {bubbleText}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-amber-200 rotate-45" />
        </div>
      )}

      {/* Toki Mascot SVG */}
      <div className={`${sizeMap[size]} relative transition-transform duration-300 hover:scale-105 active:scale-95`}>
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Toki Body Gradient (Warm sunshine yellow) */}
            <linearGradient id="tokiBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#FACC15" />
              <stop offset="100%" stopColor="#EAB308" />
            </linearGradient>

            {/* Belly highlight gradient */}
            <linearGradient id="tokiBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF9C3" />
              <stop offset="100%" stopColor="#FEF08A" />
            </linearGradient>

            {/* Cape gradient for Boss mode */}
            <linearGradient id="bossCapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </linearGradient>
          </defs>

          {/* Boss Cape (Behind body) */}
          {mood === 'boss' && (
            <path
              d="M 50 85 Q 25 130 35 150 Q 80 145 125 150 Q 135 130 110 85 Z"
              fill="url(#bossCapeGrad)"
              className="animate-pulse"
            />
          )}

          {/* Toki's Chubby One-Piece Body (Head + Body integrated) */}
          <path
            d="M 80 20
               C 125 20, 140 55, 140 95
               C 140 135, 120 150, 80 150
               C 40 150, 20 135, 20 95
               C 20 55, 35 20, 80 20 Z"
            fill="url(#tokiBodyGrad)"
          />

          {/* Cute Little Ears/Horns on Top */}
          <ellipse cx="50" cy="24" rx="10" ry="14" fill="#EAB308" transform="rotate(-15 50 24)" />
          <ellipse cx="50" cy="24" rx="6" ry="9" fill="#FEF08A" transform="rotate(-15 50 24)" />

          <ellipse cx="110" cy="24" rx="10" ry="14" fill="#EAB308" transform="rotate(15 110 24)" />
          <ellipse cx="110" cy="24" rx="6" ry="9" fill="#FEF08A" transform="rotate(15 110 24)" />

          {/* Little Top Hair Feather / Tuft */}
          <path
            d="M 76 22 Q 80 6 86 16 Q 84 22 80 22 Z"
            fill="#CA8A04"
          />

          {/* Belly Patch (Lighter creamy oval) */}
          <ellipse cx="80" cy="112" rx="38" ry="30" fill="url(#tokiBellyGrad)" />

          {/* Rosy Cheeks */}
          <ellipse cx="42" cy="88" rx="9" ry="6" fill="#FDA4AF" opacity="0.85" />
          <ellipse cx="118" cy="88" rx="9" ry="6" fill="#FDA4AF" opacity="0.85" />

          {/* Eyes & Expressions */}
          {mood === 'happy' || mood === 'celebrate' ? (
            // Joyful Arch Eyes ^ ^
            <g stroke="#1E293B" strokeWidth="4.5" strokeLinecap="round" fill="none">
              <path d="M 48 76 Q 58 66 68 76" />
              <path d="M 92 76 Q 102 66 112 76" />
            </g>
          ) : mood === 'thinking' ? (
            // Curious Eyes (One raised, looking up)
            <g>
              <ellipse cx="58" cy="72" rx="7" ry="8" fill="#1E293B" />
              <circle cx="56" cy="69" r="2.5" fill="#FFFFFF" />
              <ellipse cx="102" cy="68" rx="7" ry="8" fill="#1E293B" />
              <circle cx="100" cy="65" r="2.5" fill="#FFFFFF" />
              <path d="M 48 60 Q 58 54 68 62" stroke="#713F12" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M 92 56 Q 102 50 112 56" stroke="#713F12" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          ) : (
            // Normal Cute Round Big Eyes
            <g>
              <ellipse cx="58" cy="74" rx="7.5" ry="9" fill="#1E293B" />
              <circle cx="56" cy="71" r="3" fill="#FFFFFF" />
              <circle cx="61" cy="78" r="1.5" fill="#FFFFFF" />

              <ellipse cx="102" cy="74" rx="7.5" ry="9" fill="#1E293B" />
              <circle cx="100" cy="71" r="3" fill="#FFFFFF" />
              <circle cx="105" cy="78" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* Cute Mouth */}
          {mood === 'happy' || mood === 'celebrate' ? (
            // Open Laughing Mouth with Tongue
            <g>
              <path
                d="M 68 88 Q 80 108 92 88 Z"
                fill="#DC2626"
              />
              <path
                d="M 72 96 Q 80 90 88 96 Q 80 104 72 96 Z"
                fill="#FDA4AF"
              />
            </g>
          ) : mood === 'thinking' ? (
            // Pouting small 'o' mouth
            <circle cx="80" cy="90" r="3.5" fill="#991B1B" />
          ) : (
            // Sweet smile
            <path
              d="M 72 87 Q 80 96 88 87"
              stroke="#713F12"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Short Round Limbs (Legs / Paws) */}
          <ellipse cx="56" cy="148" rx="14" ry="9" fill="#F59E0B" />
          <ellipse cx="104" cy="148" rx="14" ry="9" fill="#F59E0B" />

          {/* Arms according to mood */}
          {mood === 'celebrate' ? (
            // Arms Raised Up High Cheering!
            <g>
              <ellipse cx="26" cy="62" rx="10" ry="16" fill="#FACC15" transform="rotate(-35 26 62)" stroke="#EAB308" strokeWidth="2" />
              <ellipse cx="134" cy="62" rx="10" ry="16" fill="#FACC15" transform="rotate(35 134 62)" stroke="#EAB308" strokeWidth="2" />
              {/* Confetti sparkle stars */}
              <text x="18" y="40" fontSize="16">✨</text>
              <text x="126" y="40" fontSize="16">⭐</text>
            </g>
          ) : mood === 'thinking' ? (
            // One arm touching chin
            <g>
              <ellipse cx="28" cy="98" rx="9" ry="14" fill="#FACC15" transform="rotate(10 28 98)" stroke="#EAB308" strokeWidth="1.5" />
              <ellipse cx="94" cy="92" rx="9" ry="14" fill="#FACC15" transform="rotate(-65 94 92)" stroke="#EAB308" strokeWidth="1.5" />
            </g>
          ) : mood === 'boss' ? (
            // Super hero stance / red headband
            <g>
              <rect x="42" y="36" width="76" height="10" rx="4" fill="#EF4444" />
              <circle cx="80" cy="41" r="7" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
              <ellipse cx="26" cy="98" rx="10" ry="14" fill="#FACC15" transform="rotate(25 26 98)" />
              <ellipse cx="134" cy="98" rx="10" ry="14" fill="#FACC15" transform="rotate(-25 134 98)" />
            </g>
          ) : (
            // Friendly Waving Left Hand
            <g>
              <ellipse cx="24" cy="85" rx="9" ry="14" fill="#FACC15" transform="rotate(-25 24 85)" stroke="#EAB308" strokeWidth="1.5" />
              <ellipse cx="134" cy="98" rx="9" ry="13" fill="#FACC15" transform="rotate(15 134 98)" stroke="#EAB308" strokeWidth="1.5" />
            </g>
          )}

          {/* 51Talk Cute Aqua Tie / Ribbon */}
          {mood !== 'boss' && (
            <g transform="translate(80, 102)">
              <polygon points="0,-4 -8,3 0,10 8,3" fill="#06B6D4" stroke="#0891B2" strokeWidth="1" />
              <circle cx="0" cy="3" r="2.5" fill="#FEF08A" />
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};
