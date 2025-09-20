// Dynamic imports for Google Cloud services to handle missing dependencies gracefully
let TranslationServiceClient: any = null;
let SpeechClient: any = null;

try {
  const translate = require('@google-cloud/translate');
  TranslationServiceClient = translate.TranslationServiceClient;
} catch (error) {
  console.log('Google Cloud Translation not available, using fallback');
}

try {
  const speech = require('@google-cloud/speech');
  SpeechClient = speech.SpeechClient;
} catch (error) {
  console.log('Google Cloud Speech not available, using fallback');
}

interface Language {
  code: string;
  name: string;
  bcp47: string;
  sttSupported: boolean;
  ttsSupported: boolean;
}

let cachedLanguages: Language[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Initialize clients (will use environment variables for auth)
let translationClient: any = null;
let speechClient: any = null;

function initializeClients() {
  try {
    // Only initialize if USE_GCP environment variable is set to true and packages are available
    if (process.env.USE_GCP === 'true' && TranslationServiceClient && SpeechClient) {
      translationClient = new TranslationServiceClient();
      speechClient = new SpeechClient();
      console.log('Google Cloud clients initialized');
    } else {
      console.log('Using mock mode - set USE_GCP=true and install Google Cloud packages to use Google Cloud services');
    }
  } catch (error) {
    console.error('Failed to initialize Google Cloud clients:', error);
    console.log('Falling back to mock mode');
  }
}

export async function getSupportedLanguages(): Promise<Language[]> {
  // Return cached languages if they're recent
  const now = Date.now();
  if (cachedLanguages && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedLanguages;
  }

  try {
    if (!translationClient || !speechClient) {
      initializeClients();
    }

    if (translationClient && speechClient && TranslationServiceClient) {
      // Fetch translation languages
      const [translationResponse] = await translationClient.getSupportedLanguages({
        parent: 'projects/' + (process.env.GOOGLE_CLOUD_PROJECT || 'your-project-id'),
        displayLanguageCode: 'en',
      });

      // Fetch speech-to-text languages
      const speechLanguages = new Set([
        'en-US', 'hi-IN', 'bn-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'mr-IN', 
        'ne-NP', 'or-IN', 'pa-IN', 'ta-IN', 'te-IN', 'ur-IN',
        'yue', 'zh-CN', 'ja-JP', 'de-DE', 'fr-FR', 'es-ES', 'es-MX',
        'ar-SA', 'ko-KR', 'it-IT', 'vi-VN', 'ru-RU', 'id-ID', 'tl-PH',
        'tr-TR', 'pl-PL'
      ]);

      const languages: Language[] = [];
      
      if (translationResponse.languages) {
        for (const lang of translationResponse.languages) {
          if (lang.languageCode) {
            const bcp47 = convertToBcp47(lang.languageCode);
            languages.push({
              code: lang.languageCode,
              name: lang.displayName || lang.languageCode,
              bcp47: bcp47,
              sttSupported: speechLanguages.has(bcp47),
              ttsSupported: true, // Most languages support TTS in GCP
            });
          }
        }
      }

      cachedLanguages = languages;
      lastFetchTime = now;
      return languages;
    }
  } catch (error) {
    console.error('Error fetching languages from Google Cloud:', error);
  }

  // Fallback to static language list
  const fallbackLanguages = getFallbackLanguages();
  cachedLanguages = fallbackLanguages;
  lastFetchTime = now;
  return fallbackLanguages;
}

function convertToBcp47(langCode: string): string {
  // Convert Google Translate language codes to BCP-47 format
  const mapping: { [key: string]: string } = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'bn': 'bn-IN',
    'gu': 'gu-IN',
    'kn': 'kn-IN',
    'ml': 'ml-IN',
    'mr': 'mr-IN',
    'ne': 'ne-NP',
    'or': 'or-IN',
    'pa': 'pa-IN',
    'ta': 'ta-IN',
    'te': 'te-IN',
    'ur': 'ur-IN',
    'zh': 'zh-CN',
    'ja': 'ja-JP',
    'de': 'de-DE',
    'fr': 'fr-FR',
    'es': 'es-ES',
    'ar': 'ar-SA',
    'ko': 'ko-KR',
    'it': 'it-IT',
    'vi': 'vi-VN',
    'ru': 'ru-RU',
    'id': 'id-ID',
    'tl': 'tl-PH',
    'tr': 'tr-TR',
    'pl': 'pl-PL'
  };
  
  return mapping[langCode] || langCode;
}

