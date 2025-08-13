#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

console.log('🎵 Creating Alexa Discogs Music Explorer deployment package (Node.js)...');

// Clean up previous deployment
if (fs.existsSync('deployment')) {
    fs.rmSync('deployment', { recursive: true, force: true });
}

if (fs.existsSync('alexa-discogs-skill-nodejs.zip')) {
    fs.unlinkSync('alexa-discogs-skill-nodejs.zip');
}

// Create deployment directory
fs.mkdirSync('deployment');

console.log('📦 Copying source files...');

// Copy source files
const filesToCopy = [
    'index.js',
    'package.json',
    'src'
];

filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(__dirname, 'deployment', file);
    
    if (fs.statSync(srcPath).isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
    } else {
        fs.copyFileSync(srcPath, destPath);
    }
});

// Install production dependencies
console.log('📦 Installing production dependencies...');
try {
    execSync('npm install --production', { 
        cwd: path.join(__dirname, 'deployment'),
        stdio: 'inherit'
    });
} catch (error) {
    console.error('Failed to install dependencies:', error.message);
    process.exit(1);
}

// Create ZIP file
console.log('📦 Creating ZIP package...');
const output = fs.createWriteStream('alexa-discogs-skill-nodejs.zip');
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log(`✅ Deployment package created: alexa-discogs-skill-nodejs.zip (${archive.pointer()} bytes)`);
    
    // Clean up deployment directory
    fs.rmSync('deployment', { recursive: true, force: true });
    
    console.log('');
    console.log('🎯 Next steps:');
    console.log('1. Upload the ZIP file to AWS Lambda');
    console.log('2. Set the handler to: index.handler');
    console.log('3. Set the runtime to: Node.js 18.x or later');
    console.log('4. Configure Alexa Skills Kit trigger');
    console.log('5. Test your skill in the Alexa Developer Console');
});

archive.on('error', (err) => {
    console.error('Error creating ZIP file:', err);
    process.exit(1);
});

archive.pipe(output);
archive.directory('deployment/', false);
archive.finalize();