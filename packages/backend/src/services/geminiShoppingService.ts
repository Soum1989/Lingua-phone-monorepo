import { GoogleGenerativeAI } from '@google/generative-ai';
import { products as productsData } from '../data/productsData';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  subCategory?: string;
  gender?: string;
  url: string;
}

interface ShoppingQuery {
  query: string;
  language: string;
  userId?: string;
  context?: {
    currentCart?: any[];
    recentViews?: string[];
    preferences?: Record<string, any>;
  };
}

interface ShoppingAction {
  type: 'ADD_TO_CART' | 'VIEW_PRODUCT' | 'SEARCH_PRODUCTS' | 'GET_RECOMMENDATIONS';
  payload: any;
}

interface ShoppingResponse {
  response: string;
  productRecommendations?: Product[];
  searchResults?: Product[];
  actions?: ShoppingAction[];
  translatedResponse?: string;
}

interface ParsedAIResponse {
  response: string;
  actions?: ShoppingAction[];
  translatedResponse?: string;
}

export class GeminiShoppingAssistant {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required. Please check your .env file.');
    }

    try {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    } catch (error: any) {
      console.error('Failed to initialize Google Generative AI:', error);
      throw new Error(`Failed to initialize Gemini AI service: ${error.message}`);
    }
  }

  async processShoppingQuery(query: ShoppingQuery): Promise<ShoppingResponse> {
    try {
      // Enhance query with gender context before processing
      const enhancedQuery: ShoppingQuery = {
        ...query,
        query: query.language ? this.enhanceGenderContext(query.query, query.language) : query.query
      };
      
      const prompt = this.buildPrompt(enhancedQuery);
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const parsedResponse = await this.parseAIResponse(response, enhancedQuery);

      parsedResponse.translatedResponse =
        enhancedQuery.language && enhancedQuery.language !== 'en'
          ? await this.translateResponse(parsedResponse.response, 'en', enhancedQuery.language)
          : parsedResponse.response;

      return parsedResponse;
    } catch (error: any) {
      console.error('Gemini shopping assistant error:', error);

      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY in the .env file.');
      } else if (error.message.includes('PERMISSION_DENIED')) {
        throw new Error('Permission denied. Please ensure the Gemini API is enabled in Google Cloud Console.');
      } else if (error.message.includes('UNAUTHENTICATED')) {
        throw new Error('Authentication failed. Please verify your Gemini API key.');
      } else {
        throw new Error(`Failed to process shopping query: ${error.message}`);
      }
    }
  }

  private buildPrompt(query: ShoppingQuery): string {
    const contextInfo = query.context
      ? `
Context:
- Current cart: ${JSON.stringify(query.context.currentCart || [])}
- Recently viewed: ${JSON.stringify(query.context.recentViews || [])}
- User preferences: ${JSON.stringify(query.context.preferences || {})}
`
      : '';

    return `
You are an AI shopping assistant for Bazaar Marketplace (https://bazaar-market-place.netlify.app). Help customers with their shopping needs.

User Query: "${query.query}"
Language: ${query.language}
${contextInfo}

Instructions:
1. Provide helpful, friendly responses about products, shopping, and recommendations.
2. If the user wants to add items to cart, search for products, or get recommendations, include appropriate actions.
3. Be conversational and personalized.
4. Always respond in the same language the user used.
5. Format your response as JSON:
{
  "response": "Your helpful response text",
  "needsRecommendations": boolean,
  "actions": [
    {
      "type": "ADD_TO_CART" | "VIEW_PRODUCT" | "SEARCH_PRODUCTS" | "GET_RECOMMENDATIONS",
      "payload": { /* relevant data */ }
    }
  ]
}
`;
  }

  private async parseAIResponse(raw: string, query: ShoppingQuery): Promise<ParsedAIResponse> {
    try {
      const parsed = JSON.parse(raw);

      let response = parsed.response || "Here are some suggestions for you.";
      let actions = parsed.actions || [];

      // If Gemini forgot actions → inject fallback
      if (!Array.isArray(actions) || actions.length === 0) {
        actions = [
          {
            type: "GET_RECOMMENDATIONS",
            payload: { query: query.query }
          }
        ];
      }

      // Extra safety: ensure structure is valid
      actions = actions.map((a: any) => {
        if (!a.type || !a.payload) {
          return {
            type: "GET_RECOMMENDATIONS",
            payload: { query: query.query }
          };
        }
        return a;
      });

      return { response, actions };
    } catch (err) {
      console.error("AI response parsing failed:", err);

      // Fallback if JSON parse fails
      return {
        response: "Here are some recommendations for you.",
        actions: [
          {
            type: "GET_RECOMMENDATIONS",
            payload: { query: query.query }
          }
        ]
      };
    }
  }

  private async fetchProducts(
    query: string,
    filters?: { gender?: string; subCategory?: string }
  ): Promise<Product[]> {
    try {
      // Apply gender context enhancement
      const enhancedQuery = this.applyGenderEnhancements(query);
      const q = enhancedQuery.toLowerCase();

      // Enhanced synonym mapping with gender awareness
      const synonymMap: Record<string, { category: string; subCategory?: string; gender?: string }> = {
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

      let matchedCategory: string | undefined;
      let matchedSub: string | undefined;
      let matchedGender: string | undefined;

      // First check for gender-specific terms
      // Sort keys by length (descending) to match longer, more specific terms first
      const sortedKeys = Object.keys(synonymMap).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        if (q.includes(key)) {
          matchedCategory = synonymMap[key].category;
          matchedSub = synonymMap[key].subCategory;
          matchedGender = synonymMap[key].gender;
          break;
        }
      }

      let results = productsData.filter((p) => {
        if (!matchedCategory) return true;
        
        // For gender-specific categories, match exactly
        if (matchedCategory.includes('_women') || matchedCategory.includes('_men')) {
          return p.category === matchedCategory;
        }
        
        // For generic categories, match by partial inclusion
        return p.category.toLowerCase().includes(matchedCategory);
      });

      if (matchedSub) results = results.filter((p) => p.category?.toLowerCase().includes(matchedSub || ''));
      if (filters?.gender) results = results.filter((p) => p.category?.toLowerCase().includes(filters.gender?.toLowerCase() || ''));

      if (!matchedCategory) {
        results = productsData.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            (p.subCategory && p.subCategory.toLowerCase().includes(q)) ||
            (p.category && p.category.toLowerCase().includes(q))
        );
      }

      return results;
    } catch (err) {
      console.error('Product search failed:', err);
      return [];
    }
  }

  private async getProductRecommendations(query: ShoppingQuery): Promise<Product[]> {
    try {
      // Apply gender context enhancement BEFORE translation for better accuracy with non-English queries
      const genderEnhancedQuery = this.enhanceGenderContext(query.query, query.language);
      
      // Translate query to English if it's not already in English
      let processedQuery = genderEnhancedQuery;
      if (query.language && query.language !== 'en' && query.language !== 'en-US') {
        try {
          processedQuery = await this.translateResponse(genderEnhancedQuery, query.language, 'en');
          console.log(`Translated query from ${query.language} to English: "${genderEnhancedQuery}" -> "${processedQuery}"`);
        } catch (translateErr) {
          console.error('Query translation failed, using original query:', translateErr);
          processedQuery = query.query;
        }
      }
      
      // Apply additional gender enhancements after translation to handle mixed-language queries
      const finalQuery = this.applyGenderEnhancements(processedQuery);
      const q = finalQuery.toLowerCase();

      // Enhanced synonym mapping with gender awareness
      const synonymMap: Record<string, { category: string; subCategory?: string; gender?: string }> = {
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

      let matchedCategory: string | undefined;
      let matchedSub: string | undefined;
      let matchedGender: string | undefined;

      // First check for gender-specific terms
      // Sort keys by length (descending) to match longer, more specific terms first
      const sortedKeys = Object.keys(synonymMap).sort((a, b) => b.length - a.length);
      for (const key of sortedKeys) {
        if (q.includes(key)) {
          matchedCategory = synonymMap[key].category;
          matchedSub = synonymMap[key].subCategory;
          matchedGender = synonymMap[key].gender;
          console.log(`Matched synonym key: "${key}" -> category: "${matchedCategory}"`);
          break;
        }
      }

      let results: Product[] = [];

      if (matchedCategory) {
        // For gender-specific categories, match exactly
        if (matchedCategory.includes('_women') || matchedCategory.includes('_men')) {
          results = productsData.filter((p) =>
            p.category === matchedCategory
          );
        } else {
          // For generic categories, match by partial inclusion
          results = productsData.filter((p) =>
            p.category.toLowerCase().includes(matchedCategory!)
          );
        }

        // If subCategory specified → include those first
        if (matchedSub) {
          const subMatches = results.filter(
            (p) => p.subCategory?.toLowerCase() === matchedSub
          );

          // Add related items (same category but diff subcategories)
          const related = results.filter(
            (p) => p.subCategory?.toLowerCase() !== matchedSub
          );

          results = [...subMatches, ...related];
        }
      } else {
        // If no category matched, search by product name
        results = productsData.filter(
          (p) =>
            p.name.toLowerCase().includes(q)
        );
      }

      // If no match at all, show trending/fallback
      if (results.length === 0) {
        results = productsData.slice(0, 5);
      }

      return results.slice(0, 6); // cap to avoid spamming
    } catch (err) {
      console.error("Recommendation fetch failed:", err);
      return productsData.slice(0, 3); // safe fallback
    }
  }

  /**
   * Enhances gender context in translated queries to improve product matching accuracy
   * This is especially important for non-English queries where gender context might be lost in translation
   */
  private enhanceGenderContext(query: string, language: string): string {
    // If already in English, apply enhancement directly
    if (!language || language === 'en' || language === 'en-US') {
      return this.applyGenderEnhancements(query);
    }
    
    // For non-English languages, we enhance based on common gender indicators
    // that might not translate perfectly
    const lowerQuery = query.toLowerCase();
    
    // Common gender indicators in Indian languages (Hindi, Bengali, etc.)
    const womenIndicators = [
      // Hindi
      'महिला', 'महिलाओं', 'स्त्री', 'महिलाओ', 'लड़कियों', 'नारी', 'लड़कियों',
      // Bengali
      'মেয়ে', 'মহিলা', 'নারী', 'মহিলাদের', 'লড়কিয়োং',
      // Generic terms that often refer to women/girls
      'girl', 'girls', 'women', 'ladies', 'female'
    ];
    
    const menIndicators = [
      // Hindi
      'पुरुष', 'आदमी', 'लड़का', 'लड़के',
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
    return this.applyGenderEnhancements(query);
  }
  
  /**
   * Apply standard gender enhancements to queries
   */
  private applyGenderEnhancements(query: string): string {
    let enhancedQuery = query;
    
    // Normalize common variations
    const normalizations: [RegExp, string][] = [
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

  // Add this new method to process actions
  async processAction(action: ShoppingAction, query: ShoppingQuery): Promise<ShoppingResponse> {
    let response: ShoppingResponse;
    
    switch (action.type) {
      case 'GET_RECOMMENDATIONS':
        const recommendations = await this.getProductRecommendations(query);
        
        // Check if the query product exists in our inventory
        let productExists = false;
        // Apply gender context enhancement BEFORE translation for better accuracy with non-English queries
        const genderEnhancedQuery = this.enhanceGenderContext(query.query, query.language);
        
        // Use translated query for product existence check
        let processedQuery = genderEnhancedQuery;
        if (query.language && query.language !== 'en' && query.language !== 'en-US') {
          try {
            processedQuery = await this.translateResponse(genderEnhancedQuery, query.language, 'en');
            console.log(`Translated query from ${query.language} to English: "${genderEnhancedQuery}" -> "${processedQuery}"`);
          } catch (translateErr) {
            console.error('Query translation failed, using original query:', translateErr);
            processedQuery = query.query;
          }
        }
        
        const q = processedQuery.toLowerCase();
        
        // Enhanced synonym mapping with gender awareness
        const synonymMap: Record<string, { category: string; subCategory?: string; gender?: string }> = {
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
        
        let matchedCategory: string | undefined;
        let matchedSub: string | undefined;
        
        // First check for gender-specific terms
        // Sort keys by length (descending) to match longer, more specific terms first
        const sortedKeys = Object.keys(synonymMap).sort((a, b) => b.length - a.length);
        for (const key of sortedKeys) {
          if (q.includes(key)) {
            matchedCategory = synonymMap[key].category;
            matchedSub = synonymMap[key].subCategory;
            break;
          }
        }
        
        // Check if product exists in inventory
        if (matchedCategory) {
          // For gender-specific categories, match exactly
          if (matchedCategory.includes('_women') || matchedCategory.includes('_men')) {
            productExists = productsData.some((p) =>
              p.category === matchedCategory
            );
          } else {
            // For generic categories, match by partial inclusion
            productExists = productsData.some((p) =>
              p.category.toLowerCase().includes(matchedCategory!)
            );
          }
          
          // If subCategory specified, check for exact subcategory match
          if (matchedSub) {
            productExists = productsData.some(
              (p) => p.subCategory?.toLowerCase() === matchedSub
            );
          }
        } else {
          // If no category matched, check by product name
          productExists = productsData.some(
            (p) =>
              p.name.toLowerCase().includes(q)
          );
        }
        
        // If product doesn't exist, provide appropriate message and smart recommendations
        if (!productExists && recommendations.length > 0) {
          // Check if this is a jewelry-related query
          const isJewelryQuery = q.includes('necklace') || q.includes('jewel') || q.includes('bracelet') || 
                                q.includes('ring') || q.includes('earring');
          
          // Check if this is an electronics-related query
          const isElectronicsQuery = q.includes('storage') || q.includes('ssd') || q.includes('hdd') || 
                                    q.includes('drive') || q.includes('monitor') || q.includes('led');
          
          // Check if this is a clothing-related query
          const isClothingQuery = q.includes('t-shirt') || q.includes('shirt') || q.includes('jacket') || 
                                 q.includes('top') || q.includes('clothing');
          
          let notFoundMessage = "Oops! I could not find your product after performing a query search but here are some recommendations:";
          
          // Customize message based on product type
          if (isJewelryQuery) {
            notFoundMessage = "Oops! I couldn't find that specific jewelry item, but here are some beautiful jewelry pieces we have available:";
          } else if (isElectronicsQuery) {
            notFoundMessage = "Oops! I couldn't find that specific electronic item, but here are some great electronics we have available:";
          } else if (isClothingQuery) {
            notFoundMessage = "Oops! I couldn't find that specific clothing item, but here are some stylish clothing options we have available:";
          }
          
          response = {
            response: notFoundMessage,
            productRecommendations: recommendations
          };
        } else {
          response = {
            response: "Here are some recommendations for you:",
            productRecommendations: recommendations
          };
        }
        break;
      case 'SEARCH_PRODUCTS':
        const searchResults = await this.fetchProducts(action.payload.query);
        response = {
          response: `I found ${searchResults.length} products matching your search.`,
          searchResults: searchResults
        };
        break;
      case 'ADD_TO_CART':
        response = {
          response: "I've added that item to your cart!"
        };
        break;
      case 'VIEW_PRODUCT':
        // This would typically fetch product details
        response = {
          response: "Here are the details for that product."
        };
        break;
      default:
        response = {
          response: "I'm not sure how to handle that request."
        };
    }
    
    // Translate response if needed
    if (query.language && query.language !== 'en' && query.language !== 'en-US') {
      try {
        response.translatedResponse = await this.translateResponse(response.response, 'en', query.language);
      } catch (translateErr) {
        console.error('Response translation failed:', translateErr);
        response.translatedResponse = response.response;
      }
    } else {
      response.translatedResponse = response.response;
    }
    
    return response;
  }

  async processVoiceQuery(audioBuffer: Buffer, language: string): Promise<ShoppingResponse> {
    // Mock STT for demo
    const mockTranscription = "I'm looking for a gift for my mother";
    return this.processShoppingQuery({ query: mockTranscription, language });
  }

  private async translateResponse(text: string, fromLang: string, toLang: string): Promise<string> {
    // Use the actual translation service
    const { translateText } = await import('./translationService');
    return await translateText(text, fromLang, toLang);
  }
}

export default GeminiShoppingAssistant;
