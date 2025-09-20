// Enhanced Google Cloud Text-to-Speech Service with improved voice selection

// Dynamic import for Google Cloud TTS to handle missing dependencies gracefully
let TextToSpeechClient: any = null;

try {
  const tts = require('@google-cloud/text-to-speech');
  TextToSpeechClient = tts.TextToSpeechClient;
} catch (error) {
  console.log('Google Cloud Text-to-Speech not available, using fallback');
}

let ttsClient: any = null;

// Enhanced language to voice mapping for better voice selection
const voiceMapping: { [key: string]: any } = {
  'en-US': { languageCode: 'en-US', name: 'en-US-Standard-C', ssmlGender: 'FEMALE' },
  'en': { languageCode: 'en-US', name: 'en-US-Standard-C', ssmlGender: 'FEMALE' },
  'hi-IN': { languageCode: 'hi-IN', name: 'hi-IN-Standard-A', ssmlGender: 'FEMALE' },
  'hi': { languageCode: 'hi-IN', name: 'hi-IN-Standard-A', ssmlGender: 'FEMALE' },
  'bn-IN': { languageCode: 'bn-IN', name: 'bn-IN-Standard-A', ssmlGender: 'FEMALE' },
  'bn': { languageCode: 'bn-IN', name: 'bn-IN-Standard-A', ssmlGender: 'FEMALE' },
  'gu-IN': { languageCode: 'gu-IN', name: 'gu-IN-Standard-A', ssmlGender: 'FEMALE' },
  'gu': { languageCode: 'gu-IN', name: 'gu-IN-Standard-A', ssmlGender: 'FEMALE' },
  'kn-IN': { languageCode: 'kn-IN', name: 'kn-IN-Standard-A', ssmlGender: 'FEMALE' },
  'kn': { languageCode: 'kn-IN', name: 'kn-IN-Standard-A', ssmlGender: 'FEMALE' },
  'ml-IN': { languageCode: 'ml-IN', name: 'ml-IN-Standard-A', ssmlGender: 'FEMALE' },
  'ml': { languageCode: 'ml-IN', name: 'ml-IN-Standard-A', ssmlGender: 'FEMALE' },
  'mr-IN': { languageCode: 'mr-IN', name: 'mr-IN-Standard-A', ssmlGender: 'FEMALE' },
  'mr': { languageCode: 'mr-IN', name: 'mr-IN-Standard-A', ssmlGender: 'FEMALE' },
  'ta-IN': { languageCode: 'ta-IN', name: 'ta-IN-Standard-A', ssmlGender: 'FEMALE' },
  'ta': { languageCode: 'ta-IN', name: 'ta-IN-Standard-A', ssmlGender: 'FEMALE' },
  'te-IN': { languageCode: 'te-IN', name: 'te-IN-Standard-A', ssmlGender: 'FEMALE' },
  'te': { languageCode: 'te-IN', name: 'te-IN-Standard-A', ssmlGender: 'FEMALE' },
  'zh-CN': { languageCode: 'zh-CN', name: 'zh-CN-Standard-A', ssmlGender: 'FEMALE' },
  'zh': { languageCode: 'zh-CN', name: 'zh-CN-Standard-A', ssmlGender: 'FEMALE' },
  'ja-JP': { languageCode: 'ja-JP', name: 'ja-JP-Standard-A', ssmlGender: 'FEMALE' },
  'ja': { languageCode: 'ja-JP', name: 'ja-JP-Standard-A', ssmlGender: 'FEMALE' },
  'ko-KR': { languageCode: 'ko-KR', name: 'ko-KR-Standard-A', ssmlGender: 'FEMALE' },
  'ko': { languageCode: 'ko-KR', name: 'ko-KR-Standard-A', ssmlGender: 'FEMALE' },
  'fr-FR': { languageCode: 'fr-FR', name: 'fr-FR-Standard-A', ssmlGender: 'FEMALE' },
  'fr': { languageCode: 'fr-FR', name: 'fr-FR-Standard-A', ssmlGender: 'FEMALE' },
  'de-DE': { languageCode: 'de-DE', name: 'de-DE-Standard-A', ssmlGender: 'FEMALE' },
  'de': { languageCode: 'de-DE', name: 'de-DE-Standard-A', ssmlGender: 'FEMALE' },
  'es-ES': { languageCode: 'es-ES', name: 'es-ES-Standard-A', ssmlGender: 'FEMALE' },
  'es': { languageCode: 'es-ES', name: 'es-ES-Standard-A', ssmlGender: 'FEMALE' },
  'it-IT': { languageCode: 'it-IT', name: 'it-IT-Standard-A', ssmlGender: 'FEMALE' },
  'it': { languageCode: 'it-IT', name: 'it-IT-Standard-A', ssmlGender: 'FEMALE' },
  'ru-RU': { languageCode: 'ru-RU', name: 'ru-RU-Standard-A', ssmlGender: 'FEMALE' },
  'ru': { languageCode: 'ru-RU', name: 'ru-RU-Standard-A', ssmlGender: 'FEMALE' },
  'ar-XA': { languageCode: 'ar-XA', name: 'ar-XA-Standard-A', ssmlGender: 'FEMALE' },
  'ar': { languageCode: 'ar-XA', name: 'ar-XA-Standard-A', ssmlGender: 'FEMALE' },
  'tr-TR': { languageCode: 'tr-TR', name: 'tr-TR-Standard-A', ssmlGender: 'FEMALE' },
  'tr': { languageCode: 'tr-TR', name: 'tr-TR-Standard-A', ssmlGender: 'FEMALE' },
  'pl-PL': { languageCode: 'pl-PL', name: 'pl-PL-Standard-A', ssmlGender: 'FEMALE' },
  'pl': { languageCode: 'pl-PL', name: 'pl-PL-Standard-A', ssmlGender: 'FEMALE' }
};

