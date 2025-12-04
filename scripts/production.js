const { execSync } = require('child_process');
require('dotenv').config();

console.log('🚀 Starting Recruitkart Production Setup...');

try {
    // 1. Stop existing containers
    console.log('🐳 Stopping any running containers...');
    try {
        execSync('docker-compose down', { stdio: 'inherit' });
        execSync('docker-compose -f docker-compose.prod.yml down', { stdio: 'inherit' });
    } catch (e) {
        // Ignore errors if no containers are running
    }

    // 2. Start Production Stack
    console.log('🏗️  Building and Starting Production Stack...');
    execSync('docker-compose -f docker-compose.prod.yml up -d --build', { stdio: 'inherit' });

    // 3. Wait for DB
    console.log('⏳ Waiting for Production Database to be ready...');
    // Simple wait loop or sleep. Since we have healthchecks in compose, we can wait a bit.
    execSync('sleep 10');

    // 4. Run Migrations
    console.log('🔄 Running Database Migrations on Production DB...');
    const { POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB } = process.env;
    const prodDbUrl = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5433/${POSTGRES_DB}?schema=public`;
    execSync(`DATABASE_URL="${prodDbUrl}" npx prisma migrate deploy`, { stdio: 'inherit' });

    // 5. Seed Database (Admin Only)
    console.log('🌱 Seeding Production Database (Admin Only)...');
    execSync(`DATABASE_URL="${prodDbUrl}" npx tsx scripts/seed-prod.ts`, { stdio: 'inherit' });

    console.log('\n✅ Production Setup Complete!');
    console.log('------------------------------------------------');
    console.log('Admin Credentials:');
    console.log('Email: ceo@recruitkart.com');
    console.log('Password: (See ADMIN_PASSWORD in .env)');
    console.log('------------------------------------------------');
    console.log('App is running at: http://localhost:3000');
    console.log('Cloudflare Tunnel is active.');

} catch (error) {
    console.error('❌ Production Setup Failed:', error.message);
    process.exit(1);
}
