import React, { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Clipboard, FileUp, Upload, Sparkles, BookOpen, Newspaper, Coffee, Gauge } from "lucide-react";
import { motion } from "motion/react";
import { DifficultyLevel } from "../types";

interface DashboardViewProps {
  onCrackText: (text: string, difficulty: DifficultyLevel) => void;
  isLoading: boolean;
  lastText?: string;
  selectedDifficulty: DifficultyLevel;
  onDifficultyChange: (difficulty: DifficultyLevel) => void;
}

interface DifficultyOption {
  id: DifficultyLevel;
  label: string;
  cefr: string;
  badgeColor: string;
  activeBorder: string;
  activeBg: string;
  textColor: string;
  summary: string;
  targetDescription: string;
  iconSymbol: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  {
    id: "very_basic",
    label: "Alla ord (Lätt➔Svår)",
    cefr: "Full skala",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    activeBorder: "border-sky-500",
    activeBg: "bg-sky-500/10",
    textColor: "text-sky-400",
    summary: "Alla ord (från enkla till svåra)",
    targetDescription: "Extraherar alla nyckelord från texten (12–18 ord) i en pedagogisk stegring: från enkla grundläggande ord upp till svåra uttryck.",
    iconSymbol: "🌱➔🔥"
  },
  {
    id: "beginner",
    label: "Nybörjare",
    cefr: "A1–B1",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    activeBorder: "border-emerald-500",
    activeBg: "bg-emerald-500/10",
    textColor: "text-emerald-400",
    summary: "Enkla till medelsvåra ord",
    targetDescription: "Hoppar över de allra mest elementära orden och fokuserar på grundläggande till medelsvåra ord.",
    iconSymbol: "🟢"
  },
  {
    id: "intermediate",
    label: "Mellannivå",
    cefr: "B1–B2",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    activeBorder: "border-amber-500",
    activeBg: "bg-amber-500/10",
    textColor: "text-amber-400",
    summary: "Medelsvåra nyhetsord",
    targetDescription: "Extraherar sammansatta ord, tidningsspråk och idiom. Hoppar över lätta ord.",
    iconSymbol: "🟡"
  },
  {
    id: "advanced",
    label: "Avancerad",
    cefr: "C1–C2",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    activeBorder: "border-rose-500",
    activeBg: "bg-rose-500/10",
    textColor: "text-rose-400",
    summary: "Endast svåra & formella ord",
    targetDescription: "Extraherar uteslutande textens mest avancerade, formella och svåra ord för högsta utmaning.",
    iconSymbol: "🔴"
  }
];

const PRESETS = [
  {
    id: "news",
    title: "Svenska Nyheter",
    icon: Newspaper,
    text: "Sveriges regering har beslutat att satsa mer pengar på förnybar energi. Solenergi och vindkraft ska byggas ut kraftigt under de kommande tio åren. Målet är att hela landet ska ha hundra procent förnybar elproduktion senast år 2040. Många medborgare välkomnar fartyget av klimatpolitik, men vissa kritiker menar att det kommer att bli för dyrt för konsumenterna.",
    description: "Swedish News: Green Energy push"
  },
  {
    id: "culture",
    title: "Fika Kultur",
    icon: Coffee,
    text: "Att ta en fika är en av de viktigaste sociala traditionerna i Sverige. Det betyder mer än att bara dricka kaffe och äta en bulle. Fika handlar om att stanna upp, umgås med vänner eller kollegor, och njuta av stunden. På de flesta svenska arbetsplatser finns det en gemensam fika varje dag där man pratar om allt utom arbete.",
    description: "Culture: The Swedish Fika tradition"
  },
  {
    id: "fairy",
    title: "Enkel Saga",
    icon: BookOpen,
    text: "Det var en gång en djup, mörk skog i norra Sverige där en liten röd räv bodde. Räven hette Hugo och han var mycket nyfiken. En vacker sommardag bestämde han sig för att söka efter den legendariska gyllene älgen som sades bo på bergets topp. På sin väg mötte han en gammal uggla som gav honom tre kloka råd.",
    description: "Fairy Tale: Curious red fox Hugo"
  }
];

