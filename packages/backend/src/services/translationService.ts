import axios from 'axios';

// Dynamic import for Google Cloud Translation to handle missing dependencies gracefully
let TranslationServiceClient: any = null;

try {
  const translate = require('@google-cloud/translate');
  TranslationServiceClient = translate.TranslationServiceClient;
} catch (error) {
  console.log('Google Cloud Translation not available, using free Google Translate API');
}

let translationClient: any = null;

// Enhanced language mapping for Google Cloud Translation API
// Optimized for Indian languages and international support
const languageMapping: { [key: string]: string } = {
  // English variants
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  
  // Indian languages - optimized for Google Cloud Translation
  'hi': 'hi',      // Hindi - हिन्दी
  'hi-IN': 'hi',
  'bn': 'bn',      // Bengali - বাংলা
  'bn-IN': 'bn',
  'bn-BD': 'bn',
  'ta': 'ta',      // Tamil - தமிழ்
  'ta-IN': 'ta',
  'ta-LK': 'ta',
  'te': 'te',      // Telugu - తెలుగు
  'te-IN': 'te',
  'mr': 'mr',      // Marathi - मराठी
  'mr-IN': 'mr',
  'gu': 'gu',      // Gujarati - ગુજરાતી
  'gu-IN': 'gu',
  'kn': 'kn',      // Kannada - ಕನ್ನಡ
  'kn-IN': 'kn',
  'ml': 'ml',      // Malayalam - മലയാളം
  'ml-IN': 'ml',
  'pa': 'pa',      // Punjabi - ਪੰਜਾਬੀ
  'pa-IN': 'pa',
  'or': 'or',      // Odia - ଓଡ଼ିଆ
  'or-IN': 'or',
  'as': 'as',      // Assamese - অসমীয়া
  'as-IN': 'as',
  'ur': 'ur',      // Urdu - اردو
  'ur-IN': 'ur',
  'ur-PK': 'ur',
  'ne': 'ne',      // Nepali - नेपाली
  'ne-NP': 'ne',
  'ne-IN': 'ne',
  'sd': 'sd',      // Sindhi - سنڌي
  'sd-IN': 'sd',
  'sa': 'sa',      // Sanskrit - संस्कृत
  'sa-IN': 'sa',
  
  // International languages
  'zh': 'zh',      // Chinese Simplified
  'zh-CN': 'zh',
  'zh-Hans': 'zh',
  'zh-TW': 'zh-TW', // Chinese Traditional
  'zh-Hant': 'zh-TW',
  'ja': 'ja',      // Japanese
  'ja-JP': 'ja',
  'ko': 'ko',      // Korean
  'ko-KR': 'ko',
  'ar': 'ar',      // Arabic
  'ar-SA': 'ar',
  'ar-AE': 'ar',
  'he': 'he',      // Hebrew
  'he-IL': 'he',
  
  // European languages
  'de': 'de',      // German
  'de-DE': 'de',
  'fr': 'fr',      // French
  'fr-FR': 'fr',
  'es': 'es',      // Spanish
  'es-ES': 'es',
  'es-MX': 'es',
  'it': 'it',      // Italian
  'it-IT': 'it',
  'ru': 'ru',      // Russian
  'ru-RU': 'ru',
  'pt': 'pt',      // Portuguese
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  'nl': 'nl',      // Dutch
  'nl-NL': 'nl',
  'sv': 'sv',      // Swedish
  'sv-SE': 'sv',
  'da': 'da',      // Danish
  'da-DK': 'da',
  'no': 'no',      // Norwegian
  'nb': 'no',      // Norwegian Bokmal
  'fi': 'fi',      // Finnish
  'fi-FI': 'fi',
  'pl': 'pl',      // Polish
  'pl-PL': 'pl',
  'tr': 'tr',      // Turkish
  'tr-TR': 'tr',
  'cs': 'cs',      // Czech
  'cs-CZ': 'cs',
  'hu': 'hu',      // Hungarian
  'hu-HU': 'hu',
  'ro': 'ro',      // Romanian
  'ro-RO': 'ro',
  'bg': 'bg',      // Bulgarian
  'bg-BG': 'bg',
  'hr': 'hr',      // Croatian
  'hr-HR': 'hr',
  'sk': 'sk',      // Slovak
  'sk-SK': 'sk',
  'sl': 'sl',      // Slovenian
  'sl-SI': 'sl',
  'et': 'et',      // Estonian
  'et-EE': 'et',
  'lv': 'lv',      // Latvian
  'lv-LV': 'lv',
  'lt': 'lt',      // Lithuanian
  'lt-LT': 'lt',
  'mt': 'mt',      // Maltese
  'mt-MT': 'mt',
  
  // Southeast Asian languages
  'id': 'id',      // Indonesian
  'id-ID': 'id',
  'ms': 'ms',      // Malay
  'ms-MY': 'ms',
  'tl': 'tl',      // Filipino/Tagalog
  'tl-PH': 'tl',
  'fil': 'tl',     // Filipino alternative code
  'th': 'th',      // Thai
  'th-TH': 'th',
  'vi': 'vi',      // Vietnamese
  'vi-VN': 'vi',
  'my': 'my',      // Myanmar
  'my-MM': 'my',
  'km': 'km',      // Khmer
  'km-KH': 'km',
  'lo': 'lo',      // Lao
  'lo-LA': 'lo'
};

