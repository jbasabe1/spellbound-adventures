import { useEffect, useState } from 'react';
import { Star, Check } from 'lucide-react';

interface CorrectFeedbackProps {
  show: boolean;
}

// Play a success sound
export function playCorrectSound() {
  try {
    const audioConstructor =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!audioConstructor) return;
    const audioContext = new audioConstructor();
    
    // Create a pleasant "ding" sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    oscillator.frequency.setValueAtTime(1100, audioContext.currentTime + 0.1); // C#6
    oscillator.frequency.setValueAtTime(1320, audioContext.currentTime + 0.2); // E6
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch (e) {
    // Audio not supported
  }
}

export function CorrectFeedback({ show }: CorrectFeedbackProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) {
      setVisible(false);
      return;
    }

    setVisible(true);
    playCorrectSound();
    const timer = setTimeout(() => setVisible(false), 800);
    return () => clearTimeout(timer);
  }, [show]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
      <div className="relative animate-scale-in">
        {/* Star background */}
        <Star 
          className="h-32 w-32 text-yellow-400 fill-yellow-400 drop-shadow-lg animate-pulse" 
          strokeWidth={1.5}
        />
        {/* Check mark overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Check className="h-16 w-16 text-white drop-shadow-md" strokeWidth={3} />
        </div>
      </div>
    </div>
  );
}
