/**
 * Google Cloud Setup Verification Script
 * 
 * This script verifies that Google Cloud services are properly configured.
 */

const fs = require('fs');
const path = require('path');

console.log('=== Google Cloud Setup Verification ===\n');

// Check environment variables
console.log('1. Checking environment variables...');
const envVars = {
  'USE_GCP': process.env.USE_GCP,
  'GOOGLE_APPLICATION_CREDENTIALS': process.env.GOOGLE_APPLICATION_CREDENTIALS,
  'GOOGLE_CLOUD_PROJECT': process.env.GOOGLE_CLOUD_PROJECT
};

Object.entries(envVars).forEach(([key, value]) => {
  if (value) {
    console.log(`   ✅ ${key}: ${value}`);
  } else {
    console.log(`   ❌ ${key}: NOT SET`);
  }
});

// Check if service account file exists
console.log('\n2. Checking service account file...');
const serviceAccountPath = path.join(__dirname, 'keys', 'service-account.json');

if (fs.existsSync(serviceAccountPath)) {
  console.log(`   ✅ Service account file found: ${serviceAccountPath}`);
  
  try {
    const content = fs.readFileSync(serviceAccountPath, 'utf8');
    const json = JSON.parse(content);
    console.log(`   ✅ Service account file is valid JSON`);
    console.log(`   ✅ Project ID in service account: ${json.project_id}`);
  } catch (error) {
    console.log(`   ❌ Service account file is not valid JSON: ${error.message}`);
  }
} else {
  console.log(`   ❌ Service account file NOT found: ${serviceAccountPath}`);
  console.log('   ℹ️  To enable Google Cloud services, please:');
  console.log('      1. Create a service account in Google Cloud Console');
  console.log('      2. Download the JSON key file');
  console.log('      3. Save it as keys/service-account.json');
}

// Check if required environment variables are set
console.log('\n3. Checking configuration status...');
const isGcpEnabled = process.env.USE_GCP === 'true';
const hasCredentialsPath = !!process.env.GOOGLE_APPLICATION_CREDENTIALS;
const hasProjectId = !!process.env.GOOGLE_CLOUD_PROJECT;

if (isGcpEnabled && hasCredentialsPath && hasProjectId) {
  console.log('   ✅ All required environment variables are set');
} else {
  console.log('   ❌ Missing required environment variables');
}

if (fs.existsSync(serviceAccountPath) && isGcpEnabled && hasCredentialsPath && hasProjectId) {
  console.log('\n🎉 Google Cloud should be properly configured!');
  console.log('   The backend should now use Google Cloud services.');
} else {
  console.log('\n⚠️  Google Cloud is not fully configured.');
  console.log('   The backend will use fallback services.');
}

console.log('\n=== End of Verification ===');