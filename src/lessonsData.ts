import { TypingLesson } from './types';

export const LOCAL_LESSONS: TypingLesson[] = [
  // Beginner Home Row
  {
    id: 'b-home-1',
    title: 'Beginner Home Row basics',
    difficulty: 'Beginner',
    type: 'finger-placement',
    promptText: 'asdf jkl; asdf jkl;',
    targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
    description: 'Place your left-hand fingers on A-S-D-F and right-hand on J-K-L-;. Rest your thumbs on spacebar.',
    xpReward: 30
  },
  {
    id: 'b-home-2',
    title: 'Home row combinations',
    difficulty: 'Beginner',
    type: 'home-row',
    promptText: 'asdfg hjkl; fad salk glad jaf',
    targetKeys: ['g', 'h', 'f', 'a', 'd', 's', 'l', ';'],
    description: 'Practice moving your index fingers to tap the G and H keys, returning to home row immediately.',
    xpReward: 40
  },
  {
    id: 'b-top-1',
    title: 'Top Row Introduction',
    difficulty: 'Beginner',
    type: 'finger-placement',
    promptText: 'qwer uiop req wet tour pot row',
    targetKeys: ['q', 'w', 'e', 'r', 'u', 'i', 'o', 'p'],
    description: 'Move fingers from Home Row to Top Row. Keep hands hovered slightly above keybed.',
    xpReward: 50
  },

  // Intermediate: Words, Sentences
  {
    id: 'i-word-1',
    title: 'Dynamic Word Practice',
    difficulty: 'Intermediate',
    type: 'words',
    promptText: 'quantum cosmic shadow neon glitch circuit code speed accuracy master laser spark neon tech planet solar moon core star',
    targetKeys: ['q', 'c', 's', 'n', 'g', 'l', 'm', 'k', 'x', 'y'],
    description: 'Flow through lowercase typing commands in immediate muscle sequence memory.',
    xpReward: 60
  },
  {
    id: 'i-sentence-1',
    title: 'Sentence Fluency Drills',
    difficulty: 'Intermediate',
    type: 'sentences',
    promptText: 'The modern coder types beautiful lines of neon glowing javascript scripts in standard layouts.',
    targetKeys: ['S', 't', 'm', 'c', 'b', 'l', 'n', 'g', 'j'],
    description: 'Combine uppercase characters utilizing the Shift key seamlessly alongside home row returns.',
    xpReward: 75
  },
  {
    id: 'i-punc-1',
    title: 'Punctuation & Syntax Focus',
    difficulty: 'Intermediate',
    type: 'punctuation',
    promptText: 'Wait, did you write: "TypeNova is standard; code is perfect"? No, I said otherwise!',
    targetKeys: [',', '.', ':', '"', ';', '?', '!'],
    description: 'Incorporate symbols alongside lowercase phrases to build dynamic muscle consistency.',
    xpReward: 80
  },

  // Advanced Mode: Long paragraphs and layout speeds
  {
    id: 'a-para-1',
    title: 'Advanced Speed Drill',
    difficulty: 'Advanced',
    type: 'advanced',
    promptText: 'Sleek dark themes paired with glowing cosmic glassmorphism elements elevate digital workspaces. High-performance software engineering demands muscle-memory precision, speed, and continuous consistency. Great typists master focus screens.',
    targetKeys: ['S', 'g', 'c', 'w', 'e', 'm', 'p'],
    description: 'A long endurance paragraph focusing on overall flow, low error rating, and fluid capital switches.',
    xpReward: 120
  },
  {
    id: 'a-code-js',
    title: 'HTML & JS Syntax Practice',
    difficulty: 'Advanced',
    type: 'coding',
    promptText: 'const calculateWpm = (chars, sec) => { return Math.round((chars / 5) / (sec / 60)); };',
    targetKeys: ['=', '>', '(', ')', '{', '}', ';', '/', '*'],
    codingLanguage: 'JavaScript',
    description: 'Learn to comfortable navigate deep bracket layouts common in standard programming stacks.',
    xpReward: 150
  },
  {
    id: 'a-code-py',
    title: 'Python Syntax Practice',
    difficulty: 'Advanced',
    type: 'coding',
    promptText: 'def find_weak_keys(history):\n    return [k for k, v in history.items() if v["error_rate"] > 0.15]',
    targetKeys: ['[', ']', ':', '"', '_', '(', ')'],
    codingLanguage: 'Python',
    description: 'Typing code arrays, list comprehension, colons, and keyword combinations rapidly.',
    xpReward: 150
  }
];

export const MOCK_CHALLENGES = [
  { id: 'ch-1', title: 'Home Row Champion', description: 'Complete 3 Home Row Lessons with 98% accuracy', targetWpm: 40, targetAccuracy: 98, rewardCoins: 120, expiresIn: '2h' },
  { id: 'ch-2', title: 'Sonic Speedster', description: 'Reach over 75 WPM on any 30-second Typing Test', targetWpm: 75, targetAccuracy: 95, rewardCoins: 250, expiresIn: '8h' },
  { id: 'ch-3', title: 'Absolute Flawless', description: 'Finish a standard quote or paragraph test with 100% Accuracy', targetWpm: 50, targetAccuracy: 100, rewardCoins: 400, expiresIn: '1d' }
];

