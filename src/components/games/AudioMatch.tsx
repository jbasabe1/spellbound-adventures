import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, ArrowRight, Hand } from 'lucide-react';
import { Word } from '@/types';
import { CorrectFeedback } from './CorrectFeedback';

interface AudioMatchProps {
  onComplete: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function AudioMatch({ onComplete }: AudioMatchProps) {
  const {
    currentWordSet,
    currentWordIndex,
    showAnswer,
    submitAnswer,
    nextWord,
    speakWord
  } = useGame();

  const currentWord: Word | undefined = currentWordSet?.words[currentWordIndex];

  const [choices, setChoices] = useState<string[]>([]);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'try-again' | 'show-answer' | null>(null);
  const [mustSelectCorrect, setMustSelectCorrect] = useState(false);
  const [showStarPopup, setShowStarPopup] = useState(false);

  const progress = useMemo(() => {
    if (!currentWordSet) return 0;
    return ((currentWordIndex + 1) / currentWordSet.words.length) * 100;
  }, [currentWordIndex, currentWordSet]);

  const buildChoices = useCallback(() => {
    if (!currentWordSet || !currentWord) return;
    const pool = currentWordSet.words
      .map(w => w.word)
      .filter(w => w.toLowerCase() !== currentWord.word.toLowerCase());

    const distractors = shuffle(pool).slice(0, 3);
    const all = shuffle([currentWord.word, ...distractors]);
    setChoices(all);
  }, [currentWord, currentWordSet]);

  useEffect(() => {
    setFeedback(null);
    setSelectedChoice(null);
    setMustSelectCorrect(false);
    setShowStarPopup(false);
    buildChoices();
    // auto-play word shortly
    const t = setTimeout(() => {
      if (currentWord) speakWord(currentWord.word);
    }, 450);
    return () => clearTimeout(t);
  }, [currentWordIndex, buildChoices, currentWord, speakWord]);

  useEffect(() => {
    if (!showStarPopup) return;

    const timer = setTimeout(() => {
      setShowStarPopup(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [showStarPopup]);

  const handleSpeak = () => {
    if (currentWord) speakWord(currentWord.word);
  };

  const handlePick = (choice: string) => {
    if (!currentWord || (feedback && !mustSelectCorrect)) return;

    setSelectedChoice(choice);

    if (mustSelectCorrect) {
      if (choice.toLowerCase() === currentWord.word.toLowerCase()) {
        setFeedback('correct');
        setShowStarPopup(true);
        setTimeout(() => {
          const hasNext = nextWord();
          if (!hasNext) onComplete();
          setFeedback(null);
        }, 1000);
      } else {
        setFeedback('incorrect');
        setTimeout(() => {
          setFeedback(null);
          setSelectedChoice(null);
        }, 500);
      }
      return;
    }

    const result = submitAnswer(choice, currentWord);
    if (result.correct) {
      setFeedback('correct');
      setShowStarPopup(true);
      setTimeout(() => {
        const hasNext = nextWord();
        if (!hasNext) onComplete();
        setFeedback(null);
      }, 1000);
      return;
    }

    if (result.shouldShowAnswer) {
      setFeedback('show-answer');
      setMustSelectCorrect(true);
      speakWord(currentWord.word);
      return;
    }

    setFeedback('try-again');
    setTimeout(() => {
      setFeedback(null);
      setSelectedChoice(null);
    }, 850);
  };

  const handleContinueAfterAnswer = () => {
    const hasNext = nextWord();
    if (!hasNext) onComplete();
    setFeedback(null);
    setSelectedChoice(null);
    setMustSelectCorrect(false);
  };

  if (!currentWord) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <CorrectFeedback show={showStarPopup} />
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Word {currentWordIndex + 1} of {currentWordSet?.words.length}</span>
          <span>Audio Match</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Listen and choose the word!</h2>
          <p className="text-muted-foreground">Tap the speaker if you want to hear it again.</p>

          <Button variant="game" size="xl" onClick={handleSpeak} className="mt-5 gap-2">
            <Volume2 className="h-7 w-7" />
            Hear Word
          </Button>
        </div>

        {showAnswer && (feedback === 'show-answer' || mustSelectCorrect) && (
          <div className="bg-amber-100 text-amber-800 rounded-2xl p-4 mb-5 text-center">
            Answer: <span className="font-bold underline">{currentWord.word}</span>
            <p className="text-sm mt-1">Tap the correct answer to continue!</p>
          </div>
        )}

        <div className="grid gap-3">
          {choices.map((c) => {
            const isCorrect = c.toLowerCase() === currentWord.word.toLowerCase();
            const isSelected = selectedChoice === c;
            const showCorrectStyle = feedback === 'correct' && isCorrect;
            const showWrongStyle = isSelected && (feedback === 'incorrect' || feedback === 'try-again');
            const showPointer = mustSelectCorrect && isCorrect && feedback !== 'correct';
            
            return (
              <button
                key={c}
                onClick={() => handlePick(c)}
                disabled={feedback === 'correct'}
                className={`relative w-full rounded-2xl p-4 border transition-all active:scale-[0.98]
                           text-lg font-semibold text-center ${
                  showCorrectStyle
                    ? 'bg-success/20 border-success text-success'
                    : showWrongStyle
                    ? 'bg-destructive/20 border-destructive text-destructive'
                    : 'bg-background border-border hover:shadow-soft text-foreground'
                }`}
              >
                {/* Pointing finger for correct answer after 2 wrong attempts */}
                {showPointer && (
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 animate-bounce">
                    <Hand className="h-6 w-6 text-amber-500 rotate-90" />
                  </div>
                )}
                <span className="flex items-center justify-center gap-2">
                  {c}
                  {showCorrectStyle && <CheckCircle className="h-5 w-5" />}
                  {showWrongStyle && <XCircle className="h-5 w-5" />}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5">
          {feedback === 'correct' && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
              <CheckCircle className="h-6 w-6" />
              <span>Correct!</span>
            </div>
          )}
          {feedback === 'try-again' && (
            <div className="flex items-center justify-center gap-2 text-red-600 font-bold">
              <XCircle className="h-6 w-6" />
              <span>Attempt 2 of 2 - Try again! 🚀</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
