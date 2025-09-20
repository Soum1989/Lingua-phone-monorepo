const { exec } = require('child_process');
const fs = require('fs');

console.log('Testing frontend Docker image build...');

// Run docker build command and capture output
exec('docker build -t lingua-frontend-test -f docker/frontend.Dockerfile .', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error building Docker image: ${error}`);
    return;
  }
  
  console.log('Docker build output:');
  console.log(stdout);
  
  if (stderr) {
    console.log('Docker build stderr:');
    console.log(stderr);
  }
  
  console.log('Frontend Docker image build test completed.');
});