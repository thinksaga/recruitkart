import prisma from '../src/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';

async function main() {
    console.log('🔧 Creating Recruitkart Staff Users...\n');

    // Create ADMIN user
    const adminPassword = await bcrypt.hash('admin@recruitkart2024', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@recruitkart.com' },
        update: {
            password_hash: adminPassword,
            role: UserRole.ADMIN,
            verification_status: 'VERIFIED',
        },
        create: {
            email: 'admin@recruitkart.com',
            password_hash: adminPassword,
            role: UserRole.ADMIN,
            verification_status: 'VERIFIED',
        }
    });
    console.log('✅ Admin created: admin@recruitkart.com');

    // Create SUPPORT user
    const supportPassword = await bcrypt.hash('support@recruitkart2024', 10);
    const support = await prisma.user.upsert({
        where: { email: 'support@recruitkart.com' },
        update: {
            password_hash: supportPassword,
            role: UserRole.SUPPORT,
            verification_status: 'VERIFIED',
        },
        create: {
            email: 'support@recruitkart.com',
            password_hash: supportPassword,
            role: UserRole.SUPPORT,
            verification_status: 'VERIFIED',
        }
    });
    console.log('✅ Support created: support@recruitkart.com');

    // Create OPERATOR user
    const operatorPassword = await bcrypt.hash('operator@recruitkart2024', 10);
    const operator = await prisma.user.upsert({
        where: { email: 'operator@recruitkart.com' },
        update: {
            password_hash: operatorPassword,
            role: UserRole.OPERATOR,
            verification_status: 'VERIFIED',
        },
        create: {
            email: 'operator@recruitkart.com',
            password_hash: operatorPassword,
            role: UserRole.OPERATOR,
            verification_status: 'VERIFIED',
        }
    });
    console.log('✅ Operator created: operator@recruitkart.com');

    console.log('\n🎉 Recruitkart Staff Users Created Successfully!');
    console.log('\n🔐 Staff Credentials:');
    console.log('┌─────────────────────────────────────────────────────────┐');
    console.log('│ ADMIN (Full System Access)                             │');
    console.log('│   Email: admin@recruitkart.com                          │');
    console.log('│   Password: admin@recruitkart2024                       │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ SUPPORT (User Verification & Support)                  │');
    console.log('│   Email: support@recruitkart.com                        │');
    console.log('│   Password: support@recruitkart2024                     │');
    console.log('├─────────────────────────────────────────────────────────┤');
    console.log('│ OPERATOR (Platform Operations)                         │');
    console.log('│   Email: operator@recruitkart.com                       │');
    console.log('│   Password: operator@recruitkart2024                    │');
    console.log('└─────────────────────────────────────────────────────────┘\n');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
