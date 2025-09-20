// Test script to directly initialize the Gemini Shopping Assistant
const path = require('path');
const dotenv = require('dotenv');

console.log('=== Direct Gemini Shopping Assistant Test ===\n');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('Environment variables loaded:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
console.log('USE_GCP:', process.env.USE_GCP);
console.log('GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT);

// Try to import and initialize the Gemini Shopping Assistant
try {
  console.log('\nAttempting to import GeminiShoppingService...');
  
  // Add the backend src to module paths
  const backendSrc = path.join(__dirname, 'packages', 'backend', 'src');
  console.log('Backend src path:', backendSrc);
  
  // Try to import the service
  const geminiModule = require('./packages/backend/src/services/geminiShoppingService');
  console.log('✅ GeminiShoppingService module imported successfully');
  
  const GeminiShoppingAssistant = geminiModule.default || geminiModule.GeminiShoppingAssistant;
  console.log('✅ GeminiShoppingAssistant class found');
  
  // Try to initialize the assistant
  console.log('\nAttempting to initialize Gemini Shopping Assistant...');
  const assistant = new GeminiShoppingAssistant();
  console.log('✅ Gemini Shopping Assistant initialized successfully');
  console.log('🎉 The Gemini Shopping Assistant is ready to use!');
  
} catch (error) {
  console.log(`❌ Failed to initialize Gemini Shopping Assistant: ${error.message}`);
  console.log('Error stack:', error.stack);
  
  // Provide specific troubleshooting steps
  if (error.message.includes('GEMINI_API_KEY')) {
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Verify the GEMINI_API_KEY in .env file is valid');
    console.log('2. Check if the Gemini API is enabled in Google Cloud Console');
    console.log('3. Ensure the API key has the correct permissions');
  } else if (error.message.includes('module')) {
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Make sure all dependencies are installed: cd packages/backend && npm install');
    console.log('2. Check if there are any syntax errors in the service files');
  } else {
    console.log('\n🔧 General troubleshooting steps:');
    console.log('1. Restart the backend server');
    console.log('2. Check the server logs for more detailed error information');
    console.log('3. Verify all environment variables are correctly set');
  }
}