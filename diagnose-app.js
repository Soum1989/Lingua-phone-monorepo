// Diagnostic script to check if the AI shopping assistant is working properly
const axios = require('axios');
const path = require('path');
const fs = require('fs');

async function diagnoseApp() {
  console.log('=== AI Shopping Assistant Diagnostic ===\n');
  
  // Test 1: Check if translation service is working
  console.log('1. Testing Translation Service...');
  try {
    // Use relative path from the current directory
    const translationServicePath = path.join('./packages/backend/src/services/translationService');
    if (fs.existsSync(translationServicePath + '.ts') || fs.existsSync(translationServicePath + '.js')) {
      // Dynamically import the module
      const translationModule = await import(translationServicePath);
      const { translateText } = translationModule;
      
      // Test Bengali to English translation
      const bengaliText = 'মেয়েদের জন্য টি-শার্ট'; // T-shirt for girls
      console.log(`   Translating Bengali text: "${bengaliText}"`);
      
      const translatedText = await translateText(bengaliText, 'bn', 'en');
      console.log(`   ✅ Translation successful: "${translatedText}"`);
    } else {
      console.log(`   ❌ Translation service file not found at ${translationServicePath}`);
    }
  } catch (error) {
    console.log(`   ❌ Translation test failed: ${error.message}`);
  }
  
  // Test 2: Check if product data is accessible
  console.log('\n2. Testing Product Data Access...');
  try {
    const productsDataPath = path.join('./packages/backend/src/data/productsData');
    if (fs.existsSync(productsDataPath + '.ts') || fs.existsSync(productsDataPath + '.js')) {
      const productsModule = await import(productsDataPath);
      const { products } = productsModule;
      console.log(`   ✅ Product data loaded successfully. Found ${products.length} products.`);
      
      // Show first few products
      console.log('   Sample products:');
      products.slice(0, 3).forEach(product => {
        console.log(`     - ${product.name} (${product.category}) - $${product.price}`);
      });
    } else {
      console.log(`   ❌ Product data file not found at ${productsDataPath}`);
    }
  } catch (error) {
    console.log(`   ❌ Product data test failed: ${error.message}`);
  }
  
  // Test 3: Check if Gemini Shopping Assistant can be initialized
  console.log('\n3. Testing Gemini Shopping Assistant Initialization...');
  try {
    const geminiServicePath = path.join('./packages/backend/src/services/geminiShoppingService');
    if (fs.existsSync(geminiServicePath + '.ts') || fs.existsSync(geminiServicePath + '.js')) {
      // Mock the environment variable for testing
      if (!process.env.GEMINI_API_KEY) {
        process.env.GEMINI_API_KEY = 'test-key';
      }
      
      const geminiModule = await import(geminiServicePath);
      const GeminiShoppingAssistant = geminiModule.default || geminiModule.GeminiShoppingAssistant;
      const assistant = new GeminiShoppingAssistant();
      console.log('   ✅ Gemini Shopping Assistant initialized successfully.');
    } else {
      console.log(`   ❌ Gemini Shopping Assistant file not found at ${geminiServicePath}`);
    }
  } catch (error) {
    console.log(`   ❌ Gemini Shopping Assistant initialization failed: ${error.message}`);
  }
  
  // Test 4: Check language service
  console.log('\n4. Testing Language Service...');
  try {
    const languageServicePath = path.join('./packages/backend/src/services/languageService');
    if (fs.existsSync(languageServicePath + '.ts') || fs.existsSync(languageServicePath + '.js')) {
      const languageModule = await import(languageServicePath);
      const { getSupportedLanguages } = languageModule;
      const languages = await getSupportedLanguages();
      console.log(`   ✅ Language service working. Found ${languages.length} supported languages.`);
      
      // Show first few languages
      console.log('   Sample languages:');
      languages.slice(0, 5).forEach(lang => {
        console.log(`     - ${lang.name} (${lang.code})`);
      });
    } else {
      console.log(`   ❌ Language service file not found at ${languageServicePath}`);
    }
  } catch (error) {
    console.log(`   ❌ Language service test failed: ${error.message}`);
  }
  
  console.log('\n=== Diagnostic Complete ===');
}

diagnoseApp().catch(console.error);