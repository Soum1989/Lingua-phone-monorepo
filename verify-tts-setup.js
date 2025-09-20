const fs = require('fs');
const path = require('path');

console.log('=== Google Cloud TTS Setup Verification ===\n');

// Check 1: Environment variables
console.log('1. Checking environment variables...');
const useGcp = process.env.USE_GCP || 'Not set';
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 'Not set';
const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'Not set';

console.log(`   USE_GCP: ${useGcp}`);
console.log(`   GOOGLE_APPLICATION_CREDENTIALS: ${credentialsPath}`);
console.log(`   GOOGLE_CLOUD_PROJECT: ${projectId}\n`);

// Check 2: Service account file
console.log('2. Checking service account file...');
const serviceAccountPath = path.join(__dirname, 'packages', 'backend', 'keys', 'service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  console.log('   ✅ Service account file found');
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log(`   Project ID from key: ${serviceAccount.project_id}`);
    console.log(`   Client email: ${serviceAccount.client_email}`);
  } catch (error) {
    console.log('   ❌ Service account file is not valid JSON');
  }
} else {
  console.log('   ❌ Service account file not found');
  console.log(`   Expected path: ${serviceAccountPath}`);
}

console.log('\n3. Checking dependencies...');
try {
  const tts = require('@google-cloud/text-to-speech');
  console.log('   ✅ Google Cloud Text-to-Speech package is installed');
} catch (error) {
  console.log('   ❌ Google Cloud Text-to-Speech package not found or not installed correctly');
  console.log(`   Error: ${error.message}`);
}

console.log('\n=== Setup Verification Complete ===\n');

console.log('Next steps:');
console.log('1. If any checks failed, follow the setup guide in GOOGLE_CLOUD_TTS_SETUP.md');
console.log('2. Make sure the Text-to-Speech API is enabled in Google Cloud Console');
console.log('3. Restart your backend server after making changes');
console.log('4. Check backend logs for "Google Cloud TTS client initialized successfully"');