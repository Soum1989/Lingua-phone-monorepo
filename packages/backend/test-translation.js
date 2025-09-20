// Simple test for translation service
async function testTranslation() {
  console.log('Testing translation service...\n');
  
  try {
    const { translateText } = require('./src/services/translationService');
    
    // Test Bengali to English translation
    const bengaliText = 'মেয়েদের জন্য টি-শার্ট'; // T-shirt for girls
    console.log(`Translating Bengali text: "${bengaliText}"`);
    
    const translatedText = await translateText(bengaliText, 'bn', 'en');
    console.log(`Translation result: "${translatedText}"`);
    
    if (translatedText && translatedText !== bengaliText) {
      console.log('✅ Translation service is working!');
    } else {
      console.log('⚠️ Translation returned the same text or empty result');
    }
  } catch (error) {
    console.log(`❌ Translation test failed: ${error.message}`);
    console.log('This might be due to missing Google Cloud credentials or network issues.');
  }
}

testTranslation().catch(console.error);