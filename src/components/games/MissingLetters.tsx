import { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, ArrowRight, HelpCircle, Volume2 } from 'lucide-react';
import { Word } from '@/types';
import { CorrectFeedback } from './CorrectFeedback';
import { useCorrectFeedback } from './useCorrectFeedback';

interface MissingLettersProps {
  onComplete: () => void;
}

function buildMasked(word: string) {
  // Keep first/last letter; hide 1-3 letters depending on length
  const letters = word.split('');
  const len = letters.length;
  const hideCount = len <= 4 ? 1 : len <= 7 ? 2 : 3;

  const indices = new Set<number>();
  // avoid first/last
  while (indices.size < hideCount) {
    const idx = 1 + Math.floor(Math.random() * Math.max(1, len - 2));
    indices.add(idx);
  }

  const masked = letters.map((ch, i) => (indices.has(i) ? '_' : ch));
  const missing = [...indices].sort((a, b) => a - b).map(i => letters[i]).join('');
  const missingPositions = [...indices].sort((a, b) => a - b);

  return { masked: masked.join(' '), missing, missingPositions };
}

export function MissingLetters({ onComplete }: MissingLettersProps) {
  const {
    currentWordSet,
    currentWordIndex,
    showAnswer,
    submitAnswer,
    nextWord,
    speakWord
  } = useGame();

  const currentWord: Word | undefined = currentWordSet?.words[currentWordIndex];

  const [maskInfo, setMaskInfo] = useState(() => currentWord ? buildMasked(currentWord.word) : null);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'try-again' | 'show-answer' | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const { showStarPopup, triggerCorrectFeedback, resetCorrectFeedback } = useCorrectFeedback();

  useEffect(() => {
    if (currentWord) {
      setMaskInfo(buildMasked(currentWord.word));
      setInput('');
      setFeedback(null);
      setHintShown(false);
      resetCorrectFeedback();
    }
  }, [currentWordIndex, currentWord, resetCorrectFeedback]);

  const progress = useMemo(() => {
    if (!currentWordSet) return 0;
    return ((currentWordIndex + 1) / currentWordSet.words.length) * 100;
  }, [currentWordIndex, currentWordSet]);

  const handleSubmit = () => {
    if (!currentWord || feedback) return;

    // Reconstruct candidate word by inserting typed letters into blanks in order
    const typed = input.toLowerCase().trim();
    const target = currentWord.word;

    if (!maskInfo) return;

    const missingPositions = maskInfo.missingPositions;
    const targetLetters = target.split('');
    const typedLetters = typed.split('');

    if (typedLetters.length !== missingPositions.length) {
      setFeedback('try-again');
      setTimeout(() => setFeedback(null), 900);
      return;
    }

    missingPositions.forEach((pos, i) => {
      targetLetters[pos] = typedLetters[i] || targetLetters[pos];
    });

    const candidate = targetLetters.join('');

    const result = submitAnswer(candidate, currentWord);
    if (result.correct) {
      setFeedback('correct');
      triggerCorrectFeedback(() => {
        const hasNext = nextWord();
        if (!hasNext) onComplete();
        setFeedback(null);
        setInput('');
      }, { visibleMs: 900, afterMs: 0 });
      return;
    }

    if (result.shouldShowAnswer) {
      setFeedback('show-answer');
      return;
    }

    setFeedback('try-again');
    setTimeout(() => setFeedback(null), 900);
  };

  const handleContinueAfterAnswer = () => {
    const hasNext = nextWord();
    if (!hasNext) onComplete();
    setFeedback(null);
    setInput('');
  };

  if (!currentWord || !maskInfo) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <CorrectFeedback show={showStarPopup} />
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Word {currentWordIndex + 1} of {currentWordSet?.words.length}</span>
          <span>Missing Letters</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-secondary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Fill in the missing letters!</h2>
        <p className="text-muted-foreground text-center mb-6">
          Type the letters that replace the blanks (in order).
        </p>
        <div className="flex justify-center mb-4">
          <Button
            variant="kid"
            size="sm"
            onClick={() => currentWord && speakWord(currentWord.word)}
            className="gap-2"
          >
            <Volume2 className="h-4 w-4" />
            Hear Word
          </Button>
        </div>

        <div className="text-center text-4xl font-bold tracking-widest mb-5">
          {maskInfo.masked}
        </div>

        {showAnswer && feedback === 'show-answer' && (
          <div className="bg-amber-100 text-amber-800 rounded-2xl p-4 mb-4">
            <p className="font-semibold text-center">
              Answer: <span className="underline">{currentWord.word}</span>
            </p>
          </div>
        )}

        {hintShown && (
          <div className="bg-muted rounded-2xl p-3 mb-4 text-sm text-muted-foreground">
            Hint: the missing letters are <span className="font-semibold">{maskInfo.missing.length}</span> characters long.
          </div>
        )}

        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Type ${maskInfo.missing.length} letter(s)...`}
          className="text-xl text-center h-14"
          disabled={feedback === 'correct' || feedback === 'show-answer'}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
        />

        <div className="mt-4">
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

        <div className="mt-6 grid grid-cols-2 gap-3">
          {showAnswer && feedback === 'show-answer' ? (
            <Button variant="game" size="lg" className="col-span-2" onClick={handleContinueAfterAnswer}>
              Continue <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <>
              <Button variant="outline" size="lg" onClick={() => setHintShown(true)} disabled={hintShown}>
                <HelpCircle className="mr-2 h-5 w-5" />
                Hint
              </Button>
              <Button
                variant="game"
                size="lg"
                onClick={handleSubmit}
                disabled={!!feedback || input.trim().length === 0}
              >
                Check
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
