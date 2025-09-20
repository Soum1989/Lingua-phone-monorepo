import React, { useState, useEffect, useRef } from 'react'
import LanguageSelector from './LanguageSelector'
import { enhancedTTS } from '../services/speechService'
import languages from '../shared/languages'

interface Scenario {
  id: string;
  name: string;
  icon: string;
  description: string;
  conversations: Conversation[];
  premium: boolean;
}

interface Conversation {
  id: string;
  speaker: 'user' | 'npc';
  text: string;
  translation?: string;
  context?: string;
}

const scenarios: Scenario[] = [
  {
    id: 'market',
    name: 'Local Market',
    icon: '🏪',
    description: 'Practice buying groceries and bargaining at a local market',
    premium: false,
    conversations: [
      {
        id: '1',
        speaker: 'npc',
        text: 'Welcome to our market! What would you like to buy today?',
        context: 'Market vendor greeting'
      },
      {
        id: '2',
        speaker: 'user',
        text: 'I would like to buy some fresh vegetables.',
        context: 'Customer request'
      },
      {
        id: '3',
        speaker: 'npc',
        text: 'We have tomatoes, onions, and potatoes. How much do you need?',
        context: 'Vendor showing options'
      },
      {
        id: '4',
        speaker: 'user',
        text: 'I need 2 kg of tomatoes and 1 kg of onions. How much will it cost?',
        context: 'Customer specifying quantities'
      },
      {
        id: '5',
        speaker: 'npc',
        text: 'That will be 150 rupees for tomatoes and 80 rupees for onions. Total 230 rupees.',
        context: 'Vendor pricing'
      }
    ]
  },
  {
    id: 'hotel',
    name: 'Hotel Check-in',
    icon: '🏨',
    description: 'Learn how to check into a hotel and ask for services',
    premium: true,
    conversations: [
      {
        id: '1',
        speaker: 'npc',
        text: 'Good evening! Welcome to our hotel. Do you have a reservation?',
        context: 'Hotel receptionist greeting'
      },
      {
        id: '2',
        speaker: 'user',
        text: 'Yes, I have a reservation under the name Smith.',
        context: 'Guest confirming reservation'
      },
      {
        id: '3',
        speaker: 'npc',
        text: 'Perfect! I found your reservation. You have a deluxe room for 3 nights. May I see your ID?',
        context: 'Receptionist confirming details'
      },
      {
        id: '4',
        speaker: 'user',
        text: 'Here is my passport. What time is breakfast served?',
        context: 'Guest providing ID and asking about services'
      },
      {
        id: '5',
        speaker: 'npc',
        text: 'Breakfast is served from 7 AM to 10 AM in the main dining hall. Here is your room key.',
        context: 'Receptionist providing information'
      }
    ]
  },
  {
    id: 'police',
    name: 'Police Station',
    icon: '👮',
    description: 'Essential phrases for reporting incidents or asking for help',
    premium: true,
    conversations: [
      {
        id: '1',
        speaker: 'npc',
        text: 'Good morning. How can I help you today?',
        context: 'Police officer greeting'
      },
      {
        id: '2',
        speaker: 'user',
        text: 'I need to report a lost wallet. I lost it somewhere in the city center.',
        context: 'Citizen reporting lost item'
      },
      {
        id: '3',
        speaker: 'npc',
        text: "I'm sorry to hear that. When did you last see your wallet?",
        context: 'Officer gathering information'
      },
      {
        id: '4',
        speaker: 'user',
        text: 'I had it this morning when I bought coffee around 9 AM.',
        context: 'Citizen providing timeline'
      },
      {
        id: '5',
        speaker: 'npc',
        text: 'Please fill out this form with your details and we will file a report.',
        context: 'Officer providing next steps'
      }
    ]
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    icon: '🍽️',
    description: 'Order food and interact with restaurant staff',
    premium: false,
    conversations: [
      {
        id: '1',
        speaker: 'npc',
        text: 'Good evening! Table for how many people?',
        context: 'Restaurant host greeting'
      },
      {
        id: '2',
        speaker: 'user',
        text: 'Table for two, please.',
        context: 'Customer requesting table'
      },
      {
        id: '3',
        speaker: 'npc',
        text: 'Right this way. Here are your menus. Can I start you with something to drink?',
        context: 'Server seating customers'
      },
      {
        id: '4',
        speaker: 'user',
        text: "We'll have two glasses of water and could you recommend a popular dish?",
        context: 'Customer ordering drinks and asking for recommendations'
      },
      {
        id: '5',
        speaker: 'npc',
        text: 'Our chicken curry is very popular, and the vegetable biryani is excellent too.',
        context: 'Server making recommendations'
      }
    ]
  }
];

