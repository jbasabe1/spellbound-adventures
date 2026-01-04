import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAvatarItems } from '@/data/shopItems';

const hairStylesMale = ['short', 'curly'];
const hairStylesFemale = ['short', 'long', 'curly', 'ponytail', 'braids', 'bun'];
const skinTones = ['#FFDBB4', '#F5D0A9', '#D4A574', '#C68642', '#8D5524', '#4A2C0A'];
const hairColors = ['#1A1110', '#4A3728', '#6B4423', '#8B4513', '#B55239', '#D4A574', '#E6CEA8', '#FFD700', '#FF4500', '#8B008B'];
const eyeColors = ['#4A3728', '#1A1110', '#2E8B57', '#4169E1', '#808080', '#8B4513'];
const shirtColors = ['#4ECDC4', '#FF6B6B', '#95E1D3', '#F38181', '#AA96DA', '#3498DB', '#E74C3C', '#2ECC71', '#9B59B6', '#F39C12'];
const pantsColors = ['#3B5998', '#2C3E50', '#1A1A2E', '#4A4A4A', '#8B4513', '#2F4F4F', '#483D8B'];
const shoeColors = ['#FFFFFF', '#1A1A1A', '#FF6B6B', '#4ECDC4', '#8B4513', '#FFD700'];

export default function AvatarEditor() {
  const navigate = useNavigate();
  const { currentChild, updateAvatar, ownedItems, toggleEquipItem } = useGame();

  useEffect(() => {
    if (!currentChild) navigate('/parent', { replace: true });
  }, [currentChild, navigate]);

  const [config, setConfig] = useState(currentChild?.avatarConfig);

  if (!currentChild || !config) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const avatarItems = getAvatarItems();
  const ownedAccessories = ownedItems
    .filter(owned => avatarItems.some(item => item.id === owned.itemId && item.category === 'avatar-accessories'))
    .map(owned => ({
      ...owned,
      item: avatarItems.find(item => item.id === owned.itemId)!
    }));

  const hairStyles = config.gender === 'female' ? hairStylesFemale : hairStylesMale;

  const handleUpdate = (key: string, value: string) => {
    const newConfig = { ...config, [key]: value };
    // Reset hair style if switching gender and current style isn't available
    if (key === 'gender') {
      const availableStyles = value === 'female' ? hairStylesFemale : hairStylesMale;
      if (!availableStyles.includes(config.hairStyle)) {
        newConfig.hairStyle = availableStyles[0];
      }
    }
    setConfig(newConfig);
    updateAvatar(newConfig);
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
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon-sm" onClick={() => navigate('/play')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">My Avatar</h1>
        </div>

        {/* Side-by-side layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Avatar Preview - Fixed on the side */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-card rounded-3xl shadow-card p-6 flex flex-col items-center">
              <div className="bg-gradient-to-b from-primary/10 to-secondary/10 rounded-2xl p-6 mb-4">
                <Avatar config={config} size="xl" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {currentChild.name}'s Avatar
              </p>
            </div>
          </div>

          {/* Customization Options */}
          <div className="flex-1 bg-card rounded-3xl shadow-card p-6">
            <div className="space-y-6">
              {/* Gender Selection */}
              <div>
                <p className="font-bold mb-3">Character Type</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleUpdate('gender', 'male')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      config.gender === 'male'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span className="text-2xl">👦</span>
                    <span className="font-medium">Boy</span>
                  </button>
                  <button
                    onClick={() => handleUpdate('gender', 'female')}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                      config.gender === 'female'
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                        : 'border-border hover:bg-muted'
                    }`}
                  >
                    <span className="text-2xl">👧</span>
                    <span className="font-medium">Girl</span>
                  </button>
                </div>
              </div>

              {/* Skin Tone */}
              <div>
                <p className="font-bold mb-3">Skin Tone</p>
                <div className="flex gap-2 flex-wrap">
                  {skinTones.map(tone => (
                    <button
                      key={tone}
                      onClick={() => handleUpdate('skinTone', tone)}
                      className={`w-12 h-12 rounded-full border-3 transition-all ${
                        config.skinTone === tone
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: tone }}
                    />
                  ))}
                </div>
              </div>

              {/* Hair Style */}
              <div>
                <p className="font-bold mb-3">Hair Style</p>
                <div className="flex gap-2 flex-wrap">
                  {hairStyles.map(style => (
                    <Button
                      key={style}
                      variant={config.hairStyle === style ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleUpdate('hairStyle', style)}
                      className="capitalize"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Hair Color */}
              <div>
                <p className="font-bold mb-3">Hair Color</p>
                <div className="flex gap-2 flex-wrap">
                  {hairColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleUpdate('hairColor', color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        config.hairColor === color
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Eye Color */}
              <div>
                <p className="font-bold mb-3">Eye Color</p>
                <div className="flex gap-2 flex-wrap">
                  {eyeColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleUpdate('eyeColor', color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        config.eyeColor === color
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Shirt Color */}
              <div>
                <p className="font-bold mb-3">Shirt Color</p>
                <div className="flex gap-2 flex-wrap">
                  {shirtColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleUpdate('shirtColor', color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        config.shirtColor === color
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Pants Color */}
              <div>
                <p className="font-bold mb-3">Pants Color</p>
                <div className="flex gap-2 flex-wrap">
                  {pantsColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleUpdate('pantsColor', color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        config.pantsColor === color
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Shoe Color */}
              <div>
                <p className="font-bold mb-3">Shoe Color</p>
                <div className="flex gap-2 flex-wrap">
                  {shoeColors.map(color => (
                    <button
                      key={color}
                      onClick={() => handleUpdate('shoesColor', color)}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        config.shoesColor === color
                          ? 'border-primary ring-2 ring-primary/30 scale-110'
                          : 'border-border hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Accessories Section */}
              <div>
                <p className="font-bold mb-3">Accessories</p>
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
        </div>

        {/* Done Button */}
        <div className="mt-6">
          <Button variant="success" size="lg" className="w-full gap-2" onClick={() => navigate('/play')}>
            <Check className="h-5 w-5" /> Done
          </Button>
        </div>
      </div>
    </div>
  );
}