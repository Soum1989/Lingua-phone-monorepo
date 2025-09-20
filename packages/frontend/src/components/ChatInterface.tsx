import React, { useRef, useState } from 'react'

// Extend Window interface for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function ChatInterface({ onTranscribed, lang, transcriptionText } : { onTranscribed: (t:string)=>void, lang: string, transcriptionText: string }) {
  const [recording, setRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [useWebSpeech, setUseWebSpeech] = useState(true)
  const recRef = useRef<MediaRecorder|null>(null)
  const speechRecognitionRef = useRef<any>(null)
  const chunksRef = useRef<BlobPart[]>([])

  // Check if Web Speech API is available
  const isWebSpeechAvailable = () => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  }

  async function startWebSpeechRecording() {
    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Web Speech API not supported');
      }
      
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;
      
      recognition.onstart = () => {
        console.log('Web Speech Recognition started for language:', lang);
        setRecording(true);
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;
        console.log(`Web Speech Recognition result: "${transcript}" (confidence: ${confidence})`);
        onTranscribed(transcript);
        setRecording(false);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Web Speech Recognition error:', event.error);
        setRecording(false);
        
        // Handle specific errors
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again and speak clearly.');
        } else if (event.error === 'audio-capture') {
          alert('Microphone not available. Please check your microphone settings.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone permission denied. Please allow microphone access.');
        } else {
          // Fallback to audio recording on other errors
          console.log('Falling back to audio recording method...');
          setUseWebSpeech(false);
          setTimeout(() => startAudioRecording(), 500);
        }
      };
      
      recognition.onend = () => {
        console.log('Web Speech Recognition ended');
        setRecording(false);
      };
      
      speechRecognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Web Speech API initialization error:', err);
      alert('Speech recognition not available. Switching to audio recording method.');
      setUseWebSpeech(false);
      setTimeout(() => startAudioRecording(), 500);
    }
  }

  async function startAudioRecording() {
    try {
      console.log('Requesting microphone access for audio recording...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
      console.log('Using MIME type:', mime);
      
      const rec = new MediaRecorder(stream, { mimeType: mime } as any);
      recRef.current = rec;
      chunksRef.current = [];
      
      rec.ondataavailable = e => { 
        if (e.data && e.data.size > 0) {
          console.log('Audio chunk received, size:', e.data.size);
          chunksRef.current.push(e.data);
        }
      };
      
      rec.onstop = async () => {
        setIsProcessing(true);
        console.log('Audio recording stopped, processing...');
        
        const blob = new Blob(chunksRef.current, { type: mime });
        console.log('Audio blob created, size:', blob.size);
        
        if (blob.size === 0) {
          alert('No audio recorded. Please try again.');
          setIsProcessing(false);
          return;
        }
        
        const form = new FormData();
        form.append('file', blob, 'recording.webm');
        form.append('language', lang);
        
        try {
          console.log('Sending audio for transcription...');
          const res = await fetch('/api/speech-to-text', { 
            method: 'POST', 
            body: form 
          });
          
          if (!res.ok) {
            throw new Error(`Server responded with ${res.status}: ${res.statusText}`);
          }
          
          const json = await res.json();
          console.log('Transcription response:', json);
          
          if (json && json.text) {
            onTranscribed(json.text);
          } else {
            alert('No transcription returned from server');
          }
        } catch (err) {
          console.error('Transcription error:', err);
          alert('Transcription failed: ' + (err as Error).message);
        } finally {
          setIsProcessing(false);
        }
        
        // Stop all audio tracks to release microphone
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Audio track stopped');
        });
      };
      
      rec.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        alert('Audio recording error occurred');
        setRecording(false);
        setIsProcessing(false);
      };
      
      rec.start(1000); // Collect data every second
      setRecording(true);
      console.log('Audio recording started');
    } catch (err) {
      console.error('Microphone access error:', err);
      if (err instanceof DOMException) {
        if (err.name === 'NotAllowedError') {
          alert('Microphone permission denied. Please allow microphone access and try again.');
        } else if (err.name === 'NotFoundError') {
          alert('No microphone found. Please connect a microphone and try again.');
        } else {
          alert('Microphone error: ' + err.message);
        }
      } else {
        alert('Microphone access error: ' + (err as Error).message);
      }
    }
  }

  async function startRecording() {
    if (useWebSpeech && isWebSpeechAvailable()) {
      await startWebSpeechRecording();
    } else {
      await startAudioRecording();
    }
  }

  function stopRecording() {
    if (speechRecognitionRef.current) {
      speechRecognitionRef.current.stop();
      speechRecognitionRef.current = null;
    }
    if (recRef.current) {
      recRef.current.stop();
    }
    setRecording(false)
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3>🎤 Voice Recording</h3>
      
      {/* Speech Recognition Method Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <input 
            type="checkbox" 
            checked={useWebSpeech} 
            onChange={(e) => setUseWebSpeech(e.target.checked)}
            disabled={!isWebSpeechAvailable()}
          />
          Use Browser Speech Recognition {!isWebSpeechAvailable() && '(Not Available)'}
        </label>
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <button 
          onClick={() => recording ? stopRecording() : startRecording()}
          disabled={isProcessing}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: recording ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {isProcessing ? '🔄 Processing...' : recording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
        </button>
        
        {isWebSpeechAvailable() && (
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
            Method: {useWebSpeech ? 'Browser Speech API' : 'Audio Upload'}
          </div>
        )}
      </div>
      
      {/* Transcription Output Box */}
      <div style={{ marginTop: '1rem' }}>
        <label><strong>📝 Transcription:</strong></label>
        <div style={{
          border: '2px solid #ddd',
          borderRadius: '5px',
          padding: '15px',
          minHeight: '100px',
          backgroundColor: transcriptionText ? '#f0f8f0' : '#f9f9f9',
          borderColor: transcriptionText ? '#4CAF50' : '#ddd',
          fontFamily: 'system-ui, sans-serif',
          fontSize: '16px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word'
        }}>
          {transcriptionText || 'No transcription yet. Click "Start Recording" to begin speaking...'}
        </div>
      </div>
    </div>
  )
}
