const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('=== Backend Environment Variables Check ===\n');

// Check if .env file exists in root
const rootEnvPath = path.resolve(__dirname, '.env');
console.log(`Checking root .env file: ${rootEnvPath}`);
if (fs.existsSync(rootEnvPath)) {
  console.log('   ✅ Root .env file found');
  const rootEnv = dotenv.parse(fs.readFileSync(rootEnvPath));
  console.log('   Root environment variables:');
  Object.keys(rootEnv).forEach(key => {
    console.log(`     ${key}: ${rootEnv[key]}`);
  });
} else {
  console.log('   ❌ Root .env file not found');
}

// Check if .env file exists in backend
const backendEnvPath = path.resolve(__dirname, 'packages', 'backend', '.env');
console.log(`\nChecking backend .env file: ${backendEnvPath}`);
if (fs.existsSync(backendEnvPath)) {
  console.log('   ✅ Backend .env file found');
  const backendEnv = dotenv.parse(fs.readFileSync(backendEnvPath));
  console.log('   Backend environment variables:');
  Object.keys(backendEnv).forEach(key => {
    console.log(`     ${key}: ${backendEnv[key]}`);
  });
} else {
  console.log('   ❌ Backend .env file not found');
}

// Check keys directory
const keysDir = path.resolve(__dirname, 'packages', 'backend', 'keys');
console.log(`\nChecking keys directory: ${keysDir}`);
if (fs.existsSync(keysDir)) {
  console.log('   ✅ Keys directory found');
  const files = fs.readdirSync(keysDir);
  console.log('   Files in keys directory:');
  files.forEach(file => {
    console.log(`     ${file}`);
  });
} else {
  console.log('   ❌ Keys directory not found');
}

console.log('\n=== Environment Check Complete ===');