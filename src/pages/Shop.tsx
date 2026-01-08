import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, Lock, Check, User, Home } from 'lucide-react';
import { shopItems, getAvatarItems, getRoomItems } from '@/data/shopItems';
import { toast } from 'sonner';

type TabType = 'avatar' | 'room';

export default function Shop() {
  const navigate = useNavigate();
  const { currentChild, purchaseItem, isItemOwned } = useGame();
  const [activeTab, setActiveTab] = useState<TabType>('avatar');

  useEffect(() => {
    if (!currentChild) navigate('/parent', { replace: true });
  }, [currentChild, navigate]);

  if (!currentChild) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const avatarItems = getAvatarItems();
  const roomItems = getRoomItems();
  const displayedItems = activeTab === 'avatar' ? avatarItems : roomItems;

  const handleBuy = (itemId: string, price: number) => {
    if (isItemOwned(itemId)) {
      toast.info('You already own this item!');
      return;
    }
    
    if (currentChild.coins < price) {
      toast.error('Not enough coins!');
      return;
    }

    const success = purchaseItem(itemId, price);
    if (success) {
      toast.success('Item purchased! Check your inventory.');
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon-sm" onClick={() => navigate('/play')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Shop</h1>
          </div>
          <div className="flex items-center gap-1.5 bg-coin/20 text-amber-600 px-4 py-2 rounded-full">
            <Coins className="h-5 w-5" />
            <span className="font-bold">{currentChild.coins}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'avatar' ? 'default' : 'outline'}
            onClick={() => setActiveTab('avatar')}
            className="flex-1 gap-2"
          >
            <User className="h-4 w-4" />
            Avatar Items
          </Button>
          <Button
            variant={activeTab === 'room' ? 'default' : 'outline'}
            onClick={() => setActiveTab('room')}
            className="flex-1 gap-2"
          >
            <Home className="h-4 w-4" />
            Room Items
          </Button>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-2 gap-4">
          {displayedItems.map(item => {
            const owned = isItemOwned(item.id);
            const canAfford = currentChild.coins >= item.price;
            const locked = currentChild.level < item.unlockLevel;
            const canBuy = canAfford && !locked && !owned;

            return (
              <div 
                key={item.id} 
                className={`bg-card rounded-2xl p-4 shadow-card text-center relative ${owned ? 'ring-2 ring-success/50' : ''}`}
              >
                {owned && (
                  <div className="absolute top-2 right-2 bg-success text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
                <span className="text-4xl block mb-2">{item.imageUrl}</span>
                <p className="font-bold text-sm">{item.name}</p>
                {item.placement && (
                  <p className="text-xs text-muted-foreground capitalize">{item.placement} item</p>
                )}
                <div className="flex items-center justify-center gap-1 text-amber-600 my-2">
                  <Coins className="h-4 w-4" />
                  <span className="font-bold">{item.price}</span>
                </div>
                {owned ? (
                  <Button variant="outline" size="sm" disabled className="w-full">
                    Owned
                  </Button>
                ) : locked ? (
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Lock className="h-3 w-3" /> Level {item.unlockLevel}
                  </div>
                ) : (
                  <Button 
                    variant={canBuy ? 'coin' : 'outline'} 
                    size="sm" 
                    disabled={!canBuy}
                    onClick={() => handleBuy(item.id, item.price)} 
                    className="w-full"
                  >
                    Buy
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Info text */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {activeTab === 'avatar' 
            ? 'Avatar items can be equipped in the Avatar Editor!'
            : 'Room items can be placed in your room!'}
        </p>
      </div>
    </div>
  );
}
