// Browser-based speech recognition service
export class BrowserSpeechService {
  private recognition: any = null;
  private isSupported: boolean = false;

  constructor() {
    this.checkSupport();
  }

  private checkSupport(): void {
    this.isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    if (this.isSupported) {
      console.log('Web Speech API is supported');
    } else {
      console.log('Web Speech API is not supported in this browser');
    }
  }

  public isWebSpeechSupported(): boolean {
    return this.isSupported;
  }

  public async startRecognition(
    language: string,
    onResult: (transcript: string) => void,
    onError: (error: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    if (!this.isSupported) {
      onError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();

      // Configure recognition settings
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = language;
      this.recognition.maxAlternatives = 1;

      // Set up event handlers
      this.recognition.onstart = () => {
        console.log('Speech recognition started for language:', language);
        if (onStart) onStart();
      };

      this.recognition.onresult = (event: any) => {
        try {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          console.log(`Speech recognition result: "${transcript}" (confidence: ${confidence})`);
          onResult(transcript);
        } catch (err) {
          console.error('Error processing speech result:', err);
          onError('Error processing speech result');
        }
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        let errorMessage = 'Speech recognition failed';

        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please speak clearly into your microphone.';
            break;
          case 'audio-capture':
            errorMessage = 'Microphone not available. Please check your microphone settings.';
            break;
          case 'not-allowed':
            errorMessage = 'Microphone permission denied. Please allow microphone access and try again.';
            break;
          case 'network':
            errorMessage = 'Network error occurred during speech recognition.';
            break;
          case 'aborted':
            errorMessage = 'Speech recognition was aborted.';
            break;
          case 'bad-grammar':
            errorMessage = 'Speech recognition grammar error.';
            break;
          case 'language-not-supported':
            errorMessage = `Language "${language}" is not supported for speech recognition.`;
            break;
          default:
            errorMessage = `Speech recognition error: ${event.error}`;
        }

        onError(errorMessage);
      };

      this.recognition.onend = () => {
        console.log('Speech recognition ended');
        this.recognition = null;
        if (onEnd) onEnd();
      };

      // Start recognition
      this.recognition.start();
    } catch (err) {
      console.error('Failed to initialize speech recognition:', err);
      onError('Failed to initialize speech recognition: ' + (err as Error).message);
    }
  }

  public stopRecognition(): void {
    if (this.recognition) {
      console.log('Stopping speech recognition');
      this.recognition.stop();
      this.recognition = null;
    }
  }

  public abort(): void {
    if (this.recognition) {
      console.log('Aborting speech recognition');
      this.recognition.abort();
      this.recognition = null;
    }
  }
}

// Enhanced Text-to-Speech service with robust voice loading and error handling
export class BrowserTTSService {
  private isSupported: boolean = false;
  private voicesLoaded: boolean = false;
  private voiceCheckPromise: Promise<SpeechSynthesisVoice[]> | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isCurrentlySpeaking: boolean = false;

  constructor() {
    this.checkSupport();
    this.preloadVoices();
  }

  private checkSupport(): void {
    this.isSupported = 'speechSynthesis' in window;
    if (this.isSupported) {
      console.log('Enhanced TTS: Web Speech Synthesis API is supported');
    } else {
      console.log('Enhanced TTS: Web Speech Synthesis API is not supported in this browser');
    }
  }

  private async preloadVoices(): Promise<void> {
    if (!this.isSupported) return;
    
    try {
      await this.getVoicesAsync();
      this.voicesLoaded = true;
      console.log('Enhanced TTS: Voices preloaded successfully');
    } catch (err) {
      console.warn('Enhanced TTS: Failed to preload voices:', err);
    }
  }

  private async getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
    if (!this.isSupported) return [];
    
    // Return cached promise if already loading
    if (this.voiceCheckPromise) {
      return this.voiceCheckPromise;
    }

