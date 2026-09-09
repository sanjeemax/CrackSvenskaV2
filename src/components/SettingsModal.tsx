import React, { useState, useEffect } from "react";
import { X, Key, ShieldAlert, CheckCircle2, Volume2, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedKey: string;
  onSaveKey: (key: string) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  savedKey,
  onSaveKey,
}: SettingsModalProps) {
  const [keyInput, setKeyInput] = useState(savedKey);
  const [showStatus, setShowStatus] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const allVoices = window.speechSynthesis.getVoices();
        const swedish = allVoices.filter((v) =>
          v.lang.toLowerCase().replace("_", "-").startsWith("sv")
        );
        setVoices(swedish);

        const savedVoice = localStorage.getItem("cracksvenska_preferred_voice_v1") || "";
        // If there's a saved voice, use it, otherwise try to select a smart default
        if (savedVoice && swedish.some(v => v.name === savedVoice)) {
          setSelectedVoiceName(savedVoice);
        } else if (swedish.length > 0) {
          const smartDefault = getBestSwedishVoiceFallback(swedish);
          if (smartDefault) {
            setSelectedVoiceName(smartDefault.name);
            localStorage.setItem("cracksvenska_preferred_voice_v1", smartDefault.name);
          }
        }
      }
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [isOpen]);

  const getBestSwedishVoiceFallback = (swedishVoices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null => {
    if (swedishVoices.length === 0) return null;
    
    const findWithKeywords = (keywords: string[]) => {
      return swedishVoices.find(v => {
        const name = v.name.toLowerCase();
        return keywords.some(kw => name.includes(kw));
      });
    };

    return (
      findWithKeywords(["natural", "neural"]) ||
      findWithKeywords(["online"]) ||
      findWithKeywords(["google"]) ||
      findWithKeywords(["premium", "enhanced", "siri", "alva", "oskar"]) ||
      swedishVoices.find(v => v.default) ||
      swedishVoices[0]
    );
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedVoiceName(name);
    localStorage.setItem("cracksvenska_preferred_voice_v1", name);
  };

  const handleTestVoice = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance("Hej! Vad kul att vi lär oss svenska tillsammans.");
      utter.lang = "sv-SE";
      utter.rate = 0.85;

      const allVoices = window.speechSynthesis.getVoices();
      const voice = allVoices.find((v) => v.name === selectedVoiceName);
      if (voice) {
        utter.voice = voice;
      } else {
        const best = getBestSwedishVoiceFallback(allVoices);
        if (best) utter.voice = best;
      }
      window.speechSynthesis.speak(utter);
    }
  };

  const handleSave = () => {
    onSaveKey(keyInput.trim());
    setShowStatus(true);
    setTimeout(() => {
      setShowStatus(false);
      onClose();
    }, 1500);
  };

  const handleClear = () => {
    setKeyInput("");
    onSaveKey("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="settings-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Key className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold tracking-tight text-white">
                    Decryption Settings
                  </h3>
                  <p className="text-xs text-slate-400">Manage your language cracking keys</p>
                </div>
              </div>
              <button
                id="close-settings-btn"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block font-display text-sm font-semibold text-slate-300">
                  Enter Gemini API Key
                </label>
                <div className="relative">
                  <input
                    id="gemini-api-key-input"
                    type="password"
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none focus:no-zoom"
                    style={{ fontSize: "16px" }} // Prevent Safari auto-zoom on mobile inputs
                  />
                </div>
              </div>

              {/* Voice Settings Section */}
              <div className="border-t border-slate-800/80 pt-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                    <Volume2 className="h-4 w-4 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-green-400">
                      Swedish Speaker Accent
                    </h4>
                    <p className="text-[10px] text-slate-400">Choose a high-quality or natural Swedish voice</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {voices.length === 0 ? (
                    <div className="rounded-xl bg-slate-950/40 p-3 border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed space-y-1.5">
                      <p className="text-amber-400 font-medium flex items-center gap-1">
                        ⚠️ No native Swedish voices found on this browser.
                      </p>
                      <p className="text-slate-500">
                        The app will default to a fallback speaker. For high-fidelity natural Swedish voices, we highly recommend using <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong>.
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <select
                        id="swedish-voice-select"
                        value={selectedVoiceName}
                        onChange={handleVoiceChange}
                        className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-xs text-slate-100 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none focus:no-zoom"
                      >
                        {voices.map((voice) => (
                          <option key={voice.name} value={voice.name}>
                            {voice.name.replace("Microsoft ", "").replace("Google ", "")} {voice.localService ? "(Offline)" : "(Natural)"}
                          </option>
                        ))}
                      </select>

                      <button
                        id="test-voice-btn"
                        onClick={handleTestVoice}
                        className="rounded-xl border border-slate-700 bg-slate-950/60 px-3.5 text-xs font-bold text-slate-300 hover:bg-slate-800 transition-all hover:text-white flex items-center justify-center gap-1 active:scale-95 shrink-0"
                        title="Test Swedish speech"
                      >
                        <span>Test 🔊</span>
                      </button>
                    </div>
                  )}

                  {voices.length > 0 && (
                    <div className="flex items-start gap-1.5 p-2.5 bg-slate-950/30 rounded-xl border border-slate-800/40">
                      <Info className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                      <p className="text-[10px] text-slate-400 leading-normal">
                        For the best experience, look for voices labeled with <strong className="text-green-400 font-bold">"(Natural)"</strong>, <strong className="text-green-400 font-bold">"Online"</strong>, or macOS/iOS <strong className="text-green-400 font-bold">"Alva Premium"</strong>.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Notice block */}
              <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800 space-y-3">
                <div className="flex items-start gap-2.5">
                  <ShieldAlert className="h-4 w-4 mt-0.5 text-amber-500 shrink-0" />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Your key is saved **locally in your browser** (`localStorage`) and is never sent anywhere else.
                    It is processed on our secure environment to parse articles and quiz structures.
                  </p>
                </div>
                
                <div className="border-t border-slate-800/80 pt-2.5 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">
                    How to get a free API Key:
                  </span>
                  <ol className="text-[11px] text-slate-400 list-decimal pl-4 space-y-1">
                    <li>
                      Go to{" "}
                      <a
                        href="https://aistudio.google.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-green-400 font-bold underline hover:text-green-300"
                      >
                        Google AI Studio
                      </a>
                    </li>
                    <li>Sign in with your Google account.</li>
                    <li>Click the prominent <strong className="text-white">"Get API key"</strong> button at the top left.</li>
                    <li>Create an API Key in a new or existing project and copy it.</li>
                  </ol>
                </div>
              </div>

              {/* Status or Actions */}
              {showStatus ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-green-500/10 py-3 text-sm font-medium text-green-400 border border-green-500/20">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Key saved securely!</span>
                </div>
              ) : (
                <div className="flex gap-2.5 pt-2">
                  {savedKey && (
                    <button
                      id="clear-settings-btn"
                      onClick={handleClear}
                      className="flex-1 rounded-xl border border-rose-500/30 bg-rose-500/10 py-3 text-sm font-semibold text-rose-400 transition-colors hover:bg-rose-500/20"
                    >
                      Remove Key
                    </button>
                  )}
                  <button
                    id="save-settings-btn"
                    onClick={handleSave}
                    disabled={!keyInput.trim()}
                    className="flex-[2] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Key
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