function initializeClient() {
  try {
    if (process.env.USE_GCP === 'true' && TranslationServiceClient) {
      // Check if service account file exists
      const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './keys/service-account.json';
      const fs = require('fs');
      const path = require('path');
      
      // Resolve the path relative to the backend src directory
      const resolvedPath = path.resolve(__dirname, '..', serviceAccountPath);
      
      if (fs.existsSync(resolvedPath)) {
        translationClient = new TranslationServiceClient();
        console.log('Google Cloud Translation client initialized successfully');
        console.log('Project ID:', process.env.GOOGLE_CLOUD_PROJECT);
      } else {
        console.log('Service account file not found at:', resolvedPath);
        console.log('Falling back to free Google Translate API service');
      }
    } else {
      console.log('Using free Google Translate API service');
    }
  } catch (error) {
    console.error('Failed to initialize Google Cloud Translation client:', error);
    console.log('Falling back to free Google Translate API service');
  }
}

export async function translateText(text: string, from: string, to: string): Promise<string> {
  // Skip translation if source and target are the same
  if (from === to || !text.trim()) {
    return text;
  }

  try {
    if (!translationClient) {
      initializeClient();
    }

    // Try Google Cloud Translation if available
    if (translationClient && process.env.USE_GCP === 'true' && TranslationServiceClient) {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'lingua-phone';
      const location = 'global';
      
      console.log(`Using Google Cloud Translation for "${text}" from ${from} to ${to}`);

      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [text],
        mimeType: 'text/plain',
        sourceLanguageCode: languageMapping[from] || from,
        targetLanguageCode: languageMapping[to] || to,
      };

      const [response] = await translationClient.translateText(request);
      const translated = response.translations?.[0]?.translatedText;
      if (translated) {
        console.log(`Google Cloud Translation successful: "${translated}"`);
        return translated;
      }
    }

    // Fallback to free Google Translate API
    return await freeGoogleTranslate(text, from, to);
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback to free service on error
    return await freeGoogleTranslate(text, from, to);
  }
}

