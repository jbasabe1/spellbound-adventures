import { Hand } from 'lucide-react';

interface PointingFingerProps {
  show: boolean;
}

export function PointingFinger({ show }: PointingFingerProps) {
  if (!show) return null;

  return (
    <div className="absolute -left-8 top-1/2 -translate-y-1/2 animate-bounce">
      <Hand className="h-6 w-6 text-amber-500 rotate-90" />
    </div>
  );
}
