import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, Lock } from 'lucide-react';

const shopItems = [
  { id: 'glasses', name: 'Cool Glasses', price: 50, emoji: '👓', unlockLevel: 1 },
  { id: 'hat', name: 'Party Hat', price: 75, emoji: '🎩', unlockLevel: 2 },
  { id: 'crown', name: 'Royal Crown', price: 150, emoji: '👑', unlockLevel: 3 },
  { id: 'desk', name: 'Study Desk', price: 100, emoji: '🪑', unlockLevel: 1 },
  { id: 'bed', name: 'Cozy Bed', price: 120, emoji: '🛏️', unlockLevel: 2 },
  { id: 'plant', name: 'Houseplant', price: 40, emoji: '🪴', unlockLevel: 1 },
];

export default function Shop() {
  const navigate = useNavigate();
  const { currentChild, addCoins } = useGame();

  if (!currentChild) return null;

  const handleBuy = (price: number) => {
    if (currentChild.coins >= price) {
      addCoins(-price);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon-sm" onClick={() => navigate('/play')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Shop</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-100 text-amber-600 px-4 py-2 rounded-full">
            <Coins className="h-5 w-5" />
            <span className="font-bold">{currentChild.coins}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {shopItems.map(item => {
            const canBuy = currentChild.coins >= item.price && currentChild.level >= item.unlockLevel;
            const locked = currentChild.level < item.unlockLevel;

            return (
              <div key={item.id} className="bg-card rounded-2xl p-4 shadow-card text-center">
                <span className="text-4xl block mb-2">{item.emoji}</span>
                <p className="font-bold text-sm">{item.name}</p>
                <div className="flex items-center justify-center gap-1 text-amber-600 my-2">
                  <Coins className="h-4 w-4" />
                  <span className="font-bold">{item.price}</span>
                </div>
                {locked ? (
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" /> Level {item.unlockLevel}
                  </div>
                ) : (
                  <Button variant={canBuy ? 'coin' : 'outline'} size="sm" disabled={!canBuy}
                    onClick={() => handleBuy(item.price)} className="w-full">
                    Buy
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
