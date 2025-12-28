import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { GameMode } from '@/types';
import { Volume2, Layers, CheckSquare, Shuffle, ArrowLeft, Search, Headphones, Type, TrendingUp } from 'lucide-react';

const gameModes: { mode: GameMode; name: string; description: string; icon: React.ReactNode; color: string }[] = [
  { 
    mode: 'hear-and-type', 
    name: 'Hear & Type', 
    description: 'Listen and spell the word',
    icon: <Volume2 className="h-8 w-8" />,
    color: 'from-primary to-cyan-500'
  },
  { 
    mode: 'letter-tiles', 
    name: 'Letter Tiles', 
    description: 'Drag letters to build words',
    icon: <Layers className="h-8 w-8" />,
    color: 'from-secondary to-orange-400'
  },
  { 
    mode: 'multiple-choice', 
    name: 'Multiple Choice', 
    description: 'Pick the correct spelling',
    icon: <CheckSquare className="h-8 w-8" />,
    color: 'from-amber-500 to-yellow-400'
  },
  { 
    mode: 'word-scramble', 
    name: 'Word Scramble', 
    description: 'Unscramble the letters',
    icon: <Shuffle className="h-8 w-8" />,
    color: 'from-purple-500 to-pink-500'
  },
  { 
    mode: 'practice-ladder', 
    name: 'Practice Ladder', 
    description: 'Look, cover, write, check!',
    icon: <TrendingUp className="h-8 w-8" />,
    color: 'from-emerald-500 to-teal-500'
  },
  { 
    mode: 'missing-letters', 
    name: 'Missing Letters', 
    description: 'Fill in the blanks',
    icon: <Type className="h-8 w-8" />,
    color: 'from-rose-500 to-orange-500'
  },
  { 
    mode: 'audio-match', 
    name: 'Audio Match', 
    description: 'Hear it, then choose it',
    icon: <Headphones className="h-8 w-8" />,
    color: 'from-indigo-500 to-sky-500'
  },
  { 
    mode: 'word-search', 
    name: 'Word Search', 
    description: 'Find the word in a grid',
    icon: <Search className="h-8 w-8" />,
    color: 'from-fuchsia-500 to-violet-500'
  },
];


export default function GameHub() {
  const navigate = useNavigate();
  const { currentWordSet, currentChild, createRandomWordSet, setCurrentWordSet, startGame } = useGame();

    useEffect(() => {
    if (!currentChild) navigate('/parent', { replace: true });
  }, [currentChild, navigate]);

  if (!currentChild) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

const handleSelectGame = (mode: GameMode) => {
    // Create word set if not already set
    if (!currentWordSet && currentChild) {
      const wordSet = createRandomWordSet(currentChild.grade, 10);
      setCurrentWordSet(wordSet);
    }
    startGame(mode);
    navigate(`/games/${mode}`);
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/play')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Choose a Game</h1>
            <p className="text-muted-foreground text-sm">
              {currentWordSet 
                ? `${currentWordSet.words.length} words ready` 
                : 'Pick a game to start'}
            </p>
          </div>
        </div>

        {/* Game Cards */}
        <div className="grid gap-4">
          {gameModes.map((game, index) => (
            <button
              key={game.mode}
              onClick={() => handleSelectGame(game.mode)}
              className="bg-card rounded-2xl p-5 shadow-card hover:shadow-glow transition-all hover:scale-[1.02] active:scale-[0.98] text-left animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center text-white shadow-soft`}>
                  {game.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground">{game.name}</h3>
                  <p className="text-muted-foreground text-sm">{game.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Word Set Info */}
        {currentWordSet && (
          <div className="mt-6 bg-muted rounded-2xl p-4">
            <p className="text-sm text-muted-foreground mb-2">Current Word Set:</p>
            <p className="font-bold text-foreground">{currentWordSet.name}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {currentWordSet.words.slice(0, 5).map(word => (
                <span key={word.id} className="px-2 py-1 bg-card rounded-lg text-xs">
                  {word.word}
                </span>
              ))}
              {currentWordSet.words.length > 5 && (
                <span className="px-2 py-1 text-muted-foreground text-xs">
                  +{currentWordSet.words.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
