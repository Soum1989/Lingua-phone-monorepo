// Test script to check Gemini Shopping Assistant initialization
console.log('Testing Gemini Shopping Assistant initialization...\n');

// Mock environment variables
process.env.GEMINI_API_KEY = 'test-key';

try {
  console.log('Attempting to import GeminiShoppingAssistant...');
  
  // Try to import the service
  const geminiModule = require('./src/services/geminiShoppingService');
  const GeminiShoppingAssistant = geminiModule.default || geminiModule.GeminiShoppingAssistant;
  
  console.log('✅ GeminiShoppingService module imported successfully');
  
  // Try to initialize the assistant
  console.log('Attempting to initialize Gemini Shopping Assistant...');
  const assistant = new GeminiShoppingAssistant();
  
  console.log('✅ Gemini Shopping Assistant initialized successfully');
  console.log('🎉 The Gemini Shopping Assistant is ready to use!');
  
} catch (error) {
  console.log(`❌ Failed to initialize Gemini Shopping Assistant: ${error.message}`);
  console.log('Stack trace:', error.stack);
  
  if (error.message.includes('GEMINI_API_KEY')) {
    console.log('\n⚠️ The issue is with the GEMINI_API_KEY environment variable.');
    console.log('Make sure you have a valid Gemini API key in your .env file.');
  } else if (error.message.includes('module')) {
    console.log('\n⚠️ There might be an issue with module imports or dependencies.');
    console.log('Make sure all required dependencies are installed.');
  } else {
    console.log('\n⚠️ There was an unexpected error during initialization.');
  }
}