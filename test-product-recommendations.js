// Test script to check product recommendation functionality
const http = require('http');

console.log('Testing product recommendation functionality...\n');

// Test data for product recommendations
const testData = {
  message: 'I need a t-shirt for girls',
  language: 'en',
  userId: 'test-user'
};

// Send chat request
const postData = JSON.stringify(testData);

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  },
  timeout: 15000
};

const req = http.request(options, (res) => {
  console.log(`✅ Chat endpoint responded with status code: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      console.log('Chat response:', JSON.stringify(result, null, 2));
      
      if (result.productRecommendations && result.productRecommendations.length > 0) {
        console.log(`✅ Product recommendations received: ${result.productRecommendations.length} products`);
        console.log('Sample products:');
        result.productRecommendations.slice(0, 3).forEach((product, index) => {
          console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.category})`);
        });
      } else {
        console.log('⚠️ No product recommendations in response');
      }
      
      if (result.response) {
        console.log(`\nAI Response: ${result.response}`);
      }
      
      if (result.translatedResponse && result.translatedResponse !== result.response) {
        console.log(`Translated Response: ${result.translatedResponse}`);
      }
    } catch (error) {
      console.log(`❌ Error parsing response: ${error.message}`);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.log(`❌ Failed to connect to chat endpoint: ${error.message}`);
});

req.on('timeout', () => {
  console.log('❌ Chat request timeout');
  req.destroy();
});

// Send the request data
req.write(postData);
req.end();

// Test Bengali query specifically
setTimeout(() => {
  console.log('\n--- Testing Bengali Product Query ---');
  
  const bengaliData = {
    message: 'মেয়েদের জন্য টি-শার্ট', // T-shirt for girls
    language: 'bn',
    userId: 'test-user'
  };
  
  const bengaliPostData = JSON.stringify(bengaliData);
  
  const bengaliOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/chat',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bengaliPostData)
    },
    timeout: 15000
  };
  
  const bengaliReq = http.request(bengaliOptions, (res) => {
    console.log(`✅ Bengali chat endpoint responded with status code: ${res.statusCode}`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('Bengali chat response:', JSON.stringify(result, null, 2));
        
        if (result.productRecommendations && result.productRecommendations.length > 0) {
          console.log(`✅ Bengali product recommendations received: ${result.productRecommendations.length} products`);
          console.log('Sample products:');
          result.productRecommendations.slice(0, 3).forEach((product, index) => {
            console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.category})`);
          });
        } else {
          console.log('⚠️ No product recommendations for Bengali query');
        }
        
        if (result.response) {
          console.log(`\nAI Response: ${result.response}`);
        }
        
        if (result.translatedResponse && result.translatedResponse !== result.response) {
          console.log(`Translated Response: ${result.translatedResponse}`);
        }
      } catch (error) {
        console.log(`❌ Error parsing Bengali response: ${error.message}`);
        console.log('Raw response:', data);
      }
    });
  });
  
  bengaliReq.on('error', (error) => {
    console.log(`❌ Failed to connect to Bengali chat endpoint: ${error.message}`);
  });
  
  bengaliReq.on('timeout', () => {
    console.log('❌ Bengali chat request timeout');
    bengaliReq.destroy();
  });
  
  bengaliReq.write(bengaliPostData);
  bengaliReq.end();
}, 3000);