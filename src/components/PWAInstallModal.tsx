import React, { useState } from "react";
import { X, Share, PlusSquare, Smartphone, CheckCircle, Copy, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { usePWAInstall } from "../usePWAInstall";

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PWAInstallModal({ isOpen, onClose }: PWAInstallModalProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);

  const getCleanAppUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.origin;
    }
    return "";
  };

  const handleCopyLink = async () => {
    const url = getCleanAppUrl();
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error("Failed to copy URL", err);
      }
    }
  };

  const handleDirectInstall = async () => {
    const success = await install();
    if (success) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="pwa-install-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.35 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 shadow-inner">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                    Install on iPhone / Mobile
                    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-mono font-bold border border-green-500/30">
                      PWA
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">Run full-screen without Safari browser bars</p>
                </div>
              </div>
              <button
                id="close-pwa-modal-btn"
                onClick={onClose}
                className="rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="mt-5 space-y-4">
              {isInstalled ? (
                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-center space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20 text-green-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <h4 className="font-display text-base font-bold text-green-300">
                    Already Running as Standalone App!
                  </h4>
                  <p className="text-xs text-slate-300">
                    CrackSvenska is successfully installed and launched directly from your home screen.
                  </p>
                </div>
              ) : (
                <>
                  {/* Native Prompt Option (if available on Android/Chrome) */}
                  {isInstallable && (
                    <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-400 animate-pulse" />
                        <span className="text-xs font-bold text-green-300 uppercase tracking-wider font-mono">
                          Instant One-Tap Install Ready
                        </span>
                      </div>
                      <button
                        id="pwa-direct-install-btn"
                        onClick={handleDirectInstall}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-400 hover:bg-green-300 text-slate-950 font-black py-3 text-sm transition-all shadow-lg active:scale-95 cursor-pointer"
                      >
                        <Smartphone className="h-4 w-4" />
                        Install CrackSvenska Now
                      </button>
                    </div>
                  )}

                  {/* iOS Safari Steps (The primary way iPhone installs PWAs) */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                        {isIOS ? "How to install on your iPhone:" : "iPhone / iPad Safari Instructions:"}
                      </span>
                      <span className="text-[10px] text-slate-500">Apple WebKit</span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      {/* Step 1 */}
                      <div className="flex items-start gap-3 rounded-xl bg-slate-950/70 p-3.5 border border-slate-800/80">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-xs">
                          1
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-200">
                            Open this page in <strong className="text-white">Safari</strong>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Make sure you are browsing in Apple Safari (Chrome/Firefox on iOS cannot add icons to the Home Screen).
                          </p>
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="flex items-start gap-3 rounded-xl bg-slate-950/70 p-3.5 border border-slate-800/80">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-xs">
                          2
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                            Tap the <strong className="text-white">Share</strong> button
                            <span className="inline-flex items-center justify-center p-1 rounded bg-slate-800 text-sky-400 border border-slate-700">
                              <Share className="h-3.5 w-3.5" />
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Located in Safari's bottom navigation toolbar (or top right on iPad).
                          </p>
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="flex items-start gap-3 rounded-xl bg-slate-950/70 p-3.5 border border-slate-800/80">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-xs">
                          3
                        </div>
                        <div className="space-y-0.5 flex-1">
                          <p className="font-semibold text-slate-200 flex items-center gap-1.5">
                            Scroll down & tap <strong className="text-white">"Add to Home Screen"</strong>
                            <span className="inline-flex items-center justify-center p-1 rounded bg-slate-800 text-amber-400 border border-slate-700">
                              <PlusSquare className="h-3.5 w-3.5" />
                            </span>
                          </p>
                          <p className="text-[11px] text-slate-400">
                            In Swedish iOS, this is labeled <span className="text-slate-300 font-medium">"Lägg till på hemskärmen"</span>.
                          </p>
                        </div>
                      </div>

                      {/* Step 4 */}
                      <div className="flex items-start gap-3 rounded-xl bg-slate-950/70 p-3.5 border border-slate-800/80">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-mono font-bold text-xs">
                          4
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-semibold text-slate-200">
                            Tap <strong className="text-white">"Add"</strong> in top-right corner
                          </p>
                          <p className="text-[11px] text-slate-400">
                            The CrackSvenska icon will appear on your iPhone home screen and launch in full-screen native mode!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Copy Link helper for when user is testing on desktop/laptop */}
                  <div className="rounded-2xl bg-slate-950/40 p-3.5 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">App URL to open on iPhone Safari:</span>
                      <button
                        onClick={handleCopyLink}
                        className="flex items-center gap-1 text-green-400 hover:text-green-300 font-bold transition-colors cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/70 font-mono text-[11px] text-slate-300 truncate select-all">
                      {getCleanAppUrl() || window.location.href}
                    </div>
                  </div>
                </>
              )}

              {/* Close Button */}
              <button
                id="pwa-guide-done-btn"
                onClick={onClose}
                className="w-full rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold py-3 text-xs transition-colors cursor-pointer"
              >
                Got It, Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
