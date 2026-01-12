import { InventoryItem } from '@/types';

export const shopItems: InventoryItem[] = [
  // ===== AVATAR ACCESSORIES =====
  // Level 1
  { id: 'glasses', name: 'Cool Glasses', category: 'avatar-accessories', price: 50, unlockLevel: 1, imageUrl: '👓' },
  { id: 'bow', name: 'Hair Bow', category: 'avatar-accessories', price: 40, unlockLevel: 1, imageUrl: '🎀' },
  { id: 'bandana', name: 'Bandana', category: 'avatar-accessories', price: 45, unlockLevel: 1, imageUrl: '🧣' },
  
  // Level 2
  { id: 'hat', name: 'Party Hat', category: 'avatar-accessories', price: 75, unlockLevel: 2, imageUrl: '🎩' },
  { id: 'headphones', name: 'Headphones', category: 'avatar-accessories', price: 80, unlockLevel: 2, imageUrl: '🎧' },
  { id: 'necklace', name: 'Gold Necklace', category: 'avatar-accessories', price: 65, unlockLevel: 2, imageUrl: '📿' },
  
  // Level 3
  { id: 'crown', name: 'Royal Crown', category: 'avatar-accessories', price: 150, unlockLevel: 3, imageUrl: '👑' },
  { id: 'sunglasses', name: 'Sunglasses', category: 'avatar-accessories', price: 90, unlockLevel: 3, imageUrl: '🕶️' },
  { id: 'watch', name: 'Cool Watch', category: 'avatar-accessories', price: 85, unlockLevel: 3, imageUrl: '⌚' },
  
  // Level 4
  { id: 'earrings', name: 'Star Earrings', category: 'avatar-accessories', price: 100, unlockLevel: 4, imageUrl: '✨' },
  { id: 'cape', name: 'Super Cape', category: 'avatar-accessories', price: 120, unlockLevel: 4, imageUrl: '🦸' },
  { id: 'tiara', name: 'Princess Tiara', category: 'avatar-accessories', price: 130, unlockLevel: 4, imageUrl: '👸' },
  
  // Level 5
  { id: 'wizard-hat', name: 'Wizard Hat', category: 'avatar-accessories', price: 160, unlockLevel: 5, imageUrl: '🧙' },
  { id: 'pirate-hat', name: 'Pirate Hat', category: 'avatar-accessories', price: 140, unlockLevel: 5, imageUrl: '🏴‍☠️' },
  { id: 'cowboy-hat', name: 'Cowboy Hat', category: 'avatar-accessories', price: 145, unlockLevel: 5, imageUrl: '🤠' },
  
  // Level 6
  { id: 'viking-helmet', name: 'Viking Helmet', category: 'avatar-accessories', price: 180, unlockLevel: 6, imageUrl: '⚔️' },
  { id: 'astronaut-helmet', name: 'Space Helmet', category: 'avatar-accessories', price: 200, unlockLevel: 6, imageUrl: '🧑‍🚀' },
  
  // Level 7
  { id: 'dragon-wings', name: 'Dragon Wings', category: 'avatar-accessories', price: 250, unlockLevel: 7, imageUrl: '🐉' },
  { id: 'fairy-wings', name: 'Fairy Wings', category: 'avatar-accessories', price: 220, unlockLevel: 7, imageUrl: '🧚' },
  
  // Level 8+
  { id: 'rainbow-aura', name: 'Rainbow Aura', category: 'avatar-accessories', price: 300, unlockLevel: 8, imageUrl: '🌈' },
  { id: 'golden-crown', name: 'Golden Crown', category: 'avatar-accessories', price: 400, unlockLevel: 10, imageUrl: '💎' },
  
  // ===== ROOM FURNITURE (floor) =====
  // Level 1
  { id: 'desk', name: 'Study Desk', category: 'room-furniture', price: 100, unlockLevel: 1, imageUrl: '🪑', placement: 'floor' },
  { id: 'bookshelf', name: 'Bookshelf', category: 'room-furniture', price: 90, unlockLevel: 1, imageUrl: '📚', placement: 'floor' },
  { id: 'lamp', name: 'Floor Lamp', category: 'room-furniture', price: 60, unlockLevel: 1, imageUrl: '🪔', placement: 'floor' },
  { id: 'chair', name: 'Comfy Chair', category: 'room-furniture', price: 70, unlockLevel: 1, imageUrl: '🪑', placement: 'floor' },
  
  // Level 2
  { id: 'bed', name: 'Cozy Bed', category: 'room-furniture', price: 120, unlockLevel: 2, imageUrl: '🛏️', placement: 'floor' },
  { id: 'dresser', name: 'Dresser', category: 'room-furniture', price: 95, unlockLevel: 2, imageUrl: '🗄️', placement: 'floor' },
  { id: 'nightstand', name: 'Nightstand', category: 'room-furniture', price: 50, unlockLevel: 2, imageUrl: '🪵', placement: 'floor' },
  
  // Level 3
  { id: 'couch', name: 'Cozy Couch', category: 'room-furniture', price: 150, unlockLevel: 3, imageUrl: '🛋️', placement: 'floor' },
  { id: 'tv', name: 'TV Stand', category: 'room-furniture', price: 180, unlockLevel: 3, imageUrl: '📺', placement: 'floor' },
  { id: 'gaming-chair', name: 'Gaming Chair', category: 'room-furniture', price: 140, unlockLevel: 3, imageUrl: '🎮', placement: 'floor' },
  
  // Level 4
  { id: 'piano', name: 'Piano', category: 'room-furniture', price: 250, unlockLevel: 4, imageUrl: '🎹', placement: 'floor' },
  { id: 'fish-tank', name: 'Fish Tank', category: 'room-furniture', price: 160, unlockLevel: 4, imageUrl: '🐠', placement: 'floor' },
  
  // Level 5
  { id: 'bunk-bed', name: 'Bunk Bed', category: 'room-furniture', price: 200, unlockLevel: 5, imageUrl: '🛏️', placement: 'floor' },
  { id: 'trampoline', name: 'Trampoline', category: 'room-furniture', price: 180, unlockLevel: 5, imageUrl: '🤸', placement: 'floor' },
  
  // Level 6+
  { id: 'arcade-machine', name: 'Arcade Machine', category: 'room-furniture', price: 300, unlockLevel: 6, imageUrl: '👾', placement: 'floor' },
  { id: 'telescope', name: 'Telescope', category: 'room-furniture', price: 220, unlockLevel: 6, imageUrl: '🔭', placement: 'floor' },
  { id: 'jukebox', name: 'Jukebox', category: 'room-furniture', price: 280, unlockLevel: 7, imageUrl: '🎶', placement: 'floor' },
  
  // ===== ROOM DECOR (floor) =====
  // Level 1
  { id: 'plant', name: 'Houseplant', category: 'room-decor', price: 40, unlockLevel: 1, imageUrl: '🪴', placement: 'floor' },
  { id: 'rug', name: 'Cozy Rug', category: 'room-decor', price: 55, unlockLevel: 1, imageUrl: '🟫', placement: 'floor' },
  { id: 'teddy', name: 'Teddy Bear', category: 'room-decor', price: 35, unlockLevel: 1, imageUrl: '🧸', placement: 'floor' },
  
  // Level 2
  { id: 'globe', name: 'World Globe', category: 'room-decor', price: 65, unlockLevel: 2, imageUrl: '🌍', placement: 'floor' },
  { id: 'basketball', name: 'Basketball', category: 'room-decor', price: 45, unlockLevel: 2, imageUrl: '🏀', placement: 'floor' },
  { id: 'guitar', name: 'Guitar', category: 'room-decor', price: 80, unlockLevel: 2, imageUrl: '🎸', placement: 'floor' },
  
  // Level 3
  { id: 'skateboard', name: 'Skateboard', category: 'room-decor', price: 70, unlockLevel: 3, imageUrl: '🛹', placement: 'floor' },
  { id: 'robot', name: 'Robot Toy', category: 'room-decor', price: 90, unlockLevel: 3, imageUrl: '🤖', placement: 'floor' },
  { id: 'rocket', name: 'Rocket Model', category: 'room-decor', price: 100, unlockLevel: 3, imageUrl: '🚀', placement: 'floor' },
  
  // Level 4+
  { id: 'lava-lamp', name: 'Lava Lamp', category: 'room-decor', price: 85, unlockLevel: 4, imageUrl: '🔮', placement: 'floor' },
  { id: 'disco-ball', name: 'Disco Ball', category: 'room-decor', price: 120, unlockLevel: 5, imageUrl: '🪩', placement: 'floor' },
  { id: 'trophy', name: 'Trophy', category: 'room-decor', price: 150, unlockLevel: 6, imageUrl: '🏆', placement: 'floor' },
  { id: 'unicorn', name: 'Unicorn Plush', category: 'room-decor', price: 110, unlockLevel: 4, imageUrl: '🦄', placement: 'floor' },
  { id: 'dragon-statue', name: 'Dragon Statue', category: 'room-decor', price: 200, unlockLevel: 7, imageUrl: '🐲', placement: 'floor' },
  
  // ===== WALL ITEMS =====
  // Level 1
  { id: 'poster', name: 'Star Poster', category: 'room-wall', price: 30, unlockLevel: 1, imageUrl: '⭐', placement: 'wall' },
  { id: 'clock', name: 'Wall Clock', category: 'room-wall', price: 45, unlockLevel: 1, imageUrl: '🕐', placement: 'wall' },
  { id: 'mirror', name: 'Wall Mirror', category: 'room-wall', price: 50, unlockLevel: 1, imageUrl: '🪞', placement: 'wall' },
  
  // Level 2
  { id: 'painting', name: 'Art Painting', category: 'room-wall', price: 80, unlockLevel: 2, imageUrl: '🖼️', placement: 'wall' },
  { id: 'map', name: 'World Map', category: 'room-wall', price: 60, unlockLevel: 2, imageUrl: '🗺️', placement: 'wall' },
  { id: 'pennant', name: 'Sports Pennant', category: 'room-wall', price: 40, unlockLevel: 2, imageUrl: '🚩', placement: 'wall' },
  
  // Level 3
  { id: 'neon-sign', name: 'Neon Sign', category: 'room-wall', price: 100, unlockLevel: 3, imageUrl: '💡', placement: 'wall' },
  { id: 'dart-board', name: 'Dart Board', category: 'room-wall', price: 75, unlockLevel: 3, imageUrl: '🎯', placement: 'wall' },
  { id: 'dreamcatcher', name: 'Dreamcatcher', category: 'room-wall', price: 55, unlockLevel: 3, imageUrl: '🌙', placement: 'wall' },
  
  // Level 4+
  { id: 'banner', name: 'Cool Banner', category: 'room-wall', price: 65, unlockLevel: 4, imageUrl: '🏴', placement: 'wall' },
  { id: 'photo-wall', name: 'Photo Wall', category: 'room-wall', price: 90, unlockLevel: 4, imageUrl: '📷', placement: 'wall' },
  { id: 'medal-display', name: 'Medal Display', category: 'room-wall', price: 130, unlockLevel: 5, imageUrl: '🎖️', placement: 'wall' },
  { id: 'constellation', name: 'Star Map', category: 'room-wall', price: 140, unlockLevel: 6, imageUrl: '✨', placement: 'wall' },
  { id: 'rainbow-wall', name: 'Rainbow Art', category: 'room-wall', price: 160, unlockLevel: 7, imageUrl: '🌈', placement: 'wall' },
  
  // ===== BIG ROOM ITEMS (Level 10+) =====
  { id: 'pool-table', name: 'Pool Table', category: 'room-furniture', price: 400, unlockLevel: 10, imageUrl: '🎱', placement: 'floor' },
  { id: 'hot-tub', name: 'Hot Tub', category: 'room-furniture', price: 500, unlockLevel: 10, imageUrl: '🛁', placement: 'floor' },
  { id: 'chandelier', name: 'Chandelier', category: 'room-wall', price: 350, unlockLevel: 10, imageUrl: '💫', placement: 'wall' },
  { id: 'movie-screen', name: 'Movie Screen', category: 'room-wall', price: 450, unlockLevel: 10, imageUrl: '🎬', placement: 'wall' },
];

export function getAvatarItems() {
  return shopItems.filter(item => item.category.startsWith('avatar-'));
}

export function getRoomItems() {
  return shopItems.filter(item => item.category.startsWith('room-'));
}

export function getItemById(id: string) {
  return shopItems.find(item => item.id === id);
}

export function getItemsByLevel(level: number) {
  return shopItems.filter(item => item.unlockLevel <= level);
}

export function getBigRoomItems() {
  return shopItems.filter(item => item.unlockLevel >= 10);
}