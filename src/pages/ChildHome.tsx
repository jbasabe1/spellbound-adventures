import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { GradeSelector } from '@/components/GradeSelector';
import { Avatar } from '@/components/Avatar';
import { GradeLevel } from '@/types';
import { BookOpen, User, ShoppingBag, Sparkles, Coins, Play, Settings } from 'lucide-react';

export default function ChildHome() {
  const navigate = useNavigate();
  const { currentChild, setCurrentChild, createRandomWordSet, setCurrentWordSet } = useGame();
  const [showGradeSelect, setShowGradeSelect] = useState(!currentChild?.grade);

  const handleGradeSelect = (grade: GradeLevel) => {
    if (currentChild) {
      setCurrentChild({ ...currentChild, grade });
      setShowGradeSelect(false);
    }
  };

  const handleQuickPlay = () => {
    if (currentChild) {
      const wordSet = createRandomWordSet(currentChild.grade, 10);
      setCurrentWordSet(wordSet);
      navigate('/games');
    }
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
          <p className="text-muted-foreground">
            Level {currentChild.level} Speller
          </p>
          
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
            <GradeSelector 
              selectedGrade={currentChild.grade} 
              onSelect={handleGradeSelect} 
            />
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
    </div>
  );
}
