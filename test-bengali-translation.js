const axios = require('axios');

async function testBengaliTranslation() {
  try {
    console.log('Testing Bengali translation and product recommendations...');
    
    // Test Bengali to English translation
    const translationResponse = await axios.post('http://localhost:3002/api/translate', {
      text: 'মেয়েদের জন্য টি-শার্ট', // T-shirt for girls/women in Bengali
      from: 'bn',
      to: 'en'
    });
    
    console.log('Bengali to English translation:');
    console.log('Original (Bengali):', 'মেয়েদের জন্য টি-শার্ট');
    console.log('Translated (English):', translationResponse.data.translatedText);
    
    // Test product recommendations with translated query
    const actionResponse = await axios.post('http://localhost:3002/api/action', {
      action: {
        type: "GET_RECOMMENDATIONS",
        payload: {
          query: translationResponse.data.translatedText
        }
      },
      context: {
        query: translationResponse.data.translatedText,
        language: "en"
      }
    });
    
    console.log('\nProduct recommendations for translated query:');
    if (actionResponse.data.productRecommendations && actionResponse.data.productRecommendations.length > 0) {
      console.log('✓ Product recommendations found:');
      actionResponse.data.productRecommendations.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.category})`);
      });
    } else {
      console.log('✗ No product recommendations found');
    }
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testBengaliTranslation();