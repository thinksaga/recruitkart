import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { SubmissionStatus } from '@prisma/client';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER', 'DECISION_MAKER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch user's organization
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        // Fetch submissions that are in 'INTERVIEWING' status and have completed interviews
        // For simplicity in this demo, we'll fetch all 'INTERVIEWING' candidates
        // In a real app, we'd check if they passed all required rounds.
        const submissions = await prisma.submission.findMany({
            where: {
                job: {
                    organization_id: user.organization_id
                },
                status: 'INTERVIEWING'
            },
            include: {
                candidate: {
                    select: {
                        id: true,
                        full_name: true,
                        email: true,
                        years_of_experience: true,
                        skills_primary: true
                    }
                },
                job: {
                    select: {
                        title: true,
                        salary_min: true,
                        salary_max: true
                    }
                },
                interviews: {
                    select: {
                        round_type: true,
                        outcome: true,
                        feedback_json: true
                    }
                }
            }
        });

        // Filter for candidates who have at least one passed interview and no rejections (simple logic)
        const readyForApproval = submissions.filter(sub => {
            const hasPassed = sub.interviews.some(int => int.outcome === 'PASSED');
            const hasRejected = sub.interviews.some(int => int.outcome === 'REJECTED');
            return hasPassed && !hasRejected;
        });

        const formattedCandidates = readyForApproval.map(sub => ({
            id: sub.id, // Submission ID is used for approval
            candidateId: sub.candidate.id,
            name: sub.candidate.full_name,
            role: sub.job.title,
            experience: sub.candidate.years_of_experience,
            salary: sub.job.salary_min && sub.job.salary_max
                ? `$${sub.job.salary_min.toLocaleString()} - $${sub.job.salary_max.toLocaleString()}`
                : 'Not specified',
            skills: sub.candidate.skills_primary,
            interviewSummary: sub.interviews.map(int => ({
                round: int.round_type,
                outcome: int.outcome,
                rating: (int.feedback_json as any)?.rating
            }))
        }));

        return NextResponse.json({ candidates: formattedCandidates });

    } catch (error) {
        console.error('Approvals Fetch Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['COMPANY_ADMIN', 'DECISION_MAKER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { submissionId, decision, notes } = body; // decision: 'HIRE' | 'REJECT'

        if (!submissionId || !decision) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newStatus = decision === 'HIRE' ? 'HIRED' : 'REJECTED';

        // Update submission status
        const updatedSubmission = await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: newStatus as SubmissionStatus
                // We could also store the decision notes in a separate table or a JSON field
            }
        });

        return NextResponse.json({ success: true, submission: updatedSubmission });

    } catch (error) {
        console.error('Decision Submission Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
