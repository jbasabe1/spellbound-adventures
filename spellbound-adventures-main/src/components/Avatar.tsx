import { AvatarConfig } from '@/types';

interface AvatarProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ config, size = 'md', className = '' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  };

  const headSizes = {
    sm: 50,
    md: 70,
    lg: 90,
    xl: 130,
  };

  const headSize = headSizes[size];

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg viewBox="0 0 100 140" className="w-full h-full">
        {/* Body/Shirt */}
        <ellipse
          cx="50"
          cy="115"
          rx="30"
          ry="25"
          fill={config.shirtColor}
        />
        
        {/* Neck */}
        <rect
          x="42"
          y="75"
          width="16"
          height="15"
          fill={config.skinTone}
          rx="3"
        />
        
        {/* Head */}
        <ellipse
          cx="50"
          cy="45"
          rx={headSize * 0.35}
          ry={headSize * 0.4}
          fill={config.skinTone}
        />
        
        {/* Hair */}
        {config.hairStyle === 'short' && (
          <path
            d={`M 25 40 Q 25 15 50 12 Q 75 15 75 40 Q 70 25 50 22 Q 30 25 25 40`}
            fill={config.hairColor}
          />
        )}
        {config.hairStyle === 'long' && (
          <>
            <path
              d={`M 20 40 Q 20 10 50 8 Q 80 10 80 40 Q 75 20 50 18 Q 25 20 20 40`}
              fill={config.hairColor}
            />
            <ellipse cx="25" cy="55" rx="8" ry="20" fill={config.hairColor} />
            <ellipse cx="75" cy="55" rx="8" ry="20" fill={config.hairColor} />
          </>
        )}
        {config.hairStyle === 'curly' && (
          <>
            <circle cx="30" cy="25" r="12" fill={config.hairColor} />
            <circle cx="50" cy="18" r="14" fill={config.hairColor} />
            <circle cx="70" cy="25" r="12" fill={config.hairColor} />
            <circle cx="22" cy="40" r="10" fill={config.hairColor} />
            <circle cx="78" cy="40" r="10" fill={config.hairColor} />
          </>
        )}
        {config.hairStyle === 'ponytail' && (
          <>
            <path
              d={`M 25 40 Q 25 15 50 12 Q 75 15 75 40 Q 70 25 50 22 Q 30 25 25 40`}
              fill={config.hairColor}
            />
            <ellipse cx="75" cy="50" rx="6" ry="25" fill={config.hairColor} />
          </>
        )}
        
        {/* Eyes */}
        <ellipse
          cx="38"
          cy="45"
          rx={config.eyeShape === 'round' ? 6 : 7}
          ry={config.eyeShape === 'round' ? 6 : 4}
          fill="white"
        />
        <ellipse
          cx="62"
          cy="45"
          rx={config.eyeShape === 'round' ? 6 : 7}
          ry={config.eyeShape === 'round' ? 6 : 4}
          fill="white"
        />
        <circle cx="39" cy="45" r="3" fill={config.eyeColor} />
        <circle cx="63" cy="45" r="3" fill={config.eyeColor} />
        <circle cx="40" cy="44" r="1" fill="white" />
        <circle cx="64" cy="44" r="1" fill="white" />
        
        {/* Nose */}
        <ellipse
          cx="50"
          cy="55"
          rx={config.noseShape === 'small' ? 3 : 4}
          ry={config.noseShape === 'small' ? 2 : 3}
          fill={config.skinTone}
          stroke="#00000020"
          strokeWidth="0.5"
        />
        
        {/* Mouth */}
        {config.mouthShape === 'smile' && (
          <path
            d="M 42 62 Q 50 70 58 62"
            fill="none"
            stroke="#D4766A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        {config.mouthShape === 'happy' && (
          <ellipse cx="50" cy="64" rx="8" ry="5" fill="#D4766A" />
        )}
        {config.mouthShape === 'neutral' && (
          <line
            x1="42"
            y1="64"
            x2="58"
            y2="64"
            stroke="#D4766A"
            strokeWidth="2"
            strokeLinecap="round"
          />
        )}
        
        {/* Cheeks (blush) */}
        <circle cx="30" cy="55" r="5" fill="#FFB6C1" opacity="0.4" />
        <circle cx="70" cy="55" r="5" fill="#FFB6C1" opacity="0.4" />
        
        {/* Accessories */}
        {config.accessories.includes('glasses') && (
          <>
            <circle cx="38" cy="45" r="10" fill="none" stroke="#333" strokeWidth="2" />
            <circle cx="62" cy="45" r="10" fill="none" stroke="#333" strokeWidth="2" />
            <line x1="48" y1="45" x2="52" y2="45" stroke="#333" strokeWidth="2" />
          </>
        )}
      </svg>
    </div>
  );
}