    this.voiceCheckPromise = new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        console.log('Enhanced TTS: Voices already loaded, count:', voices.length);
        resolve(voices);
        return;
      }

      console.log('Enhanced TTS: Waiting for voices to load...');
      let attempts = 0;
      const maxAttempts = 50;
      
      const checkVoices = () => {
        voices = window.speechSynthesis.getVoices();
        attempts++;
        
        if (voices.length > 0) {
          console.log('Enhanced TTS: Voices loaded successfully, count:', voices.length);
          resolve(voices);
        } else if (attempts >= maxAttempts) {
          console.warn('Enhanced TTS: Timeout waiting for voices, using empty array');
          resolve([]);
        } else {
          setTimeout(checkVoices, 100);
        }
      };
      
      // Set up voice change listener
      const onVoicesChanged = () => {
        voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          console.log('Enhanced TTS: Voices loaded via event, count:', voices.length);
          window.speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
          resolve(voices);
        }
      };
      
      window.speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
      checkVoices();
    });

    return this.voiceCheckPromise;
  }

  private async getVoicesWithRetry(): Promise<SpeechSynthesisVoice[]> {
    if (!this.isSupported) return [];
    
    // Force refresh voices first
    if (window.speechSynthesis.getVoices().length === 0) {
      // Trigger voice loading
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(''));
      window.speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    let voices = window.speechSynthesis.getVoices();
    let attempts = 0;
    const maxAttempts = 20;
    
    while (voices.length === 0 && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      voices = window.speechSynthesis.getVoices();
      attempts++;
    }
    
    console.log(`Enhanced TTS: Loaded ${voices.length} voices after ${attempts} attempts`);
    return voices;
  }

  private normalizeLanguageCode(language: string): string {
    // Handle common language code variations
    const langMap: { [key: string]: string } = {
      'bn': 'bn-IN',
      'hi': 'hi-IN',
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'zh': 'zh-CN',
      'ar': 'ar-SA',
      'ru': 'ru-RU',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'nl': 'nl-NL',
      'sv': 'sv-SE',
      'da': 'da-DK',
      'no': 'nb-NO',
      'fi': 'fi-FI',
      'pl': 'pl-PL',
      'tr': 'tr-TR',
      'he': 'he-IL',
      'th': 'th-TH',
      'vi': 'vi-VN',
      'cs': 'cs-CZ',
      'hu': 'hu-HU',
      'ro': 'ro-RO',
      'sk': 'sk-SK',
      'bg': 'bg-BG',
      'hr': 'hr-HR',
      'sl': 'sl-SI',
      'et': 'et-EE',
      'lv': 'lv-LV',
      'lt': 'lt-LT',
      'mt': 'mt-MT',
      'id': 'id-ID',
      'ms': 'ms-MY',
      'tl': 'tl-PH'
    };

    // Return mapped language or original if already in correct format
    return langMap[language.toLowerCase()] || language;
  }

  private findBestVoice(language: string, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;
    
    const langCode = language.toLowerCase();
    const primaryLang = langCode.split('-')[0];
    
    console.log(`Enhanced TTS: Finding voice for language: ${langCode}, primary: ${primaryLang}`);
    
    // Strategy 1: Exact match (e.g., 'en-US' matches 'en-US')
    let voice = voices.find(v => v.lang.toLowerCase() === langCode);
    if (voice) {
      console.log(`Enhanced TTS: Found exact match: ${voice.name} (${voice.lang})`);
      return voice;
    }
    
    // Strategy 2: Primary language with region (e.g., 'hi' matches 'hi-IN')
    voice = voices.find(v => v.lang.toLowerCase().startsWith(primaryLang + '-'));
    if (voice) {
      console.log(`Enhanced TTS: Found regional match: ${voice.name} (${voice.lang})`);
      return voice;
    }
    
    // Strategy 3: Primary language only (e.g., 'hi' matches 'hi')
    voice = voices.find(v => v.lang.toLowerCase() === primaryLang);
    if (voice) {
      console.log(`Enhanced TTS: Found primary language match: ${voice.name} (${voice.lang})`);
      return voice;
    }
    
    // Strategy 4: Fallback to English if available
    if (primaryLang !== 'en') {
      voice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
      if (voice) {
        console.log(`Enhanced TTS: Fallback to English: ${voice.name} (${voice.lang})`);
        return voice;
      }
    }
    
    console.log('Enhanced TTS: No suitable voice found, using default');
    return null;
  }

  public isTTSSupported(): boolean {
    return this.isSupported;
  }

  public async speak(
    text: string,
    language: string,
    options?: {
      rate?: number;
      pitch?: number;
      volume?: number;
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: string) => void;
    }
  ): Promise<void> {
    const {
      rate = 0.8,
      pitch = 1.0,
      volume = 1.0,
      onStart,
      onEnd,
      onError
    } = options || {};

    if (!this.isSupported) {
      const error = 'Text-to-speech is not supported in this browser';
      console.error('Enhanced TTS:', error);
      if (onError) onError(error);
      return;
    }

    if (!text || !text.trim()) {
      const error = 'No text provided for speech';
      console.error('Enhanced TTS:', error);
      if (onError) onError(error);
      return;
    }

    // Force stop any existing speech and wait - improved for multiple calls
    if (this.isCurrentlySpeaking || window.speechSynthesis.speaking) {
      console.log('Enhanced TTS: Stopping existing speech before starting new speech');
      this.stop();
      // Longer wait to ensure cleanup for repeated TTS calls
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    try {
      console.log(`Enhanced TTS: Speaking "${text}" in language: ${language}`);
      
      // Get voices with extended waiting
      const voices = await this.getVoicesWithRetry();
      console.log(`Enhanced TTS: Found ${voices.length} voices`);
      
      // Create utterance with explicit settings
      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;
      
      // Set language - use best available language code
      const normalizedLang = this.normalizeLanguageCode(language);
      utterance.lang = normalizedLang;
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = volume;
      
      // Find and set best voice
      const bestVoice = this.findBestVoice(normalizedLang, voices);
      if (bestVoice) {
        utterance.voice = bestVoice;
        console.log(`Enhanced TTS: Using voice "${bestVoice.name}" (${bestVoice.lang})`);
      } else {
        console.log(`Enhanced TTS: No specific voice found for ${normalizedLang}, using default`);
      }
      
      // Return promise with simplified error handling
      return new Promise((resolve, reject) => {
        let hasCompleted = false;
        this.isCurrentlySpeaking = true;
        
        const cleanup = () => {
          this.isCurrentlySpeaking = false;
          this.currentUtterance = null;
          hasCompleted = true;
        };
        
        utterance.onstart = () => {
          console.log('Enhanced TTS: Speech started successfully');
          if (onStart) onStart();
        };
        
        utterance.onend = () => {
          if (!hasCompleted) {
            cleanup();
            console.log('Enhanced TTS: Speech completed successfully');
            if (onEnd) onEnd();
            resolve();
          }
        };
        
        utterance.onerror = (event: SpeechSynthesisErrorEvent) => {
          console.error('Enhanced TTS: Speech error:', event.error);
          
          if (!hasCompleted) {
            cleanup();
            
            // Simplified error handling - no retry to avoid recursion
            let errorMessage = `Speech synthesis failed: ${event.error}`;
            if (event.error === 'interrupted') {
              errorMessage = 'Speech was interrupted. This may be due to browser limitations or multiple speech requests.';
            } else if (event.error === 'not-allowed') {
              errorMessage = 'Speech synthesis blocked. Please check browser permissions and ensure user interaction.';
            } else if (event.error === 'network') {
              errorMessage = 'Network error during speech synthesis.';
            }
            
            console.error('Enhanced TTS:', errorMessage);
            // Don't show intrusive alerts for timeout or interrupted errors
            if (event.error !== 'interrupted' && onError) onError(errorMessage);
            reject(new Error(errorMessage));
          }
        };
        
        // Safety timeout
        const timeout = setTimeout(() => {
          if (!hasCompleted) {
            cleanup();
            const error = 'Speech synthesis timeout';
            console.error('Enhanced TTS:', error);
            // Don't show intrusive alerts for timeout errors
            if (onError) onError(error);
            reject(new Error(error));
          }
        }, 30000); // 30 second timeout - increased for longer translations
        
        // Clear timeout when speech ends
        const originalOnEnd = utterance.onend;
        utterance.onend = (event) => {
          clearTimeout(timeout);
          if (originalOnEnd) originalOnEnd.call(utterance, event);
        };
        
        const originalOnError = utterance.onerror;
        utterance.onerror = (event) => {
          clearTimeout(timeout);
          if (originalOnError) originalOnError.call(utterance, event);
        };
        
        // Start speaking with user interaction check
        try {
          // Ensure clean state
          if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
          }
          
          // Small delay then speak
          setTimeout(() => {
            if (!hasCompleted) {
              window.speechSynthesis.speak(utterance);
              
              // Force resume if paused (Chrome fix)
              setTimeout(() => {
                if (window.speechSynthesis.paused && !hasCompleted) {
                  console.log('Enhanced TTS: Resuming paused speech');
                  window.speechSynthesis.resume();
                }
              }, 300);
            }
          }, 100);
          
        } catch (speakError) {
          clearTimeout(timeout);
          cleanup();
          const error = `Failed to start speech: ${speakError}`;
          console.error('Enhanced TTS:', error);
          if (onError) onError(error);
          reject(new Error(error));
        }
      });
      
    } catch (err) {
      this.isCurrentlySpeaking = false;
      this.currentUtterance = null;
      const error = 'Failed to initialize text-to-speech: ' + (err as Error).message;
      console.error('Enhanced TTS:', error);
      if (onError) onError(error);
      throw err;
    }
  }

  public stop(): void {
    if (this.isSupported) {
      try {
        window.speechSynthesis.cancel();
        this.isCurrentlySpeaking = false;
        this.currentUtterance = null;
        console.log('Enhanced TTS: All speech stopped');
      } catch (err) {
        console.error('Enhanced TTS: Error stopping speech:', err);
      }
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported) return [];
    return window.speechSynthesis.getVoices();
  }

  public async getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    return await this.getVoicesAsync();
  }

  public pause(): void {
    if (this.isSupported) {
      window.speechSynthesis.pause();
      console.log('Enhanced TTS: Speech paused');
    }
  }

  public resume(): void {
    if (this.isSupported) {
      window.speechSynthesis.resume();
      console.log('Enhanced TTS: Speech resumed');
    }
  }

  public get isSpeaking(): boolean {
    return this.isSupported && (this.isCurrentlySpeaking || window.speechSynthesis.speaking);
  }

  public get isPaused(): boolean {
    return this.isSupported && window.speechSynthesis.paused;
  }
}

