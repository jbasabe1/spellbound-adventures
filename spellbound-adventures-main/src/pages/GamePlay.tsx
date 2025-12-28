import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { HearAndType } from '@/components/games/HearAndType';
import { LetterTiles } from '@/components/games/LetterTiles';
import { MultipleChoice } from '@/components/games/MultipleChoice';
import { WordScramble } from '@/components/games/WordScramble';
import { GameComplete } from '@/components/games/GameComplete';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { GameSession } from '@/types';

export default function GamePlay() {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { currentWordSet, endGame, startGame, currentGameMode } = useGame();
  const [completedSession, setCompletedSession] = useState<GameSession | null>(null);

  const handleComplete = () => {
    const session = endGame();
    if (session) {
      setCompletedSession(session);
    }
  };

  const handlePlayAgain = () => {
    setCompletedSession(null);
    if (mode) {
      startGame(mode as any);
    }
  };

  const handleExit = () => {
    if (confirm('Are you sure you want to exit? Your progress will be lost.')) {
      endGame();
      navigate('/games');
    }
  };

  if (!currentWordSet) {
    navigate('/games');
    return null;
  }

  if (completedSession) {
    return (
      <div className="min-h-screen pt-20 pb-8 bg-background">
        <GameComplete session={completedSession} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  const renderGame = () => {
    switch (mode) {
      case 'hear-and-type':
        return <HearAndType onComplete={handleComplete} />;
      case 'letter-tiles':
        return <LetterTiles onComplete={handleComplete} />;
      case 'multiple-choice':
        return <MultipleChoice onComplete={handleComplete} />;
      case 'word-scramble':
        return <WordScramble onComplete={handleComplete} />;
      default:
        return <div>Unknown game mode</div>;
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 bg-background">
      {/* Exit Button */}
      <div className="fixed top-20 right-4 z-40">
        <Button variant="ghost" size="icon-sm" onClick={handleExit}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      {renderGame()}
    </div>
  );
}
