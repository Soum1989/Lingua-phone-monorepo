# Complete Guide to Fix Google Cloud TTS

## Problem Summary

The Google Cloud TTS is not working because:
1. Environment variables are not being loaded properly
2. The service account credentials path is not resolved correctly
3. The service account may not have the proper permissions

## Solution Steps

### Step 1: Verify Service Account File

First, let's confirm your service account file is correctly placed:

```
lingua-phone-monorepo/
└── packages/
    └── backend/
        └── keys/
            └── service-account.json  ← Should contain your credentials
```

### Step 2: Update Docker Configuration

Your docker-compose.yml should already be correctly configured to mount the keys directory:

```yaml
backend:
  # ... other config
  environment:
    - USE_GCP=true
    - GOOGLE_APPLICATION_CREDENTIALS=/app/keys/service-account.json
    - GOOGLE_CLOUD_PROJECT=lingua-phone
  volumes:
    - ./packages/backend/keys:/app/keys:ro
```

### Step 3: Grant Proper Permissions

In Google Cloud Console:
1. Go to **IAM & Admin** → **IAM**
2. Find your service account: `soumyendu@lingua-phone.iam.gserviceaccount.com`
3. Click the pencil icon to edit
4. Add the **Editor** role (this will work for all services)
5. Click **Save**

### Step 4: Enable Text-to-Speech API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the `lingua-phone` project
3. Navigate to **APIs & Services** → **Library**
4. Search for "Cloud Text-to-Speech API"
5. Click on it and then click **ENABLE**

### Step 5: Restart Docker Environment

```bash
docker-compose down
docker-compose up --build -d
```

### Step 6: Check Backend Logs

```bash
docker-compose logs backend
```

Look for:
- ✅ "Google Cloud TTS client initialized successfully"
- ❌ "Google Cloud TTS not available, using fallback"

## Troubleshooting

### If Still Not Working

1. **Check the service account file contents**:
   ```bash
   # In the backend container
   docker-compose exec backend cat /app/keys/service-account.json
   ```

2. **Verify environment variables in container**:
   ```bash
   docker-compose exec backend env | grep -E "(USE_GCP|GOOGLE_APPLICATION_CREDENTIALS|GOOGLE_CLOUD_PROJECT)"
   ```

3. **Check file permissions**:
   ```bash
   docker-compose exec backend ls -la /app/keys/
   ```

### Common Error Messages and Solutions

1. **"Could not load the default credentials"**:
   - Verify the service account file exists at the specified path
   - Check that GOOGLE_APPLICATION_CREDENTIALS points to the correct location

2. **"Permission denied"**:
   - Make sure your service account has the Editor role
   - Restart the backend after changing permissions

3. **"API has not been used"**:
   - Enable the Cloud Text-to-Speech API in Google Cloud Console

## Testing the Fix

After implementing the solution:

1. **Send a test request to the TTS endpoint**:
   ```bash
   curl -X POST http://localhost:3002/api/tts \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello, this is a test", "language": "en-US"}' \
     --output test.mp3
   ```

2. **If Google Cloud TTS is working**, you'll get an actual MP3 file
3. **If it's still using mock mode**, you'll get a JSON response

## Expected Results

Once everything is working correctly:
- ✅ Bengali TTS will work with high quality: "উফ! "
- ✅ All other supported languages will have improved TTS quality
- ✅ The shopping assistant will provide better audio responses
- ✅ You'll see "Google Cloud TTS client initialized successfully" in backend logs

## Security Note

For production use, you should restrict permissions:
1. Remove the Editor role
2. Grant only the specific Text-to-Speech roles when you find them
3. This is just for development/testing purposes

## Next Steps

1. Implement the solution above
2. Restart your Docker environment
3. Check the backend logs
4. Test with a Bengali phrase to verify quality improvement
