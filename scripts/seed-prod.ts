import 'dotenv/config';
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Starting production seed (Admin only)...');

    const adminPassword = process.env.ADMIN_PASSWORD || 'RecruitK@rt#15Aug';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create or Update Platform Admin
    const adminUser = await prisma.user.upsert({
        where: { email: 'ceo@recruitkart.com' },
        update: {}, // No updates if exists
        create: {
            email: 'ceo@recruitkart.com',
            password_hash: passwordHash,
            role: UserRole.ADMIN,
            verification_status: 'VERIFIED',
            phone: '+919554476555',
            is_active: true,
            preferences: { theme: 'dark', notifications: true },
        },
    });
    console.log('✅ Seeded Admin:', adminUser.email);

    console.log('🌱 Production seeding completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
