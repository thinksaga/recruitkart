const { execSync } = require('child_process');

const isProd = process.env.NODE_ENV === 'production';

function run(command) {
    try {
        execSync(command, { stdio: 'inherit' });
    } catch (error) {
        console.error(`❌ Command failed: ${command}`);
        process.exit(1);
    }
}

console.log(`🚀 Starting Recruitkart Setup (${isProd ? 'PRODUCTION' : 'DEVELOPMENT'})...`);

// 1. Install Dependencies
console.log('📦 Installing dependencies...');
run(isProd ? 'npm ci' : 'npm install');

// 2. Start Docker
// In production, we assume infrastructure might be managed externally, 
// but if using docker-compose, we ensure it's up.
console.log('🐳 Starting Docker containers...');
run('docker-compose up -d');

// 3. Wait for Postgres
console.log('⏳ Waiting for Database to be ready...');
const maxRetries = 30;
let retries = 0;
while (retries < maxRetries) {
    try {
        execSync('docker exec recruitkart_postgres pg_isready -U postgres', { stdio: 'ignore' });
        console.log('✅ Database is ready!');
        break;
    } catch (e) {
        retries++;
        console.log(`Waiting for postgres... (${retries}/${maxRetries})`);
        execSync('sleep 2');
    }
}

if (retries === maxRetries) {
    console.error('❌ Database failed to start in time.');
    process.exit(1);
}

// 4. Run Migrations
console.log('🔄 Running Database Migrations...');
// In prod, use 'deploy' to apply pending migrations safely without resetting.
// In dev, use 'dev' to create new migrations or reset if needed.
run(isProd ? 'npx prisma migrate deploy' : 'npx prisma migrate dev');

// 5. Build Application (Production Only)
if (isProd) {
    console.log('🏗️ Building Application...');
    run('npm run build');
}

// 6. Seed Database (Development Only)
if (!isProd) {
    console.log('🌱 Seeding Database...');
    run('npm run db:seed');
} else {
    console.log('ℹ️ Skipping seed in production. Run "npm run db:seed" manually if needed.');
}

console.log(`✅ Setup Complete! You can now run '${isProd ? 'npm start' : 'npm run dev'}' to start the app.`);
