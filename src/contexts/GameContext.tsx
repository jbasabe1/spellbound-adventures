import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Word, WordSet, GradeLevel, GameMode, ChildProfile, WordAttempt, GameSession, AvatarConfig } from '@/types';
import { getRandomWords } from '@/data/wordBank';

interface GameState {
  currentChild: ChildProfile | null;
  currentWordSet: WordSet | null;
  currentGameMode: GameMode | null;
  currentSession: GameSession | null;
  currentWordIndex: number;
  attempts: number;
  showAnswer: boolean;
}

interface GameContextType extends GameState {
  setCurrentChild: (child: ChildProfile | null) => void;
  createRandomWordSet: (grade: GradeLevel, count?: number, name?: string) => WordSet;
  createCustomWordSet: (name: string, words: Word[], grade: GradeLevel) => WordSet;
  setCurrentWordSet: (wordSet: WordSet | null) => void;
  startGame: (mode: GameMode) => void;
  submitAnswer: (answer: string, word: Word) => { correct: boolean; shouldShowAnswer: boolean };
  nextWord: () => boolean; // returns true if there are more words
  endGame: () => GameSession | null;
  addCoins: (amount: number) => void;
  addXp: (amount: number) => void;
  updateAvatar: (config: Partial<AvatarConfig>) => void;
  speakWord: (word: string, rate?: number) => void;
}

const defaultAvatar: AvatarConfig = {
  skinTone: '#FFDBB4',
  hairStyle: 'short',
  hairColor: '#4A3728',
  eyeShape: 'round',
  eyeColor: '#634E34',
  noseShape: 'small',
  mouthShape: 'smile',
  headShape: 'round',
  shirt: 'tshirt',
  shirtColor: '#4ECDC4',
  pants: 'jeans',
  pantsColor: '#4A6FA5',
  shoes: 'sneakers',
  shoesColor: '#FF6B6B',
  accessories: [],
};

const defaultChild: ChildProfile = {
  id: 'demo-child',
  parentId: 'demo-parent',
  name: 'Player',
  grade: '1',
  avatarConfig: defaultAvatar,
  xp: 0,
  level: 1,
  coins: 50,
  createdAt: new Date(),
  settings: {
    dailyGoalMinutes: 15,
    dyslexiaFont: false,
    largerText: false,
    reduceMotion: false,
  },
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentChild, setCurrentChildState] = useState<ChildProfile | null>(defaultChild);
  const [currentWordSet, setCurrentWordSet] = useState<WordSet | null>(null);
  const [currentGameMode, setCurrentGameMode] = useState<GameMode | null>(null);
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionAttempts, setSessionAttempts] = useState<WordAttempt[]>([]);

  const setCurrentChild = (child: ChildProfile | null) => {
    setCurrentChildState(child);
  };

  const createRandomWordSet = (grade: GradeLevel, count = 10, name?: string): WordSet => {
    const words = getRandomWords(grade, count);
    const wordSet: WordSet = {
      id: `random-${Date.now()}`,
      name: name || `${grade === 'K' ? 'Kindergarten' : `Grade ${grade}`} Practice`,
      type: 'random',
      grade,
      words,
      createdAt: new Date(),
    };
    return wordSet;
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

  const startGame = (mode: GameMode) => {
    if (!currentWordSet || !currentChild) return;
    
    setCurrentGameMode(mode);
    setCurrentWordIndex(0);
    setAttempts(0);
    setShowAnswer(false);
    setSessionAttempts([]);
    
    const session: GameSession = {
      id: `session-${Date.now()}`,
      childId: currentChild.id,
      wordSetId: currentWordSet.id,
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
    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedWord = word.word.toLowerCase().trim();
    const correct = normalizedAnswer === normalizedWord;
    
    if (correct) {
      // Record successful attempt
      const attempt: WordAttempt = {
        wordId: word.id,
        word: word.word,
        attempts: attempts + 1,
        correct: true,
        hintsUsed: 0,
        timeSpent: 0,
        answer: normalizedAnswer,
      };
      setSessionAttempts(prev => [...prev, attempt]);
      setAttempts(0);
      setShowAnswer(false);
      return { correct: true, shouldShowAnswer: false };
    }
    
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    
    if (newAttempts >= 2) {
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
    const correctAnswers = sessionAttempts.filter(a => a.correct && a.attempts === 1).length;
    const accuracy = totalWords > 0 ? (correctAnswers / totalWords) * 100 : 0;
    
    // Calculate rewards
    const baseCoins = 10;
    const accuracyMultiplier = accuracy / 100;
    const coinsEarned = Math.round(baseCoins * totalWords * accuracyMultiplier);
    const xpEarned = Math.round(5 * totalWords * accuracyMultiplier) + 10; // bonus for completing
    
    const completedSession: GameSession = {
      ...currentSession,
      completedAt: new Date(),
      score: correctAnswers,
      accuracy,
      coinsEarned,
      xpEarned,
      attempts: sessionAttempts,
    };
    
    // Award coins and XP
    if (currentChild) {
      addCoins(coinsEarned);
      addXp(xpEarned);
    }
    
    setCurrentSession(null);
    setCurrentGameMode(null);
    setSessionAttempts([]);
    
    return completedSession;
  };

  const addCoins = (amount: number) => {
    if (currentChild) {
      setCurrentChildState({
        ...currentChild,
        coins: currentChild.coins + amount,
      });
    }
  };

  const addXp = (amount: number) => {
    if (currentChild) {
      const newXp = currentChild.xp + amount;
      const xpPerLevel = 100;
      const newLevel = Math.floor(newXp / xpPerLevel) + 1;
      
      setCurrentChildState({
        ...currentChild,
        xp: newXp,
        level: newLevel,
      });
    }
  };

  const updateAvatar = (config: Partial<AvatarConfig>) => {
    if (currentChild) {
      setCurrentChildState({
        ...currentChild,
        avatarConfig: { ...currentChild.avatarConfig, ...config },
      });
    }
  };

  const speakWord = (word: string, rate = 0.8) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = rate;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Try to use a child-friendly voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        v.name.includes('Samantha') || 
        v.name.includes('Google US English') ||
        v.lang.startsWith('en-')
      );
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <GameContext.Provider
      value={{
        currentChild,
        currentWordSet,
        currentGameMode,
        currentSession,
        currentWordIndex,
        attempts,
        showAnswer,
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
