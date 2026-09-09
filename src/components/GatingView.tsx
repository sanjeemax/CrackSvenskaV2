import React from "react";
import { ShieldCheck, Flame, BookOpen, ChevronRight, Lock, CheckCircle2, ArrowLeft, Gauge } from "lucide-react";
import { motion } from "motion/react";
import { VocabularyQuestion, DifficultyLevel } from "../types";

interface GatingViewProps {
  vocabulary: VocabularyQuestion[];
  masteredWords: string[];
  difficulty?: DifficultyLevel;
  onStartReading: () => void;
  onStartGame: () => void;
  onBack: () => void;
}

export default function GatingView({
  vocabulary,
  masteredWords,
  difficulty = "intermediate",
  onStartReading,
  onStartGame,
  onBack,
}: GatingViewProps) {
  // Normalize comparison
  const masteredSet = new Set(masteredWords.map((w) => w.toLowerCase()));
  const matches = vocabulary.filter((item) => masteredSet.has(item.swedishWord.toLowerCase()));
  
  const totalCount = vocabulary.length || 1;
  const matchCount = matches.length;
  const confidenceScore = Math.round((matchCount / totalCount) * 100);

  const difficultyMeta = {
    very_basic: { label: "Alla ord (Lätt➔Svår)", badge: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
    beginner: { label: "Nybörjare (A1–B1)", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    intermediate: { label: "Mellannivå (B1–B2)", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    advanced: { label: "Avancerad (C1–C2)", badge: "bg-rose-500/10 text-rose-400 border-rose-500/30" }
  }[difficulty] || { label: "Mellannivå (B1–B2)", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" };

  // Gating evaluation
  let levelColor = "text-rose-500 bg-rose-500/10 border-rose-500/30";
  let gaugeColor = "#f43f5e"; // Rose
  let ratingText = "High Friction Threshold";
  let description = "You are missing key vocabulary in this text. It is highly recommended to practice first!";

  if (confidenceScore > 80) {
    levelColor = "text-green-400 bg-green-500/10 border-green-500/30";
    gaugeColor = "#22c55e"; // Green
    ratingText = "Code Cracked - Ready to Read!";
    description = "Excellent! You already master almost all of the key words in this text.";
  } else if (confidenceScore >= 50) {
    levelColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
    gaugeColor = "#f59e0b"; // Amber
    ratingText = "Caution! Gaps Detected";
    description = "You know some words, but you will experience friction. Boost confidence to guarantee smooth reading!";
  }

  // Radial configurations for SVG gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidenceScore / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        id="gating-back-btn"
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors py-1 cursor-pointer"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Back to Editor</span>
      </button>

      {/* Header Info */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-950 border border-slate-800">
          <Gauge className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-slate-400">Hardness:</span>
          <span className={`px-1.5 py-0.5 rounded text-[10px] border ${difficultyMeta.badge}`}>
            {difficultyMeta.label}
          </span>
        </div>
        <h3 className="font-display text-xl font-black text-white">
          Vocabulary Security Scan
        </h3>
        <p className="text-xs text-slate-400">
          Comparing {vocabulary.length} key Swedish terms against your mastery record
        </p>
      </div>

      {/* Visual Radial Gauge */}
      <div className="flex flex-col items-center justify-center py-4 bg-slate-950/60 rounded-2xl border border-slate-800 p-6">
        <div className="relative flex items-center justify-center h-32 w-32">
          {/* SVG Ring */}
          <svg className="absolute transform -rotate-90 w-full h-full">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className="stroke-slate-800"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="64"
              cy="64"
              r={radius}
              className="transition-all duration-1000"
              stroke={gaugeColor}
              strokeWidth="10"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          {/* Centered Percentage */}
          <div className="text-center z-10">
            <span className="font-display text-3xl font-black text-white leading-none">
              {confidenceScore}%
            </span>
            <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5 tracking-wider">
              Confidence
            </p>
          </div>
        </div>

        {/* Rating Gating Display */}
        <div className="mt-5 text-center space-y-1 max-w-xs">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${levelColor}`}>
            {ratingText}
          </span>
          <p className="text-xs text-slate-300 pt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Action Choices */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Game Boost Arena - Primary */}
        <button
          id="boost-confidence-btn"
          onClick={onStartGame}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 border border-amber-400 shadow-lg shadow-amber-500/10 hover:brightness-110 active:scale-[0.98] transition-all text-center group"
        >
          <div className="rounded-full bg-slate-950/15 p-2 mb-2">
            <Flame className="h-5 w-5 text-slate-950 animate-pulse" />
          </div>
          <span className="font-display text-sm font-black uppercase tracking-wider">
            Boost Confidence
          </span>
          <span className="text-[10px] font-medium text-slate-900 opacity-80 mt-0.5">
            Play Game Arena ({vocabulary.length} Words)
          </span>
        </button>

        {/* Read Article Anyway - Secondary */}
        <button
          id="read-anyway-btn"
          onClick={onStartReading}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-900 text-slate-100 border border-slate-800 hover:border-slate-700 active:scale-[0.98] transition-all text-center group"
        >
          <div className="rounded-full bg-slate-800 p-2 mb-2 text-green-400">
            <BookOpen className="h-5 w-5 group-hover:scale-110 transition-transform" />
          </div>
          <span className="font-display text-sm font-black uppercase tracking-wider text-white">
            Read Text Anyway
          </span>
          <span className="text-[10px] font-medium text-slate-400 mt-0.5">
            Skip study and open translation reader
          </span>
        </button>
      </div>

      {/* Detected Vocabulary list */}
      <div className="space-y-2.5">
        <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">
          Detected Key Vocabulary ({vocabulary.length})
        </h4>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {vocabulary.map((item, idx) => {
            const isMastered = masteredSet.has(item.swedishWord.toLowerCase());
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-green-400 glow-green">
                      {item.swedishWord}
                    </span>
                    {item.difficulty && (
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        item.difficulty === 'easy'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : item.difficulty === 'hard'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}>
                        {item.difficulty === 'easy' ? 'Lätt' : item.difficulty === 'hard' ? 'Svårt' : 'Medel'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                    {item.correctDefinition}
                  </p>
                </div>
                <div>
                  {isMastered ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>MASTERED</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                      <Lock className="h-3 w-3" />
                      <span>UNSOLVED</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
