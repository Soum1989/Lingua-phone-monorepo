import React from 'react';
import languages, { Language } from '../shared/languages';

interface LanguageInfoProps {
  languageCode?: string;
  title?: string;
  showDetailed?: boolean;
}

export default function LanguageInfo({ languageCode, title = "Language Information", showDetailed = true }: LanguageInfoProps) {
  if (!languageCode) {
    return (
      <div className="language-info">
        <h3>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Select a language to see detailed information
        </p>
      </div>
    );
  }

  // Find the language data - match by code or bcp47
  const language = languages.find(lang => 
    lang.code === languageCode || 
    lang.bcp47 === languageCode ||
    lang.code === languageCode.split('-')[0]
  );

  if (!language) {
    return (
      <div className="language-info">
        <h3>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
          Language information not available for: {languageCode}
        </p>
      </div>
    );
  }

  const formatPopulation = (population: number): string => {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(1)}B`;
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(0)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(0)}K`;
    }
    return population.toString();
  };

  const getRankSuffix = (rank: number): string => {
    if (rank >= 11 && rank <= 13) return 'th';
    switch (rank % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };

  return (
    <div className="language-info">
      <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '24px' }}>{language.flag}</span>
        {language.name}
        <span style={{ 
          fontSize: '12px', 
          color: 'var(--text-muted)', 
          fontWeight: 'normal' 
        }}>
          ({language.code})
        </span>
      </h3>

      {showDetailed && (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '16px' 
          }}>
            <div>
              <strong style={{ color: 'var(--accent)' }}>Global Ranking:</strong>
              <p style={{ margin: '4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                #{language.rank}{getRankSuffix(language.rank)} most spoken
              </p>
            </div>
            
            <div>
              <strong style={{ color: 'var(--accent)' }}>Speakers:</strong>
              <p style={{ margin: '4px 0', fontSize: '18px', fontWeight: 'bold' }}>
                {formatPopulation(language.population)} people
              </p>
            </div>

            <div>
              <strong style={{ color: 'var(--accent)' }}>Support:</strong>
              <p style={{ margin: '4px 0', fontSize: '14px' }}>
                🎤 Speech: {language.sttSupported ? '✅' : '❌'} | 
                🔊 TTS: {language.ttsSupported ? '✅' : '❌'}
              </p>
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <strong style={{ color: 'var(--accent)' }}>Regions:</strong>
            <div style={{ marginTop: '8px' }}>
              {language.regions.map((region, index) => (
                <span 
                  key={index}
                  style={{
                    display: 'inline-block',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    padding: '4px 8px',
                    margin: '2px 4px 2px 0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    border: '1px solid var(--border)'
                  }}
                >
                  📍 {region}
                </span>
              ))}
            </div>
          </div>

          <div>
            <strong style={{ color: 'var(--accent)' }}>Interesting Facts:</strong>
            <div style={{ marginTop: '8px' }}>
              {language.facts.map((fact, index) => (
                <div key={index} className="fact">
                  {fact}
                </div>
              ))}
            </div>
          </div>

          {language.coordinates && language.coordinates.length > 0 && (
            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: 'var(--bg-tertiary)', 
              borderRadius: '8px',
              border: '1px solid var(--border)'
            }}>
              <strong style={{ color: 'var(--accent)', fontSize: '14px' }}>
                Geographic Centers ({language.coordinates.length} region{language.coordinates.length !== 1 ? 's' : ''}):
              </strong>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                {language.coordinates.map((coord, index) => (
                  <span key={index}>
                    📌 {coord.lat.toFixed(2)}°, {coord.lng.toFixed(2)}°
                    {index < language.coordinates.length - 1 ? ' • ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Compact version for use in smaller spaces
export function LanguageInfoCompact({ languageCode }: { languageCode?: string }) {
  return (
    <LanguageInfo 
      languageCode={languageCode} 
      title="Quick Info" 
      showDetailed={false} 
    />
  );
}