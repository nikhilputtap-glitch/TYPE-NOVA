/**
 * TypeNova - Comprehensive TypeScript Definitions
 */

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type KeyboardLayout = 'QWERTY' | 'AZERTY' | 'DVORAK';
export type DailyGoalMinutes = 10 | 30 | 60;
export type TrainingPurpose = 'School' | 'Coding' | 'Office' | 'Gaming' | 'Competitive';
export type TypingLanguage = 'English' | 'Telugu' | 'Hindi' | 'Tamil' | 'Urdu' | 'Arabic' | 'Spanish' | 'French';

export interface UserPreferences {
  theme: 'neon-dark' | 'glass-light' | 'retro-terminal' | 'cyberpunk-magenta';
  keyboardLayout: KeyboardLayout;
  language: TypingLanguage;
  soundPack: 'off' | 'mechanical' | 'laser' | 'beep';
  dyslexiaFont: boolean;
  colorBlindMode: boolean;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  oneHandMode: 'off' | 'left' | 'right';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredXp?: number;
  requiredWpm?: number;
  requiredStreak?: number;
  requiredLessons?: number;
  unlockedAt?: string; // date string or null if locked
  points: number;
}

export interface TypingSession {
  id: string;
  timestamp: number;
  type: 'lesson' | 'test' | 'game' | 'multiplayer' | 'custom';
  durationSeconds: number;
  wpm: number;
  accuracy: number;
  cpm: number;
  errorsCount: number;
  consistencyScore: number; // 0-100
  weakKeys: string[];
}

export interface UserProfile {
  username: string;
  email: string;
  isGuest: boolean;
  isElite?: boolean;
  avatarUrl: string;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  lastStreakClaimedDate?: string; // YYYY-MM-DD
  levelPath: {
    skill: SkillLevel;
    purpose: TrainingPurpose;
    dailyGoal: DailyGoalMinutes;
    completedLessons: string[]; // lesson ids
  };
  achievements: string[]; // achievement ids
  statistics: {
    totalSecondsPlayed: number;
    lessonsCompleted: number;
    averageWpm: number;
    maxWpm: number;
    averageAccuracy: number;
  };
  preferences: UserPreferences;
}

export interface TypingLesson {
  id: string;
  title: string;
  difficulty: SkillLevel;
  type: 'finger-placement' | 'home-row' | 'words' | 'sentences' | 'punctuation' | 'symbols' | 'advanced' | 'coding';
  promptText: string;
  targetKeys: string[];
  description: string;
  xpReward: number;
  audioGuideUrl?: string;
  codingLanguage?: string; // for coding typing
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  country: string;
  maxWpm: number;
  totalXp: number;
  level: number;
  avatarUrl: string;
}

export interface CustomPracticeText {
  id: string;
  title: string;
  text: string;
  category: 'code' | 'quotes' | 'stories' | 'custom';
  importSource?: string;
}

export interface AiCoachReport {
  timestamp: string;
  feedback: string;
  weakLetters: string[];
  suggestedExercises: string[];
  predictedImprovement: string;
  motivationQuote: string;
}

export interface TaskChallenge {
  id: string;
  title: string;
  description: string;
  targetWpm: number;
  targetAccuracy: number;
  rewardCoins: number;
  expiresIn: string;
}