export default function DashboardView({
  onCrackText,
  isLoading,
  lastText,
  selectedDifficulty,
  onDifficultyChange
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"paste" | "upload">("paste");
  const [pastedText, setPastedText] = useState(lastText || "");
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedText, setUploadedText] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeOption = DIFFICULTY_OPTIONS.find((o) => o.id === selectedDifficulty) || DIFFICULTY_OPTIONS[1];

  const handlePresetSelect = (text: string) => {
    setPastedText(text);
    setActiveTab("paste");
  };

  const handleCrackClick = () => {
    const textToCrack = activeTab === "paste" ? pastedText : uploadedText;
    if (textToCrack.trim()) {
      onCrackText(textToCrack.trim(), selectedDifficulty);
    }
  };

  const parseFile = (file: File) => {
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setUploadedText(text);
        setUploadedFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      alert("Snälla! Please upload a plain text (.txt) file.");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      parseFile(file);
    }
  };

  const canCrack = activeTab === "paste" ? pastedText.trim().length > 10 : uploadedText.trim().length > 10;

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
        <button
          id="tab-paste-btn"
          onClick={() => setActiveTab("paste")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold font-display transition-all cursor-pointer ${
            activeTab === "paste"
              ? "bg-slate-800 text-green-400 border border-slate-700/50 shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Clipboard className="h-4 w-4" />
          <span>📋 Paste Text</span>
        </button>
        <button
          id="tab-upload-btn"
          onClick={() => setActiveTab("upload")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold font-display transition-all cursor-pointer ${
            activeTab === "upload"
              ? "bg-slate-800 text-green-400 border border-slate-700/50 shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <FileUp className="h-4 w-4" />
          <span>📁 Upload File</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === "paste" ? (
          <div className="space-y-4">
            <div className="relative">
              <textarea
                id="swedish-text-paste-area"
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Klistra in din svenska text här... (Paste your Swedish text here...)"
                rows={7}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-slate-100 placeholder:text-slate-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none focus:no-zoom"
                style={{ fontSize: "16px" }}
              />
              {pastedText && (
                <button
                  id="clear-paste-btn"
                  onClick={() => setPastedText("")}
                  className="absolute bottom-4 right-4 text-xs font-bold text-slate-500 hover:text-slate-300 bg-slate-900 px-2.5 py-1.5 rounded-lg border border-slate-800 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Presets Grid */}
            <div>
              <div className="flex items-center gap-1.5 mb-2.5">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Quick-start Swedish Snippets
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {PRESETS.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetSelect(preset.text)}
                      className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-left transition-all hover:border-slate-700 hover:bg-slate-800/80 active:scale-[0.98] cursor-pointer"
                    >
                      <div className="mt-0.5 rounded-lg bg-slate-800 p-1.5 text-amber-400 border border-slate-700">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-display text-xs font-bold text-white leading-tight">
                          {preset.title}
                        </p>
                        <p className="truncate text-[10px] text-slate-400 mt-0.5">
                          {preset.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div
            id="file-drop-zone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? "border-green-400 bg-green-500/5"
                : "border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/60"
            }`}
          >
            <input
              id="file-upload-input"
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".txt"
              className="hidden"
            />
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-green-400 border border-slate-800 shadow-lg">
              <Upload className="h-6 w-6" />
            </div>
            {uploadedFileName ? (
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">Loaded Successfully!</p>
                <p className="font-mono text-xs text-green-400 bg-slate-900 px-3 py-1 rounded border border-slate-800 inline-block max-w-[250px] truncate">
                  {uploadedFileName}
                </p>
                <p className="text-[11px] text-slate-400 mt-2">
                  Click or drag another plain text file to replace
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-display text-sm font-bold text-slate-200">
                  Drag and drop your file here
                </p>
                <p className="text-xs text-slate-500">
                  Accepts plain Swedish text files (.txt)
                </p>
                <p className="text-xs text-green-500 font-semibold pt-2">
                  or tap to browse files
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vocabulary Hardness Level Selector */}
      <div className="space-y-3 rounded-2xl bg-slate-950/70 p-4 border border-slate-850 shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Gauge className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Vocabulary Hardness Level
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
            CEFR Calibrated
          </span>
        </div>

        {/* 4 Hardness Level Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {DIFFICULTY_OPTIONS.map((opt) => {
            const isSelected = selectedDifficulty === opt.id;
            return (
              <button
                key={opt.id}
                id={`difficulty-btn-${opt.id}`}
                type="button"
                onClick={() => onDifficultyChange(opt.id)}
                className={`flex flex-col items-start text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? `${opt.activeBorder} ${opt.activeBg} shadow-md shadow-slate-950/60 ring-1 ${opt.activeBorder}`
                    : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-xs">{opt.iconSymbol}</span>
                  <span className={`text-[9px] font-mono font-black px-1.5 py-0.5 rounded border ${opt.badgeColor}`}>
                    {opt.cefr}
                  </span>
                </div>
                <span className={`text-xs font-bold font-display leading-tight ${isSelected ? opt.textColor : "text-slate-200"}`}>
                  {opt.label}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-1">
                  {opt.summary}
                </span>
              </button>
            );
          })}
        </div>

        {/* Contextual description explaining selected difficulty */}
        <div className="flex items-start gap-2 pt-1 text-[11px] text-slate-400 leading-relaxed bg-slate-900/40 p-2.5 rounded-xl border border-slate-850/60">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
          <p>
            <strong className="text-slate-200">
              {activeOption.label} ({activeOption.cefr}):
            </strong>{" "}
            {activeOption.targetDescription}
          </p>
        </div>
      </div>

      {/* Prominent Action Button */}
      <button
        id="crack-action-btn"
        onClick={handleCrackClick}
        disabled={!canCrack || isLoading}
        className="w-full rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black tracking-wider py-4 font-display text-base uppercase shadow-[0_4px_0_0_#d97706] active:translate-y-[2px] active:shadow-[0_2px_0_0_#d97706] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:shadow-[0_4px_0_0_#d97706] flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>⚡ CRACK THIS TEXT ({activeOption.cefr})</span>
      </button>
    </div>
  );
}