// Translation service
export class TranslationService {
  public async translateText(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<string> {
    try {
      console.log(`Translating "${text}" from ${fromLang} to ${toLang}`);
      
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          from: fromLang,
          to: toLang,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API responded with status ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.translatedText) {
        throw new Error('No translation returned from API');
      }

      console.log(`Translation successful: "${data.translatedText}"`);
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  }
}

// Google Cloud TTS Service (fallback when browser TTS fails or for better quality)
export class GoogleCloudTTSService {
  private isEnabled: boolean = true;

  public async speak(
    text: string,
    language: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: string) => void;
    }
  ): Promise<void> {
    const { onStart, onEnd, onError } = options || {};

    try {
      console.log(`Google Cloud TTS: Requesting speech for "${text}" in ${language}`);
      
      if (onStart) onStart();
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS API responded with status ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('audio')) {
        // Got actual audio data from Google Cloud TTS
        const audioBuffer = await response.arrayBuffer();
        
        // Play the audio
        const audioBlob = new Blob([audioBuffer], { type: contentType });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
          if (onEnd) onEnd();
        };
        
        audio.onerror = () => {
          URL.revokeObjectURL(audioUrl);
          if (onError) onError('Failed to play Google Cloud TTS audio');
        };
        
        await audio.play();
        console.log('Google Cloud TTS: Audio playback started');
      } else {
        // Got JSON response (mock mode)
        const data = await response.json();
        console.log('Google Cloud TTS: Mock response received:', data);
        
        if (data.success) {
          // Fallback to browser TTS when Google Cloud TTS is not configured
          console.log('Google Cloud TTS not configured, falling back to browser TTS');
          await ttsService.speak(text, language, {
            onEnd,
            onError,
            volume: 1.0
          });
        } else {
          throw new Error(data.note || 'TTS service failed');
        }
      }
    } catch (error) {
      console.error('Google Cloud TTS error:', error);
      if (onError) {
        onError(`Google Cloud TTS failed: ${(error as Error).message}`);
      }
      throw error;
    }
  }

  public isSupported(): boolean {
    return this.isEnabled;
  }
}

