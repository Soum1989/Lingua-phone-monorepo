import React, { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import LanguageSelector from './components/LanguageSelector'
import TranslationTool from './components/TranslationTool'
import ScenarioLearning from './components/ScenarioLearning'
import PremiumMode from './components/PremiumMode'
import DarkModeToggle from './components/DarkModeToggle'
import InteractiveGlobe from './components/InteractiveGlobe'
import LanguageInfo from './components/LanguageInfo'
import ShoppingChat from './components/ShoppingChat'
import { enhancedTTS } from './services/speechService'
import languages from './shared/languages'

export default function App() {
  const [inputLang, setInputLang] = useState('en-US')
  const [outputLang, setOutputLang] = useState('hi-IN')
  const [transcriptionText, setTranscriptionText] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [isPremiumUser, setIsPremiumUser] = useState(false)
  const [activeTab, setActiveTab] = useState<'voice' | 'translate' | 'scenarios' | 'globe' | 'shopping'>('shopping')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const handleTranscribed = (text: string) => {
    setTranscriptionText(text)
    setMessages(m => [...m, `🎤 Transcribed: ${text}`])
  }

  const handleUpgradeToPremium = () => {
    setIsPremiumUser(true)
    setMessages(m => [...m, '🎉 Welcome to Premium! All scenarios unlocked.'])
  }

  return (
    <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Dark Mode Toggle */}
      <DarkModeToggle onThemeChange={setIsDarkMode} />
      
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1>🛍️ AI-Powered Multilingual Shopping Assistant</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
          Shop Online Boutique with Gemini AI in your preferred language - GKE Turns 10 Hackathon
        </p>
      </header>

      {/* Premium Status Banner */}
      {!isPremiumUser && (
        <PremiumMode 
          isPremiumUser={isPremiumUser}
          onUpgrade={handleUpgradeToPremium}
        />
      )}
      
      {isPremiumUser && (
        <div style={{ 
          backgroundColor: '#d4edda', 
          color: '#155724', 
          padding: '10px 15px', 
          borderRadius: '5px', 
          marginBottom: '20px',
          border: '1px solid #c3e6cb',
          textAlign: 'center'
        }}>
          👑 Premium Active - All features unlocked!
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid var(--border)',
          marginBottom: '20px'
        }}>
          {[
            { id: 'shopping', label: '🛍️ AI Shopping', icon: '🛍️' },
            { id: 'globe', label: '🌍 Globe & Info', icon: '🌍' },
            { id: 'voice', label: '🎤 Voice Chat', icon: '🎤' },
            { id: 'translate', label: '🔄 Translation', icon: '🔄' },
            { id: 'scenarios', label: '🎮 Scenarios', icon: '🎮' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '12px 20px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
                borderBottom: activeTab === tab.id ? '3px solid var(--accent)' : 'none',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal',
                transition: 'all 0.3s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'shopping' && (
        <div>
          <div style={{ 
            backgroundColor: '#e8f5e8', 
            padding: '16px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '2px solid #4CAF50'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#2e7d32' }}>🏆 GKE Turns 10 Hackathon Entry</h3>
            <p style={{ margin: 0, color: '#388e3c' }}>
              This is our AI-powered multilingual shopping assistant built on GKE with Gemini AI, 
              enhancing Google's Online Boutique with voice commerce and real-time translation.
            </p>
          </div>
          <ShoppingChat 
            selectedLanguage={outputLang}
            onLanguageChange={setOutputLang}
          />
        </div>
      )}

      {activeTab === 'globe' && (
        <div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 400px', 
            gap: '20px', 
            marginBottom: '20px' 
          }}>
            {/* Globe */}
            <div>
              <InteractiveGlobe 
                selectedInputLanguage={inputLang}
                selectedOutputLanguage={outputLang}
                autoRotate={true}
              />
            </div>
            
            {/* Language Selection & Info */}
            <div>
              <div className="card" style={{ marginBottom: '20px' }}>
                <h3>Language Selection</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <LanguageSelector 
                    value={inputLang} 
                    onChange={setInputLang} 
                    label="Input Language" 
                    filterType="all"
                  />
                  <button 
                    onClick={() => {
                      const temp = inputLang;
                      setInputLang(outputLang);
                      setOutputLang(temp);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: 'var(--info)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    title="Swap languages"
                  >
                    ⇄ Swap Languages
                  </button>
                  <LanguageSelector 
                    value={outputLang} 
                    onChange={setOutputLang} 
                    label="Output Language" 
                    filterType="all"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Language Information Panels */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px',
            marginBottom: '20px' 
          }}>
            <LanguageInfo 
              languageCode={inputLang} 
              title={`Input Language: ${languages.find(l => l.code === inputLang || l.bcp47 === inputLang)?.name || 'Unknown'}`}
            />
            <LanguageInfo 
              languageCode={outputLang} 
              title={`Output Language: ${languages.find(l => l.code === outputLang || l.bcp47 === outputLang)?.name || 'Unknown'}`}
            />
          </div>
        </div>
      )}

      {activeTab === 'voice' && (
        <div>
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <LanguageSelector 
              value={inputLang} 
              onChange={setInputLang} 
              label="Speech Language" 
              filterType="stt"
            />
            <LanguageSelector 
              value={outputLang} 
              onChange={setOutputLang} 
              label="Translation Target" 
              filterType="all"
            />
          </div>
          
          <ChatInterface 
            onTranscribed={handleTranscribed} 
            lang={inputLang}
            transcriptionText={transcriptionText}
          />
          
          {/* Auto-translate transcribed text */}
          {transcriptionText && (
            <div className="card" style={{
              backgroundColor: 'var(--bg-secondary)',
              border: '2px solid var(--accent)',
              borderRadius: '8px',
              padding: '15px',
              marginTop: '20px'
            }}>
              <h4>🔄 Auto-Translation</h4>
              <AutoTranslate 
                text={transcriptionText}
                from={inputLang}
                to={outputLang}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'translate' && (
        <TranslationTool />
      )}

      {activeTab === 'scenarios' && (
        <ScenarioLearning 
          isPremiumUser={isPremiumUser}
          onUpgradeToPremium={handleUpgradeToPremium}
        />
      )}

      {/* Messages Log */}
      {messages.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: 'var(--text-primary)' }}>📝 Activity Log</h3>
          <div className="card" style={{
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ 
                padding: '5px 0', 
                borderBottom: i < messages.length - 1 ? '1px solid var(--border-light)' : 'none',
                fontSize: '14px',
                color: 'var(--text-primary)'
              }}>
                {msg}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Helper component for auto-translation
function AutoTranslate({ text, from, to }: { text: string, from: string, to: string }) {
  const [translation, setTranslation] = useState('')
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    if (text && from !== to) {
      translateText()
    }
  }, [text, from, to])

  const translateText = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text, 
          from: from.split('-')[0], 
          to: to.split('-')[0] 
        })
      })
      const json = await res.json()
      setTranslation(json.translatedText || '')
    } catch (err) {
      console.error('Auto-translation error:', err)
      setTranslation('Translation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleTTS = async (textToSpeak: string, language: string) => {
    try {
      console.log(`App TTS: Speaking "${textToSpeak}" in language ${language}`);
      
      if (!textToSpeak || !textToSpeak.trim()) {
        console.log('No text to speak');
        alert('No text to speak');
        return;
      }
      
      // Check if speech synthesis is available
      if (!window.speechSynthesis) {
        alert('Speech synthesis not supported in this browser');
        return;
      }
      
      // Use the improved language mapping from shared languages
      const languageEntry = languages.find(lang => lang.code === language || lang.bcp47 === language);
      const bestLangCode = languageEntry ? languageEntry.bcp47 : language;
      
      console.log(`App TTS: Target language: ${language} -> Mapped to: ${bestLangCode}`);
      
      // Get available voices and check for the target language
      const voices = window.speechSynthesis.getVoices();
      console.log(`App TTS: Available voices: ${voices.length}`);
      
      const targetVoice = voices.find(voice => 
        voice.lang.toLowerCase().includes(bestLangCode.split('-')[0].toLowerCase())
      );
      
      if (!targetVoice) {
        console.warn(`App TTS: No voice found for ${bestLangCode}, available languages:`, 
          voices.map(v => v.lang).join(', '));
        alert(`No voice available for ${bestLangCode}. Available voices: ${voices.map(v => v.lang).slice(0,5).join(', ')}...`);
        return;
      }
      
      console.log(`App TTS: Using voice: ${targetVoice.name} (${targetVoice.lang})`);
      
      await enhancedTTS.speak(textToSpeak, bestLangCode, {
        rate: 0.8, // Slightly slower for better pronunciation
        onError: (error) => {
          console.error('App TTS Error:', error);
          alert('Speech failed: ' + error);
        },
        onSuccess: () => {
          console.log('App TTS completed successfully');
        }
      });
      
    } catch (err) {
      console.error('App TTS error:', err);
      alert('TTS error: ' + (err as Error).message);
    }
  }

  return (
    <div>
      <p>
        <strong>Translation ({to}):</strong> 
        {loading ? ' Translating...' : translation}
      </p>
      {translation && !loading && (
        <div style={{ marginTop: '10px' }}>
          <button 
            onClick={() => handleTTS(translation, to)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginRight: '10px'
            }}
          >
            🔊 Speak Translation
          </button>
          <small style={{ color: '#666', fontSize: '12px' }}>
            Language: {to} | 
            Voice: {(() => {
              const voices = window.speechSynthesis?.getVoices() || [];
              const targetVoice = voices.find(v => v.lang.toLowerCase().includes(to.split('-')[0].toLowerCase()));
              return targetVoice ? `${targetVoice.name} (${targetVoice.lang})` : 'No suitable voice found';
            })()} |
            Voices available: {window.speechSynthesis?.getVoices().length || 0}
          </small>
        </div>
      )}
    </div>
  )
}