function getVoiceConfig(language: string) {
  // Try exact match first
  if (voiceMapping[language]) {
    return voiceMapping[language];
  }
  
  // Try language code without region
  const langCode = language.split('-')[0];
  if (voiceMapping[langCode]) {
    return voiceMapping[langCode];
  }
  
  // Fallback to English
  return voiceMapping['en-US'];
}

function initializeClient() {
  try {
    if (process.env.USE_GCP === 'true' && TextToSpeechClient) {
      ttsClient = new TextToSpeechClient();
      console.log('Google Cloud TTS client initialized successfully');
      console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT);
    } else {
      console.log('Google Cloud TTS not enabled, using fallback');
    }
  } catch (error) {
    console.error('Failed to initialize Google Cloud TTS client:', error);
    console.log('Falling back to mock TTS service');
  }
}

export async function textToSpeech(text: string, language: string) {
  try {
    if (!ttsClient) {
      initializeClient();
    }

    if (ttsClient && process.env.USE_GCP === 'true' && TextToSpeechClient) {
      console.log(`Generating speech for "${text}" in language: ${language}`);
      
      const voiceConfig = getVoiceConfig(language);
      console.log('Using voice config:', voiceConfig);
      
      const request = {
        input: { text: text },
        voice: {
          languageCode: voiceConfig.languageCode,
          name: voiceConfig.name,
          ssmlGender: voiceConfig.ssmlGender,
        },
        audioConfig: {
          audioEncoding: 'MP3' as const,
          speakingRate: 0.9,
          pitch: 0.0,
          volumeGainDb: 0.0,
          sampleRateHertz: 22050,
        },
      };

      const [response] = await ttsClient.synthesizeSpeech(request);
      
      if (response.audioContent) {
        console.log('Google Cloud TTS synthesis successful');
        return {
          success: true,
          audioBuffer: response.audioContent,
          text,
          language,
          voiceUsed: voiceConfig.name,
          contentType: 'audio/mpeg',
          provider: 'google-cloud'
        };
      } else {
        throw new Error('No audio content received from Google Cloud TTS');
      }
    } else {
      console.log('Google Cloud TTS not available, using fallback');
      return mockTTS(text, language);
    }
  } catch (error) {
    console.error('Google Cloud TTS error:', error);
    console.log('Falling back to mock TTS service');
    return mockTTS(text, language);
  }
}

export async function mockTTS(text: string, language: string) {
  // Enhanced mock TTS response with detailed information
  console.log(`Mock TTS: "${text}" in ${language}`);
  return {
    success: true,
    audioBuffer: null, // Would contain actual audio data from GCP TTS
    text,
    language,
    provider: 'mock',
    note: 'Mock TTS service - Google Cloud TTS not configured. Use browser speechSynthesis for demo.'
  };
}

// Initialize client on module load
initializeClient();
