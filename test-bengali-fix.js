// Test to verify the fix for Bengali "girls t-shirt" query processing

// Copy the updated functions from the geminiShoppingService
function enhanceGenderContext(query, language) {
  // If already in English, apply enhancement directly
  if (!language || language === 'en' || language === 'en-US') {
    return applyGenderEnhancements(query);
  }
  
  // For non-English languages, we enhance based on common gender indicators
  // that might not translate perfectly
  const lowerQuery = query.toLowerCase();
  
  // Common gender indicators in Indian languages (Hindi, Bengali, etc.)
  const womenIndicators = [
    // Hindi
    'মেয়ে', 'মহিলা', 'নারী', 'মহিলাদের', 'লড়কিয়োং',
    // Bengali
    'মেয়ে', 'মহিলা', 'নারী', 'মহিলাদের', 'লড়কিয়োং',
    // Generic terms that often refer to women/girls
    'girl', 'girls', 'women', 'ladies', 'female'
  ];
  
  const menIndicators = [
    // Hindi
    'পুরুষ', 'আদমি', 'লড়কা', 'লড়কে',
    // Bengali
    'ছেলে', 'পুরুষ',
    // Generic terms that often refer to men/boys
    'boy', 'boys', 'men', 'male'
  ];
  
  // Check if query contains women-related terms
  const hasWomenIndicators = womenIndicators.some(indicator => 
    lowerQuery.includes(indicator.toLowerCase())
  );
  
  // Check if query contains men-related terms
  const hasMenIndicators = menIndicators.some(indicator => 
    lowerQuery.includes(indicator.toLowerCase())
  );
  
  // If we detect gender indicators, enhance the query with clearer gender context
  // We'll apply this to the translated query by adding a prefix that will help
  // with matching in the synonym map
  if (hasWomenIndicators) {
    // Add "women's" prefix to help with matching
    return `women's ${query}`;
  }
  
  if (hasMenIndicators) {
    // Add "men's" prefix to help with matching
    return `men's ${query}`;
  }
  
  // Apply standard gender enhancements
  return applyGenderEnhancements(query);
}

