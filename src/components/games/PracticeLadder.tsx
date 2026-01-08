import { useEffect, useMemo, useState } from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, CheckCircle, XCircle, ArrowRight, Volume2 } from 'lucide-react';
import { Word } from '@/types';
import { CorrectFeedback } from './CorrectFeedback';
import { useCorrectFeedback } from './useCorrectFeedback';

interface PracticeLadderProps {
  onComplete: () => void;
}

/**
 * Practice Ladder (Look → Cover → Write → Check)
 * - Step 1: show the word + optional sentence (study)
 * - Step 2: hide the word, student types from memory
 * - Two incorrect tries triggers "show answer" per global rule.
 */
export function PracticeLadder({ onComplete }: PracticeLadderProps) {
  const {
    currentWordSet,
    currentWordIndex,
    showAnswer,
    submitAnswer,
    nextWord,
    speakWord
  } = useGame();

  const currentWord: Word | undefined = currentWordSet?.words[currentWordIndex];

  const [phase, setPhase] = useState<'study' | 'recall'>('study');
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'try-again' | 'show-answer' | null>(null);
  const { showStarPopup, triggerCorrectFeedback, resetCorrectFeedback } = useCorrectFeedback();

  useEffect(() => {
    // Reset when word changes
    setPhase('study');
    setInput('');
    setFeedback(null);
    resetCorrectFeedback();
  }, [currentWordIndex, resetCorrectFeedback]);

  const progress = useMemo(() => {
    if (!currentWordSet) return 0;
    return ((currentWordIndex + 1) / currentWordSet.words.length) * 100;
  }, [currentWordIndex, currentWordSet]);

  const handleSpeak = () => {
    if (currentWord) speakWord(currentWord.word);
  };

  const handleStartRecall = () => {
    setPhase('recall');
    setFeedback(null);
    setInput('');
  };

  const handleSubmit = () => {
    if (!currentWord || feedback) return;

    const result = submitAnswer(input, currentWord);
    if (result.correct) {
      setFeedback('correct');
      triggerCorrectFeedback(() => {
        const hasNext = nextWord();
        if (!hasNext) onComplete();
        setFeedback(null);
        setInput('');
        setPhase('study');
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
    setPhase('study');
  };

  if (!currentWord) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6">
      <CorrectFeedback show={showStarPopup} />
      
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Word {currentWordIndex + 1} of {currentWordSet?.words.length}</span>
          <span>Practice Ladder</span>
        </div>
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="bg-card rounded-3xl shadow-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary font-semibold">
            {phase === 'study' ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span>{phase === 'study' ? 'Look' : 'Cover & Write'}</span>
          </div>

          <Button variant="outline" size="sm" onClick={handleSpeak} className="gap-2">
            <Volume2 className="h-4 w-4" />
            Hear
          </Button>
        </div>

        {phase === 'study' ? (
          <div className="text-center">
            <div className="text-5xl font-bold tracking-wide text-foreground mb-2">
              {currentWord.word}
            </div>
            {currentWord.exampleSentence && (
              <p className="text-muted-foreground mt-2">
                "{currentWord.exampleSentence}"
              </p>
            )}

            <div className="mt-6">
              <Button variant="game" size="xl" onClick={handleStartRecall} className="w-full gap-2">
                <ArrowRight className="h-6 w-6" />
                I'm Ready!
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-muted-foreground text-center mb-4">
              Type the word from memory.
            </p>

            {/* Show answer banner after 2 tries */}
            {showAnswer && (feedback === 'show-answer') && (
              <div className="bg-amber-100 text-amber-800 rounded-2xl p-4 mb-4">
                <p className="font-semibold text-center">
                  The word is: <span className="underline">{currentWord.word}</span>
                </p>
                <p className="text-sm text-center mt-1">
                  You'll get it next time — let's keep going!
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type the word..."
                className="text-xl text-center h-14"
                disabled={feedback === 'correct' || feedback === 'show-answer'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit();
                }}
              />
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
              {showAnswer && (feedback === 'show-answer') ? (
                <Button variant="game" size="lg" className="col-span-2" onClick={handleContinueAfterAnswer}>
                  Continue
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="lg" onClick={() => setInput('')} disabled={!!feedback}>
                    Clear
                  </Button>
                  <Button variant="game" size="lg" onClick={handleSubmit} disabled={!!feedback || input.trim().length === 0}>
                    Check
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
