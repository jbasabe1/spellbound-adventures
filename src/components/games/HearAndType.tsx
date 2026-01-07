import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Volume2, RotateCcw, HelpCircle, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Word } from '@/types';

interface HearAndTypeProps {
  onComplete: () => void;
}

export function HearAndType({ onComplete }: HearAndTypeProps) {
  const { 
    currentWordSet, 
    currentWordIndex, 
    attempts, 
    showAnswer, 
    submitAnswer, 
    nextWord,
    speakWord 
  } = useGame();
  
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'try-again' | 'show-answer' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [mustTypeCorrect, setMustTypeCorrect] = useState(false);

  const currentWord: Word | undefined = currentWordSet?.words[currentWordIndex];

  const handleSpeak = useCallback(() => {
    if (currentWord) {
      speakWord(currentWord.word);
    }
  }, [currentWord, speakWord]);

  const handleSpeakSentence = () => {
    if (currentWord?.exampleSentence) {
      speakWord(currentWord.exampleSentence, 0.9);
    }
  };

  useEffect(() => {
    // Speak the word when it changes
    if (currentWord && !showAnswer) {
      const timer = setTimeout(() => handleSpeak(), 500);
      return () => clearTimeout(timer);
    }
  }, [currentWord, showAnswer, handleSpeak]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentWord || !input.trim()) return;

    if (mustTypeCorrect) {
      // Check if they typed the correct answer
      if (input.toLowerCase().trim() === currentWord.word.toLowerCase()) {
        setFeedback('correct');
        setMustTypeCorrect(false);
        setTimeout(() => {
          const hasMore = nextWord();
          setInput('');
          setFeedback(null);
          setShowHint(false);
          if (!hasMore) {
            onComplete();
          }
        }, 1000);
      } else {
        // Wrong again, keep showing answer
        setFeedback('incorrect');
        setTimeout(() => setFeedback(null), 500);
      }
      return;
    }

    const { correct, shouldShowAnswer } = submitAnswer(input, currentWord);

    if (correct) {
      setFeedback('correct');
      setTimeout(() => {
        const hasMore = nextWord();
        setInput('');
        setFeedback(null);
        setShowHint(false);
        if (!hasMore) {
          onComplete();
        }
      }, 1000);
    } else if (shouldShowAnswer) {
      setFeedback('show-answer');
      setMustTypeCorrect(true);
      speakWord(currentWord.word);
    } else {
      setFeedback('try-again');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleContinue = () => {
    setInput('');
    setMustTypeCorrect(true);
  };

  if (!currentWord) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const progress = currentWordSet ? ((currentWordIndex + 1) / currentWordSet.words.length) * 100 : 0;

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
        {/* Audio Controls */}
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
          {currentWord.exampleSentence && (
            <Button
              variant="outline"
              size="lg"
              onClick={handleSpeakSentence}
              className="gap-2"
            >
              <HelpCircle className="h-5 w-5" />
              Sentence
            </Button>
          )}
        </div>

        {/* Hint Button */}
        {!showAnswer && !mustTypeCorrect && (
          <div className="text-center mb-4">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {showHint ? 'Hide hint' : 'Need a hint?'}
            </button>
            {showHint && currentWord.definition && (
              <p className="text-muted-foreground mt-2 animate-fade-in">
                Hint: {currentWord.definition}
              </p>
            )}
          </div>
        )}

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
                Type the word correctly to continue
              </p>
            )}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type the word..."
              className={`text-center text-2xl h-16 rounded-2xl font-semibold transition-all ${
                feedback === 'correct' 
                  ? 'border-success bg-success/10 text-success' 
                  : feedback === 'incorrect' || feedback === 'show-answer'
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-border'
              }`}
              autoFocus
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            {feedback === 'correct' && (
              <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 text-success animate-pop" />
            )}
            {(feedback === 'incorrect' || feedback === 'show-answer') && (
              <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 text-destructive animate-wiggle" />
            )}
          </div>

          <Button
            type="submit"
            variant="game"
            size="xl"
            className="w-full text-xl gap-2"
            disabled={!input.trim()}
          >
            {mustTypeCorrect ? (
              <>
                <RotateCcw className="h-6 w-6" />
                Try Again
              </>
            ) : (
              <>
                <ArrowRight className="h-6 w-6" />
                Check
              </>
            )}
          </Button>
        </form>

        {/* Attempt Counter */}
        {attempts > 0 && !showAnswer && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Attempt {attempts} of 2 - Try again! 🚀
          </p>
        )}
      </div>
    </div>
  );
}
