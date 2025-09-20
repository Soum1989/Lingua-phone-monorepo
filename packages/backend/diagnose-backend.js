// Diagnostic script to check backend functionality
const path = require('path');

async function diagnoseBackend() {
  console.log('=== Backend Diagnostic ===\n');
  
  // Test 1: Check if translation service is working
  console.log('1. Testing Translation Service...');
  try {
    const { translateText } = require('./src/services/translationService');
    
    // Test Bengali to English translation
    const bengaliText = 'মেয়েদের জন্য টি-শার্ট'; // T-shirt for girls
    console.log(`   Translating Bengali text: "${bengaliText}"`);
    
    const translatedText = await translateText(bengaliText, 'bn', 'en');
    console.log(`   ✅ Translation successful: "${translatedText}"`);
  } catch (error) {
    console.log(`   ❌ Translation test failed: ${error.message}`);
  }
  
  // Test 2: Check if product data is accessible
  console.log('\n2. Testing Product Data Access...');
  try {
    const { products } = require('./src/data/productsData');
    console.log(`   ✅ Product data loaded successfully. Found ${products.length} products.`);
    
    // Show first few products
    console.log('   Sample products:');
    products.slice(0, 3).forEach(product => {
      console.log(`     - ${product.name} (${product.category}) - $${product.price}`);
    });
  } catch (error) {
    console.log(`   ❌ Product data test failed: ${error.message}`);
  }
  
  // Test 3: Check language service
  console.log('\n3. Testing Language Service...');
  try {
    const { getSupportedLanguages } = require('./src/services/languageService');
    const languages = await getSupportedLanguages();
    console.log(`   ✅ Language service working. Found ${languages.length} supported languages.`);
    
    // Show first few languages
    console.log('   Sample languages:');
    languages.slice(0, 5).forEach(lang => {
      console.log(`     - ${lang.name} (${lang.code})`);
    });
  } catch (error) {
    console.log(`   ❌ Language service test failed: ${error.message}`);
  }
  
  console.log('\n=== Diagnostic Complete ===');
}

diagnoseBackend().catch(console.error);