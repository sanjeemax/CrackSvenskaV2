import React from "react";
import { Flame, Trophy, Award, Sparkles, CheckCircle } from "lucide-react";
import { UserProgress } from "../types";
import { APP_ACHIEVEMENTS } from "../data/achievements";

interface StatsPanelProps {
  progress: UserProgress;
}

export default function StatsPanel({ progress }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {/* Streak box */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
          <Flame className="h-6 w-6 animate-pulse" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Daily Streak</p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-black text-white">{progress.dailyStreak}</span>
            <span className="text-xs font-semibold text-slate-400">days</span>
          </div>
        </div>
      </div>

      {/* Cumulative Score box */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-green-400 border border-green-500/20">
          <Trophy className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Correct Answers</p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-black text-white">{progress.cumulativeScore}</span>
            <span className="text-xs font-semibold text-slate-400">solved</span>
          </div>
        </div>
      </div>

      {/* Mastered Vocabulary box */}
      <div className="flex items-center gap-3.5 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4 shadow-lg">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Master List</p>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-xl font-black text-white">{progress.masteredWords.length}</span>
            <span className="text-xs font-semibold text-slate-400">words</span>
          </div>
        </div>
      </div>

      {/* Achievements List Block */}
      <div className="sm:col-span-3 rounded-2xl border border-slate-850 bg-slate-950/40 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Cryptology Achievements
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">
            {progress.unlockedAchievements.length} / {APP_ACHIEVEMENTS.length} UNLOCKED
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {APP_ACHIEVEMENTS.map((ach) => {
            const isUnlocked = progress.unlockedAchievements.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`relative flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                  isUnlocked
                    ? "bg-slate-900/80 border-slate-800 text-slate-100"
                    : "bg-slate-950/60 border-slate-950 text-slate-600 opacity-60"
                }`}
                title={`${ach.title}: ${ach.description} (Goal: ${ach.condition})`}
              >
                <span className={`text-xl ${isUnlocked ? "filter-none" : "grayscale opacity-40"}`}>
                  {ach.emoji}
                </span>
                <div className="overflow-hidden">
                  <p className={`font-display text-xs font-bold leading-tight ${isUnlocked ? "text-white" : "text-slate-600"}`}>
                    {ach.title}
                  </p>
                  <p className="text-[9px] text-slate-500 truncate mt-0.5 leading-none">
                    {ach.description}
                  </p>
                </div>
                {isUnlocked && (
                  <span className="absolute top-1.5 right-1.5">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
