import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { HearAndType } from '@/components/games/HearAndType';
import { LetterTiles } from '@/components/games/LetterTiles';
import { MultipleChoice } from '@/components/games/MultipleChoice';
import { WordScramble } from '@/components/games/WordScramble';
import { PracticeLadder } from '@/components/games/PracticeLadder';
import { MissingLetters } from '@/components/games/MissingLetters';
import { AudioMatch } from '@/components/games/AudioMatch';
import { WordSearch } from '@/components/games/WordSearch';
import { GameComplete } from '@/components/games/GameComplete';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X } from 'lucide-react';
import { GameMode, GameSession } from '@/types';

export default function GamePlay() {
  const { mode } = useParams<{ mode: string }>();
  const navigate = useNavigate();
  const { currentWordSet, endGame, startGame, currentGameMode, currentChild } = useGame();
  const [completedSession, setCompletedSession] = useState<GameSession | null>(null);
  const gameModes: GameMode[] = [
    'hear-and-type',
    'letter-tiles',
    'multiple-choice',
    'word-scramble',
    'practice-ladder',
    'missing-letters',
    'audio-match',
    'word-search',
  ];

  useEffect(() => {
    if (!currentChild) navigate('/parent', { replace: true });
  }, [currentChild, navigate]);

  if (!currentChild) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const handleComplete = () => {
    const session = endGame();
    if (session) {
      setCompletedSession(session);
    }
  };

  const handlePlayAgain = () => {
    setCompletedSession(null);
    if (mode && gameModes.includes(mode as GameMode)) {
      startGame(mode as GameMode);
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
      case 'practice-ladder':
        return <PracticeLadder onComplete={handleComplete} />;
      case 'missing-letters':
        return <MissingLetters onComplete={handleComplete} />;
      case 'audio-match':
        return <AudioMatch onComplete={handleComplete} />;
      case 'word-search':
        return <WordSearch onComplete={handleComplete} />;
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
