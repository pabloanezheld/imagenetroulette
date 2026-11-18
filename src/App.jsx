import React, { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/Navbar';
import CameraFeed from './components/CameraFeed';
import ControlBar from './components/ControlBar';
import ResultBanner from './components/ResultBanner';
import InspectorModal from './components/InspectorModal';
import SettingsModal from './components/SettingsModal';
import HistoryDrawer from './components/HistoryDrawer';
import { analyzeImageWithOpenAI, captureFrameAsBase64 } from './services/openai';
import { speechService } from './services/speech';
import { soundFX } from './services/sound';
import { translations } from './utils/translations';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const videoRef = useRef(null);
  const autoScanTimerRef = useRef(null);
  const isAnalyzingRef = useRef(false);

  // Language state: 'en' | 'es'
  const [language, setLanguage] = useState(() => localStorage.getItem('vision_lab_lang') || 'en');
  const t = translations[language] || translations.en;

  // Core Persistent State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('openai_api_key') || import.meta.env.VITE_OPENAI_API_KEY || '');
  const [model, setModel] = useState(() => localStorage.getItem('openai_vision_model') || 'gpt-4o-mini');
  const [selectedPreset, setSelectedPreset] = useState('contextual');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Operational State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const [autoScanInterval, setAutoScanInterval] = useState(3000);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Initialize and sync speech engine language
  useEffect(() => {
    speechService.setLanguage(language);
  }, [language]);

  // Sync speech engine mute state
  useEffect(() => {
    speechService.enabled = audioEnabled;
  }, [audioEnabled]);

  // Sync sound FX mute state
  useEffect(() => {
    soundFX.enabled = soundEnabled;
  }, [soundEnabled]);

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    localStorage.setItem('vision_lab_lang', newLang);
    speechService.setLanguage(newLang);
  };

  // Save settings helpers
  const handleSaveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem('openai_api_key', newKey);
  };

  const handleSelectModel = (newModel) => {
    setModel(newModel);
    localStorage.setItem('openai_vision_model', newModel);
  };

  // Perform Analysis
  const performAnalysis = useCallback(async () => {
    if (!videoRef.current || !isCameraActive) return;
    if (isAnalyzingRef.current) return;

    if (!apiKey || !apiKey.trim()) {
      setIsSettingsOpen(true);
      setErrorMessage(language === 'es' ? 'Por favor ingresa tu clave API de OpenAI para comenzar.' : 'Please provide your OpenAI API Key to begin image recognition.');
      return;
    }

    try {
      isAnalyzingRef.current = true;
      setIsAnalyzing(true);
      setErrorMessage(null);

      // Play shutter sound
      soundFX.playShutter();

      // Capture frame
      const frameDataUrl = captureFrameAsBase64(videoRef.current, 640);

      // Send to OpenAI Vision model with active language
      const result = await analyzeImageWithOpenAI({
        imageDataUrl: frameDataUrl,
        apiKey,
        model,
        presetId: selectedPreset,
        language,
      });

      // Play detection chime
      soundFX.playDetected();

      setCurrentResult(result);

      // Add to history
      const historyItem = {
        id: Date.now(),
        label: result.label,
        description: result.description,
        synset: result.synset,
        confidence: result.confidence,
        tags: result.tags,
        thumbnail: frameDataUrl,
        timestamp: new Date().toISOString(),
        telemetry: result.telemetry,
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 24)]);

      // Speak result aloud if enabled (in selected language and customized by mode)
      if (audioEnabled) {
        if (selectedPreset === 'concise') {
          // Strictly speak only the 1-2 words
          speechService.speak(result.label);
        } else if (selectedPreset === 'imagenet') {
          // Speak vivid adjective-rich characterization
          speechService.speak(result.description || result.label);
        } else {
          // Speak full contextual description
          speechService.speak(result.description || result.label);
        }
      }
    } catch (err) {
      console.error('Vision Recognition Error:', err);
      soundFX.playError();
      setErrorMessage(err.message || 'Error communicating with OpenAI Vision API.');
    } finally {
      isAnalyzingRef.current = false;
      setIsAnalyzing(false);
    }
  }, [isCameraActive, apiKey, model, selectedPreset, language, audioEnabled]);

  // Auto-Scan interval controller
  useEffect(() => {
    if (isAutoScanning && isCameraActive && apiKey) {
      performAnalysis();

      autoScanTimerRef.current = setInterval(() => {
        if (!isAnalyzingRef.current) {
          performAnalysis();
        }
      }, autoScanInterval);
    } else {
      if (autoScanTimerRef.current) {
        clearInterval(autoScanTimerRef.current);
        autoScanTimerRef.current = null;
      }
    }

    return () => {
      if (autoScanTimerRef.current) {
        clearInterval(autoScanTimerRef.current);
      }
    };
  }, [isAutoScanning, isCameraActive, apiKey, autoScanInterval, performAnalysis]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        performAnalysis();
      } else if (e.key.toLowerCase() === 'c') {
        setIsCameraActive((prev) => !prev);
      } else if (e.key.toLowerCase() === 'm') {
        setAudioEnabled((prev) => !prev);
      } else if (e.key.toLowerCase() === 'a') {
        setIsAutoScanning((prev) => !prev);
      } else if (e.key.toLowerCase() === 'i') {
        setIsInspectorOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [performAnalysis]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        isCameraActive={isCameraActive}
        isAnalyzing={isAnalyzing}
        isAutoScanning={isAutoScanning}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled((prev) => !prev)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        model={model}
        hasApiKey={Boolean(apiKey)}
        language={language}
        onChangeLanguage={handleLanguageChange}
        t={t}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center">
        {/* Error notification banner */}
        {errorMessage && (
          <div className="w-full max-w-4xl mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between font-mono animate-fade-in">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-rose-200 ml-4 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Central Camera Window View */}
        <CameraFeed
          videoRef={videoRef}
          isCameraActive={isCameraActive}
          onToggleCamera={(state) => {
            setIsCameraActive(state);
            if (!state) setIsAutoScanning(false);
          }}
          isAnalyzing={isAnalyzing}
          currentResult={currentResult}
          showBoundingBox={true}
          t={t}
        />

        {/* Interactive Controls Bar */}
        <ControlBar
          isCameraActive={isCameraActive}
          isAnalyzing={isAnalyzing}
          isAutoScanning={isAutoScanning}
          onAnalyze={performAnalysis}
          onToggleAutoScan={() => setIsAutoScanning((prev) => !prev)}
          autoScanInterval={autoScanInterval}
          onChangeAutoScanInterval={setAutoScanInterval}
          selectedPreset={selectedPreset}
          onChangePreset={setSelectedPreset}
          hasApiKey={Boolean(apiKey)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          language={language}
          t={t}
        />

        {/* Classification Result Banner */}
        <ResultBanner
          result={currentResult}
          onSpeak={(text) => speechService.speak(text)}
          onOpenInspector={() => setIsInspectorOpen(true)}
          t={t}
        />
      </main>

      {/* Modals & Drawers */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
        model={model}
        onSelectModel={handleSelectModel}
        soundEnabled={soundEnabled}
        onToggleSound={setSoundEnabled}
        language={language}
        t={t}
      />

      <InspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        currentResult={currentResult}
        selectedPreset={selectedPreset}
        language={language}
        t={t}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistoryItem={(item) => setCurrentResult(item)}
        onClearHistory={() => setHistory([])}
        onSpeak={(text) => speechService.speak(text)}
        t={t}
      />

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-4 text-center text-xs font-mono text-zinc-600">
        <p>{t.footerText}</p>
      </footer>
    </div>
  );
}
