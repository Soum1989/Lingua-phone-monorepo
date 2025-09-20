// Script to verify the main functionality of the AI shopping assistant
const fs = require('fs');
const path = require('path');

console.log('=== AI Shopping Assistant Functionality Verification ===\n');

// 1. Check if product data is properly structured
console.log('1. Verifying Product Data Structure...');
try {
  const productsDataPath = path.join(__dirname, 'packages', 'backend', 'src', 'data', 'productsData.ts');
  const fileContent = fs.readFileSync(productsDataPath, 'utf8');
  
  // Check for required fields in products
  const requiredFields = ['id', 'name', 'price', 'category', 'url'];
  let allFieldsPresent = true;
  
  for (const field of requiredFields) {
    if (!fileContent.includes(field)) {
      console.log(`❌ Missing required field: ${field}`);
      allFieldsPresent = false;
    }
  }
  
  if (allFieldsPresent) {
    console.log('✅ All required product fields are present');
  }
  
  // Check for Bazaar Marketplace URLs
  const urlPattern = /https:\/\/bazaar-market-place\.netlify\.app\/products\/\d+/g;
  const urls = fileContent.match(urlPattern);
  if (urls && urls.length > 0) {
    console.log(`✅ Found ${urls.length} Bazaar Marketplace product URLs`);
  } else {
    console.log('❌ No Bazaar Marketplace URLs found');
  }
} catch (error) {
  console.log('❌ Error verifying product data:', error.message);
}

// 2. Check translation service configuration
console.log('\n2. Verifying Translation Service Configuration...');
try {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check if Google Cloud is enabled
  if (envContent.includes('USE_GCP=true')) {
    console.log('✅ Google Cloud Translation is enabled');
  } else {
    console.log('⚠️ Google Cloud Translation is not enabled');
  }
  
  // Check for service account file reference
  if (envContent.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
    console.log('✅ Service account file is referenced in environment variables');
  } else {
    console.log('❌ Service account file is not referenced in environment variables');
  }
  
  // Check for project ID
  if (envContent.includes('GOOGLE_CLOUD_PROJECT')) {
    console.log('✅ Google Cloud Project ID is set');
  } else {
    console.log('❌ Google Cloud Project ID is not set');
  }
} catch (error) {
  console.log('❌ Error reading .env file:', error.message);
}

// 3. Check if the service account key file exists
console.log('\n3. Verifying Service Account Key File...');
try {
  const serviceAccountPath = path.join(__dirname, 'packages', 'backend', 'keys', 'service-account.json');
  if (fs.existsSync(serviceAccountPath)) {
    console.log('✅ Service account key file exists');
    
    // Check if it's a valid JSON file
    try {
      const serviceAccountContent = fs.readFileSync(serviceAccountPath, 'utf8');
      JSON.parse(serviceAccountContent);
      console.log('✅ Service account key file is valid JSON');
    } catch (jsonError) {
      console.log('❌ Service account key file is not valid JSON:', jsonError.message);
    }
  } else {
    console.log('❌ Service account key file does not exist');
  }
} catch (error) {
  console.log('❌ Error checking service account key file:', error.message);
}

// 4. Check frontend component for product rendering
console.log('\n4. Verifying Frontend Product Rendering...');
try {
  const frontendPath = path.join(__dirname, 'packages', 'frontend', 'src', 'components', 'ShoppingChat.tsx');
  const frontendContent = fs.readFileSync(frontendPath, 'utf8');
  
  // Check if product rendering functions exist
  if (frontendContent.includes('renderProducts')) {
    console.log('✅ Product rendering function found in frontend');
  } else {
    console.log('❌ Product rendering function not found in frontend');
  }
  
  // Check if Bazaar Marketplace URLs are being used
  if (frontendContent.includes('bazaar-market-place.netlify.app')) {
    console.log('✅ Bazaar Marketplace URLs are referenced in frontend');
  } else {
    console.log('❌ Bazaar Marketplace URLs are not referenced in frontend');
  }
  
  // Check if product recommendations are handled
  if (frontendContent.includes('productRecommendations')) {
    console.log('✅ Product recommendations handling found in frontend');
  } else {
    console.log('❌ Product recommendations handling not found in frontend');
  }
} catch (error) {
  console.log('❌ Error checking frontend component:', error.message);
}

// 5. Check API routes for translation endpoint
console.log('\n5. Verifying API Translation Endpoint...');
try {
  const apiPath = path.join(__dirname, 'packages', 'backend', 'src', 'routes', 'api.ts');
  const apiContent = fs.readFileSync(apiPath, 'utf8');
  
  // Check if translation endpoint exists
  if (apiContent.includes('/translate')) {
    console.log('✅ Translation endpoint found in API routes');
  } else {
    console.log('❌ Translation endpoint not found in API routes');
  }
  
  // Check if translation service is imported
  if (apiContent.includes('translateText')) {
    console.log('✅ Translation service is imported in API routes');
  } else {
    console.log('❌ Translation service is not imported in API routes');
  }
} catch (error) {
  console.log('❌ Error checking API routes:', error.message);
}

console.log('\n=== Verification Complete ===');