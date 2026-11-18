// Web Speech API text-to-speech engine with multi-language adaptation

class SpeechService {
  constructor() {
    this.enabled = true;
    this.currentLanguage = 'en'; // 'en' | 'es'
    this.voice = null;
    this.rate = 1.05;
    this.pitch = 1.0;
    this.voices = [];
    this.isSpeaking = false;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  loadVoices() {
    if (!('speechSynthesis' in window)) return;
    this.voices = window.speechSynthesis.getVoices();
    this.autoSelectVoiceForLanguage(this.currentLanguage);
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    this.autoSelectVoiceForLanguage(lang);
  }

  autoSelectVoiceForLanguage(lang) {
    if (!this.voices || this.voices.length === 0) return;

    if (lang === 'es') {
      // Prioritize Colombian and Latin American Spanish voices
      const esVoice = this.voices.find(v => (v.lang === 'es-CO' || v.lang === 'es_CO') && (v.name.includes('Natural') || v.name.includes('Salome') || v.name.includes('Gonzalo')))
        || this.voices.find(v => v.lang === 'es-CO' || v.lang === 'es_CO')
        || this.voices.find(v => v.lang.startsWith('es') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Paulina') || v.name.includes('Diego') || v.name.includes('Sofia') || v.name.includes('Mónica') || v.name.includes('Monica') || v.name.includes('Jorge')))
        || this.voices.find(v => v.lang.startsWith('es'))
        || this.voices[0];
      this.voice = esVoice;
    } else {
      // Find English voice
      const enVoice = this.voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Daniel')))
        || this.voices.find(v => v.lang.startsWith('en'))
        || this.voices[0];
      this.voice = enVoice;
    }
  }

  speak(text) {
    if (!this.enabled || !text || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech so phrases don't stack up
    window.speechSynthesis.cancel();

    // Clean text to avoid reading markdown artifacts
    const cleanText = text.replace(/[*_#`]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (this.voice) {
      utterance.voice = this.voice;
    }
    utterance.lang = this.currentLanguage === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = this.rate;
    utterance.pitch = this.pitch;

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
    };

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }
}

export const speechService = new SpeechService();
