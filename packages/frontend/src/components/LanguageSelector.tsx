import React, { useEffect, useState } from 'react'

interface Language {
  code: string;
  name: string;
  bcp47: string;
  sttSupported: boolean;
  ttsSupported: boolean;
}

interface LanguageSelectorProps {
  value: string;
  onChange: (s: string) => void;
  label: string;
  filterType?: 'stt' | 'tts' | 'all';
}

export default function LanguageSelector({ value, onChange, label, filterType = 'all' }: LanguageSelectorProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/languages');
      const data = await response.json();
      setLanguages(data.languages || []);
    } catch (error) {
      console.error('Error fetching languages:', error);
      // Fallback to static list if API fails
      setLanguages(getStaticLanguages());
    } finally {
      setLoading(false);
    }
  };

  const getStaticLanguages = (): Language[] => {
    return [
      { code: 'en', name: 'English', bcp47: 'en-US', sttSupported: true, ttsSupported: true },
      { code: 'hi', name: 'Hindi', bcp47: 'hi-IN', sttSupported: true, ttsSupported: true },
      { code: 'bn', name: 'Bengali', bcp47: 'bn-IN', sttSupported: true, ttsSupported: true },
      { code: 'gu', name: 'Gujarati', bcp47: 'gu-IN', sttSupported: true, ttsSupported: true },
      { code: 'kn', name: 'Kannada', bcp47: 'kn-IN', sttSupported: true, ttsSupported: true },
      { code: 'ml', name: 'Malayalam', bcp47: 'ml-IN', sttSupported: true, ttsSupported: true },
      { code: 'mr', name: 'Marathi', bcp47: 'mr-IN', sttSupported: true, ttsSupported: true },
      { code: 'ta', name: 'Tamil', bcp47: 'ta-IN', sttSupported: true, ttsSupported: true },
      { code: 'te', name: 'Telugu', bcp47: 'te-IN', sttSupported: true, ttsSupported: true },
      { code: 'zh', name: 'Chinese (Mandarin)', bcp47: 'zh-CN', sttSupported: true, ttsSupported: true },
      { code: 'ja', name: 'Japanese', bcp47: 'ja-JP', sttSupported: true, ttsSupported: true },
      { code: 'de', name: 'German', bcp47: 'de-DE', sttSupported: true, ttsSupported: true },
      { code: 'fr', name: 'French', bcp47: 'fr-FR', sttSupported: true, ttsSupported: true },
      { code: 'es', name: 'Spanish', bcp47: 'es-ES', sttSupported: true, ttsSupported: true },
      { code: 'ar', name: 'Arabic', bcp47: 'ar-SA', sttSupported: true, ttsSupported: true },
      { code: 'ko', name: 'Korean', bcp47: 'ko-KR', sttSupported: true, ttsSupported: true },
      { code: 'it', name: 'Italian', bcp47: 'it-IT', sttSupported: true, ttsSupported: true },
      { code: 'ru', name: 'Russian', bcp47: 'ru-RU', sttSupported: true, ttsSupported: true },
    ];
  };

  const filteredLanguages = languages.filter(lang => {
    if (filterType === 'stt') return lang.sttSupported;
    if (filterType === 'tts') return lang.ttsSupported;
    return true;
  });

  if (loading) {
    return (
      <div style={{ marginBottom: '1rem' }}>
        <label>{label}: </label>
        <select disabled>
          <option>Loading languages...</option>
        </select>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label>{label}: </label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {filteredLanguages.map((l: Language) => (
          <option key={l.bcp47} value={l.bcp47}>
            {l.name} ({l.code})
            {filterType === 'stt' && !l.sttSupported ? ' (STT Not Supported)' : ''}
            {filterType === 'tts' && !l.ttsSupported ? ' (TTS Not Supported)' : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
