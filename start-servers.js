const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Lingua Phone servers...');

// Start backend
const backendPath = path.join(__dirname, 'packages', 'backend');
console.log('Installing backend dependencies...');

const backendInstall = spawn('npm', ['install'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

backendInstall.on('close', (code) => {
  if (code === 0) {
    console.log('Backend dependencies installed. Starting backend server...');
    
    const backendServer = spawn('npm', ['run', 'dev'], {
      cwd: backendPath,
      stdio: 'inherit',
      shell: true
    });

    // Start frontend after a delay
    setTimeout(() => {
      const frontendPath = path.join(__dirname, 'packages', 'frontend');
      console.log('Installing frontend dependencies...');
      
      const frontendInstall = spawn('npm', ['install'], {
        cwd: frontendPath,
        stdio: 'inherit',
        shell: true
      });

      frontendInstall.on('close', (code) => {
        if (code === 0) {
          console.log('Frontend dependencies installed. Starting frontend server...');
          
          const frontendServer = spawn('npm', ['run', 'dev'], {
            cwd: frontendPath,
            stdio: 'inherit',
            shell: true
          });
        }
      });
    }, 3000);
  }
});