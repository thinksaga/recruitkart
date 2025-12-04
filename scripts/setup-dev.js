const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Recruitkart Development Setup...');

// 0. Auto-create .env if missing
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
    console.log('📝 .env file not found. Creating with default development values...');
    const defaultEnvContent = `# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruitkart?schema=public"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development_secret_key_change_in_production"

# MinIO (S3 Compatible)
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="recruitkart-media"
AWS_ENDPOINT="http://localhost:9000"

# Admin Credentials (for seeding)
ADMIN_PASSWORD="password123"
`;
    fs.writeFileSync(envPath, defaultEnvContent);
    console.log('✅ .env created successfully!');
} else {
    console.log('✅ .env file exists.');
}

try {
    // 1. Stop existing containers
    console.log('🐳 Stopping any running containers...');
    try {
        execSync('docker-compose down', { stdio: 'inherit' });
    } catch (e) {
        // Ignore errors if no containers are running
    }

    // 2. Start Development Stack
    console.log('🏗️  Starting Development Stack...');
    execSync('docker-compose up -d', { stdio: 'inherit' });

    // 3. Wait for DB
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
        throw new Error('Database failed to start in time.');
    }

    // 4. Run Migrations
    console.log('🔄 Running Database Migrations...');
    execSync('npx prisma migrate dev', { stdio: 'inherit' });

    // 5. Seed Database
    console.log('🌱 Seeding Database...');
    execSync('npm run db:seed', { stdio: 'inherit' });

    console.log('\n✅ Development Setup Complete!');
    console.log('------------------------------------------------');
    console.log('You can now run: npm run dev');
    console.log('App URL: http://localhost:3000');
    console.log('Admin: admin@recruitkart.com / password123');
    console.log('------------------------------------------------');

} catch (error) {
    console.error('❌ Setup Failed:', error.message);
    process.exit(1);
}
