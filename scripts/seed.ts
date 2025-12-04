import 'dotenv/config';
import { PrismaClient, UserRole, JobStatus, SubmissionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';



const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const dbUrl = process.env.DATABASE_URL;
    console.log('🌱 Starting seed...');
    console.log('Using DATABASE_URL:', dbUrl ? dbUrl.replace(/:[^:]+@/, ':****@') : 'UNDEFINED');

    // 1. Clean up existing data
    await prisma.auditLog.deleteMany();
    await prisma.ticket.deleteMany();
    await prisma.escrowTransaction.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.payout.deleteMany();
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
            phone: '+1234567890',
            is_active: true,
            preferences: { theme: 'dark', notifications: true },
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
            phone: '+1234567891',
            is_active: true,
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
            phone: '+1234567892',
            is_active: true,
        },
    });
    console.log('✅ Created Operator:', operatorUser.email);

    // 3. Create Company & Company Admin
    const org = await prisma.organization.create({
        data: {
            name: 'Acme Corp',
            domain: 'acme.com',
            website: 'https://acme.com',
            description: 'Leading provider of road runner catching solutions.',
            industry: 'Manufacturing',
            size: '500+',
            founded_year: 1950,
            address: {
                street: '123 Canyon Road',
                city: 'Desert City',
                state: 'Arizona',
                country: 'USA',
                zip: '85001'
            },
            social_links: {
                linkedin: 'https://linkedin.com/company/acme',
                twitter: 'https://twitter.com/acme'
            },
            branding_color: '#ef4444', // Red-500
        },
    });

    const companyUser = await prisma.user.create({
        data: {
            email: 'hr@acme.com',
            password_hash: passwordHash,
            role: UserRole.COMPANY_ADMIN,
            verification_status: 'VERIFIED',
            organization_id: org.id,
            phone: '+1234567893',
            is_active: true,
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
            phone: '+1234567894',
            is_active: true,
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
            phone: '+1234567895',
            is_active: true,
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
            phone: '+1234567896',
            is_active: true,
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
            phone: '+1234567897',
            is_active: true,
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
            phone: '+919876543210',
            is_active: true,
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
                ctc: '2500000',
                expected_ctc: '3500000',
            },
            bio: 'Experienced Full Stack Developer with a focus on React and Node.js ecosystem.',
            years_of_experience: 5.5,
            experience: {
                create: [
                    {
                        company: 'Tech Solutions Inc',
                        role: 'Senior Frontend Engineer',
                        location: 'Bangalore',
                        start_date: new Date('2022-01-01'),
                        is_current: true,
                        description: 'Leading the frontend team and migrating legacy app to Next.js.',
                        skills_used: ['React', 'Next.js', 'TypeScript', 'TailwindCSS'],
                    },
                    {
                        company: 'WebCorp',
                        role: 'Software Engineer',
                        location: 'Hyderabad',
                        start_date: new Date('2019-06-01'),
                        end_date: new Date('2021-12-31'),
                        is_current: false,
                        description: 'Developed scalable web applications using MERN stack.',
                        skills_used: ['MongoDB', 'Express', 'React', 'Node.js'],
                    }
                ]
            },
            education: {
                create: [
                    {
                        institution: 'IIT Madras',
                        degree: 'B.Tech',
                        field_of_study: 'Computer Science',
                        start_date: new Date('2015-08-01'),
                        end_date: new Date('2019-05-01'),
                        grade: '8.5 CGPA',
                    }
                ]
            },
            projects: {
                create: [
                    {
                        title: 'E-commerce Platform',
                        description: 'Built a full-featured e-commerce platform with payment gateway integration.',
                        url: 'https://github.com/johndoe/ecommerce',
                        skills_used: ['React', 'Stripe', 'Node.js'],
                    }
                ]
            },
            languages: {
                create: [
                    { language: 'English', proficiency: 'Professional' },
                    { language: 'Hindi', proficiency: 'Native' }
                ]
            }
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

    // Create Financial Controller
    const financialController = await prisma.user.upsert({
        where: { email: 'finance@recruitkart.com' },
        update: {},
        create: {
            email: 'finance@recruitkart.com',
            role: UserRole.FINANCIAL_CONTROLLER,
            password_hash: passwordHash,
            verification_status: 'VERIFIED',
        },
    });
    console.log('✅ Created Financial Controller:', financialController.email);

    // Create Compliance Officer
    const complianceOfficer = await prisma.user.upsert({
        where: { email: 'compliance@recruitkart.com' },
        update: {},
        create: {
            email: 'compliance@recruitkart.com',
            role: UserRole.COMPLIANCE_OFFICER,
            password_hash: passwordHash,
            verification_status: 'VERIFIED',
        },
    });
    console.log('✅ Created Compliance Officer:', complianceOfficer.email);

    // 8. Create Invoices
    await prisma.invoice.createMany({
        data: [
            {
                organization_id: org.id,
                amount: 50000,
                due_date: new Date(new Date().setDate(new Date().getDate() + 7)),
                status: 'SENT',
            },
            {
                organization_id: org.id,
                amount: 75000,
                due_date: new Date(new Date().setDate(new Date().getDate() - 5)),
                status: 'OVERDUE',
            }
        ]
    });
    console.log('✅ Created Invoices');

    // 9. Create Payouts
    await prisma.payout.create({
        data: {
            tas_id: tasProfile.id,
            amount: 25000,
            status: 'PENDING',
            notes: 'Commission for placement',
        }
    });
    console.log('✅ Created Payouts');

    // 10. Create Escrow Transactions
    await prisma.escrowTransaction.create({
        data: {
            job_id: job.id,
            amount: 50000,
            status: 'HELD',
            description: 'Success fee deposit',
        }
    });
    console.log('✅ Created Escrow Transactions');

    // 11. Create Audit Logs
    await prisma.auditLog.createMany({
        data: [
            {
                user_id: adminUser.id,
                action: 'USER_VERIFICATION_VERIFIED',
                entity_type: 'USER',
                entity_id: tasUser.id,
                details: { reason: 'Documents verified' },
            },
            {
                user_id: complianceOfficer.id,
                action: 'COMPLIANCE_CHECK_PASSED',
                entity_type: 'ORGANIZATION',
                entity_id: org.id,
            }
        ]
    });
    console.log('✅ Created Audit Logs');

    // 12. Create Support Tickets
    await prisma.ticket.create({
        data: {
            raised_by_id: companyUser.id,
            reason: 'Billing Issue: Unable to download invoice for last month.',
            status: 'OPEN',
        }
    });
    console.log('✅ Created Support Tickets');

    console.log('🌱 Seeding completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
