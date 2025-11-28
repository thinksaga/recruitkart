import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

interface JWTPayload {
    userId: string;
    role: string;
    organizationId?: string;
    verificationStatus: string;
}

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token) as JWTPayload | null;
        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.userId;
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const location = searchParams.get('location');
        const workMode = searchParams.get('workMode');
        const minSalary = searchParams.get('minSalary') ? parseInt(searchParams.get('minSalary')!) : null;
        const maxSalary = searchParams.get('maxSalary') ? parseInt(searchParams.get('maxSalary')!) : null;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Build where clause for available jobs
        const where: any = {
            status: 'OPEN', // Only show open jobs
        };

        // Add search filters
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { skills_required: { hasSome: [search] } },
            ];
        }

        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }

        if (workMode) {
            where.work_mode = workMode.toUpperCase();
        }

        if (minSalary !== null) {
            where.salary_min = { gte: minSalary };
        }

        if (maxSalary !== null) {
            where.salary_max = { lte: maxSalary };
        }

        // Get jobs with pagination
        const [jobs, totalCount] = await Promise.all([
            prisma.job.findMany({
                where,
                include: {
                    organization: {
                        select: {
                            id: true,
                            display_name: true,
                            logo_url: true,
                        },
                    },
                    _count: {
                        select: {
                            submissions: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
                skip: offset,
                take: limit,
            }),
            prisma.job.count({ where }),
        ]);

        // Check which jobs the TAS has already submitted to
        const jobIds = jobs.map(job => job.id);
        const existingSubmissions = await prisma.submission.findMany({
            where: {
                tas_id: userId,
                job_id: { in: jobIds },
            },
            select: {
                job_id: true,
                status: true,
            },
        });

        const submissionMap = existingSubmissions.reduce((acc, sub) => {
            acc[sub.job_id] = sub.status;
            return acc;
        }, {} as Record<string, string>);

        const formattedJobs = jobs.map(job => ({
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            workMode: job.work_mode,
            salaryRange: `${job.currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`,
            skills: job.skills_required,
            experienceRequired: `${job.experience_min} - ${job.experience_max} years`,
            company: {
                id: job.organization.id,
                name: job.organization.display_name,
                logo: job.organization.logo_url,
            },
            submissionCount: job._count.submissions,
            hasSubmitted: !!submissionMap[job.id],
            submissionStatus: submissionMap[job.id] || null,
            createdAt: job.created_at,
        }));

        return NextResponse.json({
            jobs: formattedJobs,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });

    } catch (error) {
        console.error('Error fetching TAS jobs:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST endpoint for submitting to a job
export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token) as JWTPayload | null;
        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.userId;
        const body = await request.json();
        const { jobId, candidateId, notes } = body;

        if (!jobId || !candidateId) {
            return NextResponse.json({ error: 'Job ID and Candidate ID are required' }, { status: 400 });
        }

        // Verify the job exists and is open
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job || job.status !== 'OPEN') {
            return NextResponse.json({ error: 'Job not found or not available' }, { status: 404 });
        }

        // Verify the candidate exists and belongs to this TAS
        const candidate = await prisma.candidate.findUnique({
            where: { id: candidateId },
        });

        if (!candidate) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }

        // Check if TAS has already submitted this candidate for this job
        const existingSubmission = await prisma.submission.findUnique({
            where: {
                job_id_candidate_id: {
                    job_id: jobId,
                    candidate_id: candidateId,
                },
            },
        });

        if (existingSubmission) {
            return NextResponse.json({ error: 'Candidate already submitted for this job' }, { status: 409 });
        }

        // Check TAS credits balance
        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: userId },
        });

        if (!tasProfile || tasProfile.credits_balance < 1) {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
        }

        // Create the submission
        const submission = await prisma.submission.create({
            data: {
                job_id: jobId,
                job_snapshot_id: jobId, // Using job ID as snapshot for now
                tas_id: userId,
                candidate_id: candidateId,
                status: 'PENDING_CONSENT',
                tas_notes: notes,
                locked_until: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours from now
            },
        });

        // Deduct credits
        await prisma.tASProfile.update({
            where: { user_id: userId },
            data: {
                credits_balance: tasProfile.credits_balance - 1,
            },
        });

        // Create credit transaction record
        await prisma.creditTransaction.create({
            data: {
                tas_id: userId,
                type: 'CREDIT_USAGE',
                amount: -1,
                description: `Submission for job: ${job.title}`,
                balance_after: tasProfile.credits_balance - 1,
            },
        });

        return NextResponse.json({
            message: 'Submission created successfully',
            submission: {
                id: submission.id,
                status: submission.status,
                lockedUntil: submission.locked_until,
            },
        });

    } catch (error) {
        console.error('Error creating job submission:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}