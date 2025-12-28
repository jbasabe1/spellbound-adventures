import { useCallback, useEffect, useMemo, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Volume2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Word } from '@/types';

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
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'show-answer' | null>(null);

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
    buildChoices();
    // auto-play word shortly
    const t = setTimeout(() => {
      if (currentWord) speakWord(currentWord.word);
    }, 450);
    return () => clearTimeout(t);
  }, [currentWordIndex, buildChoices, currentWord, speakWord]);

  const handleSpeak = () => {
    if (currentWord) speakWord(currentWord.word);
  };

  const handlePick = (choice: string) => {
    if (!currentWord || feedback) return;

    const result = submitAnswer(choice, currentWord);
    if (result.correct) {
      setFeedback('correct');
      setTimeout(() => {
        const hasNext = nextWord();
        if (!hasNext) onComplete();
        setFeedback(null);
      }, 850);
      return;
    }

    if (result.shouldShowAnswer) {
      setFeedback('show-answer');
      return;
    }

    setFeedback('incorrect');
    setTimeout(() => setFeedback(null), 850);
  };

  const handleContinueAfterAnswer = () => {
    const hasNext = nextWord();
    if (!hasNext) onComplete();
    setFeedback(null);
  };

  if (!currentWord) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
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

        {showAnswer && feedback === 'show-answer' && (
          <div className="bg-amber-100 text-amber-800 rounded-2xl p-4 mb-5 text-center">
            Answer: <span className="font-bold underline">{currentWord.word}</span>
          </div>
        )}

        <div className="grid gap-3">
          {choices.map((c) => (
            <button
              key={c}
              onClick={() => handlePick(c)}
              disabled={!!feedback}
              className="w-full bg-background rounded-2xl p-4 border border-border
                         hover:shadow-soft transition-all active:scale-[0.98]
                         text-lg font-semibold text-foreground text-center"
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-5">
          {feedback === 'correct' && (
            <div className="flex items-center justify-center gap-2 text-green-600 font-bold">
              <CheckCircle className="h-6 w-6" />
              <span>Correct!</span>
            </div>
          )}
          {feedback === 'incorrect' && (
            <div className="flex items-center justify-center gap-2 text-red-600 font-bold">
              <XCircle className="h-6 w-6" />
              <span>Try again!</span>
            </div>
          )}
        </div>

        {showAnswer && feedback === 'show-answer' && (
          <div className="mt-6">
            <Button variant="game" size="lg" className="w-full" onClick={handleContinueAfterAnswer}>
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
