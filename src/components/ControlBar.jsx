import React from 'react';
import { Camera, Sparkles, Play, Pause, Clock, Sliders } from 'lucide-react';
import { PROMPT_PRESETS } from '../services/openai';

export default function ControlBar({
  isCameraActive,
  isAnalyzing,
  isAutoScanning,
  onAnalyze,
  onToggleAutoScan,
  autoScanInterval,
  onChangeAutoScanInterval,
  selectedPreset,
  onChangePreset,
  hasApiKey,
  onOpenSettings,
  language,
  t
}) {
  const langKey = language === 'es' ? 'es' : 'en';

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-2">
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Preset Selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <label className="text-xs font-mono text-zinc-400 whitespace-nowrap flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.mode}</span>
          </label>
          <select
            value={selectedPreset}
            onChange={(e) => onChangePreset(e.target.value)}
            disabled={isAnalyzing}
            className="w-full md:w-52 bg-zinc-950 border border-zinc-700 text-zinc-200 text-xs rounded-xl px-3 py-2 font-mono focus:outline-none focus:border-amber-400 disabled:opacity-50"
          >
            {PROMPT_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name[langKey] || p.name.en}
              </option>
            ))}
          </select>
        </div>

        {/* Center / Primary Actions */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto justify-center">
          {/* Main Manual Analyze Snapshot Button */}
          <button
            onClick={() => {
              if (!hasApiKey) {
                onOpenSettings();
              } else {
                onAnalyze();
              }
            }}
            disabled={!isCameraActive || isAnalyzing}
            className={`flex-1 md:flex-initial px-6 py-2.5 rounded-xl font-mono font-bold text-sm flex items-center justify-center space-x-2 transition transform active:scale-95 ${
              !isCameraActive
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700/50'
                : isAnalyzing
                ? 'bg-amber-500 text-zinc-950 animate-pulse border border-amber-400'
                : 'bg-amber-400 hover:bg-amber-300 text-zinc-950 border border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-zinc-950" />
                <span>{t.analyzing}</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>{t.analyzeFrame}</span>
                <span className="hidden sm:inline-block text-[10px] bg-zinc-950/20 text-zinc-950 px-1.5 py-0.5 rounded font-mono font-normal">
                  SPACE
                </span>
              </>
            )}
          </button>

          {/* Auto-Scan Interval Toggle */}
          <button
            onClick={() => {
              if (!hasApiKey) {
                onOpenSettings();
              } else {
                onToggleAutoScan();
              }
            }}
            disabled={!isCameraActive}
            title={isAutoScanning ? t.stopAuto : t.autoScan}
            className={`px-3.5 py-2.5 rounded-xl font-mono text-xs font-semibold flex items-center space-x-1.5 border transition ${
              !isCameraActive
                ? 'bg-zinc-800 text-zinc-600 border-zinc-800 cursor-not-allowed'
                : isAutoScanning
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 hover:bg-rose-500/30'
                : 'bg-zinc-950 border-zinc-700 text-zinc-300 hover:border-amber-400/50 hover:text-amber-400'
            }`}
          >
            {isAutoScanning ? (
              <>
                <Pause className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.stopAuto}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.autoScan}</span>
              </>
            )}
          </button>
        </div>

        {/* Auto-Scan Rate Selector */}
        <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
          <Clock className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-xs font-mono text-zinc-400">{t.interval}</span>
          <select
            value={autoScanInterval}
            onChange={(e) => onChangeAutoScanInterval(Number(e.target.value))}
            className="bg-zinc-950 border border-zinc-700 text-zinc-300 text-xs rounded-xl px-2.5 py-1.5 font-mono focus:outline-none focus:border-amber-400"
          >
            <option value={2000}>2.0s</option>
            <option value={3000}>3.0s ({t.rec})</option>
            <option value={5000}>5.0s</option>
            <option value={8000}>8.0s</option>
          </select>
        </div>
      </div>
    </div>
  );
}
