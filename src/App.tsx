/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Settings, ShieldAlert, BookOpen, Sparkles, RefreshCcw, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { AppScreen, UserProgress, VocabularyQuestion, DifficultyLevel } from "./types";
import { APP_ACHIEVEMENTS } from "./data/achievements";
import SettingsModal from "./components/SettingsModal";
import DashboardView from "./components/DashboardView";
import LoaderView from "./components/LoaderView";
import GatingView from "./components/GatingView";
import GameArenaView from "./components/GameArenaView";
import ReadingView from "./components/ReadingView";
import StatsPanel from "./components/StatsPanel";

const PROGRESS_STORAGE_KEY = "cracksvenska_progress_v1";
const API_KEY_STORAGE_KEY = "cracksvenska_api_key_v1";
const VOCABULARY_STORAGE_KEY = "cracksvenska_vocab_v1";
const DIFFICULTY_STORAGE_KEY = "cracksvenska_difficulty_v1";

const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getYesterdayDateString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  // State variables
  const [apiKey, setApiKey] = useState<string>("");
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("intermediate");
  const [progress, setProgress] = useState<UserProgress>({
    dailyStreak: 0,
    lastActiveDate: "",
    cumulativeScore: 0,
    masteredWords: [],
    unlockedAchievements: [],
    lastText: ""
  });
  const [screen, setScreen] = useState<AppScreen>("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const [vocabulary, setVocabulary] = useState<VocabularyQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Load configuration and statistics on mount
  useEffect(() => {
    // 1. Get saved API Key
    const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY) || "";
    setApiKey(savedKey);

    // 1b. Get saved difficulty level
    const savedDifficulty = localStorage.getItem(DIFFICULTY_STORAGE_KEY) as DifficultyLevel;
    if (savedDifficulty && ["very_basic", "beginner", "intermediate", "advanced"].includes(savedDifficulty)) {
      setDifficulty(savedDifficulty);
    }

    // 2. Get saved vocabulary
    const savedVocab = localStorage.getItem(VOCABULARY_STORAGE_KEY);
    if (savedVocab) {
      try {
        setVocabulary(JSON.parse(savedVocab));
      } catch (e) {
        console.error("Error loading cached vocabulary", e);
      }
    }

    // 3. Get progress logs
    const savedProgress = localStorage.getItem(PROGRESS_STORAGE_KEY);
    const todayStr = getTodayDateString();
    const yesterdayStr = getYesterdayDateString();

    if (savedProgress) {
      try {
        const parsed: UserProgress = JSON.parse(savedProgress);
        let updatedStreak = parsed.dailyStreak;
        let lastDate = parsed.lastActiveDate;

        if (lastDate !== todayStr) {
          if (lastDate === yesterdayStr) {
            // Consecutive login! Increment streak
            updatedStreak += 1;
          } else if (lastDate === "") {
            updatedStreak = 1;
          } else {
            // Streak broken! Reset to 1
            updatedStreak = 1;
          }
          lastDate = todayStr;
        }

        const newProgress = {
          ...parsed,
          dailyStreak: updatedStreak === 0 ? 1 : updatedStreak,
          lastActiveDate: lastDate
        };
        setProgress(newProgress);
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(newProgress));
        
        // Populate text if it exists
        if (newProgress.lastText) {
          setCurrentText(newProgress.lastText);
        }
      } catch (e) {
        console.error("Error parsing progress logs", e);
      }
    } else {
      // Create clean progress logs
      const initialProgress: UserProgress = {
        dailyStreak: 1,
        lastActiveDate: todayStr,
        cumulativeScore: 0,
        masteredWords: [],
        unlockedAchievements: [],
        lastText: ""
      };
      setProgress(initialProgress);
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(initialProgress));
    }
  }, []);

  // Save progress changes helper
  const saveProgress = (updated: Partial<UserProgress>) => {
    setProgress((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Check achievements after progress updates
  useEffect(() => {
    if (progress.dailyStreak === 0) return; // Wait for initialization

    const checkAndUnlock = () => {
      const achievementsToUnlock: string[] = [];

      // 1. First Crack
      if (progress.lastText && !progress.unlockedAchievements.includes("first_crack")) {
        achievementsToUnlock.push("first_crack");
      }
      // 2. Svenska Smasher (Master 10 words)
      if (progress.masteredWords.length >= 10 && !progress.unlockedAchievements.includes("svenska_smasher")) {
        achievementsToUnlock.push("svenska_smasher");
      }
      // 3. Streak Breaker (Streak >= 2 days)
      if (progress.dailyStreak >= 2 && !progress.unlockedAchievements.includes("streak_breaker")) {
        achievementsToUnlock.push("streak_breaker");
      }

      if (achievementsToUnlock.length > 0) {
        const nextUnlocked = [...progress.unlockedAchievements, ...achievementsToUnlock];
        saveProgress({ unlockedAchievements: nextUnlocked });

        // Show achievement notification for the first unlocked item
        const lastUnlocked = APP_ACHIEVEMENTS.find((a) => a.id === achievementsToUnlock[0]);
        if (lastUnlocked) {
          setActiveNotification(`${lastUnlocked.emoji} Achievement Unlocked: ${lastUnlocked.title}!`);
          setTimeout(() => {
            setActiveNotification(null);
          }, 3500);
        }
      }
    };

    checkAndUnlock();
  }, [progress.lastText, progress.masteredWords.length, progress.dailyStreak]);

  // Handle Save Key from Settings
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
  };

  // Call proxy server API to crack Swedish text
  const handleCrackSwedishText = async (text: string, chosenDifficulty?: DifficultyLevel) => {
    const activeDifficulty = chosenDifficulty || difficulty;
    setDifficulty(activeDifficulty);
    localStorage.setItem(DIFFICULTY_STORAGE_KEY, activeDifficulty);
    setError(null);
    setScreen("loading");
    setCurrentText(text);

    try {
      const response = await fetch("/api/crack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          customApiKey: apiKey, // Proxy will use this key if passed, otherwise fall back to server secret
          difficulty: activeDifficulty
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        let msg = data.error || "Failed to crack text. Please verify your settings.";
        try {
          const parsed = JSON.parse(msg);
          if (parsed?.error?.message) {
            msg = parsed.error.message;
          }
        } catch {
          // not JSON, keep original
        }
        if (msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE")) {
          msg = "The AI language decoder is currently experiencing temporary high demand. Please click 'Try Again' in a few seconds.";
        }
        throw new Error(msg);
      }

      const vocabList: VocabularyQuestion[] = data.vocabulary;
      if (!vocabList || !Array.isArray(vocabList)) {
        throw new Error("Invalid response format received from language decoder.");
      }

      setVocabulary(vocabList);
      localStorage.setItem(VOCABULARY_STORAGE_KEY, JSON.stringify(vocabList));

      // Check for Elite Cryptologist achievement if confidence starts high
      const masteredSet = new Set(progress.masteredWords.map((w) => w.toLowerCase()));
      const matches = vocabList.filter((item) => masteredSet.has(item.swedishWord.toLowerCase()));
      const initialScore = vocabList.length > 0 ? (matches.length / vocabList.length) * 100 : 100;

      const updatedAchievements = [...progress.unlockedAchievements];
      if (initialScore >= 80 && !updatedAchievements.includes("master_decoder")) {
        updatedAchievements.push("master_decoder");
        setActiveNotification("👑 Achievement Unlocked: Elite Cryptologist!");
        setTimeout(() => setActiveNotification(null), 3500);
      }

      // Update progress with last text
      saveProgress({
        lastText: text,
        unlockedAchievements: updatedAchievements
      });

      setScreen("gating");
    } catch (e: any) {
      console.error(e);
      setError(e.message || "An error occurred while cracking the Swedish text.");
      setScreen("dashboard");
    }
  };

  // Handle Game Completed
  const handleGameCompleted = (newlyMastered: string[]) => {
    // Add unique mastered words
    const uniqueMastered = [...progress.masteredWords];
    newlyMastered.forEach((word) => {
      if (!uniqueMastered.some((w) => w.toLowerCase() === word.toLowerCase())) {
        uniqueMastered.push(word);
      }
    });

    saveProgress({
      cumulativeScore: progress.cumulativeScore + newlyMastered.length,
      masteredWords: uniqueMastered
    });

    // Directly open in Reader
    setScreen("reading");
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-green-500/30 selection:text-green-300">
      {/* Visual background accents */}
      <div className="pointer-events-none fixed top-0 left-0 right-0 h-64 bg-gradient-to-b from-green-500/5 via-transparent to-transparent" />
      <div className="pointer-events-none fixed -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-amber-500/5 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-green-500/5 blur-3xl" />

      {/* Main viewport-wrapped container mimicking high-end iOS layout */}
      <div className="mx-auto flex min-h-screen max-w-md flex-col bg-slate-900 border-x border-slate-850 shadow-2xl relative pt-6">
        
        {/* Device Notch decoration */}
        <div className="absolute top-0 left-0 right-0 h-6 flex justify-center items-start pointer-events-none z-50">
          <div className="w-32 h-4.5 bg-slate-800 rounded-b-2xl border-x border-b border-slate-700/40"></div>
        </div>
        
        {/* Sticky Header */}
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-850 bg-slate-900/90 px-4 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 border border-green-500/20 shadow-md">
              <span className="text-sm font-black text-green-400">SV</span>
            </div>
            <div>
              <h1 className="font-display text-lg font-black tracking-tight text-white flex items-center gap-1">
                CrackSvenska <span className="text-green-400 glow-green text-sm">⚡</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Learn Swedish with play & fun</p>
            </div>
          </div>
          <button
            id="open-settings-btn"
            onClick={() => setIsSettingsOpen(true)}
            className="rounded-xl bg-slate-950 p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white border border-slate-800 shadow-inner"
            title="Open Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </header>

        {/* Global Achievement notifications */}
        <AnimatePresence>
          {activeNotification && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-18 left-4 right-4 z-50 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 p-3.5 text-center text-xs font-black uppercase tracking-wider text-slate-950 shadow-xl shadow-amber-500/20"
            >
              {activeNotification}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scrollable Container with responsive height/padding */}
        <main className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
          {error && (
            <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 space-y-3">
              <div className="flex items-start gap-2.5">
                <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1 flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-rose-400 leading-none">Security Decryption Notice</h4>
                  <p className="text-xs text-rose-300/90 leading-relaxed break-words">{error}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                {currentText && (
                  <button
                    id="retry-decryption-btn"
                    onClick={() => handleCrackSwedishText(currentText, difficulty)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-900 hover:text-black transition-all bg-green-400 hover:bg-green-300 px-3 py-1.5 rounded-lg font-mono active:scale-95 cursor-pointer shadow-sm"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    <span>Try Again</span>
                  </button>
                )}
                <button
                  id="dismiss-error-btn"
                  onClick={() => setError(null)}
                  className="text-xs font-bold text-slate-400 hover:text-white transition-colors bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Screen Switcher */}
          {screen === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Widget */}
              <StatsPanel progress={progress} />

              <div className="space-y-1 bg-slate-950/40 p-4 rounded-2xl border border-slate-850">
                <div className="flex items-center gap-1.5 mb-1">
                  <Info className="h-4 w-4 text-green-400" />
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Ready to Decode?</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Input a Swedish newspaper snippet, essay, or email logs. The decoder will extract key vocabularies and set up your comprehension gate.
                </p>
              </div>

              {/* Main Dashboard Panel */}
              <DashboardView
                onCrackText={handleCrackSwedishText}
                isLoading={false}
                lastText={currentText}
                selectedDifficulty={difficulty}
                onDifficultyChange={(newDiff) => {
                  setDifficulty(newDiff);
                  localStorage.setItem(DIFFICULTY_STORAGE_KEY, newDiff);
                }}
              />
            </div>
          )}

          {screen === "loading" && <LoaderView />}

          {screen === "gating" && (
            <GatingView
              vocabulary={vocabulary}
              masteredWords={progress.masteredWords}
              difficulty={difficulty}
              onStartReading={() => setScreen("reading")}
              onStartGame={() => setScreen("game")}
              onBack={() => setScreen("dashboard")}
            />
          )}

          {screen === "game" && (
            <GameArenaView
              vocabulary={vocabulary}
              difficulty={difficulty}
              onGameCompleted={handleGameCompleted}
              onExit={() => setScreen("gating")}
            />
          )}

          {screen === "reading" && (
            <ReadingView
              originalText={currentText}
              vocabulary={vocabulary}
              masteredWords={progress.masteredWords}
              difficulty={difficulty}
              onBack={() => setScreen("dashboard")}
            />
          )}
        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-850 bg-slate-950/60 px-4 py-4 text-center">
          <p className="text-[10px] font-mono text-slate-500">
            CRACKSVENSKA ⚡ SERVER DECODING ACTIVE
          </p>
          <div className="flex justify-center gap-2 mt-1">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-mono text-slate-600">ONLINE</span>
          </div>
        </footer>

        {/* Secure Settings Gear Overlay */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          savedKey={apiKey}
          onSaveKey={handleSaveApiKey}
        />
      </div>
    </div>
  );
}
