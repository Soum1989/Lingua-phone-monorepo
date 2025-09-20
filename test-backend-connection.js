// Test script to check if backend server is running
const http = require('http');

console.log('Testing backend server connection...\n');

// Test connection to backend server
const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/languages',
  method: 'GET',
  timeout: 5000
};

const req = http.request(options, (res) => {
  console.log(`✅ Backend server is running! Status code: ${res.statusCode}`);
  
  res.on('data', (chunk) => {
    console.log('Received data from server:');
    console.log(JSON.parse(chunk.toString()));
  });
  
  res.on('end', () => {
    console.log('✅ Successfully connected to backend API');
  });
});

req.on('error', (error) => {
  console.log(`❌ Failed to connect to backend server: ${error.message}`);
  console.log('This might be because:');
  console.log('1. The backend server is not running');
  console.log('2. The server is running on a different port');
  console.log('3. There is a network connectivity issue');
});

req.on('timeout', () => {
  console.log('❌ Request timeout - server might not be responding');
  req.destroy();
});

req.end();

// Also test the translation endpoint
setTimeout(() => {
  console.log('\n--- Testing Translation Endpoint ---');
  
  const translateOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/translate',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 5000
  };
  
  const translateReq = http.request(translateOptions, (res) => {
    console.log(`✅ Translation endpoint accessible! Status code: ${res.statusCode}`);
  });
  
  translateReq.on('error', (error) => {
    console.log(`❌ Failed to connect to translation endpoint: ${error.message}`);
  });
  
  translateReq.on('timeout', () => {
    console.log('❌ Translation endpoint timeout');
    translateReq.destroy();
  });
  
  // Send a simple translation request
  translateReq.write(JSON.stringify({
    text: 'Hello',
    from: 'en',
    to: 'es'
  }));
  
  translateReq.end();
}, 2000);