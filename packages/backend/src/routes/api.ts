import express from 'express';
import multer from 'multer';
import { speechToText } from '../services/speechService';
import { translateText } from '../services/translationService';
import { textToSpeech } from '../services/ttsService';
import { getSupportedLanguages } from '../services/languageService';
import GeminiShoppingAssistant from '../services/geminiShoppingService';
import OnlineBoutiqueService from '../services/onlineBoutiqueService';

const router = express.Router();
const upload = multer();

// Initialize services with lazy initialization
let geminiAssistant: GeminiShoppingAssistant | null = null;
let boutiqueService: OnlineBoutiqueService;
let geminiInitialized = false;
let boutiqueInitialized = false;

// Function to initialize services when needed
function initializeServices() {
  if (!geminiInitialized) {
    try {
      geminiAssistant = new GeminiShoppingAssistant();
      console.log('✅ Gemini Shopping Assistant initialized successfully');
      geminiInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Gemini Shopping Assistant:', error);
      console.error('⚠️  Shopping assistant will be unavailable until the issue is resolved');
    }
  }
  
  if (!boutiqueInitialized) {
    try {
      boutiqueService = new OnlineBoutiqueService();
      console.log('✅ Online Boutique Service initialized successfully');
      boutiqueInitialized = true;
    } catch (error) {
      console.error('❌ Failed to initialize Online Boutique Service:', error);
      throw error; // This is critical, so we should fail fast
    }
  }
}

// Initialize services on first request
router.use((req, res, next) => {
  if (!geminiInitialized || !boutiqueInitialized) {
    initializeServices();
  }
  next();
});

// Get supported languages endpoint
router.get('/languages', async (req, res) => {
  try {
    const languages = await getSupportedLanguages();
    res.json({ languages });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: 'languages_error', details: String(err) });
  }
});

router.post('/speech-to-text', upload.single('file'), async (req, res) => {
  try {
    const lang = (req.body && req.body.language) || 'en-US';
    const text = await speechToText(req.file ? req.file.buffer : null, lang);
    res.json({ text });
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: 'stt_error', details: String(err) });
  }
});

router.post('/translate', async (req, res) => {
  try {
    const { text, to, from } = req.body;
    console.log(`Translation request: "${text}" from ${from} to ${to}`);
    
    const translatedText = await translateText(text || '', from || 'en', to || 'en-US');
    console.log(`Translation result: "${translatedText}"`);
    
    res.json({ translatedText });
  } catch (err:any) {
    console.error('Translation API error:', err);
    res.status(500).json({ error: 'translate_error', details: String(err) });
  }
});

router.post('/tts', async (req, res) => {
  try {
    const { text, language } = req.body;
    const ttsResult = await textToSpeech(text || '', language || 'en-US');
    
    // Check if ttsResult has success property and audioBuffer
    if (ttsResult && 'success' in ttsResult && ttsResult.success && ttsResult.audioBuffer) {
      // Send actual audio data
      res.set({
        'Content-Type': (ttsResult as any).contentType || 'audio/mpeg',
        'Content-Length': ttsResult.audioBuffer.length
      });
      res.send(ttsResult.audioBuffer);
    } else {
      // Send JSON response for mock mode
      res.json(ttsResult);
    }
  } catch (err:any) {
    console.error(err);
    res.status(500).json({ error: 'tts_error', details: String(err) });
  }
});

// AI Chat endpoint - Main Gemini-powered shopping assistant
router.post('/chat', async (req, res) => {
  // Check if Gemini assistant is available
  if (!geminiAssistant) {
    console.error('Gemini Shopping Assistant is not initialized');
    return res.status(503).json({ 
      error: 'service_unavailable', 
      details: 'AI Shopping Assistant is currently unavailable' 
    });
  }
  
  try {
    const { message, language = 'en', userId = 'guest' } = req.body;
    
    // Process with Gemini AI
    const response = await geminiAssistant.processShoppingQuery({
      query: message,
      language: language,
      userId: userId
    });
    
    res.json(response);
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ error: 'ai_chat_error', details: String(error) });
  }
});

// Product search endpoint
router.post('/search', async (req, res) => {
  try {
    const { query, language = 'en' } = req.body;
    
    const products = await boutiqueService.searchProducts(query, language);
    
    res.json({ products });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'search_error', details: String(error) });
  }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { language = 'en' } = req.query;
    
    const product = await boutiqueService.getProductInLanguage(id, language as string);
    
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Product fetch error:', error);
    res.status(500).json({ error: 'product_error', details: String(error) });
  }
});

// Add to cart endpoint
router.post('/cart/add', async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    
    const success = await boutiqueService.addToCart(userId, productId, quantity);
    
    if (success) {
      res.json({ success: true, message: 'Item added to cart' });
    } else {
      res.status(500).json({ success: false, message: 'Failed to add item to cart' });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'cart_error', details: String(error) });
  }
});

// Handle actions from the shopping assistant
router.post('/action', async (req, res) => {
  // Check if Gemini assistant is available
  if (!geminiAssistant) {
    console.error('Gemini Shopping Assistant is not initialized');
    return res.status(503).json({ 
      error: 'service_unavailable', 
      details: 'AI Shopping Assistant is currently unavailable' 
    });
  }
  
  try {
    const { action, context } = req.body;
    
    // Process action with Gemini AI
    const response = await geminiAssistant.processAction(action, context);
    
    res.json(response);
  } catch (error) {
    console.error('Action processing error:', error);
    res.status(500).json({ error: 'action_error', details: String(error) });
  }
});

// Test translation endpoint
router.get('/test-translation', async (req, res) => {
  try {
    const { translateText } = await import('../services/translationService');
    
    // Test Bengali to English translation
    const testText = 'মেয়েদের জন্য টি-শার্ট'; // T-shirt for girls
    const result = await translateText(testText, 'bn', 'en');
    
    res.json({
      original: testText,
      translated: result,
      success: true
    });
  } catch (error) {
    console.error('Translation test error:', error);
    res.status(500).json({ 
      error: 'translation_test_error', 
      details: String(error),
      success: false
    });
  }
});

export default router;