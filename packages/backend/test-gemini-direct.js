// Test script to directly initialize the Gemini Shopping Assistant
const path = require('path');
const fs = require('fs');

console.log('=== Direct Gemini Shopping Assistant Test ===\n');

// Load environment variables from the root directory
const envPath = path.resolve(__dirname, '../../../.env');
console.log('Loading env file from:', envPath);

// Manually load the .env file since dotenv might not work in this context
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    // Skip comments and empty lines
    if (line.trim() === '' || line.trim().startsWith('#')) {
      return;
    }
    
    // Parse key=value pairs
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
  
  console.log('✅ .env file loaded manually');
} else {
  console.log('❌ .env file not found');
}

console.log('Environment variables loaded:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
console.log('USE_GCP:', process.env.USE_GCP);
console.log('GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT);

// Try to import and initialize the Gemini Shopping Assistant
try {
  console.log('\nAttempting to import GeminiShoppingService...');
  
  // Try to import the service using the correct relative path
  const geminiModule = require('./src/services/geminiShoppingService');
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
    console.log('1. Make sure all dependencies are installed: npm install');
    console.log('2. Check if there are any syntax errors in the service files');
  } else {
    console.log('\n🔧 General troubleshooting steps:');
    console.log('1. Restart the backend server');
    console.log('2. Check the server logs for more detailed error information');
    console.log('3. Verify all environment variables are correctly set');
  }
}