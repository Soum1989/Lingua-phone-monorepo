// Test script to verify translation service is working
const { translateText, testGoogleCloudTranslation } = require('./packages/backend/src/services/translationService');

async function testTranslationService() {
  console.log('Testing translation service...\n');
  
  // Test if Google Cloud Translation is working
  const isGCPWorking = await testGoogleCloudTranslation();
  console.log('Google Cloud Translation working:', isGCPWorking);
  
  // Test translations
  const testCases = [
    { text: 'Hello, how are you?', from: 'en', to: 'hi' },
    { text: 'Good morning', from: 'en', to: 'bn' },
    { text: 'Thank you', from: 'en', to: 'ta' },
    { text: 'How much does this cost?', from: 'en', to: 'te' }
  ];
  
  for (const test of testCases) {
    try {
      console.log(`\nTesting: "${test.text}" (${test.from} → ${test.to})`);
      const result = await translateText(test.text, test.from, test.to);
      console.log(`Result: "${result}"`);
      
      // Check if we got a meaningful translation
      if (result && result !== test.text && result.length > 0) {
        console.log('✅ SUCCESS: Translation worked!');
      } else {
        console.log('⚠️  WARNING: Got same text back or empty result');
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
  
  // Test Bengali specifically since that was mentioned in the issue
  console.log('\n=== Bengali Translation Tests ===');
  const bengaliTests = [
    { text: 'মেয়েদের জন্য টি-শার্ট', from: 'bn', to: 'en' }, // T-shirt for girls
    { text: 'মহিলাদের জন্য কোন টি-শার্ট দেখান', from: 'bn', to: 'en' }, // Show T-shirts for women
    { text: 'নারীদের জন্য শার্ট', from: 'bn', to: 'en' }, // Shirt for women
    { text: 'ছেলেদের জন্য টি-শার্ট', from: 'bn', to: 'en' } // T-shirt for boys
  ];
  
  for (const test of bengaliTests) {
    try {
      console.log(`\nTranslating: "${test.text}" (${test.from} → ${test.to})`);
      const result = await translateText(test.text, test.from, test.to);
      console.log(`Result: "${result}"`);
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
}

testTranslationService().catch(console.error);

// Test script to verify our fixes for translated gender-specific clothing recommendations
const fs = require('fs');
const path = require('path');

// Load the products data
const productsData = [
  { id: "1", name: "Travel Fjallraven - Foldsack No. 1 Backpack", price: 109.95, category: "travel_bag", url: "https://bazaar-market-place.netlify.app/products/1" },
  { id: "2", name: "Men's T-Shirt", price: 22.3, category: "t_shirts_men", url: "https://bazaar-market-place.netlify.app/products/2" },
  { id: "3", name: "Men's Jacket", price: 55.99, category: "jackets_men", url: "https://bazaar-market-place.netlify.app/products/3" },
  { id: "4", name: "Another Men's T-Shirt", price: 15.99, category: "t_shirts_men", url: "https://bazaar-market-place.netlify.app/products/4" },
  { id: "5", name: "Bracelet", price: 695, category: "jewellery_bracelet", url: "https://bazaar-market-place.netlify.app/products/5" },
  { id: "18", name: "MBJ Women Solid Short Sleeve Boat Neck V", price: 9.85, category: "top_women", url: "https://bazaar-market-place.netlify.app/products/18" },
  { id: "19", name: "Opna Women's Short Sleeve Moisture", price: 7.95, category: "top_women", url: "https://bazaar-market-place.netlify.app/products/19" },
  { id: "20", name: "DANVOUY Womens T Shirt Casual Cotton Short", price: 12.99, category: "top_women", url: "https://bazaar-market-place.netlify.app/products/20" }
];

// Test cases with original queries and their English translations
const testCases = [
  { 
    original: "মহিলাদের জন্য কোন টি-শার্ট দেখান", 
    translated: "show me t-shirt for women",
    expectedCategory: "top_women" 
  },
  { 
    original: "लड़कियों के लिए कुछ टी-शर्ट दिखाइए", 
    translated: "show me some t-shirts for girls",
    expectedCategory: "top_women" 
  },
  { 
    original: "क्या आप मुझे कुछ गर्ल्स की टी-शर्ट दिखा सकते हैं", 
    translated: "can you show me some girls t-shirt",
    expectedCategory: "top_women" 
  },
  { 
    original: "पुरुषों के लिए कुछ टी-शर्ट दिखाएं", 
    translated: "show me some t-shirts for men",
    expectedCategory: "t_shirts_men" 
  }
];

// Simple synonym mapping based on our implementation
const synonymMap = {
  // Women's clothing
  "women's t-shirt": { category: 'top_women' },
  "womens t-shirt": { category: 'top_women' },
  "women's top": { category: 'top_women' },
  "womens top": { category: 'top_women' },
  "women's shirt": { category: 'top_women' },
  "womens shirt": { category: 'top_women' },
  "ladies t-shirt": { category: 'top_women' },
  "ladies top": { category: 'top_women' },
  "girls t-shirt": { category: 'top_women' },
  "girls top": { category: 'top_women' },
  "girls shirt": { category: 'top_women' },
  "women's jacket": { category: 'jacket_women' },
  "womens jacket": { category: 'jacket_women' },
  "ladies jacket": { category: 'jacket_women' },
  "girls jacket": { category: 'jacket_women' },
  
  // Men's clothing
  "men's t-shirt": { category: 't_shirts_men' },
  "mens t-shirt": { category: 't_shirts_men' },
  "men's top": { category: 't_shirts_men' },
  "mens top": { category: 't_shirts_men' },
  "men's shirt": { category: 't_shirts_men' },
  "mens shirt": { category: 't_shirts_men' },
  "men's jacket": { category: 'jackets_men' },
  "mens jacket": { category: 'jackets_men' },
  "boys t-shirt": { category: 't_shirts_men' },
  "boys top": { category: 't_shirts_men' },
  "boys shirt": { category: 't_shirts_men' },
  "boys jacket": { category: 'jackets_men' },
  
  // Generic terms (fallback)
  't-shirt': { category: 'clothing' },
  'shirt': { category: 'clothing' },
  'jacket': { category: 'clothing' }
};

console.log('Testing translated gender-specific clothing recommendations...\n');

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: "${testCase.original}"`);
  console.log(`  English translation: "${testCase.translated}"`);
  
  // Use the translated query for matching (this is what our fix does)
  const q = testCase.translated.toLowerCase();
  
  // Find matching category
  let matchedCategory = null;
  for (const key in synonymMap) {
    if (q.includes(key)) {
      matchedCategory = synonymMap[key].category;
      break;
    }
  }
  
  if (matchedCategory) {
    console.log(`  Matched category: ${matchedCategory}`);
    
    // Filter products by exact category match (our fix)
    const filteredProducts = productsData.filter(p => p.category === matchedCategory);
    
    console.log(`  Found ${filteredProducts.length} products:`);
    filteredProducts.forEach(product => {
      console.log(`    - ${product.name} (${product.category})`);
    });
    
    // Check if result matches expectation
    if (filteredProducts.length > 0 && filteredProducts[0].category === testCase.expectedCategory) {
      console.log(`  ✅ PASS: Correctly matched expected category "${testCase.expectedCategory}"\n`);
    } else {
      console.log(`  ❌ FAIL: Expected category "${testCase.expectedCategory}" but got products from other categories\n`);
    }
  } else {
    console.log(`  No category match found\n`);
  }
});

console.log('Test completed.');