function getFallbackLanguages(): Language[] {
  return [
    { code: 'en', name: 'English', bcp47: 'en-US', sttSupported: true, ttsSupported: true },
    { code: 'hi', name: 'Hindi', bcp47: 'hi-IN', sttSupported: true, ttsSupported: true },
    { code: 'bn', name: 'Bengali', bcp47: 'bn-IN', sttSupported: true, ttsSupported: true },
    { code: 'as', name: 'Assamese', bcp47: 'as-IN', sttSupported: false, ttsSupported: false },
    { code: 'brx', name: 'Bodo', bcp47: 'brx-IN', sttSupported: false, ttsSupported: false },
    { code: 'doi', name: 'Dogri', bcp47: 'doi-IN', sttSupported: false, ttsSupported: false },
    { code: 'gu', name: 'Gujarati', bcp47: 'gu-IN', sttSupported: true, ttsSupported: true },
    { code: 'kn', name: 'Kannada', bcp47: 'kn-IN', sttSupported: true, ttsSupported: true },
    { code: 'ks', name: 'Kashmiri', bcp47: 'ks-IN', sttSupported: false, ttsSupported: false },
    { code: 'gom', name: 'Konkani', bcp47: 'gom-IN', sttSupported: false, ttsSupported: false },
    { code: 'mai', name: 'Maithili', bcp47: 'mai-IN', sttSupported: false, ttsSupported: false },
    { code: 'ml', name: 'Malayalam', bcp47: 'ml-IN', sttSupported: true, ttsSupported: true },
    { code: 'mni', name: 'Manipuri', bcp47: 'mni-IN', sttSupported: false, ttsSupported: false },
    { code: 'mr', name: 'Marathi', bcp47: 'mr-IN', sttSupported: true, ttsSupported: true },
    { code: 'ne', name: 'Nepali', bcp47: 'ne-NP', sttSupported: true, ttsSupported: true },
    { code: 'or', name: 'Odia', bcp47: 'or-IN', sttSupported: true, ttsSupported: true },
    { code: 'pa', name: 'Punjabi', bcp47: 'pa-IN', sttSupported: true, ttsSupported: true },
    { code: 'sa', name: 'Sanskrit', bcp47: 'sa-IN', sttSupported: false, ttsSupported: false },
    { code: 'sat', name: 'Santhali', bcp47: 'sat-IN', sttSupported: false, ttsSupported: false },
    { code: 'sd', name: 'Sindhi', bcp47: 'sd-IN', sttSupported: false, ttsSupported: false },
    { code: 'ta', name: 'Tamil', bcp47: 'ta-IN', sttSupported: true, ttsSupported: true },
    { code: 'te', name: 'Telugu', bcp47: 'te-IN', sttSupported: true, ttsSupported: true },
    { code: 'ur', name: 'Urdu', bcp47: 'ur-IN', sttSupported: true, ttsSupported: true },
    { code: 'bho', name: 'Bhojpuri', bcp47: 'bho', sttSupported: false, ttsSupported: false },
    { code: 'tcy', name: 'Tulu', bcp47: 'tcy', sttSupported: false, ttsSupported: false },
    { code: 'yue', name: 'Cantonese', bcp47: 'yue', sttSupported: true, ttsSupported: true },
    { code: 'zh', name: 'Chinese (Mandarin)', bcp47: 'zh-CN', sttSupported: true, ttsSupported: true },
    { code: 'ja', name: 'Japanese', bcp47: 'ja-JP', sttSupported: true, ttsSupported: true },
    { code: 'de', name: 'German', bcp47: 'de-DE', sttSupported: true, ttsSupported: true },
    { code: 'fr', name: 'French', bcp47: 'fr-FR', sttSupported: true, ttsSupported: true },
    { code: 'es', name: 'Spanish', bcp47: 'es-ES', sttSupported: true, ttsSupported: true },
    { code: 'es-mx', name: 'Spanish (Mexico)', bcp47: 'es-MX', sttSupported: true, ttsSupported: true },
    { code: 'ar', name: 'Arabic', bcp47: 'ar-SA', sttSupported: true, ttsSupported: true },
    { code: 'ko', name: 'Korean', bcp47: 'ko-KR', sttSupported: true, ttsSupported: true },
    { code: 'it', name: 'Italian', bcp47: 'it-IT', sttSupported: true, ttsSupported: true },
    { code: 'vi', name: 'Vietnamese', bcp47: 'vi-VN', sttSupported: true, ttsSupported: true },
    { code: 'ru', name: 'Russian', bcp47: 'ru-RU', sttSupported: true, ttsSupported: true },
    { code: 'en-ng', name: 'Nigerian English', bcp47: 'en-NG', sttSupported: false, ttsSupported: false },
    { code: 'sw', name: 'Swahili', bcp47: 'sw', sttSupported: false, ttsSupported: false },
    { code: 'ga', name: 'Irish', bcp47: 'ga-IE', sttSupported: false, ttsSupported: false },
    { code: 'ms', name: 'Malaysian', bcp47: 'ms-MY', sttSupported: false, ttsSupported: false },
    { code: 'id', name: 'Indonesian', bcp47: 'id-ID', sttSupported: true, ttsSupported: true },
    { code: 'tl', name: 'Tagalog', bcp47: 'tl-PH', sttSupported: true, ttsSupported: true },
    { code: 'ceb', name: 'Cebuano', bcp47: 'ceb', sttSupported: false, ttsSupported: false },
    { code: 'tr', name: 'Turkish', bcp47: 'tr-TR', sttSupported: true, ttsSupported: true },
    { code: 'pl', name: 'Polish', bcp47: 'pl-PL', sttSupported: true, ttsSupported: true }
  ];
}

// Initialize clients on module load
initializeClients();