// Test script for Gemini API connection
require('dotenv').config({ path: './.env' });
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
  console.log('🧪 Testing Gemini API Connection...\n');
  
  // Check if API key is set
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in .env file');
    return;
  }
  
  console.log(`✅ GEMINI_API_KEY found: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  
  // Check if API key has the correct format
  if (!process.env.GEMINI_API_KEY.startsWith('AIza')) {
    console.error('❌ GEMINI_API_KEY appears to be invalid (should start with "AIza")');
    console.error('Current key:', process.env.GEMINI_API_KEY);
    return;
  }
  
  try {
    // Initialize the Google Generative AI client
    console.log('🔄 Initializing Google Generative AI client...');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    console.log('✅ Google Generative AI client initialized');
    
    // Get the model
    console.log('🔄 Getting generative model...');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    console.log('✅ Generative model retrieved');
    
    // Test with a simple prompt
    const prompt = 'Hello, this is a test. Respond with "Test successful" if you receive this.';
    console.log(`\n📤 Sending test prompt: "${prompt}"`);
    
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    
    console.log(`📥 Received response: "${response}"`);
    console.log('\n🎉 Gemini API Connection Test PASSED!');
    console.log('✅ Your AI Shopping Assistant should work correctly');
    
  } catch (error) {
    console.error('❌ Gemini API Connection Test FAILED:', error.message);
    console.log('\n🔧 Troubleshooting Tips:');
    console.log('   1. Check if your GEMINI_API_KEY is valid and correctly formatted');
    console.log('   2. Ensure the Gemini API is enabled in Google Cloud Console');
    console.log('   3. Verify your API key has the correct permissions');
    console.log('   4. Check if there are any network restrictions');
    console.log('   5. Make sure you have internet connectivity');
    console.log('   6. The API key might have expired or been revoked');
    
    // Additional debugging info
    console.log('\n🔍 Debug Information:');
    console.log('   API Key Length:', process.env.GEMINI_API_KEY.length);
    console.log('   API Key Prefix:', process.env.GEMINI_API_KEY.substring(0, 10));
  }
}

// Run the test
testGeminiAPI();