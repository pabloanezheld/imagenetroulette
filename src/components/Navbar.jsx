import React from 'react';
import { Camera, Volume2, VolumeX, Settings, Terminal, Sparkles, History, Globe } from 'lucide-react';

export default function Navbar({
  isCameraActive,
  isAnalyzing,
  isAutoScanning,
  audioEnabled,
  onToggleAudio,
  onOpenSettings,
  onOpenInspector,
  onOpenHistory,
  historyCount,
  model,
  hasApiKey,
  language,
  onChangeLanguage,
  t
}) {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-400 text-zinc-950 flex items-center justify-center font-bold font-mono shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            👁️
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-mono font-bold text-base tracking-wider text-zinc-100 uppercase">
                {t.appTitle}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded font-mono font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                {t.eduBadge}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono hidden sm:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Bar */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Language Switcher Button (Top Right) */}
          <div className="flex items-center rounded-lg bg-zinc-900 border border-zinc-800 p-0.5 font-mono text-xs">
            <button
              onClick={() => onChangeLanguage('en')}
              className={`px-2 py-1 rounded transition flex items-center space-x-1 ${
                language === 'en'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="English (English prompts & voices)"
            >
              <span>🇺🇸</span>
              <span>EN</span>
            </button>
            <button
              onClick={() => onChangeLanguage('es')}
              className={`px-2 py-1 rounded transition flex items-center space-x-1 ${
                language === 'es'
                  ? 'bg-amber-400 text-zinc-950 font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Español (Prompts y voces en español)"
            >
              <span>🇨🇴</span>
              <span>ES</span>
            </button>
          </div>

          {/* Key missing badge */}
          {!hasApiKey && (
            <button
              onClick={onOpenSettings}
              className="animate-pulse text-xs px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center space-x-1 font-mono"
            >
              <span>{t.apiRequired}</span>
            </button>
          )}

          {/* Model badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
            <span className={`w-2 h-2 rounded-full ${isAutoScanning ? 'bg-amber-400 animate-ping' : isCameraActive ? 'bg-emerald-400' : 'bg-zinc-600'}`}></span>
            <span>{model}</span>
          </div>

          {/* Audio Speech Toggle */}
          <button
            onClick={onToggleAudio}
            title={audioEnabled ? t.voiceOn : t.voiceMuted}
            className={`p-2 rounded-lg border transition text-xs flex items-center space-x-1 font-mono ${
              audioEnabled 
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/20' 
                : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden lg:inline">{audioEnabled ? t.voiceOn : t.voiceMuted}</span>
          </button>

          {/* History drawer button */}
          <button
            onClick={onOpenHistory}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition relative text-xs flex items-center space-x-1 font-mono"
            title={t.history}
          >
            <History className="w-4 h-4" />
            <span className="hidden lg:inline">{t.history}</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-400 text-zinc-950 font-mono">
                {historyCount}
              </span>
            )}
          </button>

          {/* Inspector Modal Button */}
          <button
            onClick={onOpenInspector}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition text-xs flex items-center space-x-1 font-mono"
            title={t.inspector}
          >
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="hidden lg:inline">{t.inspector}</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800 transition text-xs flex items-center space-x-1 font-mono"
            title={t.config}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden lg:inline">{t.config}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
