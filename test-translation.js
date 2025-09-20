// Google Cloud Translation Test Script
// Run this after setting up your service account key

const axios = require('axios');
const { translateText } = require('./packages/backend/src/services/translationService');

async function testTranslation() {
  console.log('Testing Bengali to English translation...\n');
  
  const bengaliQueries = [
    'মেয়েদের জন্য টি-শার্ট',  // T-shirt for girls
    'মহিলাদের জন্য কোন টি-শার্ট দেখান',  // Show T-shirts for women
    'নারীদের জন্য শার্ট',  // Shirt for women
    'ছেলেদের জন্য টি-শার্ট'  // T-shirt for boys
  ];
  
  const hindiQueries = [
    'মহিলাওं के लिए टी-शर्ट दिखाइए',  // Show T-shirts for women
    'लड़कियों के लिए जैकेट',  // Jacket for girls
    'नारी के लिए शर्ट'  // Shirt for woman
  ];
  
  console.log('=== Bengali Queries ===');
  for (const query of bengaliQueries) {
    try {
      const result = await translateText(query, 'bn', 'en');
      console.log(`"${query}" -> "${result}"`);
    } catch (error) {
      console.log(`"${query}" -> Error: ${error.message}`);
    }
  }
  
  console.log('\n=== Hindi Queries ===');
  for (const query of hindiQueries) {
    try {
      const result = await translateText(query, 'hi', 'en');
      console.log(`"${query}" -> "${result}"`);
    } catch (error) {
      console.log(`"${query}" -> Error: ${error.message}`);
    }
  }
}

testTranslation().catch(console.error);

const testTranslations = [
  { text: "Hello, how are you?", from: "en", to: "hi", expected: "नमस्ते, आप कैसे हैं?" },
  { text: "Good morning", from: "en", to: "bn", expected: "সুপ্রভাত" },
  { text: "Thank you", from: "en", to: "ta", expected: "நன்றி" },
  { text: "How much does this cost?", from: "en", to: "te", expected: "ఇది ఎంత ఖర్చు అవుతుంది?" },
  { text: "Where is the railway station?", from: "en", to: "mr", expected: "रेल्वे स्टेशन कुठे आहे?" },
  { text: "I need help", from: "en", to: "gu", expected: "મને મદદની જરૂર છે" },
  { text: "What time is it?", from: "en", to: "kn", expected: "ಈಗ ಎಷ್ಟು ಗಂಟೆ?" },
  { text: "Can you speak English?", from: "en", to: "ml", expected: "നിനക്ക് ഇംഗ്ലീഷ് സംസാരിക്കാൻ കഴിയുമോ?" }
];

async function testTranslation(text, from, to, expected) {
  try {
    console.log(`\n🧪 Testing: "${text}" (${from} → ${to})`);
    
    const response = await axios.post('http://localhost:3001/api/translate', {
      text: text,
      from: from,
      to: to
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    if (response.data && response.data.translatedText) {
      const result = response.data.translatedText;
      console.log(`✅ Result: "${result}"`);
      console.log(`💡 Expected: "${expected}"`);
      
      // Check if we got a meaningful translation (not just echoed back)
      if (result !== text && result.length > 0) {
        console.log(`🎉 SUCCESS: Translation worked!`);
        return true;
      } else {
        console.log(`❌ FAILED: Got same text back or empty result`);
        return false;
      }
    } else {
      console.log(`❌ FAILED: No translation in response`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Google Cloud Translation API Tests...');
  console.log('📍 Make sure your backend server is running on http://localhost:3001');
  
  let successCount = 0;
  let totalCount = testTranslations.length;
  
  for (const test of testTranslations) {
    const success = await testTranslation(test.text, test.from, test.to, test.expected);
    if (success) successCount++;
    
    // Wait between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Successful: ${successCount}/${totalCount}`);
  console.log(`❌ Failed: ${totalCount - successCount}/${totalCount}`);
  
  if (successCount === totalCount) {
    console.log(`\n🎉 ALL TESTS PASSED! Google Cloud Translation is working perfectly! 🎉`);
  } else if (successCount > 0) {
    console.log(`\n⚠️ PARTIAL SUCCESS: Some translations worked. Check your setup.`);
  } else {
    console.log(`\n❌ ALL TESTS FAILED: Please check your Google Cloud setup.`);
    console.log(`\n🔧 Troubleshooting steps:`);
    console.log(`   1. Ensure service-account.json is in packages/backend/keys/`);
    console.log(`   2. Check if Translation API is enabled in Google Cloud Console`);
    console.log(`   3. Verify your backend server is running`);
    console.log(`   4. Check backend console logs for error messages`);
  }
}

// Run the tests
runAllTests().catch(console.error);