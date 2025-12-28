import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GameSession } from '@/types';
import { Trophy, Star, Coins, Sparkles, Home, RotateCcw, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

interface GameCompleteProps {
  session: GameSession;
  onPlayAgain: () => void;
}

export function GameComplete({ session, onPlayAgain }: GameCompleteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Celebration confetti
    if (session.accuracy >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [session.accuracy]);

  const getPerformanceMessage = () => {
    if (session.accuracy >= 90) return { emoji: '🌟', message: 'AMAZING!' };
    if (session.accuracy >= 70) return { emoji: '🎉', message: 'GREAT JOB!' };
    if (session.accuracy >= 50) return { emoji: '👍', message: 'GOOD EFFORT!' };
    return { emoji: '💪', message: 'KEEP PRACTICING!' };
  };

  const performance = getPerformanceMessage();
  const totalWords = session.totalWords ?? session.attempts.length;
  const correctWords = session.score ?? session.attempts.filter(a => a.correct).length;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Celebration Header */}
      <div className="text-center mb-8">
        <span className="text-6xl block mb-4 animate-bounce-soft">{performance.emoji}</span>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          {performance.message}
        </h1>
        <p className="text-muted-foreground">
          You completed the spelling practice!
        </p>
      </div>

      {/* Stats Card */}
      <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8 mb-6">
        {/* Score */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full gradient-hero mb-4">
            <span className="text-3xl font-bold text-primary-foreground">
              {Math.round(session.accuracy)}%
            </span>
          </div>
          <p className="text-lg text-muted-foreground">
            {correctWords} of {totalWords} words correct!
          </p>
        </div>

        {/* Rewards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-coin/10 rounded-2xl p-4 text-center">
            <Coins className="h-8 w-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">+{session.coinsEarned}</p>
            <p className="text-sm text-muted-foreground">Coins Earned</p>
          </div>
          <div className="bg-xp/10 rounded-2xl p-4 text-center">
            <Sparkles className="h-8 w-8 text-xp mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">+{session.xpEarned}</p>
            <p className="text-sm text-muted-foreground">XP Earned</p>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`h-10 w-10 transition-all ${
                session.accuracy >= star * 30
                  ? 'text-amber-400 fill-amber-400 animate-pop'
                  : 'text-muted'
              }`}
              style={{ animationDelay: `${star * 200}ms` }}
            />
          ))}
        </div>

        {/* Words Review */}
        {session.attempts.some(a => !a.correct || a.attempts > 1) && (
          <div className="border-t border-border pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-2">Words to practice:</p>
            <div className="flex flex-wrap gap-2">
              {session.attempts
                .filter(a => !a.correct || a.attempts > 1)
                .map((attempt, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium"
                  >
                    {attempt.word}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid gap-3">
        <Button
          variant="game"
          size="xl"
          onClick={onPlayAgain}
          className="text-xl gap-2"
        >
          <RotateCcw className="h-6 w-6" />
          Play Again
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate('/games')}
          className="gap-2"
        >
          <ArrowRight className="h-5 w-5" />
          Try Another Game
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/play')}
          className="gap-2"
        >
          <Home className="h-5 w-5" />
          Back Home
        </Button>
      </div>
    </div>
  );
}
