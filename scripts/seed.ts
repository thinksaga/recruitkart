import prisma from '../src/lib/prisma';
import * as bcrypt from 'bcryptjs';
import {
    UserRole,
    JobStatus,
    SubmissionStatus,
    InterviewStatus,
    InterviewOutcome,
    TicketStatus,
    VerificationStatus,
    WorkMode,
    TicketCategory
} from '@prisma/client';

async function main() {
    console.log('🌱 Seeding database with rich test data (Schema v7)...\n');

    const hashedPassword = await bcrypt.hash('password123', 10);

    // --- 1. Organizations ---
    const org1 = await prisma.organization.upsert({
        where: { id: 'org-1' },
        update: {},
        create: {
            id: 'org-1',
            legal_name: 'Acme Corp Private Limited',
            display_name: 'Acme Corp',
            gstin: '29ABCDE1234F1Z5',
            domain: 'acmecorp.com',
            website: 'https://acmecorp.com',
            logo_url: 'https://ui-avatars.com/api/?name=Acme+Corp&background=0D8ABC&color=fff',
            is_verified: true,
            address_line1: '123 Tech Park, Indiranagar',
            city: 'Bangalore',
            state_code: '29',
            pincode: '560038'
        }
    });

    const org2 = await prisma.organization.upsert({
        where: { id: 'org-2' },
        update: {},
        create: {
            id: 'org-2',
            legal_name: 'TechFlow Solutions LLP',
            display_name: 'TechFlow',
            gstin: '27XYZDE1234F1Z9',
            domain: 'techflow.io',
            website: 'https://techflow.io',
            logo_url: 'https://ui-avatars.com/api/?name=TechFlow&background=6366f1&color=fff',
            is_verified: true,
            address_line1: '45 FinTech Hub, BKC',
            city: 'Mumbai',
            state_code: '27',
            pincode: '400051'
        }
    });
    console.log('✅ Organizations created');

    // --- 2. Users (Company & TAS) ---

    // Company Users
    await prisma.user.upsert({
        where: { email: 'admin@acme.com' },
        update: {},
        create: {
            email: 'admin@acme.com',
            password_hash: hashedPassword,
            role: UserRole.COMPANY_ADMIN,
            verification_status: VerificationStatus.VERIFIED,
            organization_id: org1.id,
            is_active: true
        }
    });

    // TAS Users - Need to capture PROFILE IDs for submissions
    const tas1User = await prisma.user.upsert({
        where: { email: 'recruiter1@agency.com' },
        update: {},
        create: {
            email: 'recruiter1@agency.com',
            password_hash: hashedPassword,
            role: UserRole.TAS,
            verification_status: VerificationStatus.VERIFIED,
            is_active: true
        }
    });

    const tas1Profile = await prisma.tASProfile.upsert({
        where: { user_id: tas1User.id },
        update: {},
        create: {
            user_id: tas1User.id,
            full_name: 'Rahul Recruiter',
            pan_number: 'ABCDE1234F',
            linkedin_url: 'https://linkedin.com/in/recruiter1',
            credits_balance: 50,
            reputation_score: 4.8
        }
    });

    const tas2User = await prisma.user.upsert({
        where: { email: 'recruiter2@agency.com' },
        update: {},
        create: {
            email: 'recruiter2@agency.com',
            password_hash: hashedPassword,
            role: UserRole.TAS,
            verification_status: VerificationStatus.VERIFIED,
            is_active: true
        }
    });

    const tas2Profile = await prisma.tASProfile.upsert({
        where: { user_id: tas2User.id },
        update: {},
        create: {
            user_id: tas2User.id,
            full_name: 'Priya Headhunter',
            pan_number: 'FGHIJ5678K',
            linkedin_url: 'https://linkedin.com/in/recruiter2',
            credits_balance: 25,
            reputation_score: 4.2
        }
    });

    console.log('✅ Users created');

    // --- 3. Jobs ---
    const jobs = [
        { id: 'job-1', orgId: org1.id, title: 'Senior Frontend Engineer', min: 1500000, max: 2500000, status: JobStatus.OPEN, fee: 200000, location: 'Bangalore', work_mode: WorkMode.REMOTE, exp_min: 5, exp_max: 8 },
        { id: 'job-2', orgId: org1.id, title: 'Product Manager', min: 2000000, max: 3500000, status: JobStatus.OPEN, fee: 300000, location: 'Mumbai', work_mode: WorkMode.HYBRID, exp_min: 4, exp_max: 7 },
        { id: 'job-3', orgId: org2.id, title: 'DevOps Engineer', min: 1800000, max: 2800000, status: JobStatus.OPEN, fee: 250000, location: 'Pune', work_mode: WorkMode.ONSITE, exp_min: 3, exp_max: 6 },
        { id: 'job-4', orgId: org2.id, title: 'Backend Developer', min: 2500000, max: 4500000, status: JobStatus.FILLED, fee: 400000, location: 'Remote', work_mode: WorkMode.REMOTE, exp_min: 6, exp_max: 10 }
    ];

    for (const job of jobs) {
        await prisma.job.upsert({
            where: { id: job.id },
            update: {},
            create: {
                id: job.id,
                organization_id: job.orgId,
                title: job.title,
                description: 'Job description goes here...',
                salary_min: job.min,
                salary_max: job.max,
                status: job.status,
                infra_fee_paid: true,
                success_fee_amount: job.fee,
                location: job.location,
                work_mode: job.work_mode,
                experience_min: job.exp_min,
                experience_max: job.exp_max,
                skills_required: ['React', 'Node.js']
            }
        });

        // Create JobSnapshot
        const snapshotId = `snapshot-${job.id}`;
        await prisma.jobSnapshot.upsert({
            where: { id: snapshotId },
            update: {},
            create: {
                id: snapshotId,
                job_id: job.id,
                success_fee_amount: job.fee,
                salary_range: `${job.min}-${job.max}`
            }
        });
    }
    console.log('✅ Jobs & Snapshots created');

    // --- 4. Candidates ---
    const candidatesData = [
        { id: 'cand-1', name: 'Rahul Sharma', email: 'rahul.s@example.com', phone: '+919876543210' },
        { id: 'cand-2', name: 'Priya Patel', email: 'priya.p@example.com', phone: '+919876543211' },
        { id: 'cand-3', name: 'Amit Kumar', email: 'amit.k@example.com', phone: '+919876543212' },
        { id: 'cand-4', name: 'Sneha Gupta', email: 'sneha.g@example.com', phone: '+919876543213' }
    ];

    for (const cand of candidatesData) {
        await prisma.candidate.upsert({
            where: { email: cand.email },
            update: {},
            create: {
                id: cand.id,
                full_name: cand.name,
                email: cand.email,
                phone: cand.phone,
                skills_primary: ['React', 'Node.js'],
                work_history: [],
                personal_details: { current_location: 'Bangalore', notice_period: 30, current_ctc: 1200000 }
            }
        });
    }
    console.log('✅ Candidates created');

    // --- 5. Submissions ---
    // FIX: Using TAS Profile ID (tas1Profile.id) instead of User ID
    const submissions = [
        { jobId: 'job-1', candId: 'cand-1', tasProfileId: tas1Profile.id, status: SubmissionStatus.INTERVIEWING },
        { jobId: 'job-2', candId: 'cand-2', tasProfileId: tas2Profile.id, status: SubmissionStatus.ACTIVE },
        { jobId: 'job-3', candId: 'cand-3', tasProfileId: tas1Profile.id, status: SubmissionStatus.HIRED },
        { jobId: 'job-4', candId: 'cand-4', tasProfileId: tas2Profile.id, status: SubmissionStatus.REJECTED_BY_CANDIDATE }
    ];

    for (const sub of submissions) {
        const existing = await prisma.submission.findUnique({
            where: {
                job_id_candidate_id: {
                    job_id: sub.jobId,
                    candidate_id: sub.candId
                }
            }
        });

        if (!existing) {
            const snapshotId = `snapshot-${sub.jobId}`;

            const submission = await prisma.submission.create({
                data: {
                    job_id: sub.jobId,
                    candidate_id: sub.candId,
                    tas_id: sub.tasProfileId, // FIXED: Using Profile ID
                    status: sub.status,
                    job_snapshot_id: snapshotId,
                    locked_at: new Date()
                }
            });

            // --- 6. Interviews ---
            if (sub.status === SubmissionStatus.INTERVIEWING || sub.status === SubmissionStatus.HIRED) {
                await prisma.interview.create({
                    data: {
                        submission_id: submission.id,
                        round_number: 1,
                        round_type: 'Technical Round 1',
                        status: InterviewStatus.COMPLETED,
                        outcome: InterviewOutcome.PASSED,
                        feedback_json: { rating: 4, comments: 'Strong technical skills.' },
                        scheduled_at: new Date(Date.now() - 86400000),
                    }
                });
            }
        }
    }
    console.log('✅ Submissions & Interviews created');

    console.log('\n🎉 Rich Seeding Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });