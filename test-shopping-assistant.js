const axios = require('axios');

async function testShoppingAssistant() {
  try {
    console.log('Testing AI Shopping Assistant...');
    
    // Test translation
    console.log('\n1. Testing translation...');
    const translationResponse = await axios.post('http://localhost:3002/api/translate', {
      text: 'I am looking for a necklace',
      from: 'en',
      to: 'es'
    });
    console.log('Translation result:', translationResponse.data);
    
    // Test product recommendations
    console.log('\n2. Testing product recommendations...');
    const chatResponse = await axios.post('http://localhost:3002/api/chat', {
      message: 'I am looking for a necklace',
      language: 'en'
    });
    console.log('Chat response:', JSON.stringify(chatResponse.data, null, 2));
    
    // Check if product recommendations are present
    if (chatResponse.data.productRecommendations && chatResponse.data.productRecommendations.length > 0) {
      console.log('\n✓ Product recommendations found:');
      chatResponse.data.productRecommendations.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price}`);
      });
    } else {
      console.log('\n✗ No product recommendations found');
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

testShoppingAssistant();