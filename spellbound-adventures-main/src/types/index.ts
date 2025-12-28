// Grade levels
export type GradeLevel = 'K' | '1' | '2' | '3' | '4' | '5';

// Phonics patterns
export type PhonicsPattern = 
  | 'CVC' 
  | 'blends' 
  | 'digraphs' 
  | 'silent-e' 
  | 'vowel-teams' 
  | 'r-controlled' 
  | 'prefixes' 
  | 'suffixes';

// Word in the word bank
export interface Word {
  id: string;
  word: string;
  grade: GradeLevel;
  length: number;
  syllables: number;
  phonicsPattern: PhonicsPattern[];
  isSightWord: boolean;
  difficulty: number; // 1-5
  definition?: string;
  exampleSentence?: string;
}

// Word set (custom or system-generated)
export interface WordSet {
  id: string;
  name: string;
  type: 'random' | 'custom';
  grade: GradeLevel;
  words: Word[];
  createdAt: Date;
  filters?: {
    phonicsPatterns?: PhonicsPattern[];
    lengthRange?: [number, number];
    theme?: string;
  };
}

// Mastery state for a word
export type MasteryLevel = 'new' | 'learning' | 'practicing' | 'mastered';

export interface WordMastery {
  wordId: string;
  childId: string;
  level: MasteryLevel;
  correctCount: number;
  incorrectCount: number;
  lastPracticed: Date;
  nextReview: Date;
}

// Game modes
export type GameMode = 
  | 'hear-and-type'
  | 'practice-ladder'
  | 'multiple-choice'
  | 'letter-tiles'
  | 'word-scramble'
  | 'missing-letters'
  | 'audio-match'
  | 'word-search';

// Game session
export interface GameSession {
  id: string;
  childId: string;
  wordSetId: string;
  gameMode: GameMode;
  startedAt: Date;
  completedAt?: Date;
  score: number;
  accuracy: number;
  totalWords?: number;
  coinsEarned: number;
  xpEarned: number;
  attempts: WordAttempt[];
}

// Individual word attempt
export interface WordAttempt {
  wordId: string;
  word: string;
  attempts: number;
  correct: boolean;
  hintsUsed: number;
  timeSpent: number; // in seconds
  answer?: string;
}

// Child profile
export interface ChildProfile {
  id: string;
  parentId: string;
  name: string;
  grade: GradeLevel;
  avatarConfig: AvatarConfig;
  xp: number;
  level: number;
  coins: number;
  createdAt: Date;
  settings: {
    dailyGoalMinutes: number;
    dyslexiaFont: boolean;
    largerText: boolean;
    reduceMotion: boolean;
  };
}

// Avatar configuration
export interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeShape: string;
  eyeColor: string;
  noseShape: string;
  mouthShape: string;
  headShape: string;
  shirt: string;
  shirtColor: string;
  pants: string;
  pantsColor: string;
  shoes: string;
  shoesColor: string;
  accessories: string[];
}

// Inventory items
export type ItemCategory = 
  | 'avatar-hair' 
  | 'avatar-face' 
  | 'avatar-clothes' 
  | 'avatar-accessories'
  | 'room-furniture' 
  | 'room-decor' 
  | 'room-wall' 
  | 'room-floor';

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  price: number;
  unlockLevel: number;
  imageUrl: string;
  placement?: 'wall' | 'floor' | 'shelf' | 'any';
}

// Owned item
export interface OwnedItem {
  itemId: string;
  childId: string;
  acquiredAt: Date;
  equipped: boolean;
}

// Room layout
export interface RoomLayout {
  id: string;
  childId: string;
  roomType: 'small' | 'medium' | 'large' | 'house' | 'town';
  placements: ItemPlacement[];
}

export interface ItemPlacement {
  itemId: string;
  x: number;
  y: number;
  rotation: number;
  layer: number;
}

// Parent profile
export interface ParentProfile {
  id: string;
  email: string;
  name: string;
  pin: string;
  children: string[]; // child IDs
  createdAt: Date;
}