export const MOCK_ACHIEVEMENTS = [
  { id: 'ach-1', title: 'First Steps', description: 'Registered a profile and chosen a preferred layout path.', icon: 'Zap', points: 10 },
  { id: 'ach-2', title: 'Steady Pace', description: 'Reach 40 WPM with at least 95% accuracy in typing tests.', icon: 'Activity', points: 20 },
  { id: 'ach-3', title: 'Home Row Master', description: 'Finished all Beginner level home row focus lessons.', icon: 'CheckCircle2', points: 30 },
  { id: 'ach-4', title: 'Godspeed Typist', description: 'Surpassed 100 WPM speed mark on a 15-second typing drill.', icon: 'Flame', points: 50 },
  { id: 'ach-5', title: 'Syntax Wizard', description: 'Completed all Advanced level Programming syntax modules.', icon: 'Code', points: 50 },
  { id: 'ach-6', title: 'Daily Stream Grid', description: 'Maintained an unbroken 5-day active practice streak.', icon: 'Calendar', points: 40 }
];

export const KEYBOARD_FINGER_MAP: Record<string, { finger: string; color: string; hand: 'left' | 'right' }> = {
  // Left Hand
  'q': { finger: 'pinky', color: '#ff007f', hand: 'left' },
  'a': { finger: 'pinky', color: '#ff007f', hand: 'left' },
  'z': { finger: 'pinky', color: '#ff007f', hand: 'left' },
  '1': { finger: 'pinky', color: '#ff007f', hand: 'left' },
  'w': { finger: 'ring', color: '#a855f7', hand: 'left' },
  's': { finger: 'ring', color: '#a855f7', hand: 'left' },
  'x': { finger: 'ring', color: '#a855f7', hand: 'left' },
  '2': { finger: 'ring', color: '#a855f7', hand: 'left' },
  'e': { finger: 'middle', color: '#3b82f6', hand: 'left' },
  'd': { finger: 'middle', color: '#3b82f6', hand: 'left' },
  'c': { finger: 'middle', color: '#3b82f6', hand: 'left' },
  '3': { finger: 'middle', color: '#3b82f6', hand: 'left' },
  'r': { finger: 'index', color: '#00f0ff', hand: 'left' },
  'f': { finger: 'index', color: '#00f0ff', hand: 'left' },
  'v': { finger: 'index', color: '#00f0ff', hand: 'left' },
  '4': { finger: 'index', color: '#00f0ff', hand: 'left' },
  't': { finger: 'index', color: '#00f0ff', hand: 'left' },
  'g': { finger: 'index', color: '#00f0ff', hand: 'left' },
  'b': { finger: 'index', color: '#00f0ff', hand: 'left' },
  '5': { finger: 'index', color: '#00f0ff', hand: 'left' },

  // Spacebar (Thumbs)
  ' ': { finger: 'thumb', color: '#39ff14', hand: 'left' },

  // Right Hand
  'y': { finger: 'index', color: '#00f0ff', hand: 'right' },
  'h': { finger: 'index', color: '#00f0ff', hand: 'right' },
  'n': { finger: 'index', color: '#00f0ff', hand: 'right' },
  '6': { finger: 'index', color: '#00f0ff', hand: 'right' },
  'u': { finger: 'index', color: '#00f0ff', hand: 'right' },
  'j': { finger: 'index', color: '#00f0ff', hand: 'right' },
  'm': { finger: 'index', color: '#00f0ff', hand: 'right' },
  '7': { finger: 'index', color: '#00f0ff', hand: 'right' },
  'i': { finger: 'middle', color: '#3b82f6', hand: 'right' },
  'k': { finger: 'middle', color: '#3b82f6', hand: 'right' },
  ',': { finger: 'middle', color: '#3b82f6', hand: 'right' },
  '8': { finger: 'middle', color: '#3b82f6', hand: 'right' },
  'o': { finger: 'ring', color: '#a855f7', hand: 'right' },
  'l': { finger: 'ring', color: '#a855f7', hand: 'right' },
  '.': { finger: 'ring', color: '#a855f7', hand: 'right' },
  '9': { finger: 'ring', color: '#a855f7', hand: 'right' },
  'p': { finger: 'pinky', color: '#ff007f', hand: 'right' },
  ';': { finger: 'pinky', color: '#ff007f', hand: 'right' },
  '/': { finger: 'pinky', color: '#ff007f', hand: 'right' },
  '0': { finger: 'pinky', color: '#ff007f', hand: 'right' },
  '-': { finger: 'pinky', color: '#ff007f', hand: 'right' },
  '=': { finger: 'pinky', color: '#ff007f', hand: 'right' },
  '[': { finger: 'pinky', color: '#ff007f', hand: 'right' },
  ']': { finger: 'pinky', color: '#ff007f', hand: 'right' },
  '\\': { finger: 'pinky', color: '#ff007f', hand: 'right' },
};
