/**
 * Core Types for CrackSvenska
 */

export type DifficultyLevel = "very_basic" | "beginner" | "intermediate" | "advanced";

export type WordDifficulty = "easy" | "medium" | "hard" | "very_basic" | "beginner" | "intermediate" | "advanced";

export interface VocabularyQuestion {
  swedishWord: string;
  correctDefinition: string;
  distractors: string[];
  contextualExplanation: string;
  difficulty?: WordDifficulty | string;
}

export interface UserProgress {
  dailyStreak: number;
  lastActiveDate: string; // "YYYY-MM-DD"
  cumulativeScore: number;
  masteredWords: string[]; // List of Swedish words the user mastered
  unlockedAchievements: string[]; // List of achievement IDs
  lastText: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  condition: string;
}

export type AppScreen = "dashboard" | "loading" | "gating" | "game" | "reading";
