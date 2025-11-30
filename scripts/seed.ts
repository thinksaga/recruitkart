import { PrismaClient, UserRole, JobStatus, SubmissionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Clean up existing data
    await prisma.submission.deleteMany();
    await prisma.interview.deleteMany();
    await prisma.job.deleteMany();
    await prisma.candidate.deleteMany();
    await prisma.tASProfile.deleteMany();
    await prisma.organization.deleteMany();
    await prisma.user.deleteMany();

    const passwordHash = await bcrypt.hash('password123', 10);

    // 2. Create Platform Admin
    const adminUser = await prisma.user.create({
        data: {
            email: 'admin@recruitkart.com',
            password_hash: passwordHash,
            role: UserRole.ADMIN,
            verification_status: 'VERIFIED',
        },
    });
    console.log('✅ Created Admin:', adminUser.email);

    // 2.1 Create Support User
    const supportUser = await prisma.user.create({
        data: {
            email: 'support@recruitkart.com',
            password_hash: passwordHash,
            role: UserRole.SUPPORT,
            verification_status: 'VERIFIED',
        },
    });
    console.log('✅ Created Support:', supportUser.email);

    // 2.2 Create Operator User
    const operatorUser = await prisma.user.create({
        data: {
            email: 'operator@recruitkart.com',
            password_hash: passwordHash,
            role: UserRole.OPERATOR,
            verification_status: 'VERIFIED',
        },
    });
    console.log('✅ Created Operator:', operatorUser.email);

    // 3. Create Company & Company Admin
    const org = await prisma.organization.create({
        data: {
            name: 'Acme Corp',
            domain: 'acme.com',
            website: 'https://acme.com',
        },
    });

    const companyUser = await prisma.user.create({
        data: {
            email: 'hr@acme.com',
            password_hash: passwordHash,
            role: UserRole.COMPANY_ADMIN,
            verification_status: 'VERIFIED',
            organization_id: org.id,
        },
    });
    console.log('✅ Created Company:', org.name);

    // 3.1 Create Company Member
    const companyMember = await prisma.user.create({
        data: {
            email: 'member@acme.com',
            password_hash: passwordHash,
            role: UserRole.COMPANY_MEMBER,
            verification_status: 'VERIFIED',
            organization_id: org.id,
        },
    });
    console.log('✅ Created Company Member:', companyMember.email);

    // 3.2 Create Interviewer
    const interviewer = await prisma.user.create({
        data: {
            email: 'interviewer@acme.com',
            password_hash: passwordHash,
            role: UserRole.INTERVIEWER,
            verification_status: 'VERIFIED',
            organization_id: org.id,
        },
    });
    console.log('✅ Created Interviewer:', interviewer.email);

    // 3.3 Create Decision Maker
    const decisionMaker = await prisma.user.create({
        data: {
            email: 'decision@acme.com',
            password_hash: passwordHash,
            role: UserRole.DECISION_MAKER,
            verification_status: 'VERIFIED',
            organization_id: org.id,
        },
    });
    console.log('✅ Created Decision Maker:', decisionMaker.email);

    // 4. Create TAS (Agency)
    const tasUser = await prisma.user.create({
        data: {
            email: 'agency@tas.com',
            password_hash: passwordHash,
            role: UserRole.TAS,
            verification_status: 'VERIFIED',
        },
    });

    const tasProfile = await prisma.tASProfile.create({
        data: {
            user_id: tasUser.id,
            pan_number: 'ABCDE1234F',
            credits_balance: 100,
        },
    });
    console.log('✅ Created TAS:', tasUser.email);

    // 5. Create Candidate (Linked to User)
    const candidateUser = await prisma.user.create({
        data: {
            email: 'john@doe.com',
            password_hash: passwordHash,
            role: UserRole.CANDIDATE,
            verification_status: 'VERIFIED',
        },
    });

    const candidate = await prisma.candidate.create({
        data: {
            user_id: candidateUser.id,
            full_name: 'John Doe',
            email: 'john@doe.com',
            phone: '+919876543210',
            skills_primary: ['React', 'Node.js', 'TypeScript'],
            personal_details: {
                current_location: 'Bangalore',
                notice_period: 'IMMEDIATE',
            },
        },
    });
    console.log('✅ Created Candidate:', candidate.full_name);

    // 6. Create a Job
    const job = await prisma.job.create({
        data: {
            organization_id: org.id,
            title: 'Senior Frontend Engineer',
            description: 'We are looking for a React expert.',
            salary_min: 2000000,
            salary_max: 3500000,
            status: JobStatus.OPEN,
            success_fee_amount: 50000,
            infra_fee_paid: true,
        },
    });
    console.log('✅ Created Job:', job.title);

    // 7. Create a Submission (TAS submits Candidate to Job)
    const submission = await prisma.submission.create({
        data: {
            job_id: job.id,
            tas_id: tasProfile.id,
            candidate_id: candidate.id,
            status: SubmissionStatus.PENDING_CONSENT,
        },
    });
    console.log('✅ Created Submission:', submission.id);

    console.log('🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
