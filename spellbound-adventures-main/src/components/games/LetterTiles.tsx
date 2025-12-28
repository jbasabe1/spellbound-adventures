import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Volume2, RotateCcw, CheckCircle, XCircle, ArrowRight, Trash2 } from 'lucide-react';
import { Word } from '@/types';

interface LetterTilesProps {
  onComplete: () => void;
}

export function LetterTiles({ onComplete }: LetterTilesProps) {
  const { 
    currentWordSet, 
    currentWordIndex, 
    attempts,
    showAnswer, 
    submitAnswer, 
    nextWord,
    speakWord 
  } = useGame();
  
  const [selectedLetters, setSelectedLetters] = useState<{ letter: string; index: number }[]>([]);
  const [availableLetters, setAvailableLetters] = useState<{ letter: string; index: number; used: boolean }[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'show-answer' | null>(null);
  const [mustTypeCorrect, setMustTypeCorrect] = useState(false);

  const currentWord: Word | undefined = currentWordSet?.words[currentWordIndex];

  const shuffleLetters = useCallback((word: string) => {
    const letters = word.split('').map((letter, index) => ({
      letter,
      index,
      used: false,
    }));
    // Shuffle
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
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
      setAvailableLetters(shuffleLetters(currentWord.word));
      setSelectedLetters([]);
      const timer = setTimeout(() => handleSpeak(), 500);
      return () => clearTimeout(timer);
    }
  }, [currentWord, shuffleLetters, handleSpeak]);

  const selectLetter = (letterObj: { letter: string; index: number }) => {
    if (feedback) return;
    
    setAvailableLetters(prev => 
      prev.map(l => l.index === letterObj.index ? { ...l, used: true } : l)
    );
    setSelectedLetters(prev => [...prev, letterObj]);
  };

  const removeLetter = (index: number) => {
    if (feedback) return;
    
    const letterObj = selectedLetters[index];
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    setAvailableLetters(prev =>
      prev.map(l => l.index === letterObj.index ? { ...l, used: false } : l)
    );
  };

  const clearAll = () => {
    setSelectedLetters([]);
    setAvailableLetters(prev => prev.map(l => ({ ...l, used: false })));
  };

  const handleSubmit = () => {
    if (!currentWord) return;
    
    const answer = selectedLetters.map(l => l.letter).join('');
    
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
        setFeedback('incorrect');
        setTimeout(() => {
          setFeedback(null);
          clearAll();
        }, 500);
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
        clearAll();
        setFeedback(null);
      }, 2000);
    } else {
      setFeedback('incorrect');
      setTimeout(() => {
        setFeedback(null);
        clearAll();
      }, 800);
    }
  };

  if (!currentWord) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const progress = currentWordSet ? ((currentWordIndex + 1) / currentWordSet.words.length) * 100 : 0;
  const isComplete = selectedLetters.length === currentWord.word.length;

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
        <div className="flex justify-center mb-6">
          <Button
            variant="game"
            size="lg"
            onClick={handleSpeak}
            className="text-lg gap-2"
          >
            <Volume2 className="h-6 w-6" />
            Hear Word
          </Button>
        </div>

        {/* Show Answer State */}
        {(showAnswer || mustTypeCorrect) && (
          <div className="text-center mb-6 p-4 bg-destructive/10 rounded-2xl border-2 border-destructive/20 animate-scale-in">
            <p className="text-muted-foreground mb-2">The correct spelling is:</p>
            <p className="text-3xl font-bold text-foreground tracking-wider">
              {currentWord.word.split('').map((letter, i) => (
                <span key={i} className="inline-block animate-bounce-soft" style={{ animationDelay: `${i * 50}ms` }}>
                  {letter}
                </span>
              ))}
            </p>
            {mustTypeCorrect && (
              <p className="text-sm text-muted-foreground mt-3">
                Build the word correctly to continue
              </p>
            )}
          </div>
        )}

        {/* Answer Slots */}
        <div className="flex justify-center gap-2 mb-6 min-h-[60px] flex-wrap">
          {Array.from({ length: currentWord.word.length }).map((_, i) => (
            <button
              key={i}
              onClick={() => selectedLetters[i] && removeLetter(i)}
              className={`w-12 h-14 rounded-xl border-2 border-dashed flex items-center justify-center text-2xl font-bold transition-all ${
                selectedLetters[i]
                  ? feedback === 'correct'
                    ? 'bg-success/20 border-success text-success'
                    : feedback === 'incorrect' || feedback === 'show-answer'
                    ? 'bg-destructive/20 border-destructive text-destructive'
                    : 'bg-primary/10 border-primary text-foreground'
                  : 'bg-muted border-border text-muted-foreground'
              }`}
            >
              {selectedLetters[i]?.letter.toUpperCase() || ''}
            </button>
          ))}
        </div>

        {/* Clear Button */}
        {selectedLetters.length > 0 && !feedback && (
          <div className="flex justify-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="text-muted-foreground gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          </div>
        )}

        {/* Letter Tiles */}
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {availableLetters.map((letterObj) => (
            <button
              key={letterObj.index}
              onClick={() => !letterObj.used && selectLetter(letterObj)}
              disabled={letterObj.used || !!feedback}
              className={`w-14 h-14 rounded-xl text-2xl font-bold transition-all shadow-soft ${
                letterObj.used
                  ? 'bg-muted text-muted-foreground opacity-50 scale-90'
                  : 'bg-secondary text-secondary-foreground hover:scale-105 hover:shadow-card active:scale-95'
              }`}
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
              Build It
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
            Attempt {attempts} of 2 - Try again!
          </p>
        )}
      </div>
    </div>
  );
}
