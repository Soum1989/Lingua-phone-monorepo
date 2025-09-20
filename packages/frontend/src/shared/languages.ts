// Language interface with geographic and demographic data
export interface Language {
  code: string;
  name: string;
  bcp47: string;
  sttSupported: boolean;
  ttsSupported: boolean;
  // New geographic and demographic data
  coordinates: { lat: number; lng: number }[];
  population: number;
  rank: number; // World ranking by speakers
  regions: string[];
  facts: string[];
  flag?: string;
}

export default [
  { 
    code: 'en', 
    name: 'English', 
    bcp47: 'en-US', 
    sttSupported: true, 
    ttsSupported: true,
    coordinates: [
      { lat: 37.0902, lng: -95.7129 }, // USA
      { lat: 55.3781, lng: -3.4360 },  // UK
      { lat: -25.2744, lng: 133.7751 }, // Australia
      { lat: 56.1304, lng: -106.3468 }, // Canada
      { lat: -40.9006, lng: 174.8860 }  // New Zealand
    ],
    population: 1500000000,
    rank: 1,
    regions: ['North America', 'Europe', 'Australia', 'Parts of Africa and Asia'],
    facts: [
      'Most spoken language in the world by total speakers',
      'Official language in 67 countries',
      'Lingua franca of the internet and international business',
      'Originated in England, spread through British Empire'
    ],
    flag: '🇺🇸'
  },
  { 
    code: 'hi', 
    name: 'Hindi', 
    bcp47: 'hi-IN', 
    sttSupported: true, 
    ttsSupported: true,
    coordinates: [
      { lat: 20.5937, lng: 78.9629 }, // India (main)
      { lat: -17.8139, lng: 178.0650 } // Fiji
    ],
    population: 602000000,
    rank: 3,
    regions: ['Northern India', 'Fiji', 'Nepal (some regions)'],
    facts: [
      'Third most spoken language globally',
      'Official language of India',
      'Written in Devanagari script',
      'Spoken by over 600 million people worldwide'
    ],
    flag: '🇮🇳'
  },
  { 
    code: 'zh', 
    name: 'Chinese (Mandarin)', 
    bcp47: 'zh-CN', 
    sttSupported: true, 
    ttsSupported: true,
    coordinates: [
      { lat: 35.8617, lng: 104.1954 }, // China
      { lat: 25.2048, lng: 121.5598 }, // Taiwan
      { lat: 1.3521, lng: 103.8198 }   // Singapore
    ],
    population: 1100000000,
    rank: 2,
    regions: ['China', 'Taiwan', 'Singapore', 'Malaysia'],
    facts: [
      'Second most spoken language in the world',
      'Most spoken language by native speakers',
      'Official language of China, Taiwan, and Singapore',
      'Uses Chinese characters (Hanzi) writing system'
    ],
    flag: '🇨🇳'
  },
  { 
    code: 'es', 
    name: 'Spanish', 
    bcp47: 'es-ES', 
    sttSupported: true, 
    ttsSupported: true,
    coordinates: [
      { lat: 40.4637, lng: -3.7492 },  // Spain
      { lat: 23.6345, lng: -102.5528 }, // Mexico
      { lat: -38.4161, lng: -63.6167 }, // Argentina
      { lat: 4.5709, lng: -74.2973 }    // Colombia
    ],
    population: 500000000,
    rank: 4,
    regions: ['Spain', 'Most of South America', 'Central America', 'Mexico', 'Parts of USA'],
    facts: [
      'Fourth most spoken language in the world',
      'Second most spoken language by native speakers after Chinese',
      'Official language in 21 countries',
      'Fastest growing language in the US'
    ],
    flag: '🇪🇸'
  },
  { 
    code: 'fr', 
    name: 'French', 
    bcp47: 'fr-FR', 
    sttSupported: true, 
    ttsSupported: true,
    coordinates: [
      { lat: 46.2276, lng: 2.2137 },   // France
      { lat: 45.5017, lng: -73.5673 }, // Quebec, Canada
      { lat: -4.0383, lng: 21.7587 },  // Democratic Republic of Congo
      { lat: 2.3488, lng: 2.6493 }     // Central African countries
    ],
    population: 280000000,
    rank: 5,
    regions: ['France', 'Canada (Quebec)', 'Parts of Africa', 'Belgium', 'Switzerland'],
    facts: [
      'Fifth most spoken language worldwide',
      'Official language in 29 countries',
      'Language of diplomacy and international organizations',
      'Spoken on every continent'
    ],
    flag: '🇫🇷'
  },
  { 
    code: 'ar', 
    name: 'Arabic', 
    bcp47: 'ar-SA', 
    sttSupported: true, 
    ttsSupported: true,
    coordinates: [
      { lat: 23.8859, lng: 45.0792 },  // Saudi Arabia
      { lat: 26.8206, lng: 30.8025 },  // Egypt
      { lat: 33.8547, lng: 35.8623 }   // Lebanon
    ],
    population: 310000000,
    rank: 6,
    regions: ['Middle East', 'North Africa'],
    facts: [
      'Sixth most spoken language',
      'Official language of 22 countries',
      'Language of the Quran',
      'Right-to-left writing system'
    ],
    flag: '🇸🇦'
  },
  { 
    code: 'bn', 
    name: 'Bengali', 
    bcp47: 'bn-IN', 
    sttSupported: true, 
    ttsSupported: false,
    coordinates: [
      { lat: 23.6850, lng: 90.3563 }, // Bangladesh
      { lat: 22.9868, lng: 87.8550 }  // West Bengal, India
    ],
    population: 265000000,
    rank: 7,
    regions: ['Bangladesh', 'West Bengal (India)', 'Parts of Assam'],
    facts: [
      'Seventh most spoken language in the world',
      'Official language of Bangladesh and West Bengal',
      'Rich literary tradition with Nobel laureate Rabindranath Tagore',
      'Second most spoken language in India'
    ],
    flag: '🇧🇩'
  },
  // Other major languages with basic data
  { code: 'ja', name: 'Japanese', bcp47: 'ja-JP', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 36.2048, lng: 138.2529 }], population: 125000000, rank: 9, regions: ['Japan'], facts: ['Official language of Japan', 'Uses three writing systems'], flag: '🇯🇵' },
  { code: 'de', name: 'German', bcp47: 'de-DE', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 51.1657, lng: 10.4515 }], population: 100000000, rank: 12, regions: ['Germany', 'Austria', 'Switzerland'], facts: ['Official language of Germany, Austria, and Switzerland'], flag: '🇩🇪' },
  { code: 'ko', name: 'Korean', bcp47: 'ko-KR', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 35.9078, lng: 127.7669 }], population: 77000000, rank: 22, regions: ['South Korea', 'North Korea'], facts: ['Official language of both Koreas', 'Uses Hangul writing system'], flag: '🇰🇷' },
  { code: 'it', name: 'Italian', bcp47: 'it-IT', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 41.8719, lng: 12.5674 }], population: 65000000, rank: 24, regions: ['Italy', 'San Marino', 'Vatican City'], facts: ['Official language of Italy', 'Language of art and music'], flag: '🇮🇹' },
  { code: 'vi', name: 'Vietnamese', bcp47: 'vi-VN', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 14.0583, lng: 108.2772 }], population: 95000000, rank: 14, regions: ['Vietnam'], facts: ['Official language of Vietnam', 'Uses Latin alphabet with tone marks'], flag: '🇻🇳' },
  { code: 'ru', name: 'Russian', bcp47: 'ru-RU', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 61.5240, lng: 105.3188 }], population: 258000000, rank: 8, regions: ['Russia', 'Former Soviet countries'], facts: ['Eighth most spoken language', 'Official language in Russia and several former Soviet states'], flag: '🇷🇺' },
  { code: 'tr', name: 'Turkish', bcp47: 'tr-TR', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 38.9637, lng: 35.2433 }], population: 88000000, rank: 17, regions: ['Turkey', 'Northern Cyprus'], facts: ['Official language of Turkey', 'Bridge between Europe and Asia'], flag: '🇹🇷' },
  // Indian languages
  { code: 'ta', name: 'Tamil', bcp47: 'ta-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 11.1271, lng: 78.6569 }], population: 78000000, rank: 20, regions: ['Tamil Nadu (India)', 'Sri Lanka', 'Singapore'], facts: ['Official language of Tamil Nadu and Sri Lanka'], flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', bcp47: 'te-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 17.1232, lng: 79.2088 }], population: 82000000, rank: 15, regions: ['Andhra Pradesh and Telangana (India)'], facts: ['Official language of Andhra Pradesh and Telangana'], flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', bcp47: 'mr-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 19.7515, lng: 75.7139 }], population: 83000000, rank: 19, regions: ['Maharashtra (India)'], facts: ['Official language of Maharashtra state'], flag: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', bcp47: 'gu-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 23.0225, lng: 72.5714 }], population: 56000000, rank: 26, regions: ['Gujarat (India)'], facts: ['Official language of Gujarat state'], flag: '🇮🇳' },
  { code: 'kn', name: 'Kannada', bcp47: 'kn-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 15.3173, lng: 75.7139 }], population: 44000000, rank: 29, regions: ['Karnataka (India)'], facts: ['Official language of Karnataka state'], flag: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', bcp47: 'ml-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 10.8505, lng: 76.2711 }], population: 35000000, rank: 34, regions: ['Kerala (India)'], facts: ['Official language of Kerala state'], flag: '🇮🇳' },
  { code: 'pa', name: 'Punjabi', bcp47: 'pa-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 31.1471, lng: 75.3412 }], population: 102000000, rank: 10, regions: ['Punjab (India/Pakistan)'], facts: ['Official language of Punjab'], flag: '🇮🇳' },
  { code: 'or', name: 'Odia', bcp47: 'or-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 20.9517, lng: 85.0985 }], population: 35000000, rank: 35, regions: ['Odisha (India)'], facts: ['Official language of Odisha state'], flag: '🇮🇳' },
  { code: 'as', name: 'Assamese', bcp47: 'as-IN', sttSupported: false, ttsSupported: false, coordinates: [{ lat: 26.2006, lng: 92.9376 }], population: 15000000, rank: 65, regions: ['Assam (India)'], facts: ['Official language of Assam state'], flag: '🇮🇳' },
  { code: 'ur', name: 'Urdu', bcp47: 'ur-IN', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 30.3753, lng: 69.3451 }], population: 70000000, rank: 21, regions: ['Pakistan', 'India'], facts: ['Official language of Pakistan'], flag: '🇵🇰' },
  // Other languages with minimal data
  { code: 'ne', name: 'Nepali', bcp47: 'ne-NP', sttSupported: true, ttsSupported: false, coordinates: [{ lat: 28.3949, lng: 84.1240 }], population: 16000000, rank: 60, regions: ['Nepal'], facts: ['Official language of Nepal'], flag: '🇳🇵' },
  { code: 'id', name: 'Indonesian', bcp47: 'id-ID', sttSupported: true, ttsSupported: true, coordinates: [{ lat: -0.7893, lng: 113.9213 }], population: 43000000, rank: 30, regions: ['Indonesia'], facts: ['Official language of Indonesia'], flag: '🇮🇩' },
  { code: 'tl', name: 'Tagalog', bcp47: 'tl-PH', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 12.8797, lng: 121.7740 }], population: 45000000, rank: 28, regions: ['Philippines'], facts: ['Official language of Philippines'], flag: '🇵🇭' },
  { code: 'pl', name: 'Polish', bcp47: 'pl-PL', sttSupported: true, ttsSupported: true, coordinates: [{ lat: 51.9194, lng: 19.1451 }], population: 40000000, rank: 32, regions: ['Poland'], facts: ['Official language of Poland'], flag: '🇵🇱' }
] as Language[];