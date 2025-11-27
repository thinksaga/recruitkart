import prisma from '../src/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { UserRole, JobStatus, SubmissionStatus } from '@prisma/client';

async function main() {
    console.log('🌱 Seeding database...\n');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // 1. Create Organization
    const org = await prisma.organization.upsert({
        where: { id: 'test-org-1' },
        update: {},
        create: {
            id: 'test-org-1',
            name: 'Test Company Inc',
            gstin: '29ABCDE1234F1Z5',
            domain: 'testcompany.com',
            website: 'https://testcompany.com',
        }
    });
    console.log(`✅ Organization: ${org.name}`);

    // 2. Create Company Admin
    const admin = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {},
        create: {
            email: 'admin@test.com',
            password_hash: hashedPassword,
            role: UserRole.COMPANY_ADMIN,
            verification_status: 'VERIFIED',
            organization_id: org.id,
        }
    });
    console.log(`✅ Admin: ${admin.email}`);

    // 3. Create TAS users
    const tas1 = await prisma.user.upsert({
        where: { email: 'tas1@test.com' },
        update: {},
        create: {
            email: 'tas1@test.com',
            password_hash: hashedPassword,
            role: UserRole.TAS,
            verification_status: 'VERIFIED',
        }
    });

    await prisma.tASProfile.upsert({
        where: { user_id: tas1.id },
        update: {},
        create: {
            user_id: tas1.id,
            pan_number: 'ABCDE1234F',
            linkedin_url: 'https://linkedin.com/in/tas1',
            credits_balance: 10,
        }
    });
    console.log(`✅ TAS (Verified): ${tas1.email}`);

    const tas2 = await prisma.user.upsert({
        where: { email: 'tas2@test.com' },
        update: {},
        create: {
            email: 'tas2@test.com',
            password_hash: hashedPassword,
            role: UserRole.TAS,
            verification_status: 'PENDING',
        }
    });

    await prisma.tASProfile.upsert({
        where: { user_id: tas2.id },
        update: {},
        create: {
            user_id: tas2.id,
            pan_number: 'BCDEF5678G',
            credits_balance: 5,
        }
    });
    console.log(`✅ TAS (Pending): ${tas2.email}`);

    // 4. Create Jobs
    const job1 = await prisma.job.upsert({
        where: { id: 'test-job-1' },
        update: {},
        create: {
            id: 'test-job-1',
            organization_id: org.id,
            title: 'Senior Full Stack Engineer',
            description: 'Looking for experienced full stack developers',
            salary_min: 120000,
            salary_max: 180000,
            status: JobStatus.OPEN,
            infra_fee_paid: true,
            success_fee_amount: 15000,
        }
    });
    console.log(`✅ Job: ${job1.title}`);

    console.log('\n🎉 Seeding complete!');
    console.log('\n🔐 Test Credentials (password: password123):');
    console.log('  - admin@test.com (Company Admin, Verified)');
    console.log('  - tas1@test.com (TAS, Verified)');
    console.log('  - tas2@test.com (TAS, Pending)\n');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
