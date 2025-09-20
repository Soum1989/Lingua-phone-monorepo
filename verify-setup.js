const fs = require('fs');
const path = require('path');

console.log('🔍 Google Cloud Translation Setup Verification\n');

// Check 1: Environment file
const envPath = path.join(__dirname, 'packages', 'backend', '.env');
console.log('1️⃣ Checking .env file...');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  console.log('   ✅ .env file exists');
  
  if (envContent.includes('USE_GCP=true')) {
    console.log('   ✅ USE_GCP is set to true');
  } else {
    console.log('   ❌ USE_GCP is not set to true');
  }
  
  if (envContent.includes('GOOGLE_CLOUD_PROJECT=lingua-phone')) {
    console.log('   ✅ Project ID is set to lingua-phone');
  } else {
    console.log('   ❌ Project ID not found or incorrect');
  }
  
  if (envContent.includes('GOOGLE_APPLICATION_CREDENTIALS=./keys/service-account.json')) {
    console.log('   ✅ Service account path is configured');
  } else {
    console.log('   ❌ Service account path not configured');
  }
} else {
  console.log('   ❌ .env file not found');
}

// Check 2: Keys directory
const keysPath = path.join(__dirname, 'packages', 'backend', 'keys');
console.log('\n2️⃣ Checking keys directory...');
if (fs.existsSync(keysPath)) {
  console.log('   ✅ keys directory exists');
} else {
  console.log('   ❌ keys directory does not exist');
  console.log('   💡 Run: mkdir packages\\backend\\keys');
}

// Check 3: Service account file
const serviceAccountPath = path.join(keysPath, 'service-account.json');
console.log('\n3️⃣ Checking service account file...');
if (fs.existsSync(serviceAccountPath)) {
  console.log('   ✅ service-account.json exists');
  
  try {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    
    if (serviceAccount.type === 'service_account') {
      console.log('   ✅ Valid service account file structure');
    } else {
      console.log('   ❌ Invalid service account file structure');
    }
    
    if (serviceAccount.project_id) {
      console.log(`   ✅ Project ID in file: ${serviceAccount.project_id}`);
    } else {
      console.log('   ❌ No project ID found in service account file');
    }
    
    if (serviceAccount.client_email) {
      console.log(`   ✅ Service account email: ${serviceAccount.client_email}`);
    } else {
      console.log('   ❌ No client email found in service account file');
    }
    
  } catch (error) {
    console.log('   ❌ Invalid JSON in service account file');
    console.log(`   Error: ${error.message}`);
  }
} else {
  console.log('   ❌ service-account.json not found');
  console.log('   💡 Download from Google Cloud Console and save as:');
  console.log('      packages\\backend\\keys\\service-account.json');
}

// Check 4: Dependencies
console.log('\n4️⃣ Checking dependencies...');
const packageJsonPath = path.join(__dirname, 'packages', 'backend', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (packageJson.dependencies && packageJson.dependencies['@google-cloud/translate']) {
    console.log('   ✅ @google-cloud/translate dependency found');
  } else {
    console.log('   ❌ @google-cloud/translate dependency missing');
    console.log('   💡 Run: npm install @google-cloud/translate');
  }
} else {
  console.log('   ❌ package.json not found');
}

// Summary
console.log('\n📋 Setup Summary:');
console.log('To complete Google Cloud Translation setup:');
console.log('1. Go to Google Cloud Console → APIs & Services → Library');
console.log('2. Enable "Cloud Translation API"');
console.log('3. Go to IAM & Admin → Service Accounts');
console.log('4. Create service account with "Cloud Translation API User" role');
console.log('5. Download JSON key and save as packages/backend/keys/service-account.json');
console.log('6. Start your server: npm run dev');
console.log('7. Test with: node test-translation.js');
console.log('\n🚀 Once setup is complete, you\'ll have professional translation for all Indian languages!');