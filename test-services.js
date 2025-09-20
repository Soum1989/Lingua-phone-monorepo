const http = require('http');

console.log('Testing services connectivity...');

// Test frontend service
console.log('\n1. Testing frontend service (http://localhost:8080)...');
const frontendReq = http.get('http://localhost:8080', (res) => {
  console.log(`   Frontend status code: ${res.statusCode}`);
  console.log(`   Frontend headers: ${JSON.stringify(res.headers)}`);
}).on('error', (err) => {
  console.log(`   Error accessing frontend: ${err.message}`);
});

// Test backend service
console.log('\n2. Testing backend service (http://localhost:3002)...');
const backendReq = http.get('http://localhost:3002', (res) => {
  console.log(`   Backend status code: ${res.statusCode}`);
  console.log(`   Backend headers: ${JSON.stringify(res.headers)}`);
}).on('error', (err) => {
  console.log(`   Error accessing backend: ${err.message}`);
});

// Test backend chat endpoint
console.log('\n3. Testing backend chat endpoint...');
const chatData = JSON.stringify({
  message: "I am looking for a women's t-shirt",
  language: "en"
});

const chatOptions = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/chat',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': chatData.length
  }
};

const chatReq = http.request(chatOptions, (res) => {
  console.log(`   Chat endpoint status code: ${res.statusCode}`);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log(`   Chat endpoint response: ${data}`);
  });
}).on('error', (err) => {
  console.log(`   Error accessing chat endpoint: ${err.message}`);
});

chatReq.write(chatData);
chatReq.end();

console.log('\nService testing completed.');