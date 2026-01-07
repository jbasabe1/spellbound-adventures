import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, Hand } from 'lucide-react';
import { Word } from '@/types';
import { CorrectFeedback } from './CorrectFeedback';

interface MultipleChoiceProps {
  onComplete: () => void;
}

function generateMisspellings(word: string): string[] {
  const misspellings: string[] = [];
  const letters = word.split('');
  
  // Swap two adjacent letters
  if (letters.length > 1) {
    const idx = Math.floor(Math.random() * (letters.length - 1));
    const swapped = [...letters];
    [swapped[idx], swapped[idx + 1]] = [swapped[idx + 1], swapped[idx]];
    misspellings.push(swapped.join(''));
  }
  
  // Double a letter
  const doubleIdx = Math.floor(Math.random() * letters.length);
  misspellings.push(
    letters.slice(0, doubleIdx + 1).join('') + 
    letters[doubleIdx] + 
    letters.slice(doubleIdx + 1).join('')
  );
  
  // Remove a letter
  if (letters.length > 2) {
    const removeIdx = Math.floor(Math.random() * letters.length);
    misspellings.push(
      letters.filter((_, i) => i !== removeIdx).join('')
    );
  }
  
  // Replace a vowel
  const vowels = 'aeiou';
  const vowelIndices = letters
    .map((l, i) => vowels.includes(l.toLowerCase()) ? i : -1)
    .filter(i => i !== -1);
  
  if (vowelIndices.length > 0) {
    const idx = vowelIndices[Math.floor(Math.random() * vowelIndices.length)];
    const newVowel = vowels.replace(letters[idx].toLowerCase(), '')[
      Math.floor(Math.random() * 4)
    ];
    const replaced = [...letters];
    replaced[idx] = newVowel;
    misspellings.push(replaced.join(''));
  }
  
  // Filter out duplicates and the correct word
  return [...new Set(misspellings)]
    .filter(m => m.toLowerCase() !== word.toLowerCase())
    .slice(0, 3);
}

export function MultipleChoice({ onComplete }: MultipleChoiceProps) {
  const { 
    currentWordSet, 
    currentWordIndex, 
    showAnswer, 
    submitAnswer, 
    nextWord,
    speakWord 
  } = useGame();
  
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'try-again' | 'show-answer' | null>(null);
  const [mustSelectCorrect, setMustSelectCorrect] = useState(false);
  const [showStarPopup, setShowStarPopup] = useState(false);

  const currentWord: Word | undefined = currentWordSet?.words[currentWordIndex];

  const handleSpeak = useCallback(() => {
    if (currentWord) {
      speakWord(currentWord.word);
    }
  }, [currentWord, speakWord]);

  useEffect(() => {
    if (currentWord) {
      const misspellings = generateMisspellings(currentWord.word);
      const allOptions = [currentWord.word, ...misspellings];
      // Shuffle options
      setOptions(allOptions.sort(() => Math.random() - 0.5));
      setSelectedOption(null);
      setFeedback(null);
      setMustSelectCorrect(false);
      setShowStarPopup(false);
      const timer = setTimeout(() => handleSpeak(), 500);
      return () => clearTimeout(timer);
    }
  }, [currentWordIndex, currentWord, handleSpeak]);

  const handleSelect = (option: string) => {
    if (feedback && !mustSelectCorrect) return;
    
    setSelectedOption(option);
    
    if (mustSelectCorrect) {
      if (option.toLowerCase() === currentWord?.word.toLowerCase()) {
        setFeedback('correct');
        setShowStarPopup(true);
        setTimeout(() => {
          const hasMore = nextWord();
          setShowStarPopup(false);
          if (!hasMore) {
            onComplete();
          }
        }, 1000);
      } else {
        setFeedback('incorrect');
        setTimeout(() => {
          setFeedback(null);
          setSelectedOption(null);
        }, 500);
      }
      return;
    }

    const { correct, shouldShowAnswer } = submitAnswer(option, currentWord!);

    if (correct) {
      setFeedback('correct');
      setShowStarPopup(true);
      setTimeout(() => {
        const hasMore = nextWord();
        setShowStarPopup(false);
        if (!hasMore) {
          onComplete();
        }
      }, 1000);
    } else if (shouldShowAnswer) {
      setFeedback('show-answer');
      setMustSelectCorrect(true);
      speakWord(currentWord!.word);
    } else {
      setFeedback('try-again');
      setTimeout(() => {
        setFeedback(null);
        setSelectedOption(null);
      }, 800);
    }
  };

  if (!currentWord) {
    return <div className="text-center p-8">Loading...</div>;
  }

  const progress = currentWordSet ? ((currentWordIndex + 1) / currentWordSet.words.length) * 100 : 0;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <CorrectFeedback show={showStarPopup} />
      
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

        {/* Instruction */}
        <p className="text-center text-lg text-muted-foreground mb-6">
          {mustSelectCorrect 
            ? 'Select the correct spelling:' 
            : 'Which spelling is correct?'}
        </p>

        {/* Show Answer State */}
        {showAnswer && (
          <div className="text-center mb-6 p-4 bg-destructive/10 rounded-2xl border-2 border-destructive/20 animate-scale-in">
            <p className="text-muted-foreground mb-2">The correct spelling is:</p>
            <p className="text-2xl font-bold text-foreground">
              {currentWord.word}
            </p>
          </div>
        )}

        {/* Options */}
        <div className="grid gap-3">
          {options.map((option, index) => {
            const isCorrect = option.toLowerCase() === currentWord.word.toLowerCase();
            const isSelected = selectedOption === option;
            const showCorrect = feedback && isCorrect;
            const showWrong = isSelected && feedback === 'incorrect';
            const showPointer = mustSelectCorrect && isCorrect && feedback !== 'correct';
            
            return (
              <button
                key={index}
                onClick={() => handleSelect(option)}
                disabled={feedback === 'correct' || (feedback === 'incorrect' && !mustSelectCorrect)}
                className={`relative p-4 rounded-2xl text-xl font-semibold text-left transition-all border-2 ${
                  showCorrect
                    ? 'bg-success/20 border-success text-success'
                    : showWrong
                    ? 'bg-destructive/20 border-destructive text-destructive'
                    : isSelected && !feedback
                    ? 'bg-primary/10 border-primary text-foreground'
                    : 'bg-card border-border hover:border-primary hover:bg-primary/5 text-foreground'
                }`}
              >
                {/* Pointing finger for correct answer after 2 wrong attempts */}
                {showPointer && (
                  <div className="absolute -left-8 top-1/2 -translate-y-1/2 animate-bounce">
                    <Hand className="h-6 w-6 text-amber-500 rotate-90" />
                  </div>
                )}
                <span className="flex items-center justify-between">
                  {option}
                  {showCorrect && <CheckCircle className="h-6 w-6 text-success" />}
                  {showWrong && <XCircle className="h-6 w-6 text-destructive" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Attempt Counter - only show on first wrong attempt */}
        {feedback === 'try-again' && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Attempt 2 of 2 - Try again! 🚀
          </p>
        )}
      </div>
    </div>
  );
}
