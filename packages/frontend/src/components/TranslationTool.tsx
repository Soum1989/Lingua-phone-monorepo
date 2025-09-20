import React, { useState, useRef } from 'react'
import LanguageSelector from './LanguageSelector'
import LanguageInfo from './LanguageInfo'
import { enhancedTTS, ttsService, googleTTSService } from '../services/speechService'
import languages from '../shared/languages'

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function TranslationTool() {
  const [text, setText] = useState('')
  const [from, setFrom] = useState('en-US')
  const [to, setTo] = useState('hi-IN')
  const [out, setOut] = useState('')
  const [isTranslating, setIsTranslating] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlayingTTS, setIsPlayingTTS] = useState(false)
  const speechRecognitionRef = useRef<any>(null)

  // Check if Web Speech API is available
  const isWebSpeechAvailable = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  async function startVoiceInput() {
    if (!isWebSpeechAvailable()) {
      alert('Speech recognition is not available in your browser');
      return;
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = from; // Use the selected "from" language
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log(`Voice input started for language: ${from}`);
        setIsRecording(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        console.log(`Voice input result: "${transcript}" (confidence: ${confidence})`);
        setText(transcript);
        setIsRecording(false);
        
        // Auto-translate after getting voice input
        setTimeout(() => {
          if (transcript.trim()) {
            doTranslateWithText(transcript);
          }
        }, 500);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Voice input error:', event.error);
        setIsRecording(false);
        
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again and speak clearly.');
        } else if (event.error === 'audio-capture') {
          alert('Microphone not available. Please check your microphone settings.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access.');
        } else {
          alert('Voice input error: ' + event.error);
        }
      };
      
      recognition.onend = () => {
        console.log('Voice input ended');
        setIsRecording(false);
      };
      
      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Voice input initialization error:', err);
      alert('Failed to initialize voice input: ' + (err as Error).message);
      setIsRecording(false);
    }
  }

  function stopVoiceInput() {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsRecording(false);
  }

  async function doTranslateWithText(inputText: string) {
    if (!inputText.trim()) {
      alert('Please enter text to translate');
      return;
    }
    
    setIsTranslating(true);
    try {
      console.log(`Translating "${inputText}" from ${from} to ${to}`);
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, to: to.split('-')[0], from: from.split('-')[0] })
      });
      
      if (!res.ok) {
        throw new Error(`Translation failed: ${res.status} ${res.statusText}`);
      }
      
      const json = await res.json();
      console.log('Translation result:', json.translatedText);
      setOut(json.translatedText || '');
    } catch (err) {
      console.error('Translation error:', err);
      alert('Translation failed: ' + err);
    } finally {
      setIsTranslating(false);
    }
  }

  async function doTranslate() {
    await doTranslateWithText(text);
  }

  async function doTTS(textToSpeak: string, language: string) {
    if (isPlayingTTS) {
      console.log('TTS already playing, ignoring request');
      return;
    }
    
    try {
      console.log(`TTS: Speaking "${textToSpeak}" in language ${language}`);
      
      if (!textToSpeak || !textToSpeak.trim()) {
        console.log('No text to speak');
        return;
      }
      
      setIsPlayingTTS(true);
      
      // Use the improved language mapping from shared languages
      const languageEntry = languages.find(lang => lang.code === language || lang.bcp47 === language);
      const bestLangCode = languageEntry ? languageEntry.bcp47 : language;
      
      // Force Google Cloud TTS instead of browser TTS
      try {
        console.log('Attempting Google Cloud TTS first...');
        await googleTTSService.speak(textToSpeak, bestLangCode, {
          onStart: () => console.log('Google Cloud TTS started'),
          onEnd: () => {
            console.log('Google Cloud TTS completed successfully');
            setIsPlayingTTS(false);
          },
          onError: (gcError) => {
            console.log('Google Cloud TTS failed, trying browser TTS:', gcError);
            // Fallback to browser TTS
            enhancedTTS.speak(textToSpeak, bestLangCode, {
              rate: 0.8,
              volume: 1.0,
              preferBrowser: true, // Force browser TTS as fallback
              onError: (error) => {
                console.error('Both TTS methods failed:', error);
                // Only show alert for critical errors, not timeouts
                if (!error.includes('timeout') && !error.includes('interrupted')) {
                  console.log('TTS failed silently:', error);
                }
                setIsPlayingTTS(false);
              },
              onSuccess: () => {
                console.log('Browser TTS completed successfully');
                setIsPlayingTTS(false);
              }
            });
          }
        });
      } catch (gcError) {
        console.log('Google Cloud TTS not available, using browser TTS:', gcError);
        await enhancedTTS.speak(textToSpeak, bestLangCode, {
          rate: 0.8,
          volume: 1.0,
          preferBrowser: true,
          onError: (error) => {
            console.error('TTS Error:', error);
            // Only show alert for critical errors, not timeouts
            if (!error.includes('timeout') && !error.includes('interrupted')) {
              console.log('TTS failed silently:', error);
            }
            setIsPlayingTTS(false);
          },
          onSuccess: () => {
            console.log('TTS completed successfully');
            setIsPlayingTTS(false);
          }
        });
      }
      
    } catch (err) {
      console.error('TTS error:', err);
      setIsPlayingTTS(false);
      // Only show alert for critical errors
      if (!(err as Error).message.includes('timeout')) {
        console.log('TTS error handled silently:', err);
      }
    }
  }

  function swapLanguages() {
    const tempFrom = from
    setFrom(to)
    setTo(tempFrom)
    
    // Also swap the text content
    if (out) {
      setText(out)
      setOut(text)
    }
  }

  return (
    <div className="card" style={{ marginBottom: '2rem' }}>
      {/* Language Information Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '20px',
        marginBottom: '20px' 
      }}>
        <LanguageInfo 
          languageCode={from} 
          title={`From: ${languages.find(l => l.code === from || l.bcp47 === from)?.name || 'Unknown'}`}
        />
        <LanguageInfo 
          languageCode={to} 
          title={`To: ${languages.find(l => l.code === to || l.bcp47 === to)?.name || 'Unknown'}`}
        />
      </div>
      {/* Test TTS Button */}
      <div className="card" style={{ 
        marginBottom: '1rem', 
        padding: '15px', 
        backgroundColor: 'var(--bg-tertiary)', 
        borderRadius: '8px',
        border: '1px solid var(--border)'
      }}>
        <h4 style={{ color: 'var(--text-primary)' }}>🔊 Test Text-to-Speech</h4>
        <div style={{ marginBottom: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
          <strong>Volume Check:</strong> Make sure your system volume is up and browser audio is enabled.
          <br />
          <strong>Browser Check:</strong> {typeof window !== 'undefined' && 'speechSynthesis' in window ? '✅ Speech Synthesis Supported' : '❌ Speech Synthesis Not Supported'}
          <br />
          <strong>Important:</strong> Click the Volume Test button to check if TTS works. If it fails, try:
          <ul style={{ margin: '5px 0', paddingLeft: '20px', fontSize: '12px' }}>
            <li>Increase system volume and check browser isn't muted</li>
            <li>Try in Chrome browser (best Web Speech API support)</li>
            <li>Ensure microphone/audio permissions are granted</li>
            <li>Refresh the page and try again</li>
          </ul>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
          <button onClick={async () => {
            try {
              console.log('Starting volume test with user interaction');
              
              // First, check if speech synthesis is ready
              if (!window.speechSynthesis) {
                alert('Speech synthesis not available in this browser');
                return;
              }
              
              // Create a simple test utterance
              const testText = 'Volume test - can you hear this clearly?';
              console.log('Creating test utterance:', testText);
              
              // Use a more basic approach for testing
              const utterance = new SpeechSynthesisUtterance(testText);
              utterance.lang = 'en-US';
              utterance.rate = 0.8;
              utterance.volume = 1.0;
              utterance.pitch = 1.0;
              
              // Set up event handlers
              utterance.onstart = () => {
                console.log('✅ Volume test: Speech started successfully');
              };
              
              utterance.onend = () => {
                console.log('✅ Volume test: Speech completed successfully');
              };
              
              utterance.onerror = (event) => {
                console.error('❌ Volume test error:', event.error);
                alert(`Volume test failed: ${event.error}. Try checking browser permissions and system volume.`);
              };
              
              // Cancel any existing speech and wait
              window.speechSynthesis.cancel();
              await new Promise(resolve => setTimeout(resolve, 300));
              
              // Speak the test
              console.log('Starting speech synthesis...');
              window.speechSynthesis.speak(utterance);
              
              // Force resume if paused (browser compatibility)
              setTimeout(() => {
                if (window.speechSynthesis.paused) {
                  console.log('Resuming paused speech');
                  window.speechSynthesis.resume();
                }
              }, 100);
              
            } catch (err) {
              console.error('Volume test initialization error:', err);
              alert('Volume test failed to initialize: ' + (err as Error).message);
            }
          }} style={{
            padding: '8px 12px', 
            backgroundColor: 'var(--danger)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold'
          }}>🔊 Volume Test</button>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for user interaction
              await doTTS('Hello, how are you doing today?', 'en-US');
            } catch (err) {
              console.error('Test English TTS failed:', err);
            }
          }} style={{
            padding: '8px 12px', 
            backgroundColor: 'var(--info)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold'
          }}>Test English</button>
          <button onClick={async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay
              await doTTS('नमस्ते, आप कैसे हैं?', 'hi-IN');
            } catch (err) {
              console.error('Test Hindi TTS failed:', err);
            }
          }} style={{
            padding: '8px 12px', 
            backgroundColor: 'var(--success)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold'
          }}>Test Hindi</button>
          <button onClick={async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay
              await doTTS('Hola, ¿cómo estás hoy?', 'es-ES');
            } catch (err) {
              console.error('Test Spanish TTS failed:', err);
            }
          }} style={{
            padding: '8px 12px', 
            backgroundColor: 'var(--warning)', 
            color: 'black', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold'
          }}>Test Spanish</button>
          <button onClick={async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay
              await doTTS('Bonjour, comment allez-vous aujourd\'hui?', 'fr-FR');
            } catch (err) {
              console.error('Test French TTS failed:', err);
            }
          }} style={{
            padding: '8px 12px', 
            backgroundColor: 'var(--danger)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer', 
            fontWeight: 'bold'
          }}>Test French</button>
        </div>
      </div>

      <h3 style={{ color: 'var(--text-primary)' }}>🌍 Translation Tool</h3>
      
      {/* Language Selection */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
        <LanguageSelector 
          value={from} 
          onChange={setFrom} 
          label="From" 
          filterType="all"
        />
        <button 
          onClick={swapLanguages}
          style={{
            padding: '5px 10px',
            backgroundColor: 'var(--info)',
            color: 'white',
            border: 'none',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
          title="Swap languages"
        >
          ⇄
        </button>
        <LanguageSelector 
          value={to} 
          onChange={setTo} 
          label="To" 
          filterType="all"
        />
      </div>
      
      {/* Input Text with Voice Input */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <label style={{ color: 'var(--text-primary)' }}><strong>Text to translate:</strong></label>
          <button 
            onClick={() => isRecording ? stopVoiceInput() : startVoiceInput()}
            disabled={isProcessing}
            style={{
              padding: '8px 12px',
              fontSize: '14px',
              backgroundColor: isRecording ? 'var(--danger)' : 'var(--info)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            {isRecording ? '⏹️ Stop' : '🎤 Voice'}
            {!isWebSpeechAvailable() && ' (Not Available)'}
          </button>
        </div>
        <textarea 
          value={text} 
          onChange={e => setText(e.target.value)} 
          rows={4} 
          cols={50}
          style={{
            width: '100%',
            padding: '8px',
            border: isRecording ? '2px solid var(--info)' : '1px solid var(--border)',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: isRecording ? 'var(--bg-primary)' : 'var(--bg-primary)',
            color: 'var(--text-primary)'
          }}
          placeholder={`Enter text to translate or use voice input (${from})...`}
        />
        {isRecording && (
          <div style={{ 
            fontSize: '12px', 
            color: 'var(--info)', 
            marginTop: '5px',
            fontStyle: 'italic'
          }}>
            🎤 Listening in {from}... Speak clearly into your microphone
          </div>
        )}
      </div>
      
      {/* Translate Button */}
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={doTranslate}
          disabled={isTranslating || !text.trim()}
          style={{
            padding: '10px 20px',
            backgroundColor: isTranslating ? 'var(--text-muted)' : 'var(--accent)',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isTranslating ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {isTranslating ? 'Translating...' : '🔄 Translate'}
        </button>
      </div>
      
      {/* Translation Output */}
      <div>
        <label style={{ color: 'var(--text-primary)' }}><strong>Translation:</strong></label>
        <div style={{
          border: '2px solid var(--accent)',
          borderRadius: '5px',
          padding: '10px',
          minHeight: '80px',
          backgroundColor: 'var(--bg-secondary)',
          fontSize: '14px',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          color: 'var(--text-primary)'
        }}>
          {out || 'Translation will appear here...'}
        </div>
        {out && (
          <div style={{ marginTop: '0.5rem' }}>
            <button 
              onClick={async () => {
                try {
                  console.log('Speaking original text:', text, 'in language:', from);
                  await doTTS(text, from);
                } catch (err) {
                  console.error('Original TTS failed:', err);
                }
              }} 
              style={{
                marginRight: '10px',
                padding: '8px 16px',
                backgroundColor: 'var(--info)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🔊 Speak Original
            </button>
            <button 
              onClick={async () => {
                try {
                  console.log('Speaking translation:', out, 'in language:', to);
                  await doTTS(out, to);
                } catch (err) {
                  console.error('Translation TTS failed:', err);
                }
              }} 
              style={{
                padding: '8px 16px',
                backgroundColor: 'var(--warning)',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              🔊 Speak Translation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
