import React, { useState } from 'react';
import { X, Terminal, Clock, Cpu, Coins, BookOpen, Copy, Check } from 'lucide-react';

export default function InspectorModal({
  isOpen,
  onClose,
  currentResult,
  selectedPreset,
  language,
  t
}) {
  const [activeTab, setActiveTab] = useState('telemetry');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const telemetry = currentResult?.telemetry;
  const m = t.inspectorModal;

  const handleCopyRaw = () => {
    if (!telemetry?.rawResponse) return;
    navigator.clipboard.writeText(JSON.stringify(telemetry.rawResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-sm tracking-wide text-zinc-100 uppercase">
                {m.title}
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                {m.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-6 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveTab('telemetry')}
            className={`py-3 px-4 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {m.tabTelemetry}
          </button>
          <button
            onClick={() => setActiveTab('prompt')}
            className={`py-3 px-4 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'prompt'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {m.tabPrompt}
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`py-3 px-4 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'education'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {m.tabEducation}
          </button>
          <button
            onClick={() => setActiveTab('raw')}
            className={`py-3 px-4 border-b-2 font-medium transition whitespace-nowrap ${
              activeTab === 'raw'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {m.tabRaw}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 font-mono text-xs">
          {activeTab === 'telemetry' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-zinc-400 mb-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{m.latencyLabel}</span>
                  </div>
                  <div className="text-lg font-bold text-zinc-100">
                    {telemetry?.latencyMs ? `${telemetry.latencyMs} ms` : '—'}
                  </div>
                  <span className="text-[10px] text-zinc-500">{m.latencySub}</span>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-zinc-400 mb-1">
                    <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{m.tokensLabel}</span>
                  </div>
                  <div className="text-lg font-bold text-zinc-100">
                    {telemetry?.totalTokens || '—'}
                  </div>
                  <span className="text-[10px] text-zinc-500">P: {telemetry?.promptTokens || 0} / R: {telemetry?.completionTokens || 0}</span>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-zinc-400 mb-1">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{m.costLabel}</span>
                  </div>
                  <div className="text-lg font-bold text-zinc-100">
                    {telemetry?.promptTokens
                      ? `~$${((telemetry.promptTokens * 0.00000015) + (telemetry.completionTokens * 0.0000006)).toFixed(5)}`
                      : '—'}
                  </div>
                  <span className="text-[10px] text-zinc-500">{m.costSub}</span>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                  <div className="flex items-center space-x-1.5 text-zinc-400 mb-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span>{m.modelLabel}</span>
                  </div>
                  <div className="text-sm font-bold text-zinc-100 truncate">
                    {telemetry?.model || 'gpt-4o-mini'}
                  </div>
                  <span className="text-[10px] text-zinc-500">{m.modelSub}</span>
                </div>
              </div>

              {/* Step-by-step pipeline breakdown */}
              <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/70">
                <h4 className="text-zinc-300 font-bold mb-3 flex items-center space-x-2">
                  <span>{m.pipelineTitle}</span>
                </h4>
                <ol className="space-y-2 text-zinc-400 list-decimal list-inside leading-relaxed">
                  {m.steps.map((st, idx) => (
                    <li key={idx}>{st}</li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <p className="text-zinc-400 leading-relaxed font-sans text-xs">
                {language === 'es'
                  ? 'Los modelos de visión son condicionados por instrucciones que delimitan su formato, presupuesto de palabras e idioma:'
                  : 'Vision models are guided by conditioning prompts that constrain their output format, verbosity, and language:'}
              </p>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 whitespace-pre-wrap overflow-x-auto leading-relaxed text-[11px]">
                {currentResult?.reasoning || (language === 'es' ? 'Aún no hay registro. Analiza un cuadro primero.' : 'No prompt record yet. Run an analysis frame first.')}
              </pre>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-3 font-sans text-xs text-zinc-300 leading-relaxed">
              <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-200 flex items-start space-x-3">
                <BookOpen className="w-5 h-5 flex-shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm font-mono text-amber-300 mb-1">
                    {m.historyCardTitle}
                  </h4>
                  <p>{m.historyCardBody}</p>
                </div>
              </div>

              <div className="space-y-2 text-zinc-400">
                <p>{m.historyPoint1}</p>
                <p>{m.historyPoint2}</p>
                <p>{m.historyPoint3}</p>
              </div>
            </div>
          )}

          {activeTab === 'raw' && (
            <div className="space-y-2">
              <div className="flex justify-end">
                <button
                  onClick={handleCopyRaw}
                  className="px-3 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs flex items-center space-x-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t.copied : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 overflow-x-auto max-h-96 text-[11px]">
                {telemetry?.rawResponse
                  ? JSON.stringify(telemetry.rawResponse, null, 2)
                  : (language === 'es' ? 'Aún no hay registro. Analiza un cuadro primero.' : 'No telemetry record yet. Run an analysis frame first.')}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
