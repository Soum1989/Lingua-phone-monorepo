# Google Cloud Integration Setup Guide

## 🚀 Quick Setup Instructions

### Step 1: Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `lingua-phone`
3. **Enable Required APIs:**
   - ✅ Cloud Translation API (already enabled)
   - 🔄 Cloud Text-to-Speech API
   - 🔄 Cloud Speech-to-Text API (optional)

### Step 2: Create Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. **Service Account Details:**
   - Name: `lingua-phone-service`
   - Description: `Service account for Lingua Phone app`
4. **Grant Roles:**
   - Cloud Translation API User
   - Cloud Text-to-Speech API User
   - Cloud Speech API User (optional)
5. **Create and Download Key:**
   - Click on the created service account
   - Go to **Keys** tab
   - Click **Add Key** → **Create new key**
   - Choose **JSON** format
   - Download the key file

### Step 3: Install Service Account Key
1. **Save the downloaded JSON file as:**
   ```
   c:\Users\Lenovo\Lingua-phone-monorepo\packages\backend\keys\service-account.json
   ```
2. **Ensure the file is secure and never committed to git**

### Step 4: Verify Environment Configuration
The `.env` file is already configured:
```env
USE_GCP=true
GOOGLE_APPLICATION_CREDENTIALS=./keys/service-account.json
GOOGLE_CLOUD_PROJECT=lingua-phone
```

### Step 5: Test the Integration
1. **Start the servers:**
   ```bash
   cd c:\Users\Lenovo\Lingua-phone-monorepo
   npm run dev
   ```

2. **Test Google Cloud Features:**
   - Translation should automatically use Google Cloud Translation API
   - TTS will try Google Cloud first, fallback to browser if needed
   - Check console logs for "Google Cloud" messages

## 🔧 Features Implemented

### Enhanced Translation Service
- ✅ Google Cloud Translation API integration
- ✅ Fallback to free Google Translate APIs
- ✅ Comprehensive error handling
- ✅ Support for all major languages

### Enhanced Text-to-Speech Service
- ✅ Google Cloud TTS with high-quality voices
- ✅ Automatic voice selection for different languages
- ✅ Fallback to browser TTS when GCP is unavailable
- ✅ Hybrid service that intelligently chooses the best option

### Frontend Integration
- ✅ Hybrid TTS service with automatic fallback
- ✅ Google Cloud TTS option for premium quality
- ✅ Enhanced error handling and user feedback
- ✅ Compatible with existing browser-based implementation

## 🧪 Testing Commands

### Test Translation API
```bash
curl -X POST http://localhost:3001/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","from":"en","to":"hi"}'
```

### Test TTS API
```bash
curl -X POST http://localhost:3001/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello world","language":"en-US"}'
```

## 📊 Usage in Frontend

### Use Enhanced TTS with Google Cloud
```typescript
import { enhancedTTS } from './services/speechService';

// Try Google Cloud first, fallback to browser
await enhancedTTS.speak("Hello world", "en", {
  useGoogleCloud: true,
  onSuccess: () => console.log('Speech completed'),
  onError: (error) => console.error('Speech error:', error)
});

// Force Google Cloud TTS specifically
await enhancedTTS.speakWithGoogleCloud("Hello world", "en", {
  onSuccess: () => console.log('Google Cloud TTS completed'),
  onError: (error) => console.error('Google Cloud TTS error:', error)
});
```

## 🔍 Troubleshooting

### If Google Cloud APIs fail:
1. Check service account permissions
2. Verify API keys are correctly placed
3. Ensure APIs are enabled in Google Cloud Console
4. Check console logs for detailed error messages

### The app will always work:
- If Google Cloud fails → Falls back to free APIs
- If all translation APIs fail → Uses intelligent mock translation
- If Google Cloud TTS fails → Uses browser TTS
- Complete graceful degradation system

## 💰 Cost Considerations

### Google Cloud Pricing (as of 2024):
- **Translation API:** $20 per 1M characters
- **Text-to-Speech:** $4-16 per 1M characters (depending on voice type)
- **Free Tier:** Generous free quotas available

### Recommendation:
- Start with current setup (free tier)
- Monitor usage in Google Cloud Console
- Scale as needed based on user adoption

## 🔐 Security Best Practices

✅ **Implemented:**
- Service account key stored locally (not in code)
- `.env` file excluded from git
- Environment variable-based configuration
- Secure fallback mechanisms

❌ **Never Do:**
- Don't share API keys publicly
- Don't commit service account JSON to git
- Don't hardcode credentials in source code

## 🎯 Next Steps

1. **Complete the service account setup** (Steps 1-3 above)
2. **Test the integration** (Step 5)
3. **Monitor usage** in Google Cloud Console
4. **Optimize based on user feedback**

The implementation is complete and ready for Google Cloud integration!
