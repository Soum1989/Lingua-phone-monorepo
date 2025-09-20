



// Google Cloud TTS Direct Test
// This tests if the TTS client can be initialized properly

const path = require('path');
const fs = require('fs');

// Set up environment variables like the backend does
process.env.USE_GCP = 'true';
process.env.GOOGLE_APPLICATION_CREDENTIALS = './keys/service-account.json';
process.env.GOOGLE_CLOUD_PROJECT = 'lingua-phone';

console.log('🔍 Google Cloud TTS Direct Diagnosis');
console.log('=====================================');

// Check 1: Environment Variables
console.log('\n1️⃣ Environment Variables:');
console.log('   USE_GCP:', process.env.USE_GCP);
console.log('   GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
console.log('   GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT);

// Check 2: Service Account File
console.log('\n2️⃣ Service Account File:');
const keyPath = path.join(__dirname, 'packages/backend/keys/service-account.json');
if (fs.existsSync(keyPath)) {
  console.log('   ✅ Service account file exists');
  try {
    const keyContent = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
    console.log('   ✅ Valid JSON structure');
    console.log('   📧 Client email:', keyContent.client_email);
    console.log('   🏗️ Project ID:', keyContent.project_id);
  } catch (error) {
    console.log('   ❌ Invalid JSON:', error.message);
  }
} else {
  console.log('   ❌ Service account file not found at:', keyPath);
}

// Check 3: Google Cloud Package
console.log('\n3️⃣ Google Cloud Package:');
try {
  const tts = require('@google-cloud/text-to-speech');
  console.log('   ✅ @google-cloud/text-to-speech package loaded');
  
  // Check 4: Client Initialization
  console.log('\n4️⃣ TTS Client Initialization:');
  try {
    const client = new tts.TextToSpeechClient();
    console.log('   ✅ TTS Client created successfully');
    
    // Check 5: Simple API Call
    console.log('\n5️⃣ Testing API Call:');
    
    const request = {
      input: { text: 'Hello World' },
      voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
      audioConfig: { audioEncoding: 'MP3' },
    };
    
    client.synthesizeSpeech(request)
      .then(([response]) => {
        if (response.audioContent) {
          console.log('   🎉 SUCCESS: Google Cloud TTS API is working!');
          console.log('   📊 Audio size:', response.audioContent.length, 'bytes');
          console.log('\n✅ DIAGNOSIS COMPLETE: Google Cloud TTS is properly configured!');
          console.log('🔧 The backend should now work with TTS.');
        } else {
          console.log('   ❌ No audio content received');
        }
      })
      .catch((error) => {
        console.log('   ❌ API Call failed:', error.message);
        
        if (error.message.includes('PERMISSION_DENIED')) {
          console.log('\n🔧 SOLUTION: Add "Cloud Text-to-Speech API User" role to your service account');
          console.log('   1. Go to Google Cloud Console → IAM & Admin → IAM');
          console.log('   2. Find: soumyendu@lingua-phone.iam.gserviceaccount.com');
          console.log('   3. Edit and add "Cloud Text-to-Speech API User" role');
        } else if (error.message.includes('API_NOT_FOUND')) {
          console.log('\n🔧 SOLUTION: Enable Cloud Text-to-Speech API');
          console.log('   1. Go to Google Cloud Console → APIs & Services → Library');
          console.log('   2. Search "Cloud Text-to-Speech API"');
          console.log('   3. Click ENABLE');
        } else {
          console.log('\n🔧 Check your Google Cloud Console setup');
        }
      });
      
  } catch (error) {
    console.log('   ❌ Failed to create TTS client:', error.message);
  }
  
} catch (error) {
  console.log('   ❌ Package not found:', error.message);
  console.log('   💡 Run: npm install @google-cloud/text-to-speech');
}