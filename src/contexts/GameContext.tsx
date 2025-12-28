import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import {
  Word,
  WordSet,
  GradeLevel,
  GameMode,
  ChildProfile,
  WordAttempt,
  GameSession,
  AvatarConfig,
  OwnedItem,
  ItemPlacement,
  SavedWordSet
} from '@/types';
import { getRandomWords } from '@/data/wordBank';

const MAX_SAVED_LISTS = 10;
const MAX_CHILD_PROFILES = 5;

const STORAGE_KEYS = {
  parentPin: 'spellbound-parent-pin',
  childSaves: 'spellbound-child-saves',
  currentChildId: 'spellbound-current-child-id',
} as const;

type ChildSaveData = {
  profile: ChildProfile;
  ownedItems: OwnedItem[];
  roomPlacements: ItemPlacement[];
  savedWordSets: SavedWordSet[];
};

interface GameState {
  currentChild: ChildProfile | null;
  childProfiles: ChildProfile[];
  currentWordSet: WordSet | null;
  currentGameMode: GameMode | null;
  currentSession: GameSession | null;
  currentWordIndex: number;
  attempts: number;
  showAnswer: boolean;
  ownedItems: OwnedItem[];
  roomPlacements: ItemPlacement[];
  savedWordSets: SavedWordSet[];
  parentPinSet: boolean;
}

interface GameContextType extends GameState {
  // Profiles / Parent portal
  setParentPin: (pin: string) => void;
  verifyParentPin: (pin: string) => boolean;
  createChildProfile: (name: string, grade?: GradeLevel) => ChildProfile | null;
  updateChildProfile: (id: string, updates: Partial<Pick<ChildProfile, 'name' | 'grade' | 'avatarConfig' | 'settings'>>) => void;
  deleteChildProfile: (id: string) => void;
  selectChildProfile: (id: string) => void;

