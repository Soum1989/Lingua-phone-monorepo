// Google Cloud Text-to-Speech Test Script
// Run this after enabling TTS API in Google Cloud Console

const axios = require('axios');
const { textToSpeech } = require('./packages/backend/src/services/ttsService');

async function testTTS() {
  console.log('Testing Google Cloud TTS...');
  
  try {
    const result = await textToSpeech('Hello, this is a test of Google Cloud Text-to-Speech.', 'en-US');
    console.log('TTS Result:', result);
    
    if (result.provider === 'google-cloud') {
      console.log('✅ Google Cloud TTS is working!');
    } else {
      console.log('⚠️  Google Cloud TTS is not enabled, using fallback');
    }
  } catch (error) {
    console.error('Error testing TTS:', error);
  }
}

testTTS();

const testCases = [
  { text: "Hello, this is a test", language: "en-US", description: "English TTS" },
  { text: "নমস্কার, এটি একটি পরীক্ষা", language: "bn-IN", description: "Bengali TTS" },
  { text: "नमस्ते, यह एक परीक्षण है", language: "hi-IN", description: "Hindi TTS" },
  { text: "வணக்கம், இது ஒரு சோதனை", language: "ta-IN", description: "Tamil TTS" },
  { text: "ನಮಸ್ಕಾರ, ಇದು ಒಂದು ಪರೀಕ್ಷೆ", language: "kn-IN", description: "Kannada TTS" }
];

async function testTTS(text, language, description) {
  try {
    console.log(`\n🎤 Testing: ${description}`);
    console.log(`   Text: "${text}"`);
    console.log(`   Language: ${language}`);
    
    const response = await axios.post('http://localhost:3001/api/tts', {
      text: text,
      language: language
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000,
      responseType: 'arraybuffer'  // Handle both audio and JSON responses
    });

    const contentType = response.headers['content-type'];
    
    if (contentType && contentType.includes('audio')) {
      console.log(`✅ SUCCESS: Got Google Cloud TTS audio (${response.data.length} bytes)`);
      console.log(`   Content-Type: ${contentType}`);
      return { success: true, provider: 'google-cloud', size: response.data.length };
    } else {
      // Try to parse as JSON (mock response)
      const jsonResponse = JSON.parse(response.data.toString());
      if (jsonResponse.provider === 'mock') {
        console.log(`⚠️ MOCK MODE: ${jsonResponse.note}`);
        return { success: false, provider: 'mock', note: jsonResponse.note };
      } else {
        console.log(`❓ UNKNOWN: Unexpected response format`);
        return { success: false, provider: 'unknown' };
      }
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      try {
        const errorData = JSON.parse(error.response.data.toString());
        console.log(`   Details: ${JSON.stringify(errorData)}`);
      } catch {
        console.log(`   Raw Response: ${error.response.data.toString().substring(0, 200)}`);
      }
    }
    return { success: false, provider: 'error', error: error.message };
  }
}

async function runTTSTests() {
  console.log('🚀 Starting Google Cloud Text-to-Speech API Tests...');
  console.log('📍 Make sure your backend server is running on http://localhost:3001');
  console.log('🔑 Make sure Cloud Text-to-Speech API is enabled in Google Cloud Console');
  
  let googleCloudCount = 0;
  let mockCount = 0;
  let errorCount = 0;
  
  for (const test of testCases) {
    const result = await testTTS(test.text, test.language, test.description);
    
    if (result.success && result.provider === 'google-cloud') {
      googleCloudCount++;
    } else if (result.provider === 'mock') {
      mockCount++;
    } else {
      errorCount++;
    }
    
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`🎉 Google Cloud TTS: ${googleCloudCount}/${testCases.length}`);
  console.log(`🔄 Mock/Fallback: ${mockCount}/${testCases.length}`);
  console.log(`❌ Errors: ${errorCount}/${testCases.length}`);
  
  if (googleCloudCount === testCases.length) {
    console.log(`\n🎉 PERFECT! Google Cloud TTS is working for all languages! 🎉`);
    console.log(`Your Bengali TTS should now work perfectly in the app.`);
  } else if (mockCount > 0) {
    console.log(`\n⚠️ SETUP NEEDED: Text-to-Speech API not enabled`);
    console.log(`\n🔧 Next Steps:`);
    console.log(`1. Go to Google Cloud Console → APIs & Services → Library`);
    console.log(`2. Search for "Cloud Text-to-Speech API"`);
    console.log(`3. Click ENABLE`);
    console.log(`4. Add "Cloud Text-to-Speech API User" role to your service account`);
    console.log(`5. Restart your backend server: npm run dev`);
    console.log(`6. Run this test again: node test-tts.js`);
  } else {
    console.log(`\n❌ ERRORS DETECTED: Check your setup`);
    console.log(`\n🔧 Troubleshooting:`);
    console.log(`1. Ensure backend server is running: npm run dev`);
    console.log(`2. Check Google Cloud Console for API enablement`);
    console.log(`3. Verify service account permissions`);
    console.log(`4. Check backend console logs for errors`);
  }
}

// Run the tests
runTTSTests().catch(console.error);