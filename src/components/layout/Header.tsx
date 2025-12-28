import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/contexts/GameContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Home, BookOpen, User, ShoppingBag, Sparkles, Coins, Lock } from 'lucide-react';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentChild, parentPinSet, verifyParentPin } = useGame();
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);
  
  const openParentPortal = () => {
    // If no PIN has been created yet, allow direct access
    if (!parentPinSet) {
      navigate('/parent');
      return;
    }
    setPin('');
    setPinError(null);
    setOpen(true);
  };

  const submitPin = () => {
    const ok = verifyParentPin(pin);
    if (!ok) {
      setPinError('Incorrect PIN');
      return;
    }
    setOpen(false);
    setPin('');
    setPinError(null);
    navigate('/parent');
  };

  const isChildMode = location.pathname.startsWith('/play') || 
                      location.pathname.startsWith('/games') ||
                      location.pathname.startsWith('/avatar') ||
                      location.pathname.startsWith('/room') ||
                      location.pathname.startsWith('/shop');

  if (!isChildMode) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/play" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center shadow-button">
            <span className="text-xl">🏰</span>
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:block">SpellTown</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link to="/play">
            <Button 
              variant={location.pathname === '/play' ? 'default' : 'ghost'} 
              size="icon-sm"
              className="rounded-xl"
            >
              <Home className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/games">
            <Button 
              variant={location.pathname.startsWith('/games') ? 'default' : 'ghost'} 
              size="icon-sm"
              className="rounded-xl"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/avatar">
            <Button 
              variant={location.pathname === '/avatar' ? 'default' : 'ghost'} 
              size="icon-sm"
              className="rounded-xl"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Link to="/shop">
            <Button 
              variant={location.pathname === '/shop' ? 'default' : 'ghost'} 
              size="icon-sm"
              className="rounded-xl"
            >
              <ShoppingBag className="h-5 w-5" />
            </Button>
          </Link>
        </nav>

        {/* Parent Portal */}
        <Button variant="ghost" size="icon-sm" className="rounded-xl" onClick={openParentPortal} title="Parent Portal">
          <Lock className="h-5 w-5" />
        </Button>

        {/* Stats */}
        {currentChild && (
          <div className="flex items-center gap-3">
            {/* XP */}
            <div className="flex items-center gap-1.5 bg-xp/20 text-xp px-3 py-1.5 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span className="font-bold text-sm">{currentChild.xp}</span>
            </div>
            {/* Coins */}
            <div className="flex items-center gap-1.5 bg-coin/20 text-amber-600 px-3 py-1.5 rounded-full">
              <Coins className="h-4 w-4" />
              <span className="font-bold text-sm">{currentChild.coins}</span>
            </div>
          </div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle>Parent Portal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              type="password"
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitPin();
              }}
            />
            {pinError && <p className="text-sm text-destructive">{pinError}</p>}
            <Button variant="game" className="w-full" onClick={submitPin}>
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </header>
  );
}
