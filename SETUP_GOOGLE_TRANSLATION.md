# 🇮🇳 Google Cloud Translation API Setup for Indian Languages

## Step 1: Enable Translation API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: **lingua-phone**
3. Go to **APIs & Services** → **Library**
4. Search for "Cloud Translation API"
5. Click **ENABLE** (if not already enabled)

## Step 2: Create Service Account
1. Go to **IAM & Admin** → **Service Accounts**
2. Click **+ CREATE SERVICE ACCOUNT**
3. **Service Account Details:**
   - **Name:** `lingua-phone-translator`
   - **Service account ID:** `lingua-phone-translator`
   - **Description:** `Translation service for Lingua Phone app`
4. Click **CREATE AND CONTINUE**

## Step 3: Assign Roles
1. In **Grant this service account access to project**:
   - Add role: **Cloud Translation API User**
   - Add role: **Cloud Translation API Editor** (optional, for advanced features)
2. Click **CONTINUE** → **DONE**

## Step 4: Create and Download Key
1. Click on your newly created service account: `lingua-phone-translator`
2. Go to **KEYS** tab
3. Click **ADD KEY** → **Create new key**
4. Select **JSON** format
5. Click **CREATE**
6. **Save the downloaded file**

## Step 5: Install the Key File
**IMPORTANT:** Save the downloaded JSON file as:
```
c:\Users\Lenovo\Lingua-phone-monorepo\packages\backend\keys\service-account.json
```

**The file structure should look like:**
```
packages/
  backend/
    keys/
      service-account.json  ← Your downloaded JSON file here
    .env
    src/
    ...
```

## Step 6: Verify Setup
Let's test if everything is working:

1. **Start your server:**
   ```powershell
   cd c:\Users\Lenovo\Lingua-phone-monorepo
   npm run dev
   ```

2. **Check the console logs** - you should see:
   ```
   Google Cloud Translation client initialized successfully
   Project ID: lingua-phone
   ```

3. **Test translation** in your app with Indian languages like:
   - Bengali (bn)
   - Tamil (ta)
   - Telugu (te)
   - Marathi (mr)
   - Gujarati (gu)
   - Kannada (kn)
   - Malayalam (ml)

## 🧪 Quick Test

Open a new PowerShell/Terminal and test the API directly:

```powershell
# Test Hindi translation
curl -X POST http://localhost:3001/api/translate -H "Content-Type: application/json" -d "{\"text\":\"Hello world\",\"from\":\"en\",\"to\":\"hi\"}"

# Test Bengali translation
curl -X POST http://localhost:3001/api/translate -H "Content-Type: application/json" -d "{\"text\":\"Good morning\",\"from\":\"en\",\"to\":\"bn\"}"

# Test Tamil translation
curl -X POST http://localhost:3001/api/translate -H "Content-Type: application/json" -d "{\"text\":\"How are you?\",\"from\":\"en\",\"to\":\"ta\"}"
```

## 📊 Supported Indian Languages

Google Cloud Translation API supports all these Indian languages:
- ✅ **Hindi (hi)** - हिन्दी
- ✅ **Bengali (bn)** - বাংলা
- ✅ **Tamil (ta)** - தமிழ்
- ✅ **Telugu (te)** - తెలుగు
- ✅ **Marathi (mr)** - मराठी
- ✅ **Gujarati (gu)** - ગુજરાતી
- ✅ **Kannada (kn)** - ಕನ್ನಡ
- ✅ **Malayalam (ml)** - മലയാളം
- ✅ **Punjabi (pa)** - ਪੰਜਾਬੀ
- ✅ **Odia (or)** - ଓଡ଼ିଆ
- ✅ **Urdu (ur)** - اردو
- ✅ **Assamese (as)** - অসমীয়া
- ✅ **Nepali (ne)** - नेपाली

## 🔍 Troubleshooting

### If you see "Using free Google Translate API service":
- ✅ Check if `service-account.json` is in the correct location
- ✅ Verify the file has proper JSON structure
- ✅ Ensure Translation API is enabled in Google Cloud Console

### If you get authentication errors:
- ✅ Make sure the service account has proper roles
- ✅ Check that the JSON key file is not corrupted
- ✅ Restart the backend server after adding the key file

### If translations still fail for Indian languages:
- ✅ Check the language codes in your frontend
- ✅ Look at console logs for specific error messages
- ✅ Try testing with curl commands above

## 💰 Cost Information

Google Cloud Translation API pricing:
- **$20 per 1 million characters** translated
- **Free tier:** 500,000 characters per month
- **Typical usage:** 1000 translations ≈ $0.50-2.00

For testing and moderate usage, costs are very reasonable!

---

**After completing these steps, your app will have professional-grade translation for all Indian languages! 🚀**
