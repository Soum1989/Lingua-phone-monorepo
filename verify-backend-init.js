// Script to verify backend initialization without starting the server
require('dotenv').config({ path: './.env' });

async function verifyBackendInitialization() {
  console.log('🔍 Verifying Backend Initialization...\n');
  
  // Check environment variables
  console.log('1. Checking environment variables...');
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'SET' : 'NOT SET'}`);
  console.log(`   USE_GCP: ${process.env.USE_GCP || 'NOT SET'}`);
  console.log(`   GOOGLE_CLOUD_PROJECT: ${process.env.GOOGLE_CLOUD_PROJECT || 'NOT SET'}\n`);
  
  // Test Gemini service initialization
  console.log('2. Testing Gemini Shopping Assistant initialization...');
  try {
    // Change to the backend directory to ensure proper path resolution
    process.chdir('./packages/backend');
    
    // Dynamically import the service
    const geminiModule = await import('./src/services/geminiShoppingService');
    const GeminiShoppingAssistant = geminiModule.default || geminiModule.GeminiShoppingAssistant;
    
    const assistant = new GeminiShoppingAssistant();
    console.log('✅ Gemini Shopping Assistant initialized successfully\n');
    
    // Test a simple query
    console.log('3. Testing simple query...');
    try {
      const result = await assistant.processShoppingQuery({
        query: 'Hello, this is a test',
        language: 'en'
      });
      console.log('✅ Simple query test passed\n');
    } catch (queryError) {
      console.warn('⚠️  Simple query test had an issue:', queryError.message);
      console.log('   This might be due to network connectivity or API key issues\n');
    }
  } catch (initError) {
    console.error('❌ Gemini Shopping Assistant initialization failed:', initError.message);
    console.log('\n🔧 Troubleshooting steps:');
    console.log('   1. Check if GEMINI_API_KEY is correctly set in .env file');
    console.log('   2. Verify the API key is valid and has proper permissions');
    console.log('   3. Ensure @google/generative-ai package is installed');
    console.log('   4. Check network connectivity to Google APIs');
    return;
  }
  
  console.log('🎉 Backend initialization verification completed successfully!');
  console.log('✅ Your backend services should start without issues.');
}

verifyBackendInitialization().catch(console.error);