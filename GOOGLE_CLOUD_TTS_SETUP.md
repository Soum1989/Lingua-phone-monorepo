# Google Cloud Text-to-Speech (TTS) Setup Guide

## Overview

This guide explains how to enable Google Cloud Text-to-Speech for your Lingua-phone application. Currently, the application is falling back to mock TTS because Google Cloud TTS is not properly configured.

## Prerequisites

1. Google Cloud Project (Project ID: `lingua-phone`)
2. Billing enabled for your Google Cloud project
3. Access to Google Cloud Console

## Step-by-Step Setup

### 1. Enable Google Cloud Text-to-Speech API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `lingua-phone`
3. Navigate to **APIs & Services** → **Library**
4. Search for "Cloud Text-to-Speech API"
5. Click on the API and then click **ENABLE**

### 2. Create Service Account and Key

1. In Google Cloud Console, go to **IAM & Admin** → **Service Accounts**
2. Click **CREATE SERVICE ACCOUNT**
3. Enter a name (e.g., `lingua-phone-tts`)
4. Click **CREATE AND CONTINUE**
5. Grant this service account the role: **Cloud Text-to-Speech API User** (see troubleshooting below if not found)
6. Click **CONTINUE** and then **DONE**
7. Find your new service account in the list and click on it
8. Go to the **KEYS** tab
9. Click **ADD KEY** → **Create new key**
10. Select **JSON** format and click **CREATE**
11. Save the downloaded JSON file as `service-account.json`

### 3. Place Service Account Key

Place the `service-account.json` file in the correct location:
```
lingua-phone-monorepo/
└── packages/
    └── backend/
        └── keys/
            └── service-account.json  ← Place your key file here
```

### 4. Verify Environment Variables

Ensure your `.env` file has the correct configuration:
```env
# Google Cloud Configuration
USE_GCP=true
GOOGLE_APPLICATION_CREDENTIALS=./keys/service-account.json
GOOGLE_CLOUD_PROJECT=lingua-phone

# Gemini API Configuration
GEMINI_API_KEY=AIzaSyABq0i7EzoPaoxnSWgaKc8ayeFPypM-qNk
```

### 5. Install Dependencies

Make sure all dependencies are installed:
```bash
cd packages/backend
npm install
```

### 6. Restart Backend Server

```bash
# From the root directory
npm run dev:backend

# Or from packages/backend directory
npm run dev
```

## Verification

### Check Backend Logs

When the backend starts successfully with Google Cloud TTS, you should see:
```
Google Cloud TTS client initialized successfully
Project ID: lingua-phone
```

Instead of:
```
Google Cloud TTS not available, using fallback
```

### Test TTS Endpoint

You can test the TTS endpoint with curl:
```bash
curl -X POST http://localhost:3002/api/tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello, this is a test", "language": "en-US"}' \
  --output test.mp3
```

If Google Cloud TTS is working, you'll get an actual MP3 file. If it's using mock mode, you'll get a JSON response.

### Run Test Script

You can also run the provided test script:
```bash
node test-tts.js
```

## Troubleshooting

### Common Issues

1. **"Google Cloud TTS not available, using fallback"**
   - Check that `USE_GCP=true` in your .env file
   - Verify the service account key file exists at the correct path
   - Ensure the Text-to-Speech API is enabled in Google Cloud Console

2. **"Failed to initialize Google Cloud TTS client"**
   - Check that the service account key file is valid JSON
   - Verify the service account has the correct permissions
   - Ensure the project ID matches your Google Cloud project

3. **"No matches for Cloud Text-to-Speech API User"**
   - This is a common issue. Try these alternative role names:
     - **Cloud Text-to-Speech Agent**
     - **Editor** (has broader permissions)
     - **Owner** (has full permissions - NOT recommended for production)
   - If none of these work, you can grant permissions after creating the service account:
     1. Create the service account without any roles
     2. After creation, click on the service account
     3. Go to the **PERMISSIONS** tab
     4. Click **GRANT ACCESS**
     5. In the **New principals** field, enter your service account email
     6. In the **Role** field, search for "Text-to-Speech" or "tts"
     7. Select the appropriate role

4. **"Permission denied" errors**
   - Make sure your service account has the correct role
   - Check that billing is enabled for your project

### Debugging Steps

1. **Check environment variables**:
   ```bash
   echo $USE_GCP
   echo $GOOGLE_APPLICATION_CREDENTIALS
   echo $GOOGLE_CLOUD_PROJECT
   ```

2. **Verify service account key**:
   ```bash
   # Check if file exists
   ls -la packages/backend/keys/service-account.json

   # Check if it's valid JSON
   cat packages/backend/keys/service-account.json | jq .
   ```

3. **Check backend logs** for detailed error messages

## Supported Languages

The application supports TTS for multiple languages including:
- English (en-US)
- Hindi (hi-IN)
- Bengali (bn-IN)
- Tamil (ta-IN)
- Kannada (kn-IN)
- And many more...

The voice mapping is defined in `packages/backend/src/services/ttsService.ts`.

## Security Notes

- Keep your service account key file secure and never commit it to version control
- The `.gitignore` file should already exclude `keys/*.json`
- Use appropriate IAM roles (principle of least privilege)

## Next Steps

Once Google Cloud TTS is enabled:
1. Test with different languages, especially Bengali
2. Verify that the shopping assistant properly uses TTS for responses
3. Check that the TTS quality is better than the browser's built-in speech synthesis
