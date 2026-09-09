import React, { useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { usePWAInstall } from "../usePWAInstall";
import PWAInstallModal from "./PWAInstallModal";

interface PWAInstallButtonProps {
  variant?: "header" | "card" | "settings";
}

export default function PWAInstallButton({ variant = "header" }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // If already installed and running standalone, hide or show minimal badge
  if (isInstalled) {
    if (variant === "settings") {
      return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-green-500/20">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-green-400" />
            <span className="text-xs font-semibold text-slate-200">Installed as PWA</span>
          </div>
          <span className="text-[10px] font-mono text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full font-bold border border-green-500/30">
            Active
          </span>
        </div>
      );
    }
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setIsModalOpen(true);
      }
    } else {
      setIsModalOpen(true);
    }
  };

  if (variant === "header") {
    return (
      <>
        <button
          id="header-install-pwa-btn"
          onClick={handleClick}
          className="flex items-center gap-1.5 rounded-xl bg-green-500/15 hover:bg-green-500/25 px-2.5 py-1.5 text-xs font-bold text-green-400 border border-green-500/30 transition-all active:scale-95 cursor-pointer shadow-sm"
          title="Install CrackSvenska onto iPhone or Home Screen"
        >
          <Smartphone className="h-3.5 w-3.5 text-green-400" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </button>

        <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  if (variant === "card") {
    return (
      <>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-500">
                PWA Home Screen
              </span>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-green-400" />
                Install on iPhone / Mobile
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Add CrackSvenska directly to your iOS Home Screen to run full-screen like a native app.
              </p>
            </div>
          </div>
          <button
            id="card-install-pwa-btn"
            onClick={handleClick}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-green-400 border border-green-500/30 font-bold py-2.5 text-xs transition-all active:scale-95 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>View iPhone Installation Guide</span>
          </button>
        </div>

        <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </>
    );
  }

  // Variant === "settings"
  return (
    <>
      <div className="rounded-xl bg-slate-950/60 p-3.5 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-green-400" />
            <span className="text-xs font-semibold text-slate-200">Home Screen PWA</span>
          </div>
          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
            Installable
          </span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Install CrackSvenska to your iPhone Home Screen to play offline and remove the Safari browser bar.
        </p>
        <button
          id="settings-install-pwa-btn"
          onClick={handleClick}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-green-400 border border-slate-700 py-2 text-xs font-bold transition-all active:scale-95 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          <span>{isIOS ? "Install on this iPhone" : "Install App"}</span>
        </button>
      </div>

      <PWAInstallModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
