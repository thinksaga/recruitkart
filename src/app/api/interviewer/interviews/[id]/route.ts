import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER', 'INTERVIEWER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const interview = await prisma.interview.findUnique({
            where: { id },
            include: {
                submission: {
                    include: {
                        candidate: {
                            include: {
                                experience: true,
                                education: true
                            }
                        },
                        job: true
                    }
                }
            }
        });

        if (!interview) {
            return NextResponse.json({ error: 'Interview not found' }, { status: 404 });
        }

        const formattedInterview = {
            id: interview.id,
            scheduledAt: interview.scheduled_at,
            round: interview.round_type,
            status: interview.status,
            meetingLink: interview.zoom_meeting_id,
            candidate: {
                id: interview.submission.candidate.id,
                name: interview.submission.candidate.full_name,
                email: interview.submission.candidate.email,
                role: interview.submission.job.title,
                experience: interview.submission.candidate.years_of_experience,
                resumeUrl: interview.submission.candidate.resume_url,
                skills: interview.submission.candidate.skills_primary
            },
            feedback: interview.feedback_json
        };

        return NextResponse.json({ interview: formattedInterview });

    } catch (error) {
        console.error('Interview Details Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
