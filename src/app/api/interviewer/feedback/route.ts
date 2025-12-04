import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { InterviewOutcome, InterviewStatus } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER', 'INTERVIEWER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { interviewId, outcome, rating, notes, strengths, weaknesses } = body;

        if (!interviewId || !outcome || !rating) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Update the interview with feedback
        const updatedInterview = await prisma.interview.update({
            where: { id: interviewId },
            data: {
                status: InterviewStatus.COMPLETED,
                outcome: outcome as InterviewOutcome,
                feedback_json: {
                    rating,
                    notes,
                    strengths,
                    weaknesses,
                    submittedAt: new Date().toISOString(),
                    submittedBy: payload.userId as string
                }
            }
        });

        // If interview passed, we might want to update candidate status or trigger next steps
        // For now, we just update the interview.

        return NextResponse.json({ success: true, interview: updatedInterview });

    } catch (error) {
        console.error('Feedback Submission Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
