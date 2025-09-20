// Test script for Google Cloud Translation API
async function testGoogleCloudTranslation() {
  console.log('Testing Google Cloud Translation API...\n');
  
  try {
    // Try to import the Google Cloud Translation client
    const { TranslationServiceClient } = require('@google-cloud/translate');
    console.log('✅ Google Cloud Translation package loaded successfully');
    
    // Initialize the client
    const translationClient = new TranslationServiceClient();
    console.log('✅ Google Cloud Translation client initialized');
    
    // Test translation
    const projectId = process.env.GOOGLE_CLOUD_PROJECT || 'lingua-phone';
    const location = 'global';
    
    const request = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: ['Hello, how are you?'],
      mimeType: 'text/plain',
      sourceLanguageCode: 'en',
      targetLanguageCode: 'es',
    };
    
    const [response] = await translationClient.translateText(request);
    const translatedText = response.translations[0].translatedText;
    
    console.log(`✅ Translation test successful: "Hello, how are you?" → "${translatedText}"`);
    console.log('🎉 Google Cloud Translation API is working correctly!');
    
    // Test Bengali translation specifically
    const bengaliRequest = {
      parent: `projects/${projectId}/locations/${location}`,
      contents: ['মেয়েদের জন্য টি-শার্ট'], // T-shirt for girls
      mimeType: 'text/plain',
      sourceLanguageCode: 'bn',
      targetLanguageCode: 'en',
    };
    
    const [bengaliResponse] = await translationClient.translateText(bengaliRequest);
    const bengaliTranslatedText = bengaliResponse.translations[0].translatedText;
    
    console.log(`✅ Bengali translation test successful: "মেয়েদের জন্য টি-শার্ট" → "${bengaliTranslatedText}"`);
    
    return true;
  } catch (error) {
    console.log(`❌ Google Cloud Translation test failed: ${error.message}`);
    console.log('This might be due to:');
    console.log('1. Missing or invalid service account key');
    console.log('2. Google Cloud Translation API not enabled in your project');
    console.log('3. Network connectivity issues');
    console.log('4. Incorrect project ID or credentials');
    
    return false;
  }
}

// Run the test
testGoogleCloudTranslation().then(success => {
  if (success) {
    console.log('\n🎉 All tests passed! Google Cloud Translation is ready to use.');
  } else {
    console.log('\n⚠️ Google Cloud Translation is not working. The app will use fallback translation methods.');
  }
}).catch(console.error);