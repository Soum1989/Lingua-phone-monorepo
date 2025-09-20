const axios = require('axios');

async function testFakeStoreAPI() {
  try {
    console.log('Testing FakeStoreAPI integration...');
    
    // Test fetching products
    const productsResponse = await axios.get('https://fakestoreapi.com/products');
    console.log(`Successfully fetched ${productsResponse.data.length} products`);
    
    // Test fetching a specific product
    const productResponse = await axios.get('https://fakestoreapi.com/products/1');
    console.log(`Successfully fetched product: ${productResponse.data.title}`);
    
    // Test fetching categories
    const categoriesResponse = await axios.get('https://fakestoreapi.com/products/categories');
    console.log(`Available categories: ${categoriesResponse.data.join(', ')}`);
    
    console.log('All tests passed! FakeStoreAPI integration is working correctly.');
  } catch (error) {
    console.error('Error testing FakeStoreAPI:', error.message);
  }
}

testFakeStoreAPI();