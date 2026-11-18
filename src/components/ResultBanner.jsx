import React, { useState } from 'react';
import { Volume2, Copy, Check, Tag, Brain, Sparkles, Layers, Hash } from 'lucide-react';

export default function ResultBanner({
  result,
  onSpeak,
  onOpenInspector,
  t
}) {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-4 px-2">
        <div className="border border-dashed border-zinc-800 rounded-2xl p-6 text-center bg-zinc-950/40">
          <p className="text-zinc-500 font-mono text-sm">
            {t.pressSpaceHint}
          </p>
        </div>
      </div>
    );
  }

  const handleCopy = () => {
    const text = `Label: ${result.label}\nDescription: ${result.description}\nSynset: ${result.synset}\nConfidence: ${Math.round(result.confidence * 100)}%`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = result.description ? result.description.trim().split(/\s+/).length : 0;
  const presetId = result.telemetry?.presetId || 'contextual';

  return (
    <div className="w-full max-w-4xl mx-auto mt-4 px-2">
      <div className="bg-zinc-900/90 border-2 border-amber-400/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden backdrop-blur-md">
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-32 bg-amber-400/5 blur-3xl pointer-events-none"></div>

        {/* Header row: Badge, Synset, Confidence, and Action buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Classification Label */}
            <div className="bg-amber-400 text-zinc-950 font-mono font-bold text-base sm:text-lg px-3 py-1 rounded-md uppercase tracking-tight shadow-[0_0_15px_rgba(251,191,36,0.25)] flex items-center space-x-1.5">
              <span>{result.label}</span>
            </div>

            {/* Mode Indicator Badge */}
            <span className="font-mono text-xs px-2.5 py-1 rounded border flex items-center space-x-1.5 bg-zinc-950 text-zinc-300 border-zinc-700">
              {presetId === 'concise' && (
                <>
                  <Hash className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-cyan-300 font-semibold">MINIMAL TAG</span>
                </>
              )}
              {presetId === 'imagenet' && (
                <>
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-amber-300 font-semibold">IMAGENET ROULETTE</span>
                </>
              )}
              {presetId === 'contextual' && (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">SCENE DESCRIPTION</span>
                </>
              )}
            </span>

            {/* Confidence Score */}
            {result.confidence && (
              <span className="font-mono text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded flex items-center space-x-1">
                <span>{t.certainty}</span>
                <span className="font-bold">{Math.round(result.confidence * 100)}%</span>
              </span>
            )}
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => onSpeak(result.description || result.label)}
              title={t.speakAgain}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-amber-400 hover:bg-zinc-700 transition"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              title={t.copyText}
              className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-zinc-100 hover:bg-zinc-700 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Primary Description display */}
        <div className="py-4">
          {presetId === 'concise' ? (
            <div className="py-2">
              <div className="text-3xl sm:text-4xl font-mono font-black text-amber-400 tracking-wider uppercase">
                {result.label}
              </div>
              <p className="text-xs font-mono text-zinc-400 mt-2">
                ⚡ Direct Class Token • Exactly {wordCount} word(s) • Zero conversational narrative
              </p>
            </div>
          ) : presetId === 'imagenet' ? (
            <div>
              <p className="text-base sm:text-lg font-mono text-amber-200/90 leading-relaxed bg-black/40 p-3 rounded-xl border border-zinc-800">
                {result.description}
              </p>
              <div className="flex items-center space-x-3 mt-2 text-xs font-mono text-zinc-400">
                <span>ImageNet Roulette • Taxonomic Bias Simulation</span>
                {result.telemetry?.latencyMs && (
                  <span>• {t.latency} {result.telemetry.latencyMs}ms</span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-base sm:text-lg font-medium text-zinc-100 leading-relaxed font-sans">
                "{result.description}"
              </p>
              <div className="flex items-center space-x-3 mt-2 text-xs font-mono text-zinc-400">
                <span>{t.length} {wordCount} {t.wordsLimit}</span>
                {result.telemetry?.latencyMs && (
                  <span>• {t.latency} {result.telemetry.latencyMs}ms</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Visual tags & Model Reasoning breakdown */}
        <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-zinc-500" />
            {result.tags?.map((tTag, idx) => (
              <span key={idx} className="bg-zinc-950 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono text-[11px]">
                #{tTag}
              </span>
            ))}
          </div>

          {/* Educational reasoning pill */}
          {result.reasoning && (
            <button
              onClick={onOpenInspector}
              className="text-zinc-400 hover:text-amber-300 flex items-center space-x-1.5 font-mono text-xs group"
            >
              <Brain className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition" />
              <span className="truncate max-w-xs sm:max-w-sm text-left">
                {t.why} {result.reasoning}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