// Export singleton instances
export const speechService = new BrowserSpeechService();
export const ttsService = new BrowserTTSService();
export const googleTTSService = new GoogleCloudTTSService();
export const translationService = new TranslationService();

// Hybrid TTS service that tries Google Cloud first, then falls back to browser
export class HybridTTSService {
  private preferGoogleCloud: boolean = true;

  public async speak(
    text: string,
    language: string,
    options?: {
      rate?: number;
      onSuccess?: () => void;
      onError?: (error: string) => void;
      preferBrowser?: boolean;
    }
  ): Promise<void> {
    const { rate = 0.8, onSuccess, onError, preferBrowser = false } = options || {};

    // Try Google Cloud TTS first (if preferred and not explicitly disabled)
    if (!preferBrowser && this.preferGoogleCloud) {
      try {
        await googleTTSService.speak(text, language, {
          onEnd: onSuccess,
          onError: (gcError) => {
            console.log('Google Cloud TTS failed, falling back to browser TTS:', gcError);
            // Fall back to browser TTS
            this.useBrowserTTS(text, language, { rate, onSuccess, onError });
          }
        });
        return;
      } catch (error) {
        console.log('Google Cloud TTS not available, using browser TTS');
      }
    }

    // Use browser TTS
    this.useBrowserTTS(text, language, { rate, onSuccess, onError });
  }

