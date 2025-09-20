const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('=== Google Cloud TTS Permissions Debug ===\n');

// Load environment variables from .env file
const envPath = path.resolve(__dirname, '.env');
console.log(`Loading environment variables from: ${envPath}`);
dotenv.config({ path: envPath });

// Also load from backend .env if it exists
const backendEnvPath = path.resolve(__dirname, 'packages', 'backend', '.env');
if (fs.existsSync(backendEnvPath)) {
  console.log(`Loading backend environment variables from: ${backendEnvPath}`);
  const backendEnv = dotenv.parse(fs.readFileSync(backendEnvPath));
  Object.keys(backendEnv).forEach(key => {
    if (!process.env[key]) {
      process.env[key] = backendEnv[key];
    }
  });
}

console.log('\n1. Service Account File Check:');
const serviceAccountPath = path.join(__dirname, 'packages', 'backend', 'keys', 'service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  console.log('   ✅ Service account file found');
  
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log(`   Project ID: ${serviceAccount.project_id}`);
    console.log(`   Client Email: ${serviceAccount.client_email}`);
  } catch (error) {
    console.log('   ❌ Service account file is not valid JSON');
    console.log(`   Error: ${error.message}`);
    process.exit(1);
  }
} else {
  console.log('   ❌ Service account file not found');
  console.log(`   Expected path: ${serviceAccountPath}`);
  process.exit(1);
}

console.log('\n2. Environment Variables Check:');
const requiredEnvVars = ['USE_GCP', 'GOOGLE_APPLICATION_CREDENTIALS', 'GOOGLE_CLOUD_PROJECT'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length === 0) {
  console.log('   ✅ All required environment variables are set');
  console.log(`   USE_GCP: ${process.env.USE_GCP}`);
  console.log(`   GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
  console.log(`   GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT}`);
  
  // Set the credentials path explicitly
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    const resolvedPath = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);
    process.env.GOOGLE_APPLICATION_CREDENTIALS = resolvedPath;
    console.log(`   Resolved credentials path: ${resolvedPath}`);
  }
} else {
  console.log(`   ❌ Missing environment variables: ${missingEnvVars.join(', ')}`);
  
  // Try to set them manually
  process.env.USE_GCP = 'true';
  process.env.GOOGLE_CLOUD_PROJECT = 'lingua-phone';
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(__dirname, 'packages', 'backend', 'keys', 'service-account.json');
  
  console.log('   Setting environment variables manually:');
  console.log(`   USE_GCP: ${process.env.USE_GCP}`);
  console.log(`   GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT}`);
  console.log(`   GOOGLE_APPLICATION_CREDENTIALS: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
}

console.log('\n3. Testing Google Cloud TTS Initialization:');

try {
  // Dynamically import the TTS client (like in the actual service)
  const ttsModule = require('@google-cloud/text-to-speech');
  const TextToSpeechClient = ttsModule.TextToSpeechClient;
  
  console.log('   ✅ Google Cloud TTS module loaded successfully');
  
  // Try to create client
  const client = new TextToSpeechClient();
  console.log('   ✅ Google Cloud TTS client created successfully');
  
  // Try a simple list voices operation to test permissions
  client.listVoices()
    .then(([response]) => {
      console.log('   ✅ Google Cloud TTS API call successful');
      console.log(`   🎉 Google Cloud TTS is fully working!`);
      console.log(`   Available voices: ${response.voices ? response.voices.length : 0}`);
    })
    .catch((error) => {
      console.log('   ❌ Google Cloud TTS API call failed');
      console.log(`   Error: ${error.message}`);
      
      if (error.message.includes('PERMISSION')) {
        console.log('   💡 This indicates a permissions issue');
        console.log('   💡 Try granting the Editor role to your service account');
      } else if (error.message.includes('API has not been used')) {
        console.log('   💡 The Text-to-Speech API may not be enabled');
        console.log('   💡 Go to Google Cloud Console and enable the API');
      } else if (error.message.includes('Could not load the default credentials')) {
        console.log('   💡 Credentials issue - make sure the service account file is correctly placed');
        console.log('   💡 And that GOOGLE_APPLICATION_CREDENTIALS points to the correct path');
      }
    });
    
} catch (error) {
  console.log('   ❌ Failed to initialize Google Cloud TTS');
  console.log(`   Error: ${error.message}`);
  
  if (error.message.includes('Cannot find module')) {
    console.log('   💡 The @google-cloud/text-to-speech package may not be installed');
    console.log('   💡 Run: npm install @google-cloud/text-to-speech');
  }
}

console.log('\n=== Debug Complete ===\n');

console.log('Next steps if you see permission errors:');
console.log('1. In Google Cloud Console, go to IAM & Admin → IAM');
console.log('2. Find your service account: soumyendu@lingua-phone.iam.gserviceaccount.com');
console.log('3. Click the pencil icon to edit');
console.log('4. Add the Editor role (for testing) or search for Text-to-Speech roles');
console.log('5. Save and restart your backend server');