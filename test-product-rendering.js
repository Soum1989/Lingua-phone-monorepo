// Test script to verify product rendering functionality
const fs = require('fs');
const path = require('path');

// Read the product data file directly
const productsDataPath = path.join(__dirname, 'packages', 'backend', 'src', 'data', 'productsData.ts');
console.log('Reading product data from:', productsDataPath);

try {
  // Read the file content
  const fileContent = fs.readFileSync(productsDataPath, 'utf8');
  console.log('✅ Product data file found');
  
  // Extract products array (simplified parsing)
  const productsMatch = fileContent.match(/export\s+const\s+products:\s+Product\[\]\s*=\s*\[([\s\S]*?)\];/);
  if (productsMatch) {
    console.log('✅ Products array found in file');
    // Count opening and closing braces to estimate number of products
    const productsSection = productsMatch[1];
    const openBraces = (productsSection.match(/{/g) || []).length;
    const closeBraces = (productsSection.match(/}/g) || []).length;
    console.log(`Estimated number of products: ${openBraces}`);
    
    // Look for Bazaar Marketplace URLs
    const urlMatches = productsSection.match(/https:\/\/bazaar-market-place\.netlify\.app\/products\/\d+/g);
    if (urlMatches) {
      console.log('✅ Bazaar Marketplace URLs found:');
      const uniqueUrls = [...new Set(urlMatches)];
      uniqueUrls.slice(0, 5).forEach(url => console.log(`  - ${url}`));
    } else {
      console.log('❌ No Bazaar Marketplace URLs found in product data');
    }
  } else {
    console.log('❌ Products array not found in file');
  }
} catch (error) {
  console.log('❌ Error reading product data file:', error.message);
}

// Test the translation service
console.log('\n--- Translation Service Test ---');
const translationServicePath = path.join(__dirname, 'packages', 'backend', 'src', 'services', 'translationService.ts');
console.log('Checking translation service at:', translationServicePath);

try {
  const translationContent = fs.readFileSync(translationServicePath, 'utf8');
  console.log('✅ Translation service file found');
  
  // Check if Google Cloud Translation is being used
  if (translationContent.includes('@google-cloud/translate')) {
    console.log('✅ Google Cloud Translation package referenced');
  } else {
    console.log('❌ Google Cloud Translation package not referenced');
  }
  
  // Check if fallback translation methods exist
  if (translationContent.includes('freeGoogleTranslate') || translationContent.includes('intelligentMockTranslate')) {
    console.log('✅ Fallback translation methods found');
  } else {
    console.log('❌ Fallback translation methods not found');
  }
} catch (error) {
  console.log('❌ Error reading translation service file:', error.message);
}

console.log('\n--- Test Complete ---');