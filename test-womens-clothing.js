const axios = require('axios');

async function testWomensClothing() {
  try {
    console.log('Testing women\'s clothing recommendations...');
    
    const response = await axios.post('http://localhost:3002/api/action', {
      action: {
        type: "GET_RECOMMENDATIONS",
        payload: {
          query: "women's t-shirt"
        }
      },
      context: {
        query: "women's t-shirt",
        language: "en"
      }
    });
    
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.data.productRecommendations && response.data.productRecommendations.length > 0) {
      console.log('\n✓ Women\'s clothing recommendations found:');
      response.data.productRecommendations.forEach((product, index) => {
        console.log(`  ${index + 1}. ${product.name} - $${product.price} (${product.category})`);
      });
    } else {
      console.log('\n✗ No women\'s clothing recommendations found');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

testWomensClothing();