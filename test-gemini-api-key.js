// Test script to verify Gemini API key functionality
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const fs = require('fs');

console.log('=== Gemini API Key Test ===\n');

// Load environment variables manually
const envPath = path.resolve(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.trim() === '' || line.trim().startsWith('#')) {
      return;
    }
    
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      process.env[key.trim()] = value;
    }
  });
  
  console.log('✅ .env file loaded');
} else {
  console.log('❌ .env file not found');
}

console.log('GEMINI_API_KEY status:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');

if (!process.env.GEMINI_API_KEY) {
  console.log('\n❌ GEMINI_API_KEY is not set. Please check your .env file.');
  process.exit(1);
}

// Test Gemini API key
async function testGeminiAPI() {
  try {
    console.log('\nTesting Gemini API key...');
    
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to get a model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Gemini client initialized successfully');
    
    // Test with a simple prompt
    const prompt = 'Say "Hello, World!" in English';
    console.log('Sending test prompt to Gemini API...');
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log('✅ Gemini API responded successfully');
    console.log('Response:', response);
    
    console.log('\n🎉 Gemini API key is working correctly!');
    return true;
  } catch (error) {
    console.log('❌ Gemini API test failed:', error.message);
    
    if (error.message.includes('API_KEY_INVALID')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. The API key appears to be invalid');
      console.log('2. Please verify the GEMINI_API_KEY in your .env file');
      console.log('3. Generate a new API key from Google Cloud Console');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. The API key lacks necessary permissions');
      console.log('2. Check API key restrictions in Google Cloud Console');
      console.log('3. Ensure the Gemini API is enabled for this key');
    } else if (error.message.includes('UNAUTHENTICATED')) {
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Authentication failed with the provided API key');
      console.log('2. Verify the API key is correct and active');
    } else {
      console.log('\n🔧 General troubleshooting steps:');
      console.log('1. Check your internet connection');
      console.log('2. Verify firewall settings are not blocking the request');
      console.log('3. Check Google Cloud Console for any API usage limits');
    }
    
    return false;
  }
}

// Run the test
testGeminiAPI().then(success => {
  if (success) {
    console.log('\n✅ All tests passed! The Gemini API key is valid and working.');
    console.log('The AI Shopping Assistant should initialize correctly with this key.');
  } else {
    console.log('\n❌ Gemini API key test failed.');
    console.log('The AI Shopping Assistant will not be able to initialize until this is resolved.');
  }
}).catch(console.error);