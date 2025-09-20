const fs = require('fs');
const path = require('path');

console.log('=== Google Cloud TTS Verification ===\n');

// Check if service account file exists
const serviceAccountPath = path.join(__dirname, 'packages', 'backend', 'keys', 'service-account.json');
console.log('1. Checking service account file...');

if (fs.existsSync(serviceAccountPath)) {
  console.log('   ✅ Service account file found');
  
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log(`   Project ID: ${serviceAccount.project_id}`);
    console.log(`   Client Email: ${serviceAccount.client_email}`);
    
    // Verify required fields
    const requiredFields = ['project_id', 'private_key', 'client_email'];
    const missingFields = requiredFields.filter(field => !serviceAccount[field]);
    
    if (missingFields.length === 0) {
      console.log('   ✅ All required fields present in service account file');
    } else {
      console.log(`   ❌ Missing fields: ${missingFields.join(', ')}`);
    }
  } catch (error) {
    console.log('   ❌ Service account file is not valid JSON');
    console.log(`   Error: ${error.message}`);
  }
} else {
  console.log('   ❌ Service account file not found');
  console.log(`   Expected path: ${serviceAccountPath}`);
}

console.log('\n2. Checking environment variables...');
console.log(`   USE_GCP: ${process.env.USE_GCP || 'Not set'}`);
console.log(`   GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS || 'Not set'}`);
console.log(`   GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT || 'Not set'}`);

console.log('\n3. Testing Google Cloud TTS client initialization...');

try {
  // Try to initialize the Google Cloud TTS client
  const tts = require('@google-cloud/text-to-speech');
  const client = new tts.TextToSpeechClient();
  console.log('   ✅ Google Cloud TTS client initialized successfully');
  console.log('   ✅ Google Cloud TTS should be working!');
} catch (error) {
  console.log('   ❌ Failed to initialize Google Cloud TTS client');
  console.log(`   Error: ${error.message}`);
  
  if (error.message.includes('Could not load the default credentials')) {
    console.log('   💡 Hint: Make sure GOOGLE_APPLICATION_CREDENTIALS is set correctly');
  } else if (error.message.includes('ENOENT')) {
    console.log('   💡 Hint: Make sure the service account file exists at the specified path');
  }
}

console.log('\n=== Verification Complete ===\n');

console.log('Next steps:');
console.log('1. Make sure the Cloud Text-to-Speech API is enabled in Google Cloud Console');
console.log('2. Ensure your service account has the "Cloud Text-to-Speech API User" role');
console.log('3. Restart your backend server');
console.log('4. Check backend logs for "Google Cloud TTS client initialized successfully"');