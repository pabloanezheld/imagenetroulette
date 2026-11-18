import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff, Check, Volume2, Save, ShieldCheck } from 'lucide-react';
import { speechService } from '../services/speech';
import { soundFX } from '../services/sound';

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  model,
  onSelectModel,
  soundEnabled,
  onToggleSound,
  language,
  t
}) {
  const [localKey, setLocalKey] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState('');

  const s = t.settingsModal;

  useEffect(() => {
    setLocalKey(apiKey || '');
  }, [apiKey]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const vs = window.speechSynthesis.getVoices();
      setVoices(vs);
      if (speechService.voice) {
        setSelectedVoiceName(speechService.voice.name);
      }
    }
  }, [isOpen, language]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(localKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  const handleVoiceChange = (e) => {
    const v = voices.find((vox) => vox.name === e.target.value);
    if (v) {
      speechService.voice = v;
      setSelectedVoiceName(v.name);
      speechService.speak(language === 'es' ? 'Perfil de voz actualizado.' : 'Voice profile updated.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-zinc-900 border border-zinc-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-950">
          <div className="flex items-center space-x-2.5">
            <div className="p-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mono font-bold text-sm tracking-wide text-zinc-100 uppercase">
                {s.title}
              </h2>
              <p className="text-xs font-mono text-zinc-400">
                {s.subtitle}
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

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-5 font-mono text-xs">
          {/* OpenAI API Key Input */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold flex items-center justify-between">
              <span>{s.apiKeyLabel}</span>
              <span className="text-[10px] text-amber-400">{s.requiredBadge}</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                placeholder="sk-proj-..."
                value={localKey}
                onChange={(e) => setLocalKey(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3.5 py-2.5 pr-10 focus:outline-none focus:border-amber-400 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-200"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
              {s.apiKeyDesc}
            </p>
          </div>

          {/* Model selection */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold">{s.modelLabel}</label>
            <select
              value={model}
              onChange={(e) => onSelectModel(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 text-xs font-mono"
            >
              <option value="gpt-4o-mini">{s.modelMini}</option>
              <option value="gpt-4o">{s.modelStandard}</option>
            </select>
          </div>

          {/* Voice profile */}
          <div className="space-y-1.5">
            <label className="text-zinc-300 font-semibold flex items-center justify-between">
              <span>{s.voiceLabel}</span>
              <button
                type="button"
                onClick={() => speechService.speak(language === 'es' ? 'Probando síntesis de voz en español.' : 'Testing vision voice output.')}
                className="text-[10px] text-amber-400 hover:underline flex items-center space-x-1"
              >
                <Volume2 className="w-3 h-3" />
                <span>{s.testVoice}</span>
              </button>
            </label>
            <select
              value={selectedVoiceName}
              onChange={handleVoiceChange}
              className="w-full bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-400 text-xs font-mono"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          {/* Sound FX Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <div className="font-semibold text-zinc-200">{s.soundLabel}</div>
              <div className="text-[10px] text-zinc-500 font-sans">
                {s.soundDesc}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onToggleSound(!soundEnabled);
                soundFX.enabled = !soundEnabled;
                if (!soundEnabled) soundFX.playDetected();
              }}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                soundEnabled ? 'bg-amber-400 justify-end' : 'bg-zinc-800 justify-start'
              }`}
            >
              <span className={`w-4 h-4 rounded-full bg-zinc-950 shadow`} />
            </button>
          </div>

          {/* Privacy badge */}
          <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center space-x-2 text-[11px] text-zinc-400 font-sans">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{s.privacyText}</span>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end space-x-3 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 transition"
            >
              {s.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold transition flex items-center space-x-2 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-zinc-950" />
                  <span>{s.saved}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{s.save}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
