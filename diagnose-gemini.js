// Comprehensive diagnostic script for Gemini API issues
require('dotenv').config({ path: './.env' });

async function diagnoseGeminiAPI() {
  console.log('🔍 Comprehensive Gemini API Diagnostic\n');
  
  // 1. Check if API key is set
  console.log('1. Checking GEMINI_API_KEY environment variable...');
  if (!process.env.GEMINI_API_KEY) {
    console.error('❌ GEMINI_API_KEY is not set in .env file');
    return;
  }
  
  console.log(`✅ GEMINI_API_KEY found: ${process.env.GEMINI_API_KEY.substring(0, 10)}...`);
  
  // 2. Validate API key format
  console.log('\n2. Validating API key format...');
  if (!process.env.GEMINI_API_KEY.startsWith('AIza')) {
    console.error('❌ GEMINI_API_KEY appears to be invalid (should start with "AIza")');
    return;
  }
  
  if (process.env.GEMINI_API_KEY.length < 30) {
    console.error('❌ GEMINI_API_KEY appears to be too short to be valid');
    return;
  }
  
  console.log('✅ API key format appears correct');
  
  // 3. Try to import the Google Generative AI module
  console.log('\n3. Testing import of @google/generative-ai module...');
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    console.log('✅ Module imported successfully');
  } catch (importError) {
    console.error('❌ Failed to import @google/generative-ai module:', importError.message);
    console.log('🔧 Try running: npm install @google/generative-ai');
    return;
  }
  
  // 4. Test initialization
  console.log('\n4. Testing GoogleGenerativeAI initialization...');
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    console.log('✅ GoogleGenerativeAI initialized successfully');
  } catch (initError) {
    console.error('❌ Failed to initialize GoogleGenerativeAI:', initError.message);
    return;
  }
  
  // 5. Test model access
  console.log('\n5. Testing model access...');
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    console.log('✅ Model access successful');
  } catch (modelError) {
    console.error('❌ Failed to access model:', modelError.message);
    return;
  }
  
  // 6. Test API connectivity
  console.log('\n6. Testing API connectivity with a simple request...');
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Simple test prompt
    const prompt = 'Respond with exactly "TEST_OK" and nothing else';
    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    if (response === 'TEST_OK') {
      console.log('✅ API connectivity test passed');
    } else {
      console.warn(`⚠️  Unexpected response: "${response}"`);
    }
  } catch (apiError) {
    console.error('❌ API connectivity test failed:', apiError.message);
    
    // Provide specific troubleshooting based on error type
    if (apiError.message.includes('API_KEY_INVALID')) {
      console.log('\n🔧 Troubleshooting: API_KEY_INVALID');
      console.log('   - Your API key may be incorrect or revoked');
      console.log('   - Generate a new API key from Google AI Studio');
    } else if (apiError.message.includes('PERMISSION_DENIED')) {
      console.log('\n🔧 Troubleshooting: PERMISSION_DENIED');
      console.log('   - Your API key may not have the correct permissions');
      console.log('   - Check that the Gemini API is enabled in Google Cloud Console');
    } else if (apiError.message.includes('UNAUTHENTICATED')) {
      console.log('\n🔧 Troubleshooting: UNAUTHENTICATED');
      console.log('   - Authentication failed, check your API key');
    } else if (apiError.message.includes('ENOTFOUND') || apiError.message.includes('network')) {
      console.log('\n🔧 Troubleshooting: Network Issue');
      console.log('   - Check your internet connection');
      console.log('   - Check if there are firewall restrictions');
    }
    return;
  }
  
  console.log('\n🎉 All tests passed! Gemini API should work correctly.');
  console.log('✅ Your AI Shopping Assistant should function properly.');
}

// Run the diagnostic
diagnoseGeminiAPI().catch(console.error);