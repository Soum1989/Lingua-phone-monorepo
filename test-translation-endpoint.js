// Test script to verify the translation endpoint is working properly
const axios = require('axios');

async function testTranslationEndpoint() {
  console.log('Testing translation endpoint...\n');
  
  // Test cases
  const testCases = [
    {
      name: 'Bengali to English',
      text: 'মেয়েদের জন্য টি-শার্ট',
      from: 'bn',
      to: 'en',
      description: 'T-shirt for girls'
    },
    {
      name: 'English to Bengali',
      text: 'T-shirt for girls',
      from: 'en',
      to: 'bn',
      description: 'টি-শার্ট মেয়েদের জন্য'
    },
    {
      name: 'Hindi to English',
      text: 'महिलाओं के लिए टी-शर्ट',
      from: 'hi',
      to: 'en',
      description: 'T-shirt for women'
    },
    {
      name: 'English to Hindi',
      text: 'T-shirt for women',
      from: 'en',
      to: 'hi',
      description: 'महिलाओं के लिए टी-शर्ट'
    }
  ];

  // Test the /api/translate endpoint
  console.log('=== Testing /api/translate endpoint ===');
  for (const test of testCases) {
    try {
      console.log(`\nTesting: ${test.name}`);
      console.log(`Input: "${test.text}" (${test.description})`);
      
      const response = await axios.post('http://localhost:3002/api/translate', {
        text: test.text,
        from: test.from,
        to: test.to
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data && response.data.translatedText) {
        console.log(`✅ Success: "${response.data.translatedText}"`);
      } else {
        console.log(`❌ Failed: No translatedText in response`);
        console.log(`Response:`, response.data);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log(`Response:`, error.response.data);
      }
    }
  }

  // Test the /api/test-translation endpoint
  console.log('\n=== Testing /api/test-translation endpoint ===');
  try {
    console.log('\nTesting built-in test endpoint...');
    const response = await axios.get('http://localhost:3002/api/test-translation', {
      timeout: 10000
    });

    if (response.data && response.data.success) {
      console.log(`✅ Success: Test translation working`);
      console.log(`Original: "${response.data.original}"`);
      console.log(`Translated: "${response.data.translated}"`);
    } else {
      console.log(`❌ Failed: Test translation not working`);
      console.log(`Response:`, response.data);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response:`, error.response.data);
    }
  }

  // Test the /api/languages endpoint
  console.log('\n=== Testing /api/languages endpoint ===');
  try {
    console.log('\nFetching supported languages...');
    const response = await axios.get('http://localhost:3002/api/languages', {
      timeout: 10000
    });

    if (response.data && response.data.languages) {
      console.log(`✅ Success: Found ${response.data.languages.length} supported languages`);
      // Show first 5 languages
      const languages = response.data.languages.slice(0, 5);
      console.log('Sample languages:');
      languages.forEach(lang => {
        console.log(`  - ${lang.name} (${lang.code}) - STT: ${lang.sttSupported}, TTS: ${lang.ttsSupported}`);
      });
    } else {
      console.log(`❌ Failed: No languages in response`);
      console.log(`Response:`, response.data);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      console.log(`Response:`, error.response.data);
    }
  }
}

// Run the tests
testTranslationEndpoint().catch(console.error);