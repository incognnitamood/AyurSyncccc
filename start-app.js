#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting AyurSync Application...\n');

// Check if backend directory exists
const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found!');
  console.log('Please make sure you have the complete project structure.');
  process.exit(1);
}

// Check if frontend node_modules exists
const frontendNodeModules = path.join(__dirname, 'node_modules');
if (!fs.existsSync(frontendNodeModules)) {
  console.log('📦 Installing frontend dependencies...');
  const npmInstall = spawn('npm', ['install'], { 
    stdio: 'inherit',
    shell: true 
  });
  
  npmInstall.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Failed to install frontend dependencies');
      process.exit(1);
    }
    startBackend();
  });
} else {
  startBackend();
}

function startBackend() {
  console.log('🔧 Starting backend server...');
  
  // Start backend server
  const backend = spawn('npm', ['run', 'dev'], {
    cwd: backendPath,
    stdio: 'inherit',
    shell: true
  });

  backend.on('error', (error) => {
    console.error('❌ Failed to start backend:', error.message);
    console.log('\n💡 Make sure you have:');
    console.log('1. Node.js installed');
    console.log('2. MongoDB running');
    console.log('3. Backend dependencies installed (npm install in backend/)');
    console.log('4. Environment variables configured (.env file)');
  });

  // Wait a bit for backend to start, then start frontend
  setTimeout(() => {
    console.log('\n🎨 Starting frontend development server...');
    
    const frontend = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      shell: true
    });

    frontend.on('error', (error) => {
      console.error('❌ Failed to start frontend:', error.message);
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\n🛑 Shutting down servers...');
      backend.kill();
      frontend.kill();
      process.exit(0);
    });

  }, 3000);
}

console.log('\n📋 Setup Instructions:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Create a .env file in the backend/ directory with:');
console.log('   MONGODB_URI=mongodb://localhost:27017/ayursync');
console.log('   OPENAI_API_KEY=your-openai-api-key');
console.log('   JWT_SECRET=your-secret-key');
console.log('3. The application will be available at:');
console.log('   Frontend: http://localhost:5173');
console.log('   Backend: http://localhost:5000');
console.log('\n🔑 Demo Login Credentials:');
console.log('   Email: doctor@ayursync.com');
console.log('   Password: password');
console.log('\n⏳ Starting servers...\n');
