import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Volume2, RotateCcw, CheckCircle, XCircle, ArrowRight, Shuffle } from 'lucide-react';
import { Word } from '@/types';

interface WordScrambleProps {
  onComplete: () => void;
}

export function WordScramble({ onComplete }: WordScrambleProps) {
  const { 
    currentWordSet, 
    currentWordIndex, 
    attempts,
    showAnswer, 
    submitAnswer, 
    nextWord,
    speakWord 
  } = useGame();
  
  const [scrambled, setScrambled] = useState<{ letter: string; id: number }[]>([]);
  const [userOrder, setUserOrder] = useState<{ letter: string; id: number }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'try-again' | 'show-answer' | null>(null);
  const [mustTypeCorrect, setMustTypeCorrect] = useState(false);

  const currentWord: Word | undefined = currentWordSet?.words[currentWordIndex];

  const scrambleWord = useCallback((word: string) => {
    const letters = word.split('').map((letter, index) => ({
      letter,
      id: index,
    }));
    
    // Fisher-Yates shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    
    // Make sure it's actually scrambled
    if (letters.map(l => l.letter).join('') === word) {
      [letters[0], letters[1]] = [letters[1], letters[0]];
    }
    
    return letters;
  }, []);

  const handleSpeak = useCallback(() => {
    if (currentWord) {
      speakWord(currentWord.word);
    }
  }, [currentWord, speakWord]);

  useEffect(() => {
    if (currentWord) {
      setScrambled(scrambleWord(currentWord.word));
      setUserOrder([]);
      setFeedback(null);
      setMustTypeCorrect(false);
      const timer = setTimeout(() => handleSpeak(), 500);
      return () => clearTimeout(timer);
    }
  }, [currentWord, scrambleWord, handleSpeak]);

  const selectLetter = (letterObj: { letter: string; id: number }) => {
    if (feedback) return;
    setScrambled(prev => prev.filter(l => l.id !== letterObj.id));
    setUserOrder(prev => [...prev, letterObj]);
  };

  const unselectLetter = (index: number) => {
    if (feedback) return;
    const letterObj = userOrder[index];
    setUserOrder(prev => prev.filter((_, i) => i !== index));
    setScrambled(prev => [...prev, letterObj]);
  };

  const reshuffleRemaining = () => {
    setScrambled(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  const clearSelection = () => {
    if (feedback) return;
    setScrambled(prev => [...prev, ...userOrder]);
    setUserOrder([]);
  };

  // On the first mistake, don't wipe everything—keep any correct letters already placed
  const resetOnlyWrongLetters = () => {
    if (!currentWord) return;
    const target = currentWord.word.toLowerCase().split('');
    const kept: { letter: string; id: number }[] = [];
    const toReturn: { letter: string; id: number }[] = [];

    for (let i = 0; i < userOrder.length; i++) {
      const ltr = userOrder[i];
      if (target[i] && ltr.letter.toLowerCase() === target[i]) {
        kept.push(ltr);
      } else {
        toReturn.push(ltr);
      }
    }

    setUserOrder(kept);
    setScrambled(prev => [...prev, ...toReturn]);
  };


  const handleSubmit = () => {
    if (!currentWord) return;
    
    const answer = userOrder.map(l => l.letter).join('');
    
    if (mustTypeCorrect) {
      if (answer.toLowerCase() === currentWord.word.toLowerCase()) {
        setFeedback('correct');
        setMustTypeCorrect(false);
        setTimeout(() => {
          const hasMore = nextWord();
          setFeedback(null);
          if (!hasMore) {
            onComplete();
          }
        }, 1000);
      } else {
      setFeedback('try-again');
      setTimeout(() => {
        setFeedback(null);
        resetOnlyWrongLetters();
      }, 800);
    }
      return;
    }

    const { correct, shouldShowAnswer } = submitAnswer(answer, currentWord);

    if (correct) {
      setFeedback('correct');
      setTimeout(() => {
        const hasMore = nextWord();
        setFeedback(null);
        if (!hasMore) {
          onComplete();
        }
      }, 1000);
    } else if (shouldShowAnswer) {
      setFeedback('show-answer');
      setMustTypeCorrect(true);
      speakWord(currentWord.word);
      setTimeout(() => {
        setFeedback(null);
        setScrambled(scrambleWord(currentWord.word));
        setUserOrder([]);
      }, 2000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        // Reset
        setScrambled(scrambleWord(currentWord.word));
        setUserOrder([]);
      }, 800);
    }
  };

  if (!currentWord) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const progress = currentWordSet ? ((currentWordIndex + 1) / currentWordSet.words.length) * 100 : 0;
  const isComplete = scrambled.length === 0;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Word {currentWordIndex + 1} of {currentWordSet?.words.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full gradient-hero transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8">
        {/* Audio Control */}
        <div className="flex justify-center gap-3 mb-6">
          <Button
            variant="game"
            size="lg"
            onClick={handleSpeak}
            className="text-lg gap-2"
          >
            <Volume2 className="h-6 w-6" />
            Hear Word
          </Button>
          {scrambled.length > 1 && !feedback && (
            <Button
              variant="outline"
              size="lg"
              onClick={reshuffleRemaining}
              className="gap-2"
            >
              <Shuffle className="h-5 w-5" />
            </Button>
          )}
          <Button
            variant="outline"
            size="lg"
            onClick={clearSelection}
            className="gap-2"
            disabled={!!feedback || userOrder.length === 0}
          >
            <RotateCcw className="h-5 w-5" />
            Clear
          </Button>
        </div>

        {/* Instruction */}
        <p className="text-center text-lg text-muted-foreground mb-4">
          {mustTypeCorrect 
            ? 'Unscramble the letters correctly:' 
            : 'Unscramble the letters!'}
        </p>

        {/* Show Answer State */}
        {showAnswer && (
          <div className="text-center mb-6 p-4 bg-destructive/10 rounded-2xl border-2 border-destructive/20 animate-scale-in">
            <p className="text-muted-foreground mb-2">The correct spelling is:</p>
            <p className="text-3xl font-bold text-foreground tracking-wider">
              {currentWord.word}
            </p>
          </div>
        )}

        {/* User's Answer */}
        <div className="flex justify-center gap-2 mb-4 min-h-[56px] flex-wrap">
          {userOrder.map((letterObj, i) => (
            <button
              key={letterObj.id}
              onClick={() => unselectLetter(i)}
              disabled={!!feedback}
              className={`w-12 h-14 rounded-xl text-2xl font-bold transition-all shadow-soft ${
                feedback === 'correct'
                  ? 'bg-success/20 border-2 border-success text-success'
                  : feedback === 'incorrect' || feedback === 'show-answer'
                  ? 'bg-destructive/20 border-2 border-destructive text-destructive'
                  : 'bg-primary text-primary-foreground hover:scale-105 active:scale-95'
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {letterObj.letter.toUpperCase()}
            </button>
          ))}
          {/* Empty slots */}
          {Array.from({ length: scrambled.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-12 h-14 rounded-xl border-2 border-dashed border-border"
            />
          ))}
        </div>

        {/* Scrambled Letters */}
        <div className="flex justify-center gap-2 mb-6 min-h-[56px] flex-wrap">
          {scrambled.map((letterObj) => (
            <button
              key={letterObj.id}
              onClick={() => selectLetter(letterObj)}
              disabled={!!feedback}
              className="w-12 h-14 rounded-xl bg-secondary text-secondary-foreground text-2xl font-bold transition-all shadow-soft hover:scale-105 active:scale-95"
            >
              {letterObj.letter.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <Button
          variant="game"
          size="xl"
          onClick={handleSubmit}
          className="w-full text-xl gap-2"
          disabled={!isComplete || !!feedback}
        >
          {feedback === 'correct' ? (
            <>
              <CheckCircle className="h-6 w-6" />
              Correct!
            </>
          ) : feedback === 'incorrect' || feedback === 'show-answer' ? (
            <>
              <XCircle className="h-6 w-6" />
              Try Again
            </>
          ) : mustTypeCorrect ? (
            <>
              <RotateCcw className="h-6 w-6" />
              Unscramble
            </>
          ) : (
            <>
              <ArrowRight className="h-6 w-6" />
              Check
            </>
          )}
        </Button>

        {/* Attempt Counter */}
        {attempts > 0 && !showAnswer && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Try again! 🚀 (Attempt {attempts} of 2)
          </p>
        )}
      </div>
    </div>
  );
}