function applyGenderEnhancements(query) {
  let enhancedQuery = query;
  
  // Normalize common variations
  const normalizations = [
    [/\bwomen\s*t[-]?shirts?\b/i, "women's t-shirt"],
    [/\bwomen\s*jackets?\b/i, "women's jacket"],
    [/\bwomen\s*shirts?\b/i, "women's shirt"],
    [/\bwomen\s*tops?\b/i, "women's top"],
    [/\bladies\s*t[-]?shirts?\b/i, "ladies t-shirt"],
    [/\bladies\s*jackets?\b/i, "ladies jacket"],
    [/\bladies\s*shirts?\b/i, "ladies shirt"],
    [/\bladies\s*tops?\b/i, "ladies top"],
    [/\bmen\s*t[-]?shirts?\b/i, "men's t-shirt"],
    [/\bmen\s*jackets?\b/i, "men's jacket"],
    [/\bmen\s*shirts?\b/i, "men's shirt"],
    [/\bmen\s*tops?\b/i, "men's top"],
    [/\bboys\s*t[-]?shirts?\b/i, "boys t-shirt"],
    [/\bboys\s*jackets?\b/i, "boys jacket"],
    [/\bboys\s*shirts?\b/i, "boys shirt"],
    [/\bboys\s*tops?\b/i, "boys top"],
    [/\bgirls\s*t[-]?shirts?\b/i, "girls t-shirt"],
    [/\bgirls\s*jackets?\b/i, "girls jacket"],
    [/\bgirls\s*shirts?\b/i, "girls shirt"],
    [/\bgirls\s*tops?\b/i, "girls top"],
    // Additional patterns to handle translated queries with mixed languages
    [/\bwomen's\s+.*\b(girls?|women|ladies)\b/i, "women's t-shirt"],
    [/\bmen's\s+.*\b(boys?|men)\b/i, "men's t-shirt"],
    [/\b(girls?|women|ladies)\s+.*\bt[-]?shirts?\b/i, "girls t-shirt"],
    [/\b(boys?|men)\s+.*\bt[-]?shirts?\b/i, "boys t-shirt"]
  ];
  
  for (const [pattern, replacement] of normalizations) {
    enhancedQuery = enhancedQuery.replace(pattern, replacement);
  }
  
  return enhancedQuery;
}

// Mock synonym map
const synonymMap = {
  // Women's clothing
  "women's t-shirt": { category: 'top_women' },
  "womens t-shirt": { category: 'top_women' },
  "women's top": { category: 'top_women' },
  "womens top": { category: 'top_women' },
  "women's shirt": { category: 'top_women' },
  "womens shirt": { category: 'top_women' },
  "ladies t-shirt": { category: 'top_women' },
  "ladies top": { category: 'top_women' },
  "girls t-shirt": { category: 'top_women' },
  "girls top": { category: 'top_women' },
  "girls shirt": { category: 'top_women' },
  "women's jacket": { category: 'jacket_women' },
  "womens jacket": { category: 'jacket_women' },
  "ladies jacket": { category: 'jacket_women' },
  "girls jacket": { category: 'jacket_women' },
  
  // Additional women's clothing terms
  "women's t-shirts": { category: 'top_women' },
  "womens t-shirts": { category: 'top_women' },
  "ladies t-shirts": { category: 'top_women' },
  "girls t-shirts": { category: 'top_women' },
  "women's tops": { category: 'top_women' },
  "womens tops": { category: 'top_women' },
  "ladies tops": { category: 'top_women' },
  "girls tops": { category: 'top_women' },
  "women's shirts": { category: 'top_women' },
  "womens shirts": { category: 'top_women' },
  "ladies shirts": { category: 'top_women' },
  "girls shirts": { category: 'top_women' },
  "women's jackets": { category: 'jacket_women' },
  "womens jackets": { category: 'jacket_women' },
  "ladies jackets": { category: 'jacket_women' },
  "girls jackets": { category: 'jacket_women' },
  
  // Additional phrases for women's clothing
  "jackets for women": { category: 'jacket_women' },
  "jacket for women": { category: 'jacket_women' },
  "jackets for ladies": { category: 'jacket_women' },
  "jacket for ladies": { category: 'jacket_women' },
  "jackets for girls": { category: 'jacket_women' },
  "jacket for girls": { category: 'jacket_women' },
  
  // Men's clothing
  "men's t-shirt": { category: 't_shirts_men' },
  "mens t-shirt": { category: 't_shirts_men' },
  "men's top": { category: 't_shirts_men' },
  "mens top": { category: 't_shirts_men' },
  "men's shirt": { category: 't_shirts_men' },
  "mens shirt": { category: 't_shirts_men' },
  "men's jacket": { category: 'jackets_men' },
  "mens jacket": { category: 'jackets_men' },
  "boys t-shirt": { category: 't_shirts_men' },
  "boys top": { category: 't_shirts_men' },
  "boys shirt": { category: 't_shirts_men' },
  "boys jacket": { category: 'jackets_men' },
  
  // Jewelry
  'necklace': { category: 'jewellery' },
  'jewellery': { category: 'jewellery' },
  'jewelry': { category: 'jewellery' },
  'bracelet': { category: 'jewellery', subCategory: 'bracelets' },
  'ring': { category: 'jewellery', subCategory: 'rings' },
  'earring': { category: 'jewellery', subCategory: 'earrings' },
  
  // Electronics
  'storage': { category: 'electronics', subCategory: 'storage' },
  'ssd': { category: 'electronics', subCategory: 'ssd' },
  'hdd': { category: 'electronics', subCategory: 'hdd' },
  'drive': { category: 'electronics', subCategory: 'storage' },
  'monitor': { category: 'electronics', subCategory: 'led' },
  'led': { category: 'electronics', subCategory: 'led' },
  
  // Bags
  'bag': { category: 'bags' },
  'backpack': { category: 'bags' },
  
  // Generic terms (fallback)
  't-shirt': { category: 'clothing' },
  'shirt': { category: 'clothing' },
  'jacket': { category: 'clothing' }
};

// Mock products data
const productsData = [
  {
    id: "15",
    name: "BIYLACLESEN Women's 3-in-1 Winter Jacket",
    price: 56.99,
    category: "jacket_women",
    url: "https://bazaar-market-place.netlify.app/products/15",
  },
  {
    id: "16",
    name: "Lock and Love Women's Removable Hooded Faux Leather Moto Biker Jacket",
    price: 29.95,
    category: "jacket_women",
    url: "https://bazaar-market-place.netlify.app/products/16",
  },
  {
    id: "17",
    name: "Rain Jacket Women Windbreaker Striped Climbing Raincoats",
    price: 39.99,
    category: "jacket_women",
    url: "https://bazaar-market-place.netlify.app/products/17",
  },
  {
    id: "18",
    name: "MBJ Women Solid Short Sleeve Boat Neck V",
    price: 9.85,
    category: "top_women",
    url: "https://bazaar-market-place.netlify.app/products/18",
  },
  {
    id: "19",
    name: "Opna Women's Short Sleeve Moisture",
    price: 7.95,
    category: "top_women",
    url: "https://bazaar-market-place.netlify.app/products/19",
  },
  {
    id: "20",
    name: "DANVOUY Womens T Shirt Casual Cotton Short",
    price: 12.99,
    category: "top_women",
    url: "https://bazaar-market-place.netlify.app/products/20",
  },
  {
    id: "2",
    name: "Men's T-Shirt",
    price: 22.3,
    category: "t_shirts_men",
    url: "https://bazaar-market-place.netlify.app/products/2",
  },
  {
    id: "3",
    name: "Men's Jacket",
    price: 55.99,
    category: "jackets_men",
    url: "https://bazaar-market-place.netlify.app/products/3",
  },
  {
    id: "4",
    name: "Another Men's T-Shirt",
    price: 15.99,
    category: "t_shirts_men",
    url: "https://bazaar-market-place.netlify.app/products/4",
  }
];

// Simulate the complete processing flow
function simulateCompleteProcessing(originalQuery, language) {
  console.log(`\n=== Processing "${originalQuery}" (${language}) ===`);
  
  // Step 1: Apply gender context enhancement BEFORE translation
  const genderEnhancedQuery = enhanceGenderContext(originalQuery, language);
  console.log(`1. After gender context enhancement: "${genderEnhancedQuery}"`);
  
  // Step 2: Simulate translation (what Google Translate might return)
  let translatedQuery = genderEnhancedQuery;
  if (language && language !== 'en' && language !== 'en-US') {
    // Mock translations based on what Google Translate actually returns
    const translations = {
      'bn': {
        'women\'s মেয়েদের জন্য টি-শার্ট': 'women\'s T-shirt for girls',
        'women\'s মহিলাদের জন্য কোন টি-শার্ট দেখান': 'women\'s Show T-shirts for women',
        'women\'s নারীদের জন্য শার্ট': 'women\'s Shirt for women'
      }
    };
    
    if (translations[language] && translations[language][genderEnhancedQuery]) {
      translatedQuery = translations[language][genderEnhancedQuery];
      console.log(`2. After translation: "${translatedQuery}"`);
    } else {
      // Fallback if we don't have a specific translation
      translatedQuery = genderEnhancedQuery; // In real case, this would be translated
      console.log(`2. After translation (mock): "${translatedQuery}"`);
    }
  }
  
  // Step 3: Apply gender enhancements to the translated query
  const finalQuery = applyGenderEnhancements(translatedQuery);
  console.log(`3. After applying gender enhancements: "${finalQuery}"`);
  
  // Step 4: Match using synonym map
  const q = finalQuery.toLowerCase();
  console.log(`4. Processing query: "${q}"`);
  
  // First check for gender-specific terms
  // Sort keys by length (descending) to match longer, more specific terms first
  let matchedCategory = null;
  let matchedSub = null;
  let matchedKey = null;
  
  const sortedKeys = Object.keys(synonymMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (q.includes(key)) {
      matchedCategory = synonymMap[key].category;
      matchedSub = synonymMap[key].subCategory;
      matchedKey = key;
      console.log(`5. Matched key: "${key}" -> category: "${matchedCategory}"`);
      break;
    }
  }
  
  // Step 5: Filter products based on matched category
  let results = [];
  if (matchedCategory) {
    // For gender-specific categories, match exactly
    if (matchedCategory.includes('_women') || matchedCategory.includes('_men')) {
      results = productsData.filter((p) =>
        p.category === matchedCategory
      );
    } else {
      // For generic categories, match by partial inclusion
      results = productsData.filter((p) =>
        p.category.toLowerCase().includes(matchedCategory)
      );
    }
  } else {
    // If no category matched, search by product name
    results = productsData.filter(
      (p) =>
        p.name.toLowerCase().includes(q)
    );
  }
  
  console.log(`6. Found ${results.length} products:`);
  results.forEach(p => console.log(`   - ${p.name} (${p.category})`));
  
  return results;
}

// Test cases
console.log("Testing the fix for Bengali 'girls t-shirt' query...\n");

// This is the key test case - the one that was failing before
simulateCompleteProcessing("মেয়েদের জন্য টি-শার্ট", "bn");

console.log("\nTesting other Bengali queries...\n");
simulateCompleteProcessing("মহিলাদের জন্য কোন টি-শার্ট দেখান", "bn");
simulateCompleteProcessing("নারীদের জন্য শার্ট", "bn");

console.log("\nTesting Hindi queries...\n");
simulateCompleteProcessing("लड़कियों के लिए टी-शर्ट", "hi");
simulateCompleteProcessing("महिलाओं के लिए टी-शर्ट दिखाइए", "hi");

console.log("\nTesting English queries...\n");
simulateCompleteProcessing("girls t-shirt", "en");
simulateCompleteProcessing("jackets for women", "en");