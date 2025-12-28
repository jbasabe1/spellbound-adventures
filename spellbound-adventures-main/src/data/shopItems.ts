import { InventoryItem } from '@/types';

export const shopItems: InventoryItem[] = [
  // Avatar accessories
  { id: 'glasses', name: 'Cool Glasses', category: 'avatar-accessories', price: 50, unlockLevel: 1, imageUrl: '👓' },
  { id: 'hat', name: 'Party Hat', category: 'avatar-accessories', price: 75, unlockLevel: 2, imageUrl: '🎩' },
  { id: 'crown', name: 'Royal Crown', category: 'avatar-accessories', price: 150, unlockLevel: 3, imageUrl: '👑' },
  { id: 'bow', name: 'Hair Bow', category: 'avatar-accessories', price: 40, unlockLevel: 1, imageUrl: '🎀' },
  { id: 'headphones', name: 'Headphones', category: 'avatar-accessories', price: 80, unlockLevel: 2, imageUrl: '🎧' },
  
  // Room furniture (floor)
  { id: 'desk', name: 'Study Desk', category: 'room-furniture', price: 100, unlockLevel: 1, imageUrl: '🪑', placement: 'floor' },
  { id: 'bed', name: 'Cozy Bed', category: 'room-furniture', price: 120, unlockLevel: 2, imageUrl: '🛏️', placement: 'floor' },
  { id: 'bookshelf', name: 'Bookshelf', category: 'room-furniture', price: 90, unlockLevel: 1, imageUrl: '📚', placement: 'floor' },
  { id: 'lamp', name: 'Floor Lamp', category: 'room-furniture', price: 60, unlockLevel: 1, imageUrl: '🪔', placement: 'floor' },
  { id: 'chair', name: 'Comfy Chair', category: 'room-furniture', price: 70, unlockLevel: 1, imageUrl: '🪑', placement: 'floor' },
  
  // Room decor
  { id: 'plant', name: 'Houseplant', category: 'room-decor', price: 40, unlockLevel: 1, imageUrl: '🪴', placement: 'floor' },
  { id: 'rug', name: 'Cozy Rug', category: 'room-decor', price: 55, unlockLevel: 1, imageUrl: '🟫', placement: 'floor' },
  { id: 'globe', name: 'World Globe', category: 'room-decor', price: 65, unlockLevel: 2, imageUrl: '🌍', placement: 'floor' },
  
  // Wall items
  { id: 'poster', name: 'Star Poster', category: 'room-wall', price: 30, unlockLevel: 1, imageUrl: '⭐', placement: 'wall' },
  { id: 'clock', name: 'Wall Clock', category: 'room-wall', price: 45, unlockLevel: 1, imageUrl: '🕐', placement: 'wall' },
  { id: 'painting', name: 'Art Painting', category: 'room-wall', price: 80, unlockLevel: 2, imageUrl: '🖼️', placement: 'wall' },
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
