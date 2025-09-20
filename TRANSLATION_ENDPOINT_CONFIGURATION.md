# Translation Endpoint Configuration

This document explains how the translation endpoints are configured in the backend API and how to test them.

## Translation Endpoints

### 1. `/api/translate` (POST)
- **Purpose**: Translates text from one language to another
- **Request Body**:
  ```json
  {
    "text": "string",      // Text to translate
    "from": "string",      // Source language code (e.g., 'en', 'bn', 'hi')
    "to": "string"         // Target language code (e.g., 'en', 'bn', 'hi')
  }
  ```
- **Response**:
  ```json
  {
    "translatedText": "string"  // Translated text
  }
  ```

### 2. `/api/test-translation` (GET)
- **Purpose**: Built-in test endpoint for translation functionality
- **Response**:
  ```json
  {
    "original": "string",      // Original test text
    "translated": "string",    // Translated text
    "success": true|false      // Test result
  }
  ```

### 3. `/api/languages` (GET)
- **Purpose**: Returns list of supported languages
- **Response**:
  ```json
  {
    "languages": [
      {
        "code": "string",        // Language code
        "name": "string",        // Language name
        "bcp47": "string",       // BCP-47 language tag
        "sttSupported": true|false,  // Speech-to-text support
        "ttsSupported": true|false   // Text-to-speech support
      }
    ]
  }
  ```

## Translation Service Implementation

### Google Cloud Translation
The backend uses Google Cloud Translation API when:
1. `USE_GCP=true` in environment variables
2. Google Cloud service account key is available
3. `@google-cloud/translate` package is installed

### Fallback Mechanisms
If Google Cloud Translation is not available, the service falls back to:
1. Free Google Translate API
2. MyMemory translation API
3. Intelligent mock translation with predefined translations

### Language Support
The service supports a wide range of languages including:
- Indian languages: Hindi, Bengali, Tamil, Telugu, Marathi, etc.
- International languages: English, Chinese, Japanese, Spanish, French, etc.

## Testing Translation Endpoints

### Using Node.js Test Script
Run the test script to verify translation functionality:
```bash
node test-translation-endpoint.js
```

### Using cURL (Linux/Mac)
Use the provided shell script:
```bash
chmod +x test-translation-curl.sh
./test-translation-curl.sh
```

### Using cURL (Windows)
Use the provided batch file:
```cmd
test-translation-curl.bat
```

### Manual cURL Commands
```bash
# Bengali to English translation
curl -X POST http://localhost:3002/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"মেয়েদের জন্য টি-শার্ট","from":"bn","to":"en"}'

# Get supported languages
curl -X GET http://localhost:3002/api/languages

# Test translation endpoint
curl -X GET http://localhost:3002/api/test-translation
```

## Environment Configuration

### Required Environment Variables
```env
USE_GCP=true
GOOGLE_APPLICATION_CREDENTIALS=./keys/service-account.json
GOOGLE_CLOUD_PROJECT=lingua-phone
```

### Service Account Setup
1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Place it at `./keys/service-account.json` relative to the backend directory
4. Enable the Translation API in Google Cloud Console

## Troubleshooting

### Common Issues
1. **Translation not working**: Check if service account key is valid and Translation API is enabled
2. **Languages endpoint empty**: Verify Google Cloud credentials and network connectivity
3. **Fallback translation**: If you see prefixed text like `[BN]`, it means fallback translation is being used

### Log Messages
- `Google Cloud Translation client initialized successfully` - Google Cloud Translation is working
- `Using free Google Translate API service` - Falling back to free service
- `Translation successful` - Translation completed successfully

### Testing in Docker
When running in Docker, ensure:
1. Service account key is mounted correctly
2. Environment variables are set in docker-compose.yml
3. Network connectivity to Google Cloud services
