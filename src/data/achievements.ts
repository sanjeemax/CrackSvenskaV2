import { Achievement } from "../types";

export const APP_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_crack",
    title: "First Crack",
    description: "Successfully processed your first Swedish text",
    emoji: "⚡",
    condition: "Crack 1 text"
  },
  {
    id: "svenska_smasher",
    title: "Svenska Smasher",
    description: "Added 10 or more Swedish words to your vocabulary master list",
    emoji: "🇸🇪",
    condition: "Master 10 words"
  },
  {
    id: "streak_breaker",
    title: "Codebreaker Streak",
    description: "Kept the daily training streak active for 2+ consecutive days",
    emoji: "🔥",
    condition: "Streak >= 2 days"
  },
  {
    id: "master_decoder",
    title: "Elite Cryptologist",
    description: "Successfully cracked a text and hit over 80% reading confidence",
    emoji: "👑",
    condition: "High confidence read"
  }
];
