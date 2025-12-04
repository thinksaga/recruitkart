import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get TAS Profile ID
        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: payload.userId as string },
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS Profile not found' }, { status: 404 });
        }

        const submissions = await prisma.submission.findMany({
            where: {
                tas_id: tasProfile.id,
            },
            include: {
                job: {
                    include: {
                        organization: {
                            select: { name: true }
                        }
                    }
                },
                candidate: {
                    select: { full_name: true }
                },
                interviews: {
                    orderBy: { created_at: 'desc' },
                    take: 1
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        const formattedSubmissions = submissions.map(sub => {
            const latestInterview = sub.interviews[0];
            return {
                id: sub.id,
                candidate: sub.candidate.full_name,
                job: sub.job.title,
                company: sub.job.organization.name,
                status: sub.status, // Use enum value directly or map it
                submitted: new Date(sub.created_at).toLocaleDateString(),
                stage: latestInterview ? latestInterview.round_type : 'Screening',
                feedback: latestInterview ? latestInterview.outcome : 'Pending'
            };
        });

        return NextResponse.json({ submissions: formattedSubmissions });

    } catch (error) {
        console.error('TAS Submissions Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

const submitCandidateSchema = z.object({
    job_id: z.string().uuid(),
    candidate_id: z.string().uuid(),
});

const SUBMISSION_COST = 10;

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { job_id, candidate_id } = submitCandidateSchema.parse(body);

        const result = await prisma.$transaction(async (tx) => {
            const tasProfile = await tx.tASProfile.findUnique({
                where: { user_id: payload.userId as string }
            });

            if (!tasProfile) {
                throw new Error('TAS Profile not found');
            }

            if (tasProfile.credits_balance < SUBMISSION_COST) {
                throw new Error('Insufficient credits');
            }

            // Check if already submitted
            const existingSubmission = await tx.submission.findUnique({
                where: {
                    job_id_candidate_id: {
                        job_id,
                        candidate_id
                    }
                }
            });

            if (existingSubmission) {
                throw new Error('Candidate already submitted to this job');
            }

            // Create submission
            const submission = await tx.submission.create({
                data: {
                    job_id,
                    candidate_id,
                    tas_id: tasProfile.id,
                    status: 'PENDING_CONSENT'
                }
            });

            // Deduct credits
            await tx.tASProfile.update({
                where: { id: tasProfile.id },
                data: {
                    credits_balance: { decrement: SUBMISSION_COST }
                }
            });

            // Record transaction
            await tx.creditTransaction.create({
                data: {
                    tas_id: tasProfile.id,
                    type: 'DEBIT',
                    amount: -SUBMISSION_COST,
                    description: `Submission for Job ID: ${job_id}`,
                    status: 'COMPLETED'
                }
            });

            return submission;
        });

        return NextResponse.json({ success: true, submission: result });

    } catch (error: any) {
        console.error('Submission Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        if (error.message === 'Insufficient credits') {
            return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 });
        }
        if (error.message === 'Candidate already submitted to this job') {
            return NextResponse.json({ error: 'Candidate already submitted' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