  // Existing game APIs
  setCurrentChild: (child: ChildProfile | null) => void;
  createRandomWordSet: (grade: GradeLevel, count?: number, name?: string) => WordSet;
  createCustomWordSet: (name: string, words: Word[], grade: GradeLevel) => WordSet;
  setCurrentWordSet: (wordSet: WordSet | null) => void;
  startGame: (mode: GameMode, wordSetOverride?: WordSet) => void;
  submitAnswer: (answer: string, word: Word) => { correct: boolean; shouldShowAnswer: boolean };
  nextWord: () => boolean;
  endGame: () => GameSession | null;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  updateAvatar: (config: Partial<AvatarConfig>) => void;
  speakWord: (word: string, rate?: number) => void;
  purchaseItem: (itemId: string, price: number) => boolean;
  isItemOwned: (itemId: string) => boolean;
  toggleEquipItem: (itemId: string) => void;
  updateRoomPlacements: (placements: ItemPlacement[]) => void;
  saveCurrentWordSet: (name: string) => boolean;
  loadSavedWordSet: (id: string) => void;
  deleteSavedWordSet: (id: string) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const createBlankProfile = (name: string, grade: GradeLevel = '1'): ChildProfile => ({
  id: `child-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  parentId: 'parent-1',
  name: name.trim() || 'Player',
  grade,
  avatarConfig: {
    skinTone: 'medium',
    hairStyle: 'short',
    hairColor: 'brown',
    eyes: 'brown',
    outfit: 'default',
    accessories: [],
  },
  xp: 0,
  level: 1,
  coins: 100,
  createdAt: new Date(),
  settings: {
    dailyGoalMinutes: 15,
    dyslexiaFont: false,
    largerText: false,
    reduceMotion: false,
  },
});

function safeJsonParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function reviveChildSaves(raw: Record<string, any>): Record<string, ChildSaveData> {
  const result: Record<string, ChildSaveData> = {};
  Object.entries(raw || {}).forEach(([id, v]) => {
    if (!v?.profile) return;
    const profile: ChildProfile = {
      ...v.profile,
      createdAt: v.profile.createdAt ? new Date(v.profile.createdAt) : new Date(),
    };
    result[id] = {
      profile,
      ownedItems: Array.isArray(v.ownedItems) ? v.ownedItems : [],
      roomPlacements: Array.isArray(v.roomPlacements) ? v.roomPlacements : [],
      savedWordSets: Array.isArray(v.savedWordSets)
        ? v.savedWordSets.map((s: any) => ({ ...s, createdAt: s.createdAt ? new Date(s.createdAt) : new Date() }))
        : [],
    };
  });
  return result;
}

export function GameProvider({ children }: { children: ReactNode }) {
  // Parent pin
  const [parentPin, setParentPinState] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.parentPin);
  });

  // Per-child saves (profile + inventory + room + saved lists)
  const [childSaves, setChildSaves] = useState<Record<string, ChildSaveData>>(() => {
    const raw = safeJsonParse<Record<string, any>>(localStorage.getItem(STORAGE_KEYS.childSaves), {});
    return reviveChildSaves(raw);
  });

  const childProfiles = useMemo(() => Object.values(childSaves).map(s => s.profile), [childSaves]);

  const [currentChild, setCurrentChildState] = useState<ChildProfile | null>(() => {
    const storedId = localStorage.getItem(STORAGE_KEYS.currentChildId);
    if (storedId && childSaves[storedId]?.profile) return childSaves[storedId].profile;
    const first = Object.values(childSaves)[0]?.profile;
    return first || null;
  });

  // Game/session state
  const [currentWordSet, setCurrentWordSet] = useState<WordSet | null>(null);
  const [currentGameMode, setCurrentGameMode] = useState<GameMode | null>(null);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionAttempts, setSessionAttempts] = useState<WordAttempt[]>([]);

  // Per-child state slices
  const [ownedItems, setOwnedItems] = useState<OwnedItem[]>(() => {
    if (!currentChild) return [];
    return childSaves[currentChild.id]?.ownedItems || [];
  });
  const [roomPlacements, setRoomPlacements] = useState<ItemPlacement[]>(() => {
    if (!currentChild) return [];
    return childSaves[currentChild.id]?.roomPlacements || [];
  });
  const [savedWordSets, setSavedWordSets] = useState<SavedWordSet[]>(() => {
    if (!currentChild) return [];
    return childSaves[currentChild.id]?.savedWordSets || [];
  });

  // Persist childSaves
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.childSaves, JSON.stringify(childSaves));
  }, [childSaves]);

  // Persist current child id
  useEffect(() => {
    if (currentChild?.id) localStorage.setItem(STORAGE_KEYS.currentChildId, currentChild.id);
    if (!currentChild?.id) localStorage.removeItem(STORAGE_KEYS.currentChildId);
  }, [currentChild?.id]);

  // When switching child, load their slices
  useEffect(() => {
    if (!currentChild) {
      setOwnedItems([]);
      setRoomPlacements([]);
      setSavedWordSets([]);
      return;
    }
    const save = childSaves[currentChild.id];
    setOwnedItems(save?.ownedItems || []);
    setRoomPlacements(save?.roomPlacements || []);
    setSavedWordSets(save?.savedWordSets || []);
  }, [currentChild?.id]);

  // Persist slices into current child save
  useEffect(() => {
    if (!currentChild) return;
    setChildSaves(prev => {
      const existing = prev[currentChild.id] || { profile: currentChild, ownedItems: [], roomPlacements: [], savedWordSets: [] };
      return {
        ...prev,
        [currentChild.id]: {
          ...existing,
          profile: existing.profile.id ? currentChild : existing.profile,
          ownedItems,
          roomPlacements,
          savedWordSets,
        },
      };
    });
  }, [ownedItems, roomPlacements, savedWordSets, currentChild]);

  const parentPinSet = !!parentPin;

  const setParentPin = (pin: string) => {
    const cleaned = pin.trim();
    setParentPinState(cleaned);
    localStorage.setItem(STORAGE_KEYS.parentPin, cleaned);
  };

  const verifyParentPin = (pin: string) => {
    if (!parentPin) return true;
    return pin.trim() === parentPin;
  };

  const createChildProfile = (name: string, grade?: GradeLevel) => {
    if (childProfiles.length >= MAX_CHILD_PROFILES) return null;
    const profile = createBlankProfile(name, grade || '1');
    const save: ChildSaveData = {
      profile,
      ownedItems: [],
      roomPlacements: [],
      savedWordSets: [],
    };
    setChildSaves(prev => ({ ...prev, [profile.id]: save }));
    setCurrentChildState(profile);
    return profile;
  };

  const updateChildProfile = (id: string, updates: Partial<Pick<ChildProfile, 'name' | 'grade' | 'avatarConfig' | 'settings'>>) => {
    setChildSaves(prev => {
      const existing = prev[id];
      if (!existing) return prev;
      const nextProfile = { ...existing.profile, ...updates };
      return { ...prev, [id]: { ...existing, profile: nextProfile } };
    });
    if (currentChild?.id === id) {
      setCurrentChildState(prev => (prev ? { ...prev, ...updates } : prev));
    }
  };

  const deleteChildProfile = (id: string) => {
    setChildSaves(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    if (currentChild?.id === id) {
      const remaining = childProfiles.filter(p => p.id !== id);
      setCurrentChildState(remaining[0] || null);
    }
  };

  const selectChildProfile = (id: string) => {
    const profile = childSaves[id]?.profile;
    if (!profile) return;
    setCurrentChildState(profile);
  };

  const setCurrentChild = (child: ChildProfile | null) => {
    setCurrentChildState(child);
    if (child) {
      setChildSaves(prev => {
        const existing = prev[child.id];
        const next: ChildSaveData = existing
          ? { ...existing, profile: child }
          : { profile: child, ownedItems: [], roomPlacements: [], savedWordSets: [] };
        return { ...prev, [child.id]: next };
      });
    }
  };

  const createRandomWordSet = (grade: GradeLevel, count = 10, name?: string): WordSet => {
    const words = getRandomWords(grade, count);
    return {
      id: `random-${Date.now()}`,
      name: name || `${grade === 'K' ? 'Kindergarten' : `Grade ${grade}`} Practice`,
      type: 'random',
      grade,
      words,
      createdAt: new Date(),
    };
  };

  const createCustomWordSet = (name: string, words: Word[], grade: GradeLevel): WordSet => {
    return {
      id: `custom-${Date.now()}`,
      name,
      type: 'custom',
      grade,
      words,
      createdAt: new Date(),
    };
  };

  const startGame = (mode: GameMode, wordSetOverride?: WordSet) => {
    if (!currentChild) return;

    const wordSetToUse = wordSetOverride || currentWordSet || createRandomWordSet(currentChild.grade, 10);
    setCurrentWordSet(wordSetToUse);

    setCurrentGameMode(mode);
    setCurrentWordIndex(0);
    setAttempts(0);
    setShowAnswer(false);
    setSessionAttempts([]);

    const session: GameSession = {
      id: `session-${Date.now()}`,
      childId: currentChild.id,
      wordSetId: wordSetToUse.id,
      gameMode: mode,
      startedAt: new Date(),
      score: 0,
      accuracy: 0,
      coinsEarned: 0,
      xpEarned: 0,
      attempts: [],
    };
    setCurrentSession(session);
  };

  const submitAnswer = (answer: string, word: Word) => {
    const normalizedAnswer = answer.trim().toLowerCase();
    const normalizedWord = word.word.toLowerCase();
    const isCorrect = normalizedAnswer === normalizedWord;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (isCorrect) {
      const attempt: WordAttempt = {
        wordId: word.id,
        word: word.word,
        attempts: newAttempts,
        correct: true,
        hintsUsed: 0,
        timeSpent: 0,
        answer: normalizedAnswer,
      };
      setSessionAttempts(prev => [...prev, attempt]);
      setShowAnswer(false);
      return { correct: true, shouldShowAnswer: false };
    }

    if (newAttempts >= 2) {
      const attempt: WordAttempt = {
        wordId: word.id,
        word: word.word,
        attempts: newAttempts,
        correct: false,
        hintsUsed: 0,
        timeSpent: 0,
        answer: normalizedAnswer,
      };
      setSessionAttempts(prev => [...prev, attempt]);
      setShowAnswer(true);
      return { correct: false, shouldShowAnswer: true };
    }

    return { correct: false, shouldShowAnswer: false };
  };

  const nextWord = (): boolean => {
    if (!currentWordSet) return false;

    if (currentWordIndex < currentWordSet.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setAttempts(0);
      setShowAnswer(false);
      return true;
    }
    return false;
  };

  const endGame = (): GameSession | null => {
    if (!currentSession || !currentWordSet) return null;

    const totalWords = currentWordSet.words.length;
    const correctWords = sessionAttempts.filter(a => a.correct).length;
    const accuracy = totalWords > 0 ? (correctWords / totalWords) * 100 : 0;

    // Reward: base coins + xp scaled by accuracy
    const coinsEarned = Math.round(10 + (accuracy / 100) * 40);
    const xpEarned = Math.round(10 + (accuracy / 100) * 50);

    const completedSession: GameSession = {
      ...currentSession,
      endedAt: new Date(),
      score: correctWords,
      accuracy,
      coinsEarned,
      xpEarned,
      attempts: sessionAttempts,
    };

    setCurrentSession(completedSession);

    // Apply rewards to profile
    addCoins(coinsEarned);
    addXp(xpEarned);

    return completedSession;
  };

  const addCoins = (amount: number) => {
    if (!currentChild) return;
    const next = { ...currentChild, coins: currentChild.coins + amount };
    setCurrentChild(next);
  };

  const addXp = (amount: number) => {
    if (!currentChild) return;
    const newXp = currentChild.xp + amount;
    const xpPerLevel = 100;
    const newLevel = Math.floor(newXp / xpPerLevel) + 1;
    const next = { ...currentChild, xp: newXp, level: newLevel };
    setCurrentChild(next);
  };

  const updateAvatar = (config: Partial<AvatarConfig>) => {
    if (!currentChild) return;
    const next = { ...currentChild, avatarConfig: { ...currentChild.avatarConfig, ...config } };
    setCurrentChild(next);
  };

  const speakWord = (word: string, rate = 0.8) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.speak(utterance);
    }
  };

  const purchaseItem = (itemId: string, price: number) => {
    if (!currentChild) return false;
    if (currentChild.coins < price) return false;

    if (ownedItems.some(i => i.itemId === itemId)) return true;

    setOwnedItems(prev => [...prev, { itemId, equipped: false, purchasedAt: new Date() }]);
    addCoins(-price);
    return true;
  };

  const isItemOwned = (itemId: string) => ownedItems.some(i => i.itemId === itemId);

  const toggleEquipItem = (itemId: string) => {
    setOwnedItems(prev =>
      prev.map(item =>
        item.itemId === itemId ? { ...item, equipped: !item.equipped } : item
      )
    );
  };

  const updateRoomPlacements = (placements: ItemPlacement[]) => {
    setRoomPlacements(placements);
  };

  const saveCurrentWordSet = (name: string) => {
    if (!currentWordSet) return false;
    if (savedWordSets.length >= MAX_SAVED_LISTS) return false;

    const savedSet: SavedWordSet = {
      id: `saved-${Date.now()}`,
      name,
      words: currentWordSet.words,
      grade: currentWordSet.grade,
      createdAt: new Date(),
    };

    setSavedWordSets(prev => [savedSet, ...prev]);
    return true;
  };

  const loadSavedWordSet = (id: string) => {
    const savedSet = savedWordSets.find(s => s.id === id);
    if (!savedSet) return;

    const wordSet: WordSet = {
      id: savedSet.id,
      name: savedSet.name,
      type: 'saved',
      grade: savedSet.grade,
      words: [...savedSet.words],
      createdAt: new Date(),
    };

    setCurrentWordSet(wordSet);
  };

  const deleteSavedWordSet = (id: string) => {
    setSavedWordSets(prev => prev.filter(s => s.id !== id));
  };

  return (
    <GameContext.Provider
      value={{
        currentChild,
        childProfiles,
        currentWordSet,
        currentGameMode,
        currentSession,
        currentWordIndex,
        attempts,
        showAnswer,
        ownedItems,
        roomPlacements,
        savedWordSets,
        parentPinSet,

        setParentPin,
        verifyParentPin,
        createChildProfile,
        updateChildProfile,
        deleteChildProfile,
        selectChildProfile,

        setCurrentChild,
        createRandomWordSet,
        createCustomWordSet,
        setCurrentWordSet,
        startGame,
        submitAnswer,
        nextWord,
        endGame,
        addCoins,
        addXp,
        updateAvatar,
        speakWord,
        purchaseItem,
        isItemOwned,
        toggleEquipItem,
        updateRoomPlacements,
        saveCurrentWordSet,
        loadSavedWordSet,
        deleteSavedWordSet,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
