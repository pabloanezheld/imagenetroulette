import React from 'react';
import { X, Trash2, Volume2, ArrowRight, Clock } from 'lucide-react';

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
  onSpeak,
  t
}) {
  if (!isOpen) return null;

  const h = t.historyDrawer;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border-l border-zinc-800 w-full max-w-md h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center space-x-2">
            <h2 className="font-mono font-bold text-sm tracking-wide text-zinc-100 uppercase">
              {h.title}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
              {history.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition"
                title={h.clearTooltip}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center text-zinc-500">
              <Clock className="w-8 h-8 mb-2 opacity-40" />
              <p>{h.emptyTitle}</p>
              <p className="text-[11px] text-zinc-600 mt-1">
                {h.emptyDesc}
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                className="group p-3 rounded-xl bg-zinc-950 border border-zinc-800/80 hover:border-amber-400/50 cursor-pointer transition flex space-x-3 items-start"
              >
                {/* Thumbnail */}
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.label}
                    className="w-16 h-16 rounded-lg object-cover border border-zinc-800 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-600 flex-shrink-0">
                    📸
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-400 uppercase truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-zinc-300 font-sans text-xs line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-zinc-800/60 text-[10px] text-zinc-500">
                    <span>{item.synset || 'n00000000'}</span>
                    <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSpeak(item.description);
                        }}
                        className="p-1 hover:text-amber-400 text-zinc-400"
                        title="Speak"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <ArrowRight className="w-3 h-3 text-amber-400" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
