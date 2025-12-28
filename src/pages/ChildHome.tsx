import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { GradeSelector } from '@/components/GradeSelector';
import { Avatar } from '@/components/Avatar';
import { GradeLevel, Word } from '@/types';
import { getWordsByGrade } from '@/data/wordBank';
import { BookOpen, User, ShoppingBag, Sparkles, Coins, Play } from 'lucide-react';

export default function ChildHome() {
  const navigate = useNavigate();
  const {
    currentChild,
    currentWordSet,
    setCurrentChild,
    createRandomWordSet,
    setCurrentWordSet,
    startGame
  } = useGame();

  const [showGradeSelect, setShowGradeSelect] = useState(!currentChild?.grade);
  const [selectedWordIndexes, setSelectedWordIndexes] = useState<number[]>([]);

    // Default grade is Grade 1 unless the player has changed it
  useEffect(() => {
    if (!currentChild) return;
    if (!currentChild.grade) {
      setCurrentChild({ ...currentChild, grade: '1' });
      setShowGradeSelect(false);
      setSelectedWordIndexes([]);
    }
  }, [currentChild]);

// ensure we always have a practice set for the selected grade
  useEffect(() => {
    if (!currentChild?.grade) return;

    if (
      !currentWordSet ||
      currentWordSet.grade !== currentChild.grade ||
      currentWordSet.words.length !== 10
    ) {
      const wordSet = createRandomWordSet(currentChild.grade, 10);
      setCurrentWordSet(wordSet);
      setSelectedWordIndexes([]);
    }
  }, [currentChild?.grade, currentWordSet, createRandomWordSet, setCurrentWordSet]);

  const handleGradeSelect = (grade: GradeLevel) => {
    if (currentChild) {
      setCurrentChild({ ...currentChild, grade });

      // Create a fresh practice set when grade changes
      const wordSet = createRandomWordSet(grade, 10);
      setCurrentWordSet(wordSet);

      setSelectedWordIndexes([]);
      setShowGradeSelect(false);
    }
  };

  const handleQuickPlay = () => {
    if (!currentChild) return;

    const grade: GradeLevel = (currentChild.grade || '1') as GradeLevel;

    // Randomize a fresh 10-word set FROM THE CURRENT GRADE ONLY
    const wordSet = createRandomWordSet(grade, 10);

    // Randomly pick one of the available game modes
    const quickPlayModes = [
      'hear-and-type',
      'letter-tiles',
      'multiple-choice',
      'word-scramble',
      'practice-ladder',
      'missing-letters',
      'audio-match',
      'word-search',
    ] as const;
    const mode = quickPlayModes[Math.floor(Math.random() * quickPlayModes.length)];

    // Start game using this word set (prevents stale state timing issues)
    startGame(mode, wordSet);
    navigate(`/games/${mode}`);
  };

  const toggleWordIndex = (index: number) => {
    setSelectedWordIndexes(prev => {
      if (prev.includes(index)) return prev.filter(i => i !== index);
      return [...prev, index];
    });
  };

  const refreshAllWords = () => {
    if (!currentChild?.grade) return;
    const wordSet = createRandomWordSet(currentChild.grade, 10);
    setCurrentWordSet(wordSet);
    setSelectedWordIndexes([]);
  };

  const rerollSelectedWords = () => {
    if (!currentChild?.grade || !currentWordSet) return;
    if (selectedWordIndexes.length === 0) return;

    const grade = currentChild.grade;
    const pool = getWordsByGrade(grade);

    const keepIndexes = new Set<number>(
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(i => !selectedWordIndexes.includes(i))
    );

    const used = new Set<string>();

    // keep words that are not being rerolled
    currentWordSet.words.forEach((w, i) => {
      if (keepIndexes.has(i)) used.add(w.word.toLowerCase());
    });

    const nextWords: Word[] = currentWordSet.words.map(w => w);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    let cursor = 0;

    const pickNext = (): Word => {
      while (cursor < shuffled.length) {
        const candidate = shuffled[cursor++];
        const key = candidate.word.toLowerCase();
        if (!used.has(key)) {
          used.add(key);
          return candidate;
        }
      }

      // fallback (should be rare)
      const fallback = pool[Math.floor(Math.random() * pool.length)];
      return fallback;
    };

    selectedWordIndexes
      .slice()
      .sort((a, b) => a - b)
      .forEach(i => {
        nextWords[i] = pickNext();
      });

    setCurrentWordSet({ ...currentWordSet, words: nextWords });
    setSelectedWordIndexes([]);
  };

  if (!currentChild) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-gradient-to-b from-town-sky to-background">
      <div className="max-w-lg mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-8 animate-slide-up">
          <div className="inline-block mb-4">
            <Avatar config={currentChild.avatarConfig} size="lg" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Hi, {currentChild.name}! 👋
          </h1>
          <p className="text-muted-foreground">Level {currentChild.level} Speller</p>

          {/* Stats Bar */}
          <div className="flex justify-center gap-4 mt-4">
            <div className="flex items-center gap-1.5 bg-xp/20 text-purple-600 px-4 py-2 rounded-full">
              <Sparkles className="h-5 w-5" />
              <span className="font-bold">{currentChild.xp} XP</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-100 text-amber-600 px-4 py-2 rounded-full">
              <Coins className="h-5 w-5" />
              <span className="font-bold">{currentChild.coins}</span>
            </div>
          </div>
        </div>

        {/* Grade Selection */}
        {showGradeSelect ? (
          <div className="bg-card rounded-3xl shadow-card p-6 mb-6 animate-scale-in">
            <h2 className="text-xl font-bold text-center mb-4">Choose Your Grade</h2>
            <GradeSelector selectedGrade={currentChild.grade} onSelect={handleGradeSelect} />
          </div>
        ) : (
          <>
            {/* Quick Play Button */}
            <Button
              variant="game"
              size="xl"
              onClick={handleQuickPlay}
              className="w-full mb-6 text-2xl gap-3 h-20 animate-slide-up"
            >
              <Play className="h-8 w-8" />
              Quick Play!
            </Button>

            {/* Main Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant="kid"
                size="lg"
                onClick={() => navigate('/games')}
                className="flex flex-col items-center gap-2 h-auto py-6"
              >
                <BookOpen className="h-8 w-8 text-primary" />
                <span>All Games</span>
              </Button>

              <Button
                variant="kid"
                size="lg"
                onClick={() => navigate('/avatar')}
                className="flex flex-col items-center gap-2 h-auto py-6"
              >
                <User className="h-8 w-8 text-secondary" />
                <span>My Avatar</span>
              </Button>

              <Button
                variant="kid"
                size="lg"
                onClick={() => navigate('/room')}
                className="flex flex-col items-center gap-2 h-auto py-6"
              >
                <span className="text-3xl">🏠</span>
                <span>My Room</span>
              </Button>

              <Button
                variant="kid"
                size="lg"
                onClick={() => navigate('/shop')}
                className="flex flex-col items-center gap-2 h-auto py-6"
              >
                <ShoppingBag className="h-8 w-8 text-amber-500" />
                <span>Shop</span>
              </Button>
            </div>

            {/* Current Grade */}
            <button
              onClick={() => setShowGradeSelect(true)}
              className="w-full bg-card rounded-2xl p-4 shadow-soft flex items-center justify-between"
            >
              <span className="text-muted-foreground">Current Grade:</span>
              <span className="font-bold text-primary">
                {currentChild.grade === 'K' ? 'Kindergarten' : `Grade ${currentChild.grade}`}
              </span>
            </button>
          </>
        )}
      </div>

      {/* Bottom Word Bar */}
      <div className="mt-6 pb-6">
        <div className="bg-card rounded-3xl shadow-card p-3 border">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div>
              <h3 className="font-bold">Current Practice Words</h3>
              <p className="text-xs text-muted-foreground">
                Tap words to reroll only those. Refresh all for a brand new set.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={refreshAllWords}>
                Refresh All
              </Button>
              <Button
                variant="kid"
                size="sm"
                onClick={rerollSelectedWords}
                disabled={selectedWordIndexes.length === 0}
              >
                Reroll Selected
              </Button>
            </div>
          </div>

          {currentWordSet?.words ? (
            <div className="grid grid-cols-5 gap-2">
              {currentWordSet.words.slice(0, 10).map((w, i) => {
                const isSelected = selectedWordIndexes.includes(i);
                return (
                  <button
                    key={`${w.id}-${i}`}
                    onClick={() => toggleWordIndex(i)}
                    className={`text-sm font-semibold rounded-xl px-2 py-2 shadow-soft border transition-all ${
                      isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-border'
                    }`}
                    aria-pressed={isSelected}
                    title={isSelected ? 'Selected to reroll' : 'Tap to select'}
                  >
                    {w.word}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Pick a grade to generate your first word set.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
