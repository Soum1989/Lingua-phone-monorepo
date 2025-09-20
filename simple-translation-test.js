// Simple test to see what Google Translate returns for Bengali queries
async function testBengaliTranslation() {
  try {
    // Import the translation service
    const translationModule = await import('./packages/backend/src/services/translationService');
    const { translateText } = translationModule;
    
    console.log('Testing Bengali to English translation...\n');
    
    const testQueries = [
      'মেয়েদের জন্য টি-শার্ট',  // T-shirt for girls
      'girls t-shirt',
      'টি-শার্ট'  // T-shirt
    ];
    
    for (const query of testQueries) {
      try {
        console.log(`Translating: "${query}"`);
        const result = await translateText(query, 'bn', 'en');
        console.log(`Result: "${result}"\n`);
      } catch (error) {
        console.log(`Error translating "${query}": ${error.message}\n`);
      }
    }
  } catch (error) {
    console.error('Failed to import translation service:', error);
  }
}

testBengaliTranslation();