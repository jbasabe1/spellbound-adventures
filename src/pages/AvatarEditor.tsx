import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAvatarItems } from '@/data/shopItems';

const hairStyles = ['short', 'long', 'curly', 'ponytail'];
const skinTones = ['#FFDBB4', '#EDB98A', '#D08B5B', '#8D5524', '#4A2C0A'];
const hairColors = ['#4A3728', '#1A1110', '#B55239', '#E6CEA8', '#6B4423'];
const shirtColors = ['#4ECDC4', '#FF6B6B', '#95E1D3', '#F38181', '#AA96DA'];

export default function AvatarEditor() {
  const navigate = useNavigate();
  const { currentChild, updateAvatar, ownedItems, toggleEquipItem } = useGame();
    useEffect(() => {
    if (!currentChild) navigate('/parent', { replace: true });
  }, [currentChild, navigate]);

  if (!currentChild) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

const [config, setConfig] = useState(currentChild?.avatarConfig);

  if (!currentChild || !config) return null;

  const avatarItems = getAvatarItems();
  const ownedAccessories = ownedItems
    .filter(owned => avatarItems.some(item => item.id === owned.itemId && item.category === 'avatar-accessories'))
    .map(owned => ({
      ...owned,
      item: avatarItems.find(item => item.id === owned.itemId)!
    }));

  const handleUpdate = (key: string, value: string) => {
    setConfig({ ...config, [key]: value });
    updateAvatar({ [key]: value });
  };

  const handleToggleAccessory = (itemId: string) => {
    const newAccessories = config.accessories.includes(itemId)
      ? config.accessories.filter(a => a !== itemId)
      : [...config.accessories, itemId];
    
    setConfig({ ...config, accessories: newAccessories });
    updateAvatar({ accessories: newAccessories });
  };

  return (
    <div className="min-h-screen pt-20 pb-8 px-4 bg-background">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/play')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Avatar</h1>
        </div>

        <div className="bg-card rounded-3xl shadow-card p-6 mb-6">
          <div className="flex justify-center mb-6">
            <Avatar config={config} size="xl" />
          </div>

          <div className="space-y-6">
            <div>
              <p className="font-bold mb-2">Skin Tone</p>
              <div className="flex gap-2">
                {skinTones.map(tone => (
                  <button key={tone} onClick={() => handleUpdate('skinTone', tone)}
                    className={`w-10 h-10 rounded-full border-2 ${config.skinTone === tone ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}
                    style={{ backgroundColor: tone }} />
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">Hair Style</p>
              <div className="flex gap-2 flex-wrap">
                {hairStyles.map(style => (
                  <Button key={style} variant={config.hairStyle === style ? 'default' : 'outline'} size="sm"
                    onClick={() => handleUpdate('hairStyle', style)}>
                    {style}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">Hair Color</p>
              <div className="flex gap-2">
                {hairColors.map(color => (
                  <button key={color} onClick={() => handleUpdate('hairColor', color)}
                    className={`w-10 h-10 rounded-full border-2 ${config.hairColor === color ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>

            <div>
              <p className="font-bold mb-2">Shirt Color</p>
              <div className="flex gap-2 flex-wrap">
                {shirtColors.map(color => (
                  <button key={color} onClick={() => handleUpdate('shirtColor', color)}
                    className={`w-10 h-10 rounded-full border-2 ${config.shirtColor === color ? 'border-primary ring-2 ring-primary/30' : 'border-border'}`}
                    style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>

            {/* Accessories Section */}
            <div>
              <p className="font-bold mb-2">Accessories</p>
              {ownedAccessories.length === 0 ? (
                <div className="bg-muted rounded-xl p-4 text-center">
                  <p className="text-muted-foreground text-sm mb-2">No accessories yet!</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/shop')} className="gap-1">
                    <ShoppingBag className="h-4 w-4" />
                    Visit Shop
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {ownedAccessories.map(({ itemId, item }) => {
                    const isEquipped = config.accessories.includes(itemId);
                    return (
                      <button
                        key={itemId}
                        onClick={() => handleToggleAccessory(itemId)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                          isEquipped 
                            ? 'border-primary bg-primary/10 ring-2 ring-primary/30' 
                            : 'border-border bg-muted hover:bg-muted/80'
                        }`}
                      >
                        <span className="text-xl">{item.imageUrl}</span>
                        <span className="text-sm font-medium">{item.name}</span>
                        {isEquipped && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <Button variant="success" size="lg" className="w-full gap-2" onClick={() => navigate('/play')}>
          <Check className="h-5 w-5" /> Done
        </Button>
      </div>
    </div>
  );
}
