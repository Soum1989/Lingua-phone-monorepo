#!/usr/bin/env node

/**
 * Google Cloud TTS Setup Helper Script
 * 
 * This script provides guidance for setting up Google Cloud TTS integration.
 */

const fs = require('fs');
const path = require('path');

console.log('=== Google Cloud TTS Setup Helper ===\n');

// Check if service account file exists
const serviceAccountPath = path.join(__dirname, 'keys', 'service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  console.log('✅ Service account file found!');
  console.log('Google Cloud TTS should be enabled and working.\n');
  
  // Check environment variables
  if (process.env.USE_GCP === 'true') {
    console.log('✅ USE_GCP is set to true');
  } else {
    console.log('⚠️  USE_GCP is not set to true in your .env file');
  }
  
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log('✅ GOOGLE_APPLICATION_CREDENTIALS is set');
  } else {
    console.log('⚠️  GOOGLE_APPLICATION_CREDENTIALS is not set in your .env file');
  }
  
  console.log('\nTo test Google Cloud TTS:');
  console.log('1. Start your backend server: npm run dev (from packages/backend)');
  console.log('2. Check the console logs for "Google Cloud TTS client initialized successfully"');
  console.log('3. Test the TTS API endpoint with a tool like curl or Postman');
  
} else {
  console.log('❌ Service account file not found.');
  console.log('\nTo enable Google Cloud TTS, please follow these steps:');
  console.log('\n1. Go to Google Cloud Console: https://console.cloud.google.com/');
  console.log('2. Select your project: lingua-phone');
  console.log('3. Enable the Text-to-Speech API');
  console.log('4. Create a service account with TTS permissions');
  console.log('5. Download the JSON key file');
  console.log('6. Save it as: ' + serviceAccountPath);
  console.log('7. Restart your backend server');
  
  console.log('\nFor detailed instructions, see: GOOGLE_CLOUD_SETUP.md');
}

console.log('\n=== End of Setup Helper ===');