// Multiple Google Translate API implementations with fallbacks
async function freeGoogleTranslate(text: string, from: string, to: string): Promise<string> {
  try {
    console.log(`Translating "${text}" from ${from} to ${to} using Google Translate API`);
    
    const fromLang = languageMapping[from] || from;
    const toLang = languageMapping[to] || to;
    
    // Method 1: Try Google Translate free API endpoint
    try {
      const url1 = 'https://translate.googleapis.com/translate_a/single';
      const params1 = {
        client: 'gtx',
        sl: fromLang,
        tl: toLang,
        dt: 't',
        q: text
      };
      
      const response1 = await axios.get(url1, { 
        params: params1,
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        }
      });
      
      if (response1.data && response1.data[0] && response1.data[0][0] && response1.data[0][0][0]) {
        const translatedText = response1.data[0][0][0];
        console.log(`Translation successful (Method 1): "${translatedText}"`);
        return translatedText;
      }
    } catch (err1) {
      console.log('Method 1 failed, trying Method 2...');
    }
    
    // Method 2: Try alternative endpoint
    try {
      const url2 = 'https://translate.googleapis.com/translate_a/t';
      const params2 = {
        client: 'dict-chrome-ex',
        sl: fromLang,
        tl: toLang,
        q: text
      };
      
      const response2 = await axios.get(url2, { 
        params: params2,
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (response2.data && response2.data[0]) {
        const translatedText = response2.data[0];
        console.log(`Translation successful (Method 2): "${translatedText}"`);
        return translatedText;
      }
    } catch (err2) {
      console.log('Method 2 failed, trying Method 3...');
    }
    
    // Method 3: Use MyMemory API as fallback
    try {
      const url3 = 'https://api.mymemory.translated.net/get';
      const params3 = {
        q: text,
        langpair: `${fromLang}|${toLang}`
      };
      
      const response3 = await axios.get(url3, { 
        params: params3,
        timeout: 5000
      });
      
      if (response3.data && response3.data.responseData && response3.data.responseData.translatedText) {
        const translatedText = response3.data.responseData.translatedText;
        console.log(`Translation successful (Method 3): "${translatedText}"`);
        return translatedText;
      }
    } catch (err3) {
      console.log('Method 3 failed, using intelligent fallback');
    }
    
    console.log('All translation APIs failed, using intelligent fallback');
    return intelligentMockTranslate(text, from, to);
  } catch (error) {
    console.error('All translation methods failed:', error);
    console.log('Using intelligent fallback translation');
    return intelligentMockTranslate(text, from, to);
  }
}

// Enhanced fallback translation using built-in translation patterns
async function fallbackTranslate(text: string, from: string, to: string): Promise<string> {
  console.log(`Translating "${text}" from ${from} to ${to}`);
  
  // Try free Google Translate first
  return await freeGoogleTranslate(text, from, to);
}

// Intelligent mock translation with comprehensive language patterns
function intelligentMockTranslate(text: string, from: string, to: string): string {
  const translations: { [key: string]: { [key: string]: { [key: string]: string } } } = {
    'en': {
      'hi': {
        'hello': 'नमस्ते',
        'thank you': 'धन्यवाद',
        'good morning': 'सुप्रभात',
        'good evening': 'शुभ संध्या',
        'how are you': 'आप कैसे हैं',
        'my name is': 'मेरा नाम है',
        'yes': 'हाँ',
        'no': 'नहीं',
        'please': 'कृपया',
        'sorry': 'माफ़ करना',
        'welcome': 'स्वागत है',
        'goodbye': 'अलविदा',
        'i need': 'मुझे चाहिए',
        'how much': 'कितना',
        'water': 'पानी',
        'food': 'खाना',
        'help': 'मदद',
        'market': 'बाज़ार',
        'hotel': 'होटल',
        'police': 'पुलिस',
        'restaurant': 'रेस्टोरेंट',
        'i would like to buy': 'मैं खरीदना चाहूंगा',
        'fresh vegetables': 'ताज़ी सब्जियां',
        'tomatoes': 'टमाटर',
        'onions': 'प्याज',
        'potatoes': 'आलू',
        'i have a reservation': 'मेरा आरक्षण है',
        'passport': 'पासपोर्ट',
        'breakfast': 'नाश्ता',
        'room key': 'कमरे की चाबी',
        'lost wallet': 'खोया हुआ बटुआ',
        'city center': 'शहर का केंद्र',
        'this morning': 'आज सुबह',
        'table for two': 'दो लोगों के लिए टेबल',
        'recommend': 'सुझाना',
        'popular dish': 'लोकप्रिय व्यंजन',
        'chicken curry': 'चिकन करी',
        'vegetable biryani': 'सब्जी बिरयानी'
      },
      'es': {
        'hello': 'hola',
        'thank you': 'gracias',
        'good morning': 'buenos días',
        'good evening': 'buenas tardes',
        'how are you': 'cómo estás',
        'my name is': 'mi nombre es',
        'yes': 'sí',
        'no': 'no',
        'please': 'por favor',
        'sorry': 'lo siento',
        'welcome': 'bienvenido',
        'goodbye': 'adiós',
        'i need': 'necesito',
        'how much': 'cuánto',
        'water': 'agua',
        'food': 'comida',
        'help': 'ayuda',
        'market': 'mercado',
        'hotel': 'hotel',
        'police': 'policía',
        'restaurant': 'restaurante',
        'i would like to buy': 'me gustaría comprar',
        'fresh vegetables': 'verduras frescas',
        'tomatoes': 'tomates',
        'onions': 'cebollas',
        'potatoes': 'papas',
        'i have a reservation': 'tengo una reserva',
        'passport': 'pasaporte',
        'breakfast': 'desayuno',
        'room key': 'llave de la habitación',
        'lost wallet': 'billetera perdida',
        'city center': 'centro de la ciudad',
        'this morning': 'esta mañana',
        'table for two': 'mesa para dos',
        'recommend': 'recomendar',
        'popular dish': 'plato popular',
        'chicken curry': 'curry de pollo',
        'vegetable biryani': 'biryani de verduras'
      },
      'fr': {
        'hello': 'bonjour',
        'thank you': 'merci',
        'good morning': 'bonjour',
        'good evening': 'bonsoir',
        'how are you': 'comment allez-vous',
        'my name is': 'je m\'appelle',
        'yes': 'oui',
        'no': 'non',
        'please': 's\'il vous plaît',
        'sorry': 'désolé',
        'welcome': 'bienvenue',
        'goodbye': 'au revoir',
        'i need': 'j\'ai besoin',
        'how much': 'combien',
        'water': 'eau',
        'food': 'nourriture',
        'help': 'aide',
        'market': 'marché',
        'hotel': 'hôtel',
        'police': 'police',
        'restaurant': 'restaurant',
        'i would like to buy': 'je voudrais acheter',
        'fresh vegetables': 'légumes frais',
        'tomatoes': 'tomates',
        'onions': 'oignons',
        'potatoes': 'pommes de terre',
        'i have a reservation': 'j\'ai une réservation',
        'passport': 'passeport',
        'breakfast': 'petit déjeuner',
        'room key': 'clé de chambre',
        'lost wallet': 'portefeuille perdu',
        'city center': 'centre-ville',
        'this morning': 'ce matin',
        'table for two': 'table pour deux',
        'recommend': 'recommander',
        'popular dish': 'plat populaire',
        'chicken curry': 'curry de poulet',
        'vegetable biryani': 'biryani aux légumes'
      },
      'de': {
        'hello': 'hallo',
        'thank you': 'danke',
        'good morning': 'guten Morgen',
        'good evening': 'guten Abend',
        'how are you': 'wie geht es dir',
        'my name is': 'mein Name ist',
        'yes': 'ja',
        'no': 'nein',
        'please': 'bitte',
        'sorry': 'entschuldigung',
        'welcome': 'willkommen',
        'goodbye': 'auf Wiedersehen',
        'i need': 'ich brauche',
        'how much': 'wie viel',
        'water': 'Wasser',
        'food': 'Essen',
        'help': 'Hilfe',
        'market': 'Markt',
        'hotel': 'Hotel',
        'police': 'Polizei',
        'restaurant': 'Restaurant',
        'i would like to buy': 'ich möchte kaufen',
        'fresh vegetables': 'frisches Gemüse',
        'tomatoes': 'Tomaten',
        'onions': 'Zwiebeln',
        'potatoes': 'Kartoffeln',
        'i have a reservation': 'ich habe eine Reservierung',
        'passport': 'Reisepass',
        'breakfast': 'Frühstück',
        'room key': 'Zimmerschlüssel',
        'lost wallet': 'verlorene Brieftasche',
        'city center': 'Stadtzentrum',
        'this morning': 'heute Morgen',
        'table for two': 'Tisch für zwei',
        'recommend': 'empfehlen',
        'popular dish': 'beliebtes Gericht',
        'chicken curry': 'Hähnchen-Curry',
        'vegetable biryani': 'Gemüse-Biryani'
      }
    }
  };

  // Add reverse translations
  Object.keys(translations).forEach(fromLang => {
    Object.keys(translations[fromLang]).forEach(toLang => {
      if (!translations[toLang]) translations[toLang] = {};
      if (!translations[toLang][fromLang]) translations[toLang][fromLang] = {};
      
      Object.entries(translations[fromLang][toLang]).forEach(([key, value]) => {
        translations[toLang][fromLang][value] = key;
      });
    });
  });

  const lowerText = text.toLowerCase().trim();
  
  // Check for direct translations
  if (translations[from] && translations[from][to] && translations[from][to][lowerText]) {
    return translations[from][to][lowerText];
  }
  
  // Check for partial matches and multi-word phrases
  if (translations[from] && translations[from][to]) {
    let translatedText = text;
    let hasTranslation = false;
    
    // Sort by length (longest first) to handle longer phrases first
    const sortedKeys = Object.keys(translations[from][to]).sort((a, b) => b.length - a.length);
    
    for (const key of sortedKeys) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      if (regex.test(lowerText)) {
        translatedText = translatedText.replace(regex, translations[from][to][key]);
        hasTranslation = true;
      }
    }
    
    if (hasTranslation) {
      return translatedText;
    }
  }
  
  // Language indicators for untranslated text
  const languageIndicators: { [key: string]: string } = {
    'hi': '[हिंदी में] ',
    'es': '[En Español] ',
    'fr': '[En Français] ',
    'de': '[Auf Deutsch] ',
    'zh': '[中文翻译] ',
    'ja': '[日本語で] ',
    'ar': '[بالعربية] ',
    'ru': '[По-русски] ',
    'ko': '[한국어로] ',
    'it': '[In Italiano] ',
    'pt': '[Em Português] '
  };
  
  const indicator = languageIndicators[to] || `[${to.toUpperCase()}] `;
  return `${indicator}${text}`;
}

export async function mockTranslate(text: string, from: string, to: string) {
  return intelligentMockTranslate(text, from, to);
}

// Add a function to test if Google Cloud Translation is working
export async function testGoogleCloudTranslation(): Promise<boolean> {
  try {
    if (!translationClient) {
      initializeClient();
    }
    
    if (translationClient && process.env.USE_GCP === 'true' && TranslationServiceClient) {
      const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'lingua-phone';
      const location = 'global';
      
      const request = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: ['Hello'],
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: 'es',
      };

      const [response] = await translationClient.translateText(request);
      const translated = response.translations?.[0]?.translatedText;
      
      return !!translated;
    }
    return false;
  } catch (error) {
    console.error('Google Cloud Translation test failed:', error);
    return false;
  }
}

// Initialize client on module load
initializeClient();
