// Direct test of our fix

// Test the enhanced gender context function
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

// Test the specific case that was failing
console.log('Testing Bengali "girls t-shirt" query processing...\n');

const bengaliQuery = "মেয়েদের জন্য টি-শার্ট";
console.log(`Original Bengali query: "${bengaliQuery}"`);

// Step 1: Gender context enhancement
const enhanced = enhanceGenderContext(bengaliQuery, 'bn');
console.log(`After gender enhancement: "${enhanced}"`);

// Step 2: Simulate what Google Translate might return
const translated = "women's T-shirt for girls";
console.log(`After translation: "${translated}"`);

// Step 3: Apply gender enhancements to translated query
const final = applyGenderEnhancements(translated);
console.log(`After final enhancement: "${final}"`);

// Step 4: Check if it matches our synonym map
const synonymMapKeys = [
  "women's t-shirt",
  "womens t-shirt",
  "girls t-shirt",
  "girls t-shirts"
];

const q = final.toLowerCase();
console.log(`\nChecking for matches in synonym map:`);
for (const key of synonymMapKeys) {
  if (q.includes(key)) {
    console.log(`✅ Match found: "${key}"`);
  } else {
    console.log(`❌ No match: "${key}"`);
  }
}

console.log('\nTest completed!');