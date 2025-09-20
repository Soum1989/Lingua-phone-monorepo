// Script to check the overall status of the application
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('=== AI Shopping Assistant Application Status Check ===\n');

// Function to make HTTP requests
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: data ? JSON.parse(data) : null
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            data: data
          });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

// Check if backend server is running
async function checkBackendStatus() {
  console.log('1. Checking Backend Server Status...');
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/languages',
      method: 'GET',
      timeout: 5000
    };
    
    const response = await makeRequest(options);
    
    if (response.statusCode === 200) {
      console.log('✅ Backend server is running');
      console.log(`✅ Languages endpoint is accessible (${response.data.languages.length} languages supported)`);
      return true;
    } else {
      console.log(`❌ Backend server responded with status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend server is not accessible: ${error.message}`);
    return false;
  }
}

// Check translation service
async function checkTranslationService() {
  console.log('\n2. Checking Translation Service...');
  
  try {
    const testData = JSON.stringify({
      text: 'Hello',
      from: 'en',
      to: 'es'
    });
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/translate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      },
      timeout: 10000
    };
    
    const response = await makeRequest(options, testData);
    
    if (response.statusCode === 200 && response.data.translatedText) {
      console.log('✅ Translation service is working');
      console.log(`✅ English to Spanish translation: "Hello" → "${response.data.translatedText}"`);
      return true;
    } else {
      console.log(`❌ Translation service responded with status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Translation service is not accessible: ${error.message}`);
    return false;
  }
}

// Check Bengali translation specifically
async function checkBengaliTranslation() {
  console.log('\n3. Checking Bengali Translation...');
  
  try {
    const testData = JSON.stringify({
      text: 'মেয়েদের জন্য টি-শার্ট', // T-shirt for girls
      from: 'bn',
      to: 'en'
    });
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/translate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      },
      timeout: 10000
    };
    
    const response = await makeRequest(options, testData);
    
    if (response.statusCode === 200 && response.data.translatedText) {
      console.log('✅ Bengali translation is working');
      console.log(`✅ Bengali to English translation: "মেয়েদের জন্য টি-শার্ট" → "${response.data.translatedText}"`);
      return true;
    } else {
      console.log(`❌ Bengali translation responded with status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Bengali translation is not accessible: ${error.message}`);
    return false;
  }
}

// Check product data
async function checkProductData() {
  console.log('\n4. Checking Product Data...');
  
  try {
    const productsDataPath = path.join(__dirname, 'packages', 'backend', 'src', 'data', 'productsData.ts');
    const productsData = fs.readFileSync(productsDataPath, 'utf8');
    
    // Count products
    const productMatches = productsData.match(/id:\s*"\d+"/g);
    const productCount = productMatches ? productMatches.length : 0;
    
    // Check for Bazaar Marketplace URLs
    const urlMatches = productsData.match(/https:\/\/bazaar-market-place\.netlify\.app\/products\/\d+/g);
    const urlCount = urlMatches ? urlMatches.length : 0;
    
    console.log(`✅ Found ${productCount} products in data file`);
    console.log(`✅ Found ${urlCount} Bazaar Marketplace URLs`);
    
    if (productCount > 0 && urlCount > 0) {
      console.log('✅ Product data is properly configured');
      return true;
    } else {
      console.log('❌ Issues with product data configuration');
      return false;
    }
  } catch (error) {
    console.log(`❌ Error reading product data: ${error.message}`);
    return false;
  }
}

// Check AI Shopping Assistant status
async function checkAIService() {
  console.log('\n5. Checking AI Shopping Assistant Service...');
  
  try {
    const testData = JSON.stringify({
      message: 'I need a t-shirt',
      language: 'en',
      userId: 'test-user'
    });
    
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
      },
      timeout: 15000
    };
    
    const response = await makeRequest(options, testData);
    
    if (response.statusCode === 200) {
      console.log('✅ AI Shopping Assistant is accessible');
      if (response.data.productRecommendations && response.data.productRecommendations.length > 0) {
        console.log(`✅ Product recommendations working (${response.data.productRecommendations.length} products)`);
        return true;
      } else {
        console.log('⚠️ AI service accessible but no product recommendations returned');
        return true;
      }
    } else if (response.statusCode === 503) {
      console.log('❌ AI Shopping Assistant is not initialized (Service Unavailable)');
      console.log('   This is likely due to missing Gemini API key or initialization error');
      return false;
    } else {
      console.log(`❌ AI Shopping Assistant responded with status ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ AI Shopping Assistant is not accessible: ${error.message}`);
    return false;
  }
}

// Main function to run all checks
async function runAllChecks() {
  const results = {
    backend: false,
    translation: false,
    bengali: false,
    products: false,
    ai: false
  };
  
  results.backend = await checkBackendStatus();
  results.translation = await checkTranslationService();
  results.bengali = await checkBengaliTranslation();
  results.products = await checkProductData();
  results.ai = await checkAIService();
  
  console.log('\n=== Summary ===');
  console.log(`Backend Server: ${results.backend ? '✅ Working' : '❌ Not Working'}`);
  console.log(`Translation Service: ${results.translation ? '✅ Working' : '❌ Not Working'}`);
  console.log(`Bengali Translation: ${results.bengali ? '✅ Working' : '❌ Not Working'}`);
  console.log(`Product Data: ${results.products ? '✅ Working' : '❌ Not Working'}`);
  console.log(`AI Shopping Assistant: ${results.ai ? '✅ Working' : '❌ Not Working'}`);
  
  const workingCount = Object.values(results).filter(Boolean).length;
  console.log(`\nOverall Status: ${workingCount}/5 components working`);
  
  if (workingCount === 5) {
    console.log('\n🎉 All systems are operational!');
    console.log('The AI shopping assistant can render products from Bazaar Marketplace and handle translations seamlessly.');
  } else if (workingCount >= 3) {
    console.log('\n⚠️ Most systems are working, but some features may be limited.');
    console.log('The app can handle translations and product rendering, but AI recommendations may not be available.');
  } else {
    console.log('\n❌ Critical components are not working.');
    console.log('The app may have limited functionality.');
  }
  
  // Provide specific recommendations
  console.log('\n=== Recommendations ===');
  if (!results.backend) {
    console.log('1. Start the backend server: cd packages/backend && npm run dev');
  }
  if (!results.ai) {
    console.log('2. Check if GEMINI_API_KEY is set in .env file');
    console.log('3. Verify the Gemini API key is valid');
  }
  if (!results.translation || !results.bengali) {
    console.log('4. Verify Google Cloud Translation API is enabled');
    console.log('5. Check service account key permissions');
  }
}

// Run the checks
runAllChecks().catch(console.error);