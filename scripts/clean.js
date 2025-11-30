const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        process.exit(1);
    }
}

console.log('🧹 Cleaning project...');

// 1. Stop Docker & Remove Volumes
console.log('🐳 Stopping Docker and removing volumes...');
run('docker-compose down -v');

// 2. Remove Next.js build
const nextDir = path.join(__dirname, '../.next');
if (fs.existsSync(nextDir)) {
    console.log('🗑️ Removing .next build directory...');
    fs.rmSync(nextDir, { recursive: true, force: true });
}

console.log("✨ Clean complete! Run 'npm run setup' to start fresh.");
