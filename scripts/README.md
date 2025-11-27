# Recruitkart - Development Scripts

This directory contains utility scripts for managing the Recruitkart application.

## Available Scripts

### Setup & Build

#### `./scripts/setup.sh` or `npm run setup`
Complete setup from scratch:
- Starts Docker services (PostgreSQL, Redis, MinIO)
- Installs dependencies
- Runs database migrations
- Seeds test data
- Creates admin users
- Starts development server

**Usage:**
```bash
./scripts/setup.sh
# or
npm run setup
```

#### `./scripts/build.sh`
Build for production:
- Installs dependencies (production mode)
- Generates Prisma Client
- Builds Next.js application

**Usage:**
```bash
./scripts/build.sh
```

#### `./scripts/clean.sh` or `npm run clean`
Clean everything:
- Stops running processes
- Removes build artifacts (.next, out, .turbo)
- Removes node_modules
- Removes Prisma generated files
- Resets database (optional)

**Usage:**
```bash
./scripts/clean.sh
# or
npm run clean
```

### Database Management

#### `npm run db:migrate`
Run database migrations in development mode.

#### `npm run db:seed`
Seed database with test data:
- Test Company Inc
- 3 test users (admin, tas1, tas2)
- 1 test job

#### `npm run db:reset`
Reset database (drops all data and re-runs migrations).

#### `npm run db:studio`
Open Prisma Studio to view/edit database.

### User Management

#### `npm run create:admin`
Create Recruitkart staff users:
- admin@recruitkart.com (ADMIN)
- support@recruitkart.com (SUPPORT)
- operator@recruitkart.com (OPERATOR)

### Testing

#### `npm run test:api`
Run API authentication flow tests.

## Quick Start

### First Time Setup
```bash
# Clean install and setup
./scripts/clean.sh
./scripts/setup.sh
```

### Daily Development
```bash
# Start Docker services
docker-compose up -d

# Start dev server
npm run dev
```

### Reset Everything
```bash
# Clean and start fresh
npm run clean
npm run setup
```

## Credentials

### Recruitkart Staff
- **ADMIN**: admin@recruitkart.com / admin@recruitkart2024
- **SUPPORT**: support@recruitkart.com / support@recruitkart2024
- **OPERATOR**: operator@recruitkart.com / operator@recruitkart2024

### Test Users
- **Company Admin**: admin@test.com / password123
- **TAS (Verified)**: tas1@test.com / password123
- **TAS (Pending)**: tas2@test.com / password123

## Environment Variables

Make sure `.env.local` exists with:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/recruitkart?schema=public"
JWT_SECRET="your-secret-key"
NEXT_PUBLIC_MINIO_URL="http://localhost:9000"
```