  private async useBrowserTTS(
    text: string,
    language: string,
    options: {
      rate?: number;
      onSuccess?: () => void;
      onError?: (error: string) => void;
    }
  ): Promise<void> {
    try {
      await ttsService.speak(text, language, {
        rate: options.rate || 0.8,
        volume: 1.0,
        onEnd: options.onSuccess,
        onError: options.onError
      });
    } catch (err) {
      console.error('Browser TTS failed:', err);
      if (options.onError) {
        options.onError((err as Error).message);
      }
    }
  }

  public stop(): void {
    ttsService.stop();
  }

  public isSupported(): boolean {
    return ttsService.isTTSSupported() || googleTTSService.isSupported();
  }

  public isSpeaking(): boolean {
    return ttsService.isSpeaking;
  }

  public setPreferGoogleCloud(prefer: boolean): void {
    this.preferGoogleCloud = prefer;
  }
}

// Create hybrid TTS instance
export const hybridTTSService = new HybridTTSService();

// Enhanced TTS function for easy integration with Google Cloud support
export const enhancedTTS = {
  speak: async (
    text: string, 
    language: string, 
    options?: {
      rate?: number;
      volume?: number;
      onSuccess?: () => void;
      onError?: (error: string) => void;
      preferBrowser?: boolean;
      useGoogleCloud?: boolean;
    }
  ) => {
    const { rate = 0.8, volume = 1.0, onSuccess, onError, preferBrowser = false, useGoogleCloud = true } = options || {};

    try {
      if (useGoogleCloud && !preferBrowser) {
        // Try Google Cloud TTS first
        await hybridTTSService.speak(text, language, {
          rate,
          onSuccess,
          onError,
          preferBrowser: false
        });
      } else {
        // Use browser TTS directly
        await ttsService.speak(text, language, {
          rate,
          volume,
          onEnd: onSuccess,
          onError
        });
      }
    } catch (err) {
      console.error('Enhanced TTS function error:', err);
      if (onError) {
        onError((err as Error).message);
      }
    }
  },
  
  // Try Google Cloud TTS specifically
  speakWithGoogleCloud: async (
    text: string,
    language: string,
    options?: {
      onSuccess?: () => void;
      onError?: (error: string) => void;
    }
  ) => {
    try {
      await googleTTSService.speak(text, language, {
        onEnd: options?.onSuccess,
        onError: options?.onError
      });
    } catch (err) {
      console.error('Google Cloud TTS specific call failed:', err);
      if (options?.onError) {
        options.onError((err as Error).message);
      }
    }
  },
  
  stop: () => {
    ttsService.stop();
    hybridTTSService.stop();
  },
  
  isSupported: () => ttsService.isTTSSupported(),
  isSpeaking: () => ttsService.isSpeaking || hybridTTSService.isSpeaking(),
  
  // Configure preference for Google Cloud vs Browser TTS
  setPreferGoogleCloud: (prefer: boolean) => {
    hybridTTSService.setPreferGoogleCloud(prefer);
  }
};