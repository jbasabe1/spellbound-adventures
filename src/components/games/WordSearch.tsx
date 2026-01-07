import { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, RotateCcw, ArrowRight } from 'lucide-react';
import { Word } from '@/types';
import { CorrectFeedback } from './CorrectFeedback';

interface WordSearchProps {
  onComplete: () => void;
}

type Cell = { letter: string; id: string };

function randLetter() {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  return letters[Math.floor(Math.random() * letters.length)];
}

function makeGrid(target: string, size = 8) {
  const word = target.toLowerCase();
  const grid: Cell[][] = Array.from({ length: size }, (_, r) =>
    Array.from({ length: size }, (_, c) => ({ letter: randLetter(), id: `${r}-${c}` }))
  );

  const horizontal = Math.random() < 0.5;
  const maxStart = size - word.length;

  const startRow = horizontal ? Math.floor(Math.random() * size) : Math.floor(Math.random() * (maxStart + 1));
  const startCol = horizontal ? Math.floor(Math.random() * (maxStart + 1)) : Math.floor(Math.random() * size);

  for (let i = 0; i < word.length; i++) {
    const r = startRow + (horizontal ? 0 : i);
    const c = startCol + (horizontal ? i : 0);
    grid[r][c] = { letter: word[i], id: `${r}-${c}` };
  }

  return { grid, horizontal, startRow, startCol };
}

export function WordSearch({ onComplete }: WordSearchProps) {
  const {
    currentWordSet,
    currentWordIndex,
    showAnswer,
    submitAnswer,
    nextWord
  } = useGame();

  const currentWord: Word | undefined = currentWordSet?.words[currentWordIndex];

  const [gridInfo, setGridInfo] = useState(() => currentWord ? makeGrid(currentWord.word) : null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'try-again' | 'show-answer' | null>(null);
  const [showStarPopup, setShowStarPopup] = useState(false);

  useEffect(() => {
    if (currentWord) {
      setGridInfo(makeGrid(currentWord.word));
      setSelectedIds([]);
      setFeedback(null);
      setShowStarPopup(false);
    }
  }, [currentWordIndex, currentWord]);

  const progress = useMemo(() => {
    if (!currentWordSet) return 0;
    return ((currentWordIndex + 1) / currentWordSet.words.length) * 100;
  }, [currentWordIndex, currentWordSet]);

  const selectedText = useMemo(() => {
    if (!gridInfo) return '';
    const map = new Map<string, string>();
    gridInfo.grid.forEach(row => row.forEach(cell => map.set(cell.id, cell.letter)));
    return selectedIds.map(id => map.get(id) || '').join('');
  }, [gridInfo, selectedIds]);

  const handleReset = () => {
    setSelectedIds([]);
    setFeedback(null);
  };

  const handleCell = (id: string) => {
    if (!currentWord || feedback) return;

    if (selectedIds.includes(id)) return;
    setSelectedIds(prev => [...prev, id]);
  };

  useEffect(() => {
    if (!currentWord || !gridInfo) return;
    if (feedback) return;

    const target = currentWord.word.toLowerCase();
    if (selectedText.length < target.length) return;

    // If user selected too many letters, treat as wrong attempt
    const candidate = selectedText.slice(0, target.length);
    const result = submitAnswer(candidate, currentWord);

    if (result.correct) {
      setFeedback('correct');
      setShowStarPopup(true);
      setTimeout(() => {
        const hasNext = nextWord();
        if (!hasNext) onComplete();
        setSelectedIds([]);
        setFeedback(null);
        setShowStarPopup(false);
      }, 900);
      return;
    }

    if (result.shouldShowAnswer) {
      setFeedback('show-answer');
      return;
    }

    setFeedback('try-again');
    setTimeout(() => {
      setFeedback(null);
      setSelectedIds([]);
    }, 900);
  }, [selectedText, currentWord, gridInfo, feedback, nextWord, onComplete, submitAnswer]);

  const handleContinueAfterAnswer = () => {
    const hasNext = nextWord();
    if (!hasNext) onComplete();
    setFeedback(null);
    setSelectedIds([]);
  };

  if (!currentWord || !gridInfo) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <CorrectFeedback show={showStarPopup} />
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Word {currentWordIndex + 1} of {currentWordSet?.words.length}</span>
          <span>Word Search</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-purple-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-center mb-2">Find the word!</h2>
        <p className="text-muted-foreground text-center mb-4">
          Tap letters to spell: <span className="font-semibold text-foreground">{currentWord.word}</span>
        </p>

        {showAnswer && feedback === 'show-answer' && (
          <div className="bg-amber-100 text-amber-800 rounded-2xl p-4 mb-4 text-center">
            Answer: <span className="font-bold underline">{currentWord.word}</span>
          </div>
        )}

        <div className="bg-background rounded-2xl p-3 border border-border">
          <div className="grid grid-cols-8 gap-1">
            {gridInfo.grid.flat().map(cell => {
              const active = selectedIds.includes(cell.id);
              return (
                <button
                  key={cell.id}
                  onClick={() => handleCell(cell.id)}
                  disabled={!!feedback || (selectedIds.length >= currentWord.word.length)}
                  className={`h-10 w-10 rounded-xl border border-border text-lg font-bold
                              transition-all active:scale-[0.98]
                              ${active ? 'bg-primary text-white shadow-soft' : 'bg-card hover:shadow-soft'}`}
                >
                  {cell.letter.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-sm text-muted-foreground">Selected:</div>
          <div className="text-2xl font-bold tracking-widest min-h-[2.25rem]">
            {selectedText.toUpperCase()}
          </div>
        </div>

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
              <Button variant="outline" size="lg" onClick={handleReset} disabled={!!feedback}>
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
              <Button
                variant="game"
                size="lg"
                onClick={() => {
                  // Force evaluation by padding to length
                  if (!currentWord) return;
                  if (selectedIds.length === 0) return;
                  // no-op: evaluation runs automatically once length reached; this just lets the kid feel in control
                }}
                disabled
              >
                Keep Tapping
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