interface ScenarioLearningProps {
  isPremiumUser: boolean;
  onUpgradeToPremium: () => void;
}

export default function ScenarioLearning({ isPremiumUser, onUpgradeToPremium }: ScenarioLearningProps) {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [translatedInput, setTranslatedInput] = useState('');
  const [targetLang, setTargetLang] = useState('hi-IN');
  const [sourceLang, setSourceLang] = useState('en-US');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [translatedNPCText, setTranslatedNPCText] = useState<string>('');
  const [isTranslatingNPC, setIsTranslatingNPC] = useState(false);
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const speechRecognitionRef = useRef<any>(null);

  // Check if Web Speech API is available
  const isWebSpeechAvailable = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  };

  // Translate NPC text when scenario or step changes
  useEffect(() => {
    if (selectedScenario && selectedScenario.conversations[currentStep]) {
      const currentConversation = selectedScenario.conversations[currentStep];
      if (currentConversation.speaker === 'npc') {
        // Translate from English to user's preferred language (sourceLang)
        translateNPCText(currentConversation.text);
      }
    }
  }, [selectedScenario, currentStep, sourceLang]); // Changed from targetLang to sourceLang

  const translateNPCText = async (npcText: string) => {
    // If source language is English, no need to translate
    if (sourceLang.startsWith('en')) {
      setTranslatedNPCText(npcText);
      return;
    }

    setIsTranslatingNPC(true);
    try {
      console.log(`Translating NPC text "${npcText}" from English to ${sourceLang}`);
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: npcText, 
          from: 'en', 
          to: sourceLang.split('-')[0] 
        })
      });
      
      if (!res.ok) {
        throw new Error(`NPC translation failed: ${res.status} ${res.statusText}`);
      }
      
      const json = await res.json();
      console.log('NPC translation result:', json.translatedText);
      setTranslatedNPCText(json.translatedText || npcText);
    } catch (err) {
      console.error('NPC translation error:', err);
      setTranslatedNPCText(npcText); // Fallback to original text
    } finally {
      setIsTranslatingNPC(false);
    }
  };

  const startVoiceInput = () => {
    if (!isWebSpeechAvailable()) {
      alert('Speech recognition is not available in your browser');
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = sourceLang;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('Scenario speech recognition started for:', sourceLang);
        setIsRecording(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        console.log(`Scenario speech result: "${transcript}" (confidence: ${confidence})`);
        setUserInput(transcript);
        setIsRecording(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Scenario speech recognition error:', event.error);
        setIsRecording(false);
        
        // Handle specific errors
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again and speak clearly.');
        } else if (event.error === 'audio-capture') {
          alert('Microphone not available. Please check your microphone settings.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access.');
        } else {
          alert('Speech recognition error: ' + event.error);
        }
      };
      
      recognition.onend = () => {
        console.log('Scenario speech recognition ended');
        setIsRecording(false);
      };
      
      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Speech recognition initialization error:', err);
      alert('Failed to initialize speech recognition: ' + (err as Error).message);
      setIsRecording(false);
    }
  };

  const stopVoiceInput = () => {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
    }
    setIsRecording(false);
  };

  const handleScenarioSelect = (scenario: Scenario) => {
    if (scenario.premium && !isPremiumUser) {
      onUpgradeToPremium();
      return;
    }
    setSelectedScenario(scenario);
    setCurrentStep(0);
    setCompletedSteps([]);
  };

  const handleUserResponse = async () => {
    if (!userInput.trim()) {
      alert('Please enter or speak your response first');
      return;
    }

    console.log('Handling user response:', userInput);

    // Translate user input from their language to the target language
    try {
      console.log(`Translating user input "${userInput}" from ${sourceLang} to ${targetLang}`);
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: userInput, 
          from: sourceLang.split('-')[0], 
          to: targetLang.split('-')[0] 
        })
      });
      
      if (!res.ok) {
        throw new Error(`Translation failed: ${res.status} ${res.statusText}`);
      }
      
      const json = await res.json();
      console.log('User input translation result:', json.translatedText);
      
      if (json.translatedText) {
        setTranslatedInput(json.translatedText);
      } else {
        console.warn('No translated text in response');
        setTranslatedInput('Translation not available');
      }
    } catch (err) {
      console.error('Translation error:', err);
      setTranslatedInput('Translation failed: ' + (err as Error).message);
    }

    // Mark step as completed
    if (selectedScenario) {
      const stepId = `${selectedScenario.id}-${currentStep}`;
      setCompletedSteps(prev => [...prev, stepId]);
      console.log('Step completed:', stepId);
    }

    // Move to next step after a longer delay to allow user to see translation
    setTimeout(() => {
      if (selectedScenario && currentStep < selectedScenario.conversations.length - 1) {
        setCurrentStep(currentStep + 1);
        setUserInput('');
        setTranslatedInput('');
        console.log('Moving to step:', currentStep + 1);
      } else {
        console.log('Scenario completed!');
      }
    }, 30000); // Increased from 2000ms to 30000ms (30 seconds)
  };

  const resetScenario = () => {
    setCurrentStep(0);
    setUserInput('');
    setTranslatedInput('');
    setCompletedSteps([]);
  };

  const handleTTS = async (text: string, language: string) => {
    if (isPlayingTTS) {
      console.log('TTS already playing, ignoring request');
      return;
    }
    
    try {
      console.log(`Scenario TTS: Speaking "${text}" in language ${language}`);
      
      if (!text || !text.trim()) {
        console.log('No text to speak');
        return;
      }
      
      setIsPlayingTTS(true);
      
      // Use the improved language mapping from shared languages
      const languageEntry = languages.find(lang => lang.code === language || lang.bcp47 === language);
      const bestLangCode = languageEntry ? languageEntry.bcp47 : language;
      
      await enhancedTTS.speak(text, bestLangCode, {
        rate: 0.8, // Slightly slower for better pronunciation
        volume: 1.0, // Maximum volume
        onError: (error) => {
          console.error('Scenario TTS Error:', error);
          // Only show alert for critical errors, not timeouts or interruptions
          if (!error.includes('timeout') && !error.includes('interrupted')) {
            console.log('TTS failed silently:', error);
          }
          setIsPlayingTTS(false);
        },
        onSuccess: () => {
          console.log('Scenario TTS completed successfully');
          setIsPlayingTTS(false);
        }
      });
      
    } catch (err) {
      console.error('Scenario TTS error:', err);
      setIsPlayingTTS(false);
    }
  };

  if (!selectedScenario) {
    return (
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '2rem' }}>
        <h3>🎮 Interactive Scenarios</h3>
        <p>Practice real-world conversations in different situations!</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px', marginTop: '20px' }}>
          {scenarios.map(scenario => (
            <div 
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario)}
              style={{
                border: '2px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                cursor: 'pointer',
                backgroundColor: scenario.premium && !isPremiumUser ? '#f5f5f5' : '#fff',
                opacity: scenario.premium && !isPremiumUser ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: '10px' }}>
                {scenario.icon}
              </div>
              <h4 style={{ textAlign: 'center', margin: '0 0 10px 0' }}>
                {scenario.name}
                {scenario.premium && (
                  <span style={{ 
                    backgroundColor: '#gold', 
                    color: '#333', 
                    padding: '2px 6px', 
                    borderRadius: '3px', 
                    fontSize: '12px', 
                    marginLeft: '5px' 
                  }}>
                    PREMIUM
                  </span>
                )}
              </h4>
              <p style={{ fontSize: '14px', color: '#666', textAlign: 'center', margin: 0 }}>
                {scenario.description}
              </p>
              {scenario.premium && !isPremiumUser && (
                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '10px', 
                  color: '#FF9800', 
                  fontWeight: 'bold',
                  fontSize: '12px'
                }}>
                  🔒 Upgrade to Premium
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentConversation = selectedScenario.conversations[currentStep];
  const isUserTurn = currentConversation.speaker === 'user';
  const progress = ((currentStep + 1) / selectedScenario.conversations.length) * 100;

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3>{selectedScenario.icon} {selectedScenario.name}</h3>
        <div>
          <button 
            onClick={resetScenario}
            style={{
              padding: '5px 10px',
              marginRight: '10px',
              backgroundColor: '#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            🔄 Restart
          </button>
          <button 
            onClick={() => setSelectedScenario(null)}
            style={{
              padding: '5px 10px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '3px',
              cursor: 'pointer'
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
          <span>Progress:</span>
          <span>{currentStep + 1} / {selectedScenario.conversations.length}</span>
        </div>
        <div style={{ width: '100%', backgroundColor: '#ddd', borderRadius: '10px', height: '8px' }}>
          <div style={{
            width: `${progress}%`,
            backgroundColor: '#4CAF50',
            borderRadius: '10px',
            height: '100%',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Language Selection */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
        <LanguageSelector value={sourceLang} onChange={setSourceLang} label="Your Language" />
        <LanguageSelector value={targetLang} onChange={setTargetLang} label="Practice Language" />
      </div>

      {/* Conversation */}
      <div style={{ 
        backgroundColor: isUserTurn ? '#e3f2fd' : '#f3e5f5', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <strong>{isUserTurn ? '👤 You:' : '💬 NPC:'}</strong>
          <span style={{ marginLeft: '10px', fontSize: '12px', color: '#666' }}>
            ({currentConversation.context})
          </span>
        </div>
        
        {!isUserTurn ? (
          <div>
            {/* User's preferred language (primary display) */}
            <div style={{ fontSize: '18px', marginBottom: '10px', fontWeight: 'bold', color: '#2c3e50' }}>
              <strong>{sourceLang.split('-')[0].toUpperCase()}:</strong> 
              {isTranslatingNPC ? ' Translating...' : ` ${translatedNPCText || currentConversation.text}`}
            </div>
            
            {/* Original English text (smaller, for reference) */}
            {!sourceLang.startsWith('en') && (
              <div style={{ fontSize: '14px', marginBottom: '15px', color: '#7f8c8d', fontStyle: 'italic' }}>
                <strong>English:</strong> {currentConversation.text}
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <button 
                onClick={async () => {
                  try {
                    console.log('Speaking NPC text in user language:', translatedNPCText || currentConversation.text, 'language:', sourceLang);
                    await handleTTS(translatedNPCText || currentConversation.text, sourceLang);
                  } catch (err) {
                    console.error('NPC TTS failed:', err);
                    alert('Speech playback failed. Please try again.');
                  }
                }}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  minWidth: '150px'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#2980b9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#3498db';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                🔊 Listen in {sourceLang.split('-')[0].toUpperCase()}
              </button>
              
              {!sourceLang.startsWith('en') && (
                <button 
                  onClick={async () => {
                    try {
                      console.log('Speaking NPC text in English:', currentConversation.text);
                      await handleTTS(currentConversation.text, 'en-US');
                    } catch (err) {
                      console.error('English NPC TTS failed:', err);
                      alert('Speech playback failed. Please try again.');
                    }
                  }}
                  style={{
                    padding: '12px 20px',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'all 0.3s ease',
                    minWidth: '130px'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#7f8c8d';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#95a5a6';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  🔊 English
                </button>
              )}
            </div>
            
            <button 
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#27ae60',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Continue →
            </button>
          </div>
        ) : (
          <div>
            <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#ecf0f1', borderRadius: '5px' }}>
              <strong>Expected response (English):</strong> {currentConversation.text}
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>
                Your response in {sourceLang.split('-')[0].toUpperCase()}:
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={`Type your response in ${sourceLang.split('-')[0].toUpperCase()}...`}
                style={{
                  width: '100%',
                  height: '80px',
                  padding: '10px',
                  border: isRecording ? '2px solid #3498db' : '1px solid #ccc',
                  borderRadius: '5px',
                  fontSize: '14px',
                  backgroundColor: isRecording ? '#f8f9fa' : 'white'
                }}
              />
              {isRecording && (
                <div style={{ 
                  fontSize: '12px', 
                  color: '#3498db', 
                  marginTop: '5px',
                  fontStyle: 'italic'
                }}>
                  🎤 Listening in {sourceLang}... Speak clearly into your microphone
                </div>
              )}
            </div>
            
            {/* Voice Input Button */}
            {isWebSpeechAvailable() && (
              <div style={{ marginBottom: '15px' }}>
                <button
                  onClick={isRecording ? stopVoiceInput : startVoiceInput}
                  style={{
                    padding: '10px 16px',
                    backgroundColor: isRecording ? '#e74c3c' : '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '10px',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {isRecording ? '🛑 Stop Speaking' : `🎤 Speak in ${sourceLang.split('-')[0].toUpperCase()}`}
                </button>
                <small style={{ color: '#7f8c8d' }}>Or type your response above</small>
              </div>
            )}
            
            {/* Translation Display - Made more prominent */}
            {translatedInput && (
              <div style={{
                backgroundColor: '#e8f5e8',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '3px solid #27ae60',
                boxShadow: '0 4px 8px rgba(39, 174, 96, 0.2)'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px', color: '#27ae60', fontSize: '16px' }}>
                  🎯 Your Translation in {targetLang.split('-')[0].toUpperCase()}:
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', color: '#2c3e50' }}>
                  {translatedInput}
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <button 
                    onClick={async () => {
                      if (isPlayingTTS) return; // Prevent multiple clicks
                      try {
                        console.log('Speaking translated input:', translatedInput, 'language:', targetLang);
                        await handleTTS(translatedInput, targetLang);
                      } catch (err) {
                        console.error('Translation TTS failed:', err);
                        // Don't show alert for TTS errors in scenario mode
                        console.log('TTS error handled silently:', err);
                      }
                    }}
                    disabled={isPlayingTTS}
                    style={{
                      padding: '12px 20px',
                      backgroundColor: isPlayingTTS ? '#95a5a6' : '#27ae60',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: isPlayingTTS ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      opacity: isPlayingTTS ? 0.7 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!isPlayingTTS) {
                        e.currentTarget.style.backgroundColor = '#229954';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isPlayingTTS) {
                        e.currentTarget.style.backgroundColor = '#27ae60';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }
                    }}
                  >
                    {isPlayingTTS ? '🔊 Playing...' : '🔊 Listen to Your Translation'}
                  </button>
                  <div style={{ fontSize: '14px', color: '#7f8c8d', fontStyle: 'italic' }}>
                    This translation will remain visible for 30 seconds
                  </div>
                </div>
              </div>
            )}
            
            <button 
              onClick={handleUserResponse}
              disabled={!userInput.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: userInput.trim() ? '#27ae60' : '#bdc3c7',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: userInput.trim() ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Submit Response
            </button>
          </div>
        )}
      </div>

      {/* Completion Message */}
      {currentStep >= selectedScenario.conversations.length - 1 && (
        <div style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '15px',
          borderRadius: '5px',
          textAlign: 'center',
          border: '1px solid #c3e6cb'
        }}>
          🎉 Congratulations! You've completed the {selectedScenario.name} scenario!
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={resetScenario}
              style={{
                padding: '10px 20px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              🔄 Try Again
            </button>
            <button 
              onClick={() => setSelectedScenario(null)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Choose Another Scenario
            </button>
          </div>
        </div>
      )}
    </div>
  );
}