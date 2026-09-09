import React, { useState } from "react";
import { ArrowLeft, BookOpen, Volume2, Sparkles, CheckCircle2, Gauge } from "lucide-react";
import { VocabularyQuestion, DifficultyLevel } from "../types";

interface ReadingViewProps {
  originalText: string;
  vocabulary: VocabularyQuestion[];
  masteredWords: string[];
  difficulty?: DifficultyLevel;
  onBack: () => void;
}

export default function ReadingView({
  originalText,
  vocabulary,
  masteredWords,
  difficulty = "intermediate",
  onBack,
}: ReadingViewProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const masteredSet = new Set(masteredWords.map((w) => w.toLowerCase()));

  const difficultyMeta = {
    very_basic: { label: "Alla ord (Lätt➔Svår)", badge: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
    beginner: { label: "Nybörjare (A1–B1)", badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
    intermediate: { label: "Mellannivå (B1–B2)", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" },
    advanced: { label: "Avancerad (C1–C2)", badge: "bg-rose-500/10 text-rose-400 border-rose-500/30" }
  }[difficulty] || { label: "Mellannivå (B1–B2)", badge: "bg-amber-500/10 text-amber-400 border-amber-500/30" };

  const handleSpeakFullText = () => {
    try {
      const synth = window.speechSynthesis;
      if (!synth) return;

      if (isPlaying) {
        synth.cancel();
        setIsPlaying(false);
        return;
      }

      const utter = new SpeechSynthesisUtterance(originalText);
      utter.lang = "sv-SE";
      utter.rate = 0.9;
      utter.onend = () => setIsPlaying(false);
      utter.onerror = () => setIsPlaying(false);

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
      
      setIsPlaying(true);
      synth.speak(utter);
    } catch (e) {
      setIsPlaying(false);
    }
  };

  // Helper to highlight mastered or matched vocabulary words inside the Swedish text
  // We can do a basic string match highlight
  const renderHighlightedText = () => {
    if (!vocabulary || vocabulary.length === 0) return <p className="leading-relaxed whitespace-pre-line text-slate-200">{originalText}</p>;

    // Let's split by words and highlight words that are in our vocabulary list
    // To make it safe and not ruin the text layout, let's do a case-insensitive replacement with marking tags
    let tempText = originalText;
    
    // Sort vocabulary words by length descending so that we match longer phrases before shorter ones
    const sortedVocab = [...vocabulary].sort((a, b) => b.swedishWord.length - a.swedishWord.length);

    // Let's replace each word with a special token so we don't double replace
    const replacements: { [key: string]: { original: string; wordInfo: VocabularyQuestion } } = {};
    
    sortedVocab.forEach((item, index) => {
      const word = item.swedishWord;
      // Use regex to match the word with word boundaries, taking Swedish characters into account
      // Swedish characters: å, ä, ö, Å, Ä, Ö
      const escapedWord = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b(${escapedWord})\\b`, 'gi');
      
      tempText = tempText.replace(regex, (match) => {
        const token = `___VOCAB_TOKEN_${index}___`;
        replacements[token] = { original: match, wordInfo: item };
        return token;
      });
    });

    // Now split by the tokens and construct JSX elements
    const tokenRegex = /(___VOCAB_TOKEN_\d+___)/g;
    const parts = tempText.split(tokenRegex);

    return (
      <p className="leading-relaxed whitespace-pre-line text-slate-100 font-sans text-base">
        {parts.map((part, i) => {
          if (replacements[part]) {
            const { original, wordInfo } = replacements[part];
            const isMastered = masteredSet.has(wordInfo.swedishWord.toLowerCase());
            
            return (
              <span
                key={i}
                className={`inline-block px-1 rounded-md font-bold transition-all cursor-pointer border-b-2 ${
                  isMastered
                    ? "text-green-400 bg-green-950/20 border-green-500/30 hover:bg-green-900/30"
                    : "text-amber-400 bg-amber-950/20 border-amber-500/30 hover:bg-amber-900/30"
                }`}
                title={`${wordInfo.correctDefinition} - Click to see details`}
                onClick={() => {
                  alert(`🇸🇪 "${wordInfo.swedishWord}"\n🇬🇧 ${wordInfo.correctDefinition}\n\n💡 Explanation: ${wordInfo.contextualExplanation}`);
                }}
              >
                {original}
              </span>
            );
          }
          return <React.Fragment key={i}>{part}</React.Fragment>;
        })}
      </p>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header toolbar */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button
          id="reader-back-btn"
          onClick={() => {
            // Cancel speaking if playing
            window.speechSynthesis?.cancel();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit Reader</span>
        </button>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-1 rounded border ${difficultyMeta.badge}`}>
            {difficultyMeta.label}
          </span>
          <button
            id="speak-text-btn"
            onClick={handleSpeakFullText}
            className={`flex items-center gap-1.5 text-xs font-bold py-1.5 px-3 rounded-lg border transition-all cursor-pointer ${
              isPlaying
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 animate-pulse"
                : "bg-slate-900 text-green-400 border-slate-800 hover:border-slate-700"
            }`}
          >
            <Volume2 className="h-4 w-4" />
            <span>{isPlaying ? "Stop Audio" : "Listen (SE)"}</span>
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 sm:p-7 shadow-xl space-y-4">
        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold uppercase tracking-wider">
          <BookOpen className="h-3.5 w-3.5" />
          <span>Decrypted Reading Workspace</span>
        </div>

        {/* Highlight instructions helper */}
        <p className="text-[10px] text-slate-500 leading-normal italic">
          💡 Keywords highlighted in <span className="text-amber-400 font-bold">amber</span> and <span className="text-green-400 font-bold">green</span> are identified vocabulary targets. Tap on them for definitions and contextual translations.
        </p>

        {/* Text Container */}
        <div className="font-sans leading-relaxed tracking-wide text-slate-100 antialiased py-2 select-text">
          {renderHighlightedText()}
        </div>
      </div>

      {/* Glossary reference footer */}
      <div className="rounded-xl border border-slate-850 bg-slate-900/60 p-4 space-y-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4 w-4 text-green-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Translation Logs & Reference Key
          </span>
        </div>
        <div className="space-y-2">
          {vocabulary.map((vocab, index) => {
            const isMastered = masteredSet.has(vocab.swedishWord.toLowerCase());
            return (
              <div
                key={index}
                className="text-xs flex flex-col sm:flex-row sm:items-start justify-between border-t border-slate-800/60 pt-2 first:border-0 first:pt-0 gap-1"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-green-400">{vocab.swedishWord}</span>
                    <span className="text-slate-500">→</span>
                    <span className="font-semibold text-slate-200">{vocab.correctDefinition}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{vocab.contextualExplanation}</p>
                </div>
                <div className="shrink-0 pt-0.5 sm:pt-0">
                  {isMastered ? (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/15">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      <span>MASTERED</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/15">
                      <span>SOLVE IN GAME</span>
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
