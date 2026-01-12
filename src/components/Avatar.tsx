import { AvatarConfig } from '@/types';

interface AvatarProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ config, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-20 h-28',
    md: 'w-28 h-40',
    lg: 'w-40 h-56',
    xl: 'w-56 h-80',
  };

  const isFemale = config.gender === 'female';
  
  // Get darkerShade for shadows
  const getDarkerShade = (color: string) => {
    // Simple darkening by adjusting hex
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = Math.max(0, parseInt(hex.slice(0, 2), 16) - 30);
      const g = Math.max(0, parseInt(hex.slice(2, 4), 16) - 30);
      const b = Math.max(0, parseInt(hex.slice(4, 6), 16) - 30);
      return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
    return color;
  };

  const skinShadow = getDarkerShade(config.skinTone);
  const hairDark = getDarkerShade(config.hairColor);

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg viewBox="0 0 100 150" className="w-full h-full">
        <defs>
          {/* Gradients for more realistic look */}
          <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.skinTone} />
            <stop offset="100%" stopColor={skinShadow} />
          </linearGradient>
          <linearGradient id="hairGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={config.hairColor} />
            <stop offset="100%" stopColor={hairDark} />
          </linearGradient>
          <linearGradient id="shirtGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={config.shirtColor} />
            <stop offset="100%" stopColor={getDarkerShade(config.shirtColor)} />
          </linearGradient>
          <linearGradient id="pantsGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={config.pantsColor} />
            <stop offset="100%" stopColor={getDarkerShade(config.pantsColor)} />
          </linearGradient>
        </defs>

        {/* === LEGS === */}
        {/* Left Leg */}
        <path
          d={isFemale 
            ? "M 38 95 L 36 125 Q 35 128 36 130 L 38 125 L 42 95 Z"
            : "M 36 95 L 34 125 Q 33 128 35 130 L 40 125 L 44 95 Z"
          }
          fill="url(#pantsGradient)"
        />
        {/* Right Leg */}
        <path
          d={isFemale 
            ? "M 58 95 L 60 125 Q 61 128 60 130 L 58 125 L 54 95 Z"
            : "M 56 95 L 58 125 Q 59 128 57 130 L 52 125 L 48 95 Z"
          }
          fill="url(#pantsGradient)"
        />

        {/* === FEET / SHOES === */}
        {/* Left Shoe */}
        <ellipse cx="37" cy="132" rx="8" ry="4" fill={config.shoesColor} />
        <ellipse cx="37" cy="131" rx="6" ry="3" fill={getDarkerShade(config.shoesColor)} />
        {/* Right Shoe */}
        <ellipse cx="59" cy="132" rx="8" ry="4" fill={config.shoesColor} />
        <ellipse cx="59" cy="131" rx="6" ry="3" fill={getDarkerShade(config.shoesColor)} />

        {/* === BODY / TORSO === */}
        <path
          d={isFemale 
            ? "M 50 58 Q 32 62 30 75 L 32 95 Q 38 98 50 98 Q 62 98 68 95 L 70 75 Q 68 62 50 58 Z"
            : "M 50 58 Q 28 62 26 75 L 30 95 Q 38 100 50 100 Q 62 100 70 95 L 74 75 Q 72 62 50 58 Z"
          }
          fill="url(#shirtGradient)"
        />
        
        {/* Shirt collar/neckline */}
        {isFemale ? (
          <path d="M 42 58 Q 50 64 58 58" fill="none" stroke={config.skinTone} strokeWidth="3" />
        ) : (
          <path d="M 44 58 L 50 65 L 56 58" fill="none" stroke={getDarkerShade(config.shirtColor)} strokeWidth="1" />
        )}

        {/* === ARMS === */}
        {/* Left Arm */}
        <path
          d={isFemale 
            ? "M 32 62 Q 22 68 18 80 Q 16 88 18 92"
            : "M 28 65 Q 18 70 14 82 Q 12 90 14 95"
          }
          fill="none"
          stroke="url(#shirtGradient)"
          strokeWidth={isFemale ? "8" : "10"}
          strokeLinecap="round"
        />
        {/* Left Hand */}
        <ellipse 
          cx={isFemale ? 18 : 14} 
          cy={isFemale ? 94 : 97} 
          rx={isFemale ? 5 : 6} 
          ry={isFemale ? 6 : 7} 
          fill="url(#skinGradient)" 
        />
        {/* Left Fingers */}
        <g>
          <ellipse cx={isFemale ? 15 : 11} cy={isFemale ? 98 : 101} rx="1.5" ry="3" fill={config.skinTone} />
          <ellipse cx={isFemale ? 18 : 14} cy={isFemale ? 100 : 104} rx="1.5" ry="3" fill={config.skinTone} />
          <ellipse cx={isFemale ? 21 : 17} cy={isFemale ? 98 : 101} rx="1.5" ry="3" fill={config.skinTone} />
        </g>

        {/* Right Arm */}
        <path
          d={isFemale 
            ? "M 68 62 Q 78 68 82 80 Q 84 88 82 92"
            : "M 72 65 Q 82 70 86 82 Q 88 90 86 95"
          }
          fill="none"
          stroke="url(#shirtGradient)"
          strokeWidth={isFemale ? "8" : "10"}
          strokeLinecap="round"
        />
        {/* Right Hand */}
        <ellipse 
          cx={isFemale ? 82 : 86} 
          cy={isFemale ? 94 : 97} 
          rx={isFemale ? 5 : 6} 
          ry={isFemale ? 6 : 7} 
          fill="url(#skinGradient)" 
        />
        {/* Right Fingers */}
        <g>
          <ellipse cx={isFemale ? 79 : 83} cy={isFemale ? 98 : 101} rx="1.5" ry="3" fill={config.skinTone} />
          <ellipse cx={isFemale ? 82 : 86} cy={isFemale ? 100 : 104} rx="1.5" ry="3" fill={config.skinTone} />
          <ellipse cx={isFemale ? 85 : 89} cy={isFemale ? 98 : 101} rx="1.5" ry="3" fill={config.skinTone} />
        </g>

        {/* === NECK === */}
        <rect
          x="44"
          y="50"
          width="12"
          height="12"
          fill="url(#skinGradient)"
          rx="2"
        />

        {/* === HEAD === */}
        <ellipse
          cx="50"
          cy="32"
          rx={isFemale ? 22 : 24}
          ry="24"
          fill="url(#skinGradient)"
        />

        {/* === HAIR === */}
        {/* Short Hair */}
        {config.hairStyle === 'short' && (
          <>
            <path
              d={isFemale 
                ? "M 28 30 Q 28 8 50 6 Q 72 8 72 30 Q 68 15 50 13 Q 32 15 28 30"
                : "M 26 32 Q 26 6 50 4 Q 74 6 74 32 Q 70 14 50 12 Q 30 14 26 32"
              }
              fill="url(#hairGradient)"
            />
            {/* Hair texture lines */}
            <path d="M 35 12 Q 40 8 45 12" fill="none" stroke={hairDark} strokeWidth="1" opacity="0.5" />
            <path d="M 50 8 Q 55 5 60 10" fill="none" stroke={hairDark} strokeWidth="1" opacity="0.5" />
          </>
        )}

        {/* Long Hair - Back portion rendered behind head */}
        {config.hairStyle === 'long' && (
          <>
            {/* Back hair - rendered first so it's behind everything */}
            <path
              d="M 28 40 Q 22 55 24 80 Q 28 90 50 92 Q 72 90 76 80 Q 78 55 72 40"
              fill="url(#hairGradient)"
            />
          </>
        )}

        {/* Curly Hair */}
        {config.hairStyle === 'curly' && (
          <>
            {/* Base curly mass */}
            <ellipse cx="50" cy="18" rx="26" ry="16" fill="url(#hairGradient)" />
            {/* Individual curls */}
            <circle cx="30" cy="22" r="10" fill={config.hairColor} />
            <circle cx="45" cy="14" r="9" fill={config.hairColor} />
            <circle cx="55" cy="12" r="10" fill={config.hairColor} />
            <circle cx="70" cy="22" r="10" fill={config.hairColor} />
            <circle cx="25" cy="35" r="8" fill={config.hairColor} />
            <circle cx="75" cy="35" r="8" fill={config.hairColor} />
            {/* Highlight curls */}
            <circle cx="35" cy="16" r="5" fill={config.hairColor} />
            <circle cx="65" cy="16" r="5" fill={config.hairColor} />
            {/* Curl shadows */}
            <circle cx="32" cy="24" r="4" fill={hairDark} opacity="0.3" />
            <circle cx="68" cy="24" r="4" fill={hairDark} opacity="0.3" />
          </>
        )}

        {/* Ponytail Hair */}
        {config.hairStyle === 'ponytail' && (
          <>
            <path
              d="M 28 30 Q 28 8 50 6 Q 72 8 72 30 Q 68 15 50 13 Q 32 15 28 30"
              fill="url(#hairGradient)"
            />
            {/* Ponytail */}
            <ellipse cx="50" cy="8" rx="8" ry="6" fill={config.hairColor} />
            <path
              d="M 50 12 Q 75 20 78 50 Q 80 70 75 85"
              fill="none"
              stroke={config.hairColor}
              strokeWidth="10"
              strokeLinecap="round"
            />
            {/* Ponytail shine */}
            <path
              d="M 52 15 Q 74 25 77 52"
              fill="none"
              stroke={hairDark}
              strokeWidth="2"
              opacity="0.4"
            />
            {/* Hair tie */}
            <ellipse cx="50" cy="10" rx="4" ry="2" fill="#FF69B4" />
          </>
        )}

        {/* Braids Hair */}
        {config.hairStyle === 'braids' && (
          <>
            <path
              d="M 26 30 Q 26 8 50 6 Q 74 8 74 30 Q 70 15 50 13 Q 30 15 26 30"
              fill="url(#hairGradient)"
            />
            {/* Left braid */}
            <path
              d="M 28 35 Q 22 50 24 70 Q 20 75 22 80"
              fill="none"
              stroke={config.hairColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="22" cy="82" r="3" fill="#FF69B4" />
            {/* Right braid */}
            <path
              d="M 72 35 Q 78 50 76 70 Q 80 75 78 80"
              fill="none"
              stroke={config.hairColor}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx="78" cy="82" r="3" fill="#FF69B4" />
            {/* Braid texture */}
            <path d="M 26 45 L 22 48 M 24 55 L 20 58 M 26 65 L 22 68" fill="none" stroke={hairDark} strokeWidth="1" />
            <path d="M 74 45 L 78 48 M 76 55 L 80 58 M 74 65 L 78 68" fill="none" stroke={hairDark} strokeWidth="1" />
          </>
        )}

        {/* Bun Hair */}
        {config.hairStyle === 'bun' && (
          <>
            <path
              d="M 28 30 Q 28 10 50 8 Q 72 10 72 30 Q 68 18 50 16 Q 32 18 28 30"
              fill="url(#hairGradient)"
            />
            {/* Bun */}
            <circle cx="50" cy="6" r="10" fill="url(#hairGradient)" />
            <circle cx="50" cy="6" r="6" fill={hairDark} opacity="0.2" />
            {/* Side hair wisps */}
            <path d="M 30 28 Q 26 32 28 38" fill="none" stroke={config.hairColor} strokeWidth="2" />
            <path d="M 70 28 Q 74 32 72 38" fill="none" stroke={config.hairColor} strokeWidth="2" />
          </>
        )}

        {/* === EARS === */}
        <ellipse cx="26" cy="35" rx="4" ry="6" fill={config.skinTone} />
        <ellipse cx="74" cy="35" rx="4" ry="6" fill={config.skinTone} />
        <ellipse cx="26" cy="35" rx="2" ry="3" fill={skinShadow} opacity="0.3" />
        <ellipse cx="74" cy="35" rx="2" ry="3" fill={skinShadow} opacity="0.3" />

        {/* === LONG HAIR FRONT PORTIONS (rendered after head so it overlays properly) === */}
        {config.hairStyle === 'long' && (
          <>
            {/* Top of head hair */}
            <path
              d="M 24 32 Q 24 6 50 4 Q 76 6 76 32 Q 72 14 50 12 Q 28 14 24 32"
              fill="url(#hairGradient)"
            />
            {/* Side hair flows - in front of ears */}
            <path
              d="M 26 30 Q 20 50 22 75 Q 24 78 28 75 Q 26 55 28 35 Z"
              fill="url(#hairGradient)"
            />
            <path
              d="M 74 30 Q 80 50 78 75 Q 76 78 72 75 Q 74 55 72 35 Z"
              fill="url(#hairGradient)"
            />
            {/* Hair texture */}
            <path d="M 24 45 Q 22 55 24 65" fill="none" stroke={hairDark} strokeWidth="1" opacity="0.4" />
            <path d="M 76 45 Q 78 55 76 65" fill="none" stroke={hairDark} strokeWidth="1" opacity="0.4" />
          </>
        )}

        {/* === EYES === */}
        {/* Eye whites */}
        <ellipse
          cx="40"
          cy="32"
          rx={config.eyeShape === 'round' ? 5 : 6}
          ry={config.eyeShape === 'round' ? 5 : 4}
          fill="white"
        />
        <ellipse
          cx="60"
          cy="32"
          rx={config.eyeShape === 'round' ? 5 : 6}
          ry={config.eyeShape === 'round' ? 5 : 4}
          fill="white"
        />
        {/* Iris */}
        <circle cx="41" cy="32" r="3" fill={config.eyeColor} />
        <circle cx="61" cy="32" r="3" fill={config.eyeColor} />
        {/* Pupils */}
        <circle cx="41.5" cy="32" r="1.5" fill="#1a1a1a" />
        <circle cx="61.5" cy="32" r="1.5" fill="#1a1a1a" />
        {/* Eye sparkle */}
        <circle cx="42" cy="31" r="1" fill="white" />
        <circle cx="62" cy="31" r="1" fill="white" />
        
        {/* Eyebrows */}
        <path
          d={isFemale 
            ? "M 34 26 Q 40 24 46 26"
            : "M 33 25 Q 40 23 47 26"
          }
          fill="none"
          stroke={config.hairColor}
          strokeWidth={isFemale ? "1.5" : "2"}
          strokeLinecap="round"
        />
        <path
          d={isFemale 
            ? "M 54 26 Q 60 24 66 26"
            : "M 53 26 Q 60 23 67 25"
          }
          fill="none"
          stroke={config.hairColor}
          strokeWidth={isFemale ? "1.5" : "2"}
          strokeLinecap="round"
        />

        {/* Eyelashes for female */}
        {isFemale && (
          <>
            <path d="M 34 30 L 33 28" stroke="#333" strokeWidth="1" />
            <path d="M 36 29 L 35 27" stroke="#333" strokeWidth="1" />
            <path d="M 64 29 L 65 27" stroke="#333" strokeWidth="1" />
            <path d="M 66 30 L 67 28" stroke="#333" strokeWidth="1" />
          </>
        )}

        {/* === NOSE === */}
        <path
          d={config.noseShape === 'small' 
            ? "M 50 36 Q 48 40 50 42 Q 52 40 50 36"
            : "M 50 34 Q 46 40 50 44 Q 54 40 50 34"
          }
          fill={skinShadow}
          opacity="0.4"
        />

        {/* === MOUTH === */}
        {config.mouthShape === 'smile' && (
          <path
            d="M 44 46 Q 50 52 56 46"
            fill="none"
            stroke="#D4766A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {config.mouthShape === 'happy' && (
          <>
            <ellipse cx="50" cy="48" rx="6" ry="4" fill="#D4766A" />
            <ellipse cx="50" cy="47" rx="4" ry="2" fill="#FF8B8B" />
          </>
        )}
        {config.mouthShape === 'neutral' && (
          <line
            x1="44"
            y1="48"
            x2="56"
            y2="48"
            stroke="#D4766A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}

        {/* === CHEEKS (blush) === */}
        <circle cx="32" cy="40" r="4" fill="#FFB6C1" opacity="0.35" />
        <circle cx="68" cy="40" r="4" fill="#FFB6C1" opacity="0.35" />

        {/* === ACCESSORIES === */}
        {/* Glasses */}
        {config.accessories.includes('glasses') && (
          <>
            <circle cx="40" cy="32" r="8" fill="none" stroke="#333" strokeWidth="2" />
            <circle cx="60" cy="32" r="8" fill="none" stroke="#333" strokeWidth="2" />
            <line x1="48" y1="32" x2="52" y2="32" stroke="#333" strokeWidth="2" />
            <line x1="32" y1="32" x2="26" y2="30" stroke="#333" strokeWidth="1.5" />
            <line x1="68" y1="32" x2="74" y2="30" stroke="#333" strokeWidth="1.5" />
          </>
        )}

        {/* Hair Bow / Ribbon */}
        {config.accessories.includes('bow') && (
          <>
            <ellipse cx="70" cy="14" rx="7" ry="4" fill="#FF69B4" />
            <ellipse cx="80" cy="14" rx="7" ry="4" fill="#FF69B4" />
            <circle cx="75" cy="14" r="3" fill="#FF1493" />
          </>
        )}

        {/* Party Hat */}
        {config.accessories.includes('hat') && (
          <>
            <polygon points="50,-8 35,12 65,12" fill="#9B59B6" />
            <circle cx="50" cy="-6" r="4" fill="#F1C40F" />
            <line x1="38" y1="10" x2="62" y2="10" stroke="#E74C3C" strokeWidth="3" />
          </>
        )}

        {/* Royal Crown */}
        {config.accessories.includes('crown') && (
          <>
            <polygon points="32,8 36,-2 42,6 50,-6 58,6 64,-2 68,8" fill="#FFD700" />
            <rect x="32" y="8" width="36" height="6" fill="#FFD700" />
            <circle cx="36" cy="0" r="2" fill="#E74C3C" />
            <circle cx="50" cy="-4" r="2" fill="#3498DB" />
            <circle cx="64" cy="0" r="2" fill="#2ECC71" />
          </>
        )}

        {/* Headphones */}
        {config.accessories.includes('headphones') && (
          <>
            <path d="M 24 32 Q 24 6 50 4 Q 76 6 76 32" fill="none" stroke="#333" strokeWidth="4" />
            <ellipse cx="24" cy="36" rx="5" ry="8" fill="#333" />
            <ellipse cx="76" cy="36" rx="5" ry="8" fill="#333" />
            <ellipse cx="24" cy="36" rx="3" ry="5" fill="#666" />
            <ellipse cx="76" cy="36" rx="3" ry="5" fill="#666" />
          </>
        )}

        {/* Necklace */}
        {config.accessories.includes('necklace') && (
          <path
            d="M 40 58 Q 50 65 60 58"
            fill="none"
            stroke="#FFD700"
            strokeWidth="2"
          />
        )}

        {/* Watch */}
        {config.accessories.includes('watch') && (
          <>
            <rect x={isFemale ? 14 : 10} y={isFemale ? 88 : 91} width="8" height="6" rx="1" fill="#333" />
            <rect x={isFemale ? 15 : 11} y={isFemale ? 89 : 92} width="6" height="4" rx="1" fill="#87CEEB" />
          </>
        )}
      </svg>
    </div>
  );
}