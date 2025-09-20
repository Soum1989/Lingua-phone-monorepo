// Test script to verify Docker setup is working correctly
const axios = require('axios');

async function testDockerSetup() {
  console.log('Testing Docker setup...\n');
  
  // Test cases
  const testCases = [
    {
      name: 'Frontend Access',
      url: 'http://localhost:8080',
      method: 'GET',
      expectSuccess: true
    },
    {
      name: 'Backend Direct Access - Test Translation',
      url: 'http://localhost:3002/api/test-translation',
      method: 'GET',
      expectSuccess: true
    },
    {
      name: 'Backend via Frontend Proxy - Test Translation',
      url: 'http://localhost:8080/api/test-translation',
      method: 'GET',
      expectSuccess: true
    },
    {
      name: 'Backend Direct Access - Languages',
      url: 'http://localhost:3002/api/languages',
      method: 'GET',
      expectSuccess: true
    },
    {
      name: 'Backend via Frontend Proxy - Languages',
      url: 'http://localhost:8080/api/languages',
      method: 'GET',
      expectSuccess: true
    },
    {
      name: 'Backend Direct Access - Translate',
      url: 'http://localhost:3002/api/translate',
      method: 'POST',
      data: {
        text: 'Hello',
        from: 'en',
        to: 'es'
      },
      expectSuccess: true
    },
    {
      name: 'Backend via Frontend Proxy - Translate',
      url: 'http://localhost:8080/api/translate',
      method: 'POST',
      data: {
        text: 'Hello',
        from: 'en',
        to: 'es'
      },
      expectSuccess: true
    }
  ];

  let passedTests = 0;
  let totalTests = testCases.length;

  for (const test of testCases) {
    try {
      console.log(`Testing: ${test.name}`);
      
      const config = {
        method: test.method,
        url: test.url,
        timeout: 10000
      };
      
      if (test.data) {
        config.data = test.data;
        config.headers = { 'Content-Type': 'application/json' };
      }
      
      const response = await axios(config);
      
      if (response.status >= 200 && response.status < 300) {
        console.log(`✅ PASS: Status ${response.status}`);
        if (test.name.includes('Translate') && response.data.translatedText) {
          console.log(`   Translated: "${response.data.translatedText}"`);
        } else if (test.name.includes('Languages') && response.data.languages) {
          console.log(`   Languages: ${response.data.languages.length} supported`);
        }
        passedTests++;
      } else {
        console.log(`❌ FAIL: Status ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        console.log(`❌ FAIL: Status ${error.response.status}`);
        if (error.response.status === 404) {
          console.log(`   This indicates the API endpoint is not found, likely a proxy issue`);
        }
      } else if (error.request) {
        console.log(`❌ FAIL: No response received`);
        console.log(`   This indicates the service is not running or not accessible`);
      } else {
        console.log(`❌ FAIL: ${error.message}`);
      }
    }
    console.log(''); // Empty line for readability
  }

  console.log(`\nTest Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Docker setup is working correctly.');
  } else if (passedTests > 0) {
    console.log('⚠️  Some tests passed. There may be partial issues with the setup.');
  } else {
    console.log('❌ All tests failed. Please check the Docker setup and container logs.');
  }
}

// Run the tests
testDockerSetup().catch(console.error);