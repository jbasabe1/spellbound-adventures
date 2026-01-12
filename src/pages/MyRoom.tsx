import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Move, Trash2, Lock, Home } from 'lucide-react';
import { getRoomItems, getItemById } from '@/data/shopItems';
import { ItemPlacement } from '@/types';
import { toast } from 'sonner';

type RoomType = 'small' | 'large';

export default function MyRoom() {
  const navigate = useNavigate();
  const { currentChild, ownedItems, roomPlacements, updateRoomPlacements } = useGame();
  const [editMode, setEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [currentRoom, setCurrentRoom] = useState<RoomType>('small');

  const canAccessLargeRoom = currentChild && currentChild.level >= 10;

  useEffect(() => {
    if (!currentChild) navigate('/parent', { replace: true });
  }, [currentChild, navigate]);

  if (!currentChild) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const roomItems = getRoomItems();
  const ownedRoomItems = ownedItems
    .filter(owned => roomItems.some(item => item.id === owned.itemId))
    .map(owned => ({
      ...owned,
      item: getItemById(owned.itemId)!
    }));

  const placedItemIds = roomPlacements.map(p => p.itemId);
  const inventoryItems = ownedRoomItems.filter(i => !placedItemIds.includes(i.itemId));

  const handlePlaceItem = (itemId: string) => {
    const item = getItemById(itemId);
    if (!item) return;

    const x = currentRoom === 'large' ? 250 + Math.random() * 150 : 150 + Math.random() * 100;
    const y = item.placement === 'wall' ? 80 : 220;

    const newPlacement: ItemPlacement = {
      itemId,
      x,
      y,
      rotation: 0,
      layer: roomPlacements.length,
    };

    updateRoomPlacements([...roomPlacements, newPlacement]);
    setShowInventory(false);
    toast.success(`${item.name} placed in your room!`);
  };

  const handleRemoveItem = (itemId: string) => {
    updateRoomPlacements(roomPlacements.filter(p => p.itemId !== itemId));
    setSelectedItem(null);
    toast.info('Item removed from room');
  };

  const handleMoveItem = (itemId: string, dx: number, dy: number) => {
    const maxX = currentRoom === 'large' ? 580 : 380;
    updateRoomPlacements(roomPlacements.map(p => {
      if (p.itemId !== itemId) return p;
      const item = getItemById(itemId);
      const minY = item?.placement === 'wall' ? 40 : 180;
      const maxY = item?.placement === 'wall' ? 120 : 280;
      return {
        ...p,
        x: Math.max(20, Math.min(maxX, p.x + dx)),
        y: Math.max(minY, Math.min(maxY, p.y + dy)),
      };
    }));
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-background">
      <div className={`mx-auto ${currentRoom === 'large' ? 'max-w-2xl' : 'max-w-lg'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon-sm" onClick={() => navigate('/play')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">My Room</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={editMode ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              <Move className="h-4 w-4 mr-1" />
              {editMode ? 'Done' : 'Edit'}
            </Button>
          </div>
        </div>

        {/* Room Selector */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={currentRoom === 'small' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrentRoom('small')}
            className="flex-1"
          >
            <Home className="h-4 w-4 mr-1" />
            Starter Room
          </Button>
          <Button
            variant={currentRoom === 'large' ? 'default' : 'outline'}
            size="sm"
            onClick={() => canAccessLargeRoom && setCurrentRoom('large')}
            disabled={!canAccessLargeRoom}
            className="flex-1"
          >
            {!canAccessLargeRoom && <Lock className="h-4 w-4 mr-1" />}
            Big Room {!canAccessLargeRoom && '(Lvl 10)'}
          </Button>
        </div>

        {/* Room View */}
        <div className="bg-card rounded-3xl shadow-card overflow-hidden mb-4">
          {currentRoom === 'small' ? (
            // Small Room
            <svg viewBox="0 0 400 320" className="w-full">
              {/* Back wall */}
              <rect x="0" y="0" width="400" height="160" fill="#E8D4C4" />
              
              {/* Floor */}
              <rect x="0" y="160" width="400" height="160" fill="#C4A484" />
              <path d="M 0 160 L 400 160" stroke="#B8956C" strokeWidth="3" />
              
              {/* Floor boards */}
              {[0, 50, 100, 150, 200, 250, 300, 350].map(x => (
                <line key={x} x1={x} y1="160" x2={x} y2="320" stroke="#B8956C" strokeWidth="1" opacity="0.5" />
              ))}
              
              {/* Window */}
              <rect x="150" y="30" width="100" height="80" fill="#87CEEB" rx="4" />
              <rect x="150" y="30" width="100" height="80" fill="none" stroke="#8B7355" strokeWidth="6" rx="4" />
              <line x1="200" y1="30" x2="200" y2="110" stroke="#8B7355" strokeWidth="3" />
              <line x1="150" y1="70" x2="250" y2="70" stroke="#8B7355" strokeWidth="3" />
              
              {/* Window view - neighborhood */}
              <circle cx="175" cy="55" r="8" fill="#228B22" />
              <rect x="165" y="55" width="20" height="2" fill="#8B4513" />
              <rect x="210" y="50" width="25" height="20" fill="#CD853F" />
              <polygon points="210,50 222.5,40 235,50" fill="#8B0000" />
              <rect x="218" y="58" width="8" height="12" fill="#654321" />
              <circle cx="185" cy="95" r="10" fill="#FFD700" opacity="0.6" />
              
              {/* Curtains */}
              <path d="M 145 25 Q 140 70 145 115" fill="#D4A373" />
              <path d="M 255 25 Q 260 70 255 115" fill="#D4A373" />
              
              {/* Placed items */}
              {roomPlacements.map(placement => {
                const item = getItemById(placement.itemId);
                if (!item) return null;
                const isSelected = selectedItem === placement.itemId;
                
                return (
                  <g 
                    key={placement.itemId}
                    transform={`translate(${placement.x}, ${placement.y})`}
                    onClick={() => editMode && setSelectedItem(isSelected ? null : placement.itemId)}
                    style={{ cursor: editMode ? 'pointer' : 'default' }}
                  >
                    {isSelected && (
                      <rect x="-25" y="-25" width="50" height="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" rx="4" />
                    )}
                    <text 
                      fontSize="32" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      style={{ userSelect: 'none' }}
                    >
                      {item.imageUrl}
                    </text>
                  </g>
                );
              })}
            </svg>
          ) : (
            // Large Room
            <svg viewBox="0 0 600 400" className="w-full">
              {/* Back wall with wallpaper pattern */}
              <rect x="0" y="0" width="600" height="200" fill="#D4C4B0" />
              <pattern id="wallpaper" patternUnits="userSpaceOnUse" width="40" height="40">
                <circle cx="20" cy="20" r="2" fill="#C4B4A0" opacity="0.5" />
              </pattern>
              <rect x="0" y="0" width="600" height="200" fill="url(#wallpaper)" />
              
              {/* Crown molding */}
              <rect x="0" y="0" width="600" height="8" fill="#FFF8E7" />
              
              {/* Floor - fancy hardwood */}
              <rect x="0" y="200" width="600" height="200" fill="#B8956C" />
              <path d="M 0 200 L 600 200" stroke="#A0805C" strokeWidth="4" />
              
              {/* Herringbone floor pattern */}
              {[0, 60, 120, 180, 240, 300, 360, 420, 480, 540].map(x => (
                <g key={x}>
                  <line x1={x} y1="200" x2={x} y2="400" stroke="#A0805C" strokeWidth="1" opacity="0.4" />
                  <line x1={x} y1="250" x2={x + 30} y2="280" stroke="#C4A484" strokeWidth="1" opacity="0.3" />
                  <line x1={x} y1="300" x2={x + 30} y2="330" stroke="#C4A484" strokeWidth="1" opacity="0.3" />
                </g>
              ))}
              
              {/* Large bay window */}
              <rect x="180" y="30" width="240" height="120" fill="#87CEEB" rx="6" />
              <rect x="180" y="30" width="240" height="120" fill="none" stroke="#5C4033" strokeWidth="8" rx="6" />
              <line x1="260" y1="30" x2="260" y2="150" stroke="#5C4033" strokeWidth="4" />
              <line x1="340" y1="30" x2="340" y2="150" stroke="#5C4033" strokeWidth="4" />
              <line x1="180" y1="90" x2="420" y2="90" stroke="#5C4033" strokeWidth="4" />
              
              {/* Window view - park scene */}
              <rect x="185" y="95" width="230" height="50" fill="#90EE90" opacity="0.6" />
              <circle cx="220" cy="70" r="18" fill="#228B22" />
              <rect x="215" y="85" width="10" height="20" fill="#8B4513" />
              <circle cx="380" cy="75" r="15" fill="#228B22" />
              <rect x="376" y="88" width="8" height="15" fill="#8B4513" />
              <circle cx="300" cy="60" r="20" fill="#FFD700" opacity="0.7" />
              <path d="M 250 120 Q 300 100 350 120" fill="#4682B4" opacity="0.5" />
              
              {/* Fancy curtains */}
              <path d="M 170 20 Q 160 80 170 160" fill="#8B4513" strokeWidth="2" />
              <path d="M 430 20 Q 440 80 430 160" fill="#8B4513" strokeWidth="2" />
              <ellipse cx="175" cy="25" rx="15" ry="8" fill="#FFD700" />
              <ellipse cx="425" cy="25" rx="15" ry="8" fill="#FFD700" />
              
              {/* Side windows */}
              <rect x="40" y="50" width="60" height="80" fill="#87CEEB" rx="4" />
              <rect x="40" y="50" width="60" height="80" fill="none" stroke="#5C4033" strokeWidth="5" rx="4" />
              <line x1="70" y1="50" x2="70" y2="130" stroke="#5C4033" strokeWidth="2" />
              
              <rect x="500" y="50" width="60" height="80" fill="#87CEEB" rx="4" />
              <rect x="500" y="50" width="60" height="80" fill="none" stroke="#5C4033" strokeWidth="5" rx="4" />
              <line x1="530" y1="50" x2="530" y2="130" stroke="#5C4033" strokeWidth="2" />
              
              {/* Placed items */}
              {roomPlacements.map(placement => {
                const item = getItemById(placement.itemId);
                if (!item) return null;
                const isSelected = selectedItem === placement.itemId;
                
                return (
                  <g 
                    key={placement.itemId}
                    transform={`translate(${placement.x}, ${placement.y})`}
                    onClick={() => editMode && setSelectedItem(isSelected ? null : placement.itemId)}
                    style={{ cursor: editMode ? 'pointer' : 'default' }}
                  >
                    {isSelected && (
                      <rect x="-30" y="-30" width="60" height="60" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" strokeDasharray="4" rx="4" />
                    )}
                    <text 
                      fontSize="40" 
                      textAnchor="middle" 
                      dominantBaseline="middle"
                      style={{ userSelect: 'none' }}
                    >
                      {item.imageUrl}
                    </text>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Edit controls */}
        {editMode && selectedItem && (
          <div className="bg-card rounded-2xl p-4 shadow-card mb-4 animate-scale-in">
            <p className="font-bold text-center mb-3">Move {getItemById(selectedItem)?.name}</p>
            <div className="flex justify-center gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={() => handleMoveItem(selectedItem, 0, -20)}>↑</Button>
            </div>
            <div className="flex justify-center gap-2 mb-3">
              <Button size="sm" variant="outline" onClick={() => handleMoveItem(selectedItem, -20, 0)}>←</Button>
              <Button size="sm" variant="outline" onClick={() => handleMoveItem(selectedItem, 20, 0)}>→</Button>
            </div>
            <div className="flex justify-center gap-2 mb-4">
              <Button size="sm" variant="outline" onClick={() => handleMoveItem(selectedItem, 0, 20)}>↓</Button>
            </div>
            <Button 
              variant="destructive" 
              size="sm" 
              className="w-full"
              onClick={() => handleRemoveItem(selectedItem)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Remove from Room
            </Button>
          </div>
        )}

        {/* Inventory button */}
        {editMode && (
          <Button 
            variant="kid" 
            className="w-full gap-2"
            onClick={() => setShowInventory(!showInventory)}
          >
            <Package className="h-5 w-5" />
            My Inventory ({inventoryItems.length} items)
          </Button>
        )}

        {/* Inventory panel */}
        {showInventory && (
          <div className="bg-card rounded-2xl p-4 shadow-card mt-4 animate-slide-up">
            <h3 className="font-bold mb-3">Place items in your room:</h3>
            {inventoryItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No room items in inventory. Visit the shop to buy some!
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {inventoryItems.map(({ itemId, item }) => (
                  <button
                    key={itemId}
                    onClick={() => handlePlaceItem(itemId)}
                    className="bg-muted rounded-xl p-3 text-center hover:bg-muted/80 transition-colors"
                  >
                    <span className="text-2xl block mb-1">{item.imageUrl}</span>
                    <span className="text-xs font-medium">{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!editMode && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Click "Edit" to place or move items in your room!
          </p>
        )}
      </div>
    </div>
  );
}