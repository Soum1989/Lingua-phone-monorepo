// Quick check to see if AI Shopping Assistant is working
const http = require('http');

console.log('=== Quick AI Shopping Assistant Check ===\n');

function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ statusCode: res.statusCode, data });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

async function checkAI() {
  try {
    console.log('Checking AI Shopping Assistant status...');
    
    // Test chat endpoint
    const response = await makeRequest({
      hostname: 'localhost',
      port: 3002,
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (response.statusCode === 503) {
      console.log('❌ AI Shopping Assistant is still not initialized');
      console.log('   This is expected if the backend server hasn\'t been restarted');
      console.log('   after installing dependencies and verifying the API key.');
      return false;
    } else if (response.statusCode === 400) {
      console.log('✅ AI Shopping Assistant endpoint is accessible');
      console.log('   (400 is expected since we didn\'t send proper data)');
      return true;
    } else {
      console.log(`Status: ${response.statusCode}`);
      console.log('Response:', response.data);
      return response.statusCode === 200;
    }
  } catch (error) {
    console.log('❌ Backend server is not running or not accessible');
    console.log('   Please start the backend server with: cd packages/backend && npm run dev');
    return false;
  }
}

checkAI().then(result => {
  if (result) {
    console.log('\n🎉 AI Shopping Assistant endpoint is working!');
    console.log('To test full functionality, please:');
    console.log('1. Start the backend server: cd packages/backend && npm run dev');
    console.log('2. Run the full verification test');
  } else {
    console.log('\n🔧 To fix the AI Shopping Assistant:');
    console.log('1. Start the backend server: cd packages/backend && npm run dev');
    console.log('2. The AI assistant should initialize correctly now that the API key is verified');
  }
});