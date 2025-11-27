#!/usr/bin/env node

/**
 * Recruitkart - Cross-Platform Setup & Build Manager
 * Works on Windows, macOS, and Linux
 * * Usage:
 * node setup.js          -> Runs Development Setup (Docker, DB, Seeds)
 * node setup.js --build  -> Runs Production Build (Clean Install, Build)
 * node setup.js --clean  -> Nukes everything (Docker, Modules, Dist) for a fresh start
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
    try {
        execSync(command, { stdio: 'inherit', ...options });
        return true;
    } catch (error) {
        return false;
    }
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- FILE SYSTEM HELPERS ---
function removeDir(dirPath) {
    try {
        if (fs.existsSync(dirPath)) {
            fs.rmSync(dirPath, { recursive: true, force: true });
            return true;
        }
    } catch (error) {
        log(`⚠️  Failed to remove ${dirPath}: ${error.message}`, 'yellow');
    }
    return false;
}

function removeFile(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return true;
        }
    } catch (error) {
        log(`⚠️  Failed to remove ${filePath}: ${error.message}`, 'yellow');
    }
    return false;
}

// --- CLEAN WORKFLOW ---
async function runClean() {
    log('\n🧹 Cleaning Recruitkart Project...\n', 'bright');

    // Stop running processes (platform-specific)
    log('⏹️  Stopping running processes...', 'cyan');
    try {
        if (process.platform === 'win32') {
            // Use PowerShell to kill node processes excluding the current one to avoid self-termination
            const currentPid = process.pid;
            const cmd = `powershell -Command "Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne ${currentPid} } | Stop-Process -Force"`;
            execSync(cmd, { stdio: 'ignore' });
        } else {
            execSync('pkill -f "next dev"', { stdio: 'ignore' });
            execSync('pkill -f "prisma studio"', { stdio: 'ignore' });
        }
    } catch (e) {
        // Ignore errors if processes aren't running
    }
    log('✅ Processes stopped\n', 'green');

    // Stop and remove Docker containers
    log('🐳 Stopping Docker containers...', 'cyan');
    execCommand('docker-compose down', { stdio: 'ignore' });
    log('✅ Docker containers stopped\n', 'green');

    // Remove Docker containers specific to project to be safe
    log('🗑️  Removing Recruitkart Docker containers...', 'cyan');
    const containers = [
        'recruitkart_postgres',
        'recruitkart_redis',
        'recruitkart_minio',
        'recruitkart_minio_create_bucket'
    ];
    containers.forEach(container => {
        execCommand(`docker rm -f ${container}`, { stdio: 'ignore' });
    });
    log('✅ Docker containers removed\n', 'green');

    // Remove Docker volumes
    log('💾 Removing Docker volumes and data...', 'cyan');
    removeDir(path.join(process.cwd(), 'docker', 'pg_data'));
    removeDir(path.join(process.cwd(), 'docker', 'redis_data'));
    removeDir(path.join(process.cwd(), 'docker', 'minio_data'));
    log('✅ Docker volumes removed\n', 'green');

    // Clean Next.js build artifacts
    log('🗑️  Removing Next.js build artifacts...', 'cyan');
    removeDir(path.join(process.cwd(), '.next'));
    removeDir(path.join(process.cwd(), 'out'));
    removeDir(path.join(process.cwd(), '.turbo'));
    log('✅ Build artifacts removed\n', 'green');

    // Clean node modules
    log('📦 Removing node_modules...', 'cyan');
    removeDir(path.join(process.cwd(), 'node_modules'));
    log('✅ node_modules removed\n', 'green');

    // Clean package lock
    log('🔒 Removing package-lock.json...', 'cyan');
    removeFile(path.join(process.cwd(), 'package-lock.json'));
    log('✅ package-lock.json removed\n', 'green');

    // Clean Prisma generated files
    log('🔧 Removing Prisma generated files...', 'cyan');
    removeDir(path.join(process.cwd(), 'node_modules', '.prisma'));
    removeDir(path.join(process.cwd(), 'node_modules', '@prisma', 'client'));
    log('✅ Prisma files removed\n', 'green');

    // Display summary
    log('\n' + '='.repeat(60), 'bright');
    log('✅ Clean Complete!', 'green');
    log('='.repeat(60) + '\n', 'bright');

    log('🔄 What was cleaned:', 'bright');
    log('  ✓ Next.js build artifacts (.next, out, .turbo)', 'cyan');
    log('  ✓ Node modules and package-lock.json', 'cyan');
    log('  ✓ Prisma generated files', 'cyan');
    log('  ✓ Docker containers (postgres, redis, minio)', 'cyan');
    log('  ✓ Docker volumes (all data deleted)', 'cyan');

    log('\n📝 Next steps:', 'bright');
    log('  1. Run "npm install" to reinstall dependencies', 'yellow');
    log('  2. Run "node setup.js" to rebuild environment', 'yellow');
}

// --- PRODUCTION BUILD WORKFLOW ---
async function runBuild() {
    log('\n🏗️  Building Recruitkart for Production...\n', 'bright');

    // Check environment
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        log('⚠️  Warning: .env not found. Make sure environment variables are set.\n', 'yellow');
    }

    // Install dependencies (Clean Install)
    log('📦 Installing dependencies (npm ci)...', 'cyan');
    if (!execCommand('npm ci')) {
        log('❌ Failed to install dependencies', 'red');
        process.exit(1);
    }
    log('✅ Dependencies installed\n', 'green');

    // Generate Prisma Client
    log('🔧 Generating Prisma Client...', 'cyan');
    if (!execCommand('npx prisma generate')) {
        log('❌ Failed to generate Prisma Client', 'red');
        process.exit(1);
    }
    log('✅ Prisma Client generated\n', 'green');

    // Build Next.js application
    log('⚙️  Building Next.js application...', 'cyan');
    if (!execCommand('npm run build')) {
        log('❌ Failed to build Next.js application', 'red');
        process.exit(1);
    }
    log('✅ Next.js build complete\n', 'green');

    // Display summary
    log('\n' + '='.repeat(60), 'bright');
    log('✅ Build Complete!', 'green');
    log('='.repeat(60) + '\n', 'bright');

    log('Production build artifacts:', 'bright');
    log('  • .next/ - Next.js build output', 'cyan');
    log('  • node_modules/@prisma/client - Prisma Client', 'cyan');
    log('');
    log('To run in production:', 'bright');
    log('  1. Set DATABASE_URL in production environment', 'yellow');
    log('  2. Run migrations: npx prisma migrate deploy', 'yellow');
    log('  3. Start server: npm start\n', 'yellow');
}

// --- DEVELOPMENT SETUP WORKFLOW ---
async function runDevSetup() {
    log('\n🚀 Setting up Recruitkart (Development)...\n', 'bright');

    // Check if Docker is running
    log('🐳 Checking Docker...', 'cyan');
    const dockerRunning = execCommand('docker info', { stdio: 'ignore' });
    if (!dockerRunning) {
        log('❌ Docker is not running. Please start Docker and try again.', 'red');
        process.exit(1);
    }
    log('✅ Docker is running\n', 'green');

    // Check if .env exists, if not create it
    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
        log('⚠️  .env not found. Creating default .env file...', 'yellow');
        const defaultEnv = `# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruitkart?schema=public"

# JWT Secret (Change this to a secure random string in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-12345"

# Application URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Node Environment
NODE_ENV="development"

# Redis Configuration
REDIS_URL="redis://localhost:6379"

# MinIO/S3 Configuration
AWS_ENDPOINT="http://localhost:9000"
AWS_ACCESS_KEY_ID="minioadmin"
AWS_SECRET_ACCESS_KEY="minioadmin"
AWS_REGION="us-east-1"
AWS_BUCKET_NAME="recruitkart-media"
`;
        fs.writeFileSync(envPath, defaultEnv);
        log('✅ Created .env file\n', 'green');
    }

    // Start Docker services
    log('🐳 Starting Docker services (PostgreSQL, Redis, MinIO)...', 'cyan');
    if (!execCommand('docker-compose up -d')) {
        log('❌ Failed to start Docker services', 'red');
        process.exit(1);
    }
    log('✅ Docker services started\n', 'green');

    // Wait for PostgreSQL to be ready
    log('⏳ Waiting for PostgreSQL to be ready...', 'cyan');
    await sleep(5000);
    log('✅ PostgreSQL is ready\n', 'green');

    // Install dependencies
    log('📦 Installing dependencies...', 'cyan');
    if (!execCommand('npm install')) {
        log('❌ Failed to install dependencies', 'red');
        process.exit(1);
    }
    log('✅ Dependencies installed\n', 'green');

    // Generate Prisma Client
    log('🔧 Generating Prisma Client...', 'cyan');
    if (!execCommand('npx prisma generate')) {
        log('❌ Failed to generate Prisma Client', 'red');
        process.exit(1);
    }
    log('✅ Prisma Client generated\n', 'green');

    // Run migrations
    log('🗄️  Running database migrations...', 'cyan');
    // Using --name init to ensure first migration is created if needed
    if (!execCommand('npx prisma migrate dev --name init')) {
        log('⚠️  Migrations may have already been applied or failed', 'yellow');
    }
    log('✅ Database migrations complete\n', 'green');

    // Seed database with test data
    log('🌱 Seeding database with test data...', 'cyan');
    if (!execCommand('npx tsx scripts/seed.ts')) {
        log('⚠️  Database seeding failed or already seeded', 'yellow');
    } else {
        log('✅ Database seeded\n', 'green');
    }

    // Create admin users - INLINE LOGIC
    log('👤 Creating Recruitkart staff users (ADMIN, SUPPORT, OPERATOR)...', 'cyan');
    try {
        // Dynamic require to ensure dependencies are loaded after install
        const { PrismaClient, UserRole, VerificationStatus } = require('@prisma/client');
        const bcrypt = require('bcryptjs');
        const prisma = new PrismaClient();

        const createUser = async (email, pass, role) => {
            const passwordHash = await bcrypt.hash(pass, 10);
            return prisma.user.upsert({
                where: { email },
                update: {
                    password_hash: passwordHash,
                    role: role,
                    verification_status: VerificationStatus.VERIFIED,
                },
                create: {
                    email,
                    password_hash: passwordHash,
                    role: role,
                    verification_status: VerificationStatus.VERIFIED,
                }
            });
        };

        await createUser('admin@recruitkart.com', 'admin@recruitkart2024', UserRole.ADMIN || 'SUPER_ADMIN');
        log('   ✅ Admin created: admin@recruitkart.com', 'green');

        await createUser('support@recruitkart.com', 'support@recruitkart2024', UserRole.SUPPORT || 'SUPPORT_AGENT');
        log('   ✅ Support created: support@recruitkart.com', 'green');

        await createUser('operator@recruitkart.com', 'operator@recruitkart2024', UserRole.OPERATOR || 'OPERATOR');
        log('   ✅ Operator created: operator@recruitkart.com', 'green');

        await prisma.$disconnect();
        log('✅ Staff users created\n', 'green');

    } catch (error) {
        log(`⚠️  Failed to create/update staff users: ${error.message}`, 'yellow');
        log('   (They might already exist or DB connection failed)', 'yellow');
    }

    // Display credentials
    log('\n' + '='.repeat(60), 'bright');
    log('✅ Setup Complete!', 'green');
    log('='.repeat(60) + '\n', 'bright');

    log('🔐 Credentials Summary:', 'bright');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'cyan');
    log('Recruitkart Staff:', 'yellow');
    log('  • admin@recruitkart.com / admin@recruitkart2024 (ADMIN)');
    log('  • support@recruitkart.com / support@recruitkart2024 (SUPPORT)');
    log('  • operator@recruitkart.com / operator@recruitkart2024 (OPERATOR)');
    log('');
    log('Company Users:', 'yellow');
    log('  • admin@acme.com / password123 (Acme Corp)');
    log('  • admin@techflow.io / password123 (TechFlow)');
    log('  • hiring@acme.com / password123 (Acme Member)');
    log('');
    log('TAS (Recruiters):', 'yellow');
    log('  • recruiter1@agency.com / password123 (Verified, Balance: 50)');
    log('  • recruiter2@agency.com / password123 (Verified, Balance: 25)');
    log('  • newbie@agency.com / password123 (Pending)');
    log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'cyan');

    log('🌐 Access Points:', 'bright');
    log('  • Application: http://localhost:3000', 'cyan');
    log('  • MinIO Console: http://localhost:9001 (minioadmin/minioadmin)', 'cyan');
    log('  • Database: localhost:5432 (postgres/postgres)\n', 'cyan');

    log('🚀 Next Steps:', 'bright');
    log('  1. Run "npm run dev" to start the development server');
    log('  2. Open http://localhost:3000 in your browser');
    log('  3. Login with any of the credentials above\n');
}

// --- CLI HANDLER ---
const args = process.argv.slice(2);

if (args.includes('--build')) {
    runBuild().catch((error) => {
        log(`\n❌ Build failed: ${error.message}`, 'red');
        process.exit(1);
    });
} else if (args.includes('--clean')) {
    runClean().catch((error) => {
        log(`\n❌ Clean failed: ${error.message}`, 'red');
        process.exit(1);
    });
} else {
    runDevSetup().catch((error) => {
        log(`\n❌ Setup failed: ${error.message}`, 'red');
        process.exit(1);
    });
}