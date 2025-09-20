// Test script to check environment variables
const path = require('path');
const dotenv = require('dotenv');

console.log('=== Environment Variables Test ===\n');

// Load environment variables
const envPath = path.resolve(__dirname, '.env');
console.log('Loading env file from:', envPath);

const result = dotenv.config({ path: envPath });

if (result.error) {
  console.log('❌ Error loading .env file:', result.error.message);
} else {
  console.log('✅ .env file loaded successfully');
}

// Check specific environment variables
console.log('\nEnvironment Variables Status:');
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Not set');
if (process.env.GEMINI_API_KEY) {
  console.log('GEMINI_API_KEY length:', process.env.GEMINI_API_KEY.length);
}

console.log('USE_GCP:', process.env.USE_GCP ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_CLOUD_PROJECT:', process.env.GOOGLE_CLOUD_PROJECT ? '✅ Set' : '❌ Not set');

console.log('\nAll Environment Variables:');
for (const [key, value] of Object.entries(process.env)) {
  // Don't print sensitive information
  if (key.includes('KEY') || key.includes('SECRET') || key.includes('PASSWORD')) {
    console.log(`${key}: ${value ? '****' + value.slice(-4) : 'Not set'}`);
  } else {
    console.log(`${key}: ${value || 'Not set'}`);
  }
}