import React, { useState, useEffect } from "react";
import { Sparkles, ArrowRight, CheckCircle, AlertTriangle, BookOpen, Volume2, Gauge } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { VocabularyQuestion, DifficultyLevel } from "../types";

interface GameArenaViewProps {
  vocabulary: VocabularyQuestion[];
  difficulty?: DifficultyLevel;
  onGameCompleted: (newlyMasteredWords: string[]) => void;
  onExit: () => void;
}

export default function GameArenaView({
  vocabulary,
  difficulty = "intermediate",
  onGameCompleted,
  onExit,
}: GameArenaViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [sessionMastered, setSessionMastered] = useState<string[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = vocabulary[currentIndex];

  const difficultyMeta = {
    very_basic: { label: "Alla ord (Lätt➔Svår)", badge: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
    beginner: { label: "Nybörjare (A1–B1)", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    intermediate: { label: "Mellannivå (B1–B2)", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    advanced: { label: "Avancerad (C1–C2)", badge: "bg-rose-500/10 text-rose-400 border-rose-500/30" }
  }[difficulty] || { label: "Mellannivå (B1–B2)", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" };

  // Prepare options when current question changes
  useEffect(() => {
    if (currentQuestion) {
      const allOptions = [
        currentQuestion.correctDefinition,
        ...currentQuestion.distractors
      ];
      // Fisher-Yates shuffle
      const shuffled = [...allOptions];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      setShuffledOptions(shuffled);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentIndex, currentQuestion]);

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return; // Allow only one selection per card
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === currentQuestion.correctDefinition;
    if (isCorrect) {
      setSessionScore((prev) => prev + 1);
      setSessionMastered((prev) => [...prev, currentQuestion.swedishWord]);
      // Play a quick satisfying tap/beep if desired (using Web Audio API)
      playAudioBeep(true);
    } else {
      playAudioBeep(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleComplete = () => {
    onGameCompleted(sessionMastered);
  };

  // Web Audio API feedback
  const playAudioBeep = (isSuccess: boolean) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
        setTimeout(() => {
          ctx.close().catch(() => {});
        }, 300);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(147, ctx.currentTime + 0.1); // D3
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
        setTimeout(() => {
          ctx.close().catch(() => {});
        }, 350);
      }
    } catch (e) {
      // Ignored if browser blocks AudioContext before interaction
    }
  };

  // Speak Swedish Word
  const speakSwedishWord = (word: string) => {
    try {
      const synth = window.speechSynthesis;
      if (synth) {
        // Cancel any pending/active speech to keep feedback responsive and prevent overlays
        synth.cancel();

        const utter = new SpeechSynthesisUtterance(word);
        utter.lang = "sv-SE";
        utter.rate = 0.85;

        const voices = synth.getVoices();
        const swedishVoices = voices.filter((v) =>
          v.lang.toLowerCase().replace("_", "-").startsWith("sv")
        );

        if (swedishVoices.length > 0) {
          const preferredName = localStorage.getItem("cracksvenska_preferred_voice_v1");
          const preferredVoice = swedishVoices.find((v) => v.name === preferredName);

          if (preferredVoice) {
            utter.voice = preferredVoice;
          } else {
            // Find high-quality neural, online, or premium voices
            const findWithKeywords = (keywords: string[]) => {
              return swedishVoices.find((v) => {
                const name = v.name.toLowerCase();
                return keywords.some((kw) => name.includes(kw));
              });
            };

            const bestVoice =
              findWithKeywords(["natural", "neural"]) ||
              findWithKeywords(["online"]) ||
              findWithKeywords(["google"]) ||
              findWithKeywords(["premium", "enhanced", "siri", "alva", "oskar"]) ||
              swedishVoices.find((v) => v.default) ||
              swedishVoices[0];

            if (bestVoice) {
              utter.voice = bestVoice;
            }
          }
        }

        synth.speak(utter);
      }
    } catch (e) {
      // Speech synthesis unsupported or blocked
    }
  };

  if (isFinished) {
    const accuracy = Math.round((sessionScore / vocabulary.length) * 100);
    return (
      <div className="space-y-6 text-center py-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <Sparkles className="h-8 w-8 glow-amber animate-bounce" />
        </div>

        <div className="space-y-1">
          <h3 className="font-display text-2xl font-black text-white uppercase tracking-wider">
            Svenska Arena Clear!
          </h3>
          <p className="text-sm text-slate-400">
            You processed and practiced the key language logs
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-2xl font-black text-green-400 font-display">
              {sessionScore}/{vocabulary.length}
            </span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">
              Accuracy
            </p>
          </div>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-2xl font-black text-amber-400 font-display">
              {accuracy}%
            </span>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">
              Code Decoded
            </p>
          </div>
        </div>

        {/* Mastered list block */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-850 max-w-sm mx-auto space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-left">
            Newly Mastered Swedish Log ({sessionMastered.length})
          </p>
          <div className="flex flex-wrap gap-1.5 justify-start">
            {sessionMastered.length === 0 ? (
              <span className="text-xs text-slate-500">None this round. Try again to lock them in!</span>
            ) : (
              sessionMastered.map((word, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-semibold bg-slate-950 text-green-400 border border-green-500/20 rounded-lg font-mono"
                >
                  {word}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2.5 pt-4">
          <button
            id="finish-and-read-btn"
            onClick={handleComplete}
            className="w-full max-w-sm rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 py-3.5 font-display text-sm font-black uppercase tracking-wider text-slate-950 shadow-xl transition-all hover:brightness-110 active:scale-[0.98] inline-flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Reader</span>
            <BookOpen className="h-4 w-4" />
          </button>
          
          <button
            id="abort-arena-btn-finished"
            onClick={onExit}
            className="block mx-auto text-xs font-bold text-slate-500 hover:text-slate-300 transition-colors py-1"
          >
            Go back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Progress Header */}
      <div className="flex items-center justify-between bg-slate-950 px-4 py-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">
            DECK: <span className="text-green-400 font-bold">{currentIndex + 1}</span>/<span className="text-slate-400 font-bold">{vocabulary.length}</span>
          </span>
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${difficultyMeta.badge}`}>
            {difficultyMeta.label}
          </span>
        </div>
        <button
          id="exit-game-arena-btn"
          onClick={onExit}
          className="text-xs font-bold text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
        >
          Exit Game
        </button>
      </div>

      {/* Swedish Word Card */}
      <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-4 shadow-xl">
        <div className="absolute top-4 right-4">
          <button
            id="speak-swedish-btn"
            onClick={() => speakSwedishWord(currentQuestion.swedishWord)}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-green-400 transition-colors cursor-pointer"
            title="Hear Pronunciation"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        </div>

        <div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-black">
              Swedish Vocabulary Log
            </span>
            {currentQuestion.difficulty && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : currentQuestion.difficulty === 'hard'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {currentQuestion.difficulty === 'easy' ? '🌱 Lätt' : currentQuestion.difficulty === 'hard' ? '🔥 Svårt' : '⚡ Medel'}
              </span>
            )}
          </div>
          <h2 className="font-display text-3xl font-extrabold text-white glow-green tracking-tight">
            {currentQuestion.swedishWord}
          </h2>
        </div>
      </div>

      {/* Multiple Choice Options Grid */}
      <div className="space-y-2.5">
        {shuffledOptions.map((option, i) => {
          const isSelected = selectedOption === option;
          const isCorrect = option === currentQuestion.correctDefinition;
          const optionLetters = ["A", "B", "C", "D"];
          const letter = optionLetters[i] || String(i + 1);

          // Styling overrides depending on state
          let optionStyle = "border-slate-800 bg-slate-950 hover:bg-slate-900/70 text-slate-200 hover:border-slate-700";
          let badgeStyle = "bg-slate-900 text-slate-400 border-slate-800";
          
          if (isAnswered) {
            if (isCorrect) {
              // Highlight correct green always
              optionStyle = "border-green-500/60 bg-green-500/10 text-green-300 font-bold";
              badgeStyle = "bg-green-500/20 text-green-400 border-green-500/40";
            } else if (isSelected) {
              // Red for incorrect selected
              optionStyle = "border-rose-500/60 bg-rose-500/10 text-rose-300 font-bold";
              badgeStyle = "bg-rose-500/20 text-rose-400 border-rose-500/40";
            } else {
              // Fade others
              optionStyle = "border-slate-900 bg-slate-950/40 text-slate-500 opacity-50";
              badgeStyle = "bg-slate-950 text-slate-700 border-slate-900";
            }
          }

          return (
            <button
              key={i}
              id={`option-choice-btn-${i}`}
              onClick={() => handleOptionSelect(option)}
              disabled={isAnswered}
              className={`w-full p-3.5 sm:p-4 rounded-xl text-left text-sm transition-all border font-semibold active:scale-[0.99] disabled:active:scale-100 flex items-center justify-between gap-3 min-h-[54px] cursor-pointer ${optionStyle}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-xs font-mono font-bold ${badgeStyle}`}>
                  {letter}
                </span>
                <span className="flex-1 leading-snug break-words">{option}</span>
              </div>
              {isAnswered && isCorrect && (
                <span className="text-green-400 text-xs font-black shrink-0">✔ CORRECT</span>
              )}
              {isAnswered && isSelected && !isCorrect && (
                <span className="text-rose-400 text-xs font-black shrink-0">✘ WRONG</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Post-selection feedback & Context panel */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
          >
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {selectedOption === currentQuestion.correctDefinition ? (
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span>Success +10 XP</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Mismatched Log</span>
                </div>
              )}
            </div>

            {/* Explanation text */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                Context Decoding
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentQuestion.contextualExplanation}
              </p>
            </div>

            {/* Advancing Action */}
            <button
              id="next-question-btn"
              onClick={handleNext}
              className="w-full mt-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-750 text-xs font-bold text-white py-2.5 flex items-center justify-center gap-1 transition-colors"
            >
              <span>{currentIndex === vocabulary.length - 1 ? "Finish Quiz 🏁" : "Next Word"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
