import React, { useEffect, useState } from "react";
import { Terminal, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";

const LOADER_PHASES = [
  "Bypassing grammar shields...",
  "Extracting complex vocabulary logs...",
  "Translating compound Swedish phrases...",
  "Compiling multi-choice training decks...",
  "Finalizing reading confidence meters..."
];

export default function LoaderView() {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [binaryGrid, setBinaryGrid] = useState<string[]>([]);

  // Rotate helpful messages
  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((prev) => (prev + 1) % LOADER_PHASES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  // Generate matrix coding effect in background
  useEffect(() => {
    const chars = "🇸🇪⚡🇸🇪ÅÄÖåäöCRACKSVENSKAAaBbCcDdEeFfGgHhIiJjKkLl";
    const updateGrid = () => {
      const items: string[] = [];
      for (let i = 0; i < 20; i++) {
        let line = "";
        for (let j = 0; j < 8; j++) {
          line += chars[Math.floor(Math.random() * chars.length)] + " ";
        }
        items.push(line);
      }
      setBinaryGrid(items);
    };

    const gridInterval = setInterval(updateGrid, 650);
    updateGrid();
    return () => clearInterval(gridInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center min-h-[400px]">
      {/* Visual scanning circle */}
      <div className="relative mb-8 flex h-32 w-32 items-center justify-center rounded-full border border-green-500/20 bg-slate-950 shadow-inner">
        {/* Pulsing glow outer */}
        <div className="absolute inset-0 rounded-full bg-green-500/5 animate-ping" />
        
        {/* Scanner Radar line */}
        <div className="absolute inset-2 rounded-full border-2 border-dashed border-green-500/40 animate-spin" style={{ animationDuration: '6s' }} />
        
        {/* Rotating inner bracket */}
        <div className="absolute inset-6 rounded-full border border-amber-500/60 border-t-transparent border-b-transparent animate-spin" style={{ animationDuration: '2s' }} />

        {/* Center icon */}
        <Terminal className="h-8 w-8 text-green-400 glow-green animate-pulse" />
      </div>

      {/* Code Grid Stream */}
      <div className="w-full max-w-xs h-28 overflow-hidden rounded-xl bg-slate-950 p-3 border border-slate-800 text-left mb-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/80 pointer-events-none" />
        <div className="font-mono text-[9px] text-green-500/40 leading-none space-y-1 select-none">
          {binaryGrid.map((line, i) => (
            <p key={i} className="truncate">{line}</p>
          ))}
        </div>
      </div>

      {/* Primary status */}
      <div className="space-y-2 px-4 max-w-sm">
        <h3 className="font-display text-lg font-black uppercase tracking-wider text-green-400 glow-green">
          Decrypting Article Code
        </h3>
        <p className="text-sm font-semibold text-slate-100 min-h-[20px] transition-all duration-300">
          {LOADER_PHASES[phaseIndex]}
        </p>
        <p className="text-xs text-slate-500 max-w-[280px] mx-auto">
          Gemini is identifying key vocabularies, verifying plausible definitions, and setting up the confidence gauge.
        </p>
      </div>
    </div>
  );
}
