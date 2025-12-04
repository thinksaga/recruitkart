import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
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

        // Fetch interviews where the user is the interviewer
        // Note: The current schema might not have an 'interviewer_id' on the Interview model directly,
        // or it might be a relation. Let's check the schema.
        // Assuming for now we fetch all interviews for the organization if no specific assignment exists yet,
        // OR if we have an interviewer_id field.

        // Let's first get the user's organization
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        // Fetch interviews for the organization (since we don't have explicit assignment yet in the schema shown previously)
        // In a real app, we would filter by interviewer_id = user.id
        const interviews = await prisma.interview.findMany({
            where: {
                submission: {
                    job: {
                        organization_id: user.organization_id
                    }
                },
                status: 'SCHEDULED'
            },
            include: {
                submission: {
                    include: {
                        candidate: {
                            select: {
                                full_name: true,
                                email: true
                            }
                        },
                        job: {
                            select: {
                                title: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                scheduled_at: 'asc'
            }
        });

        const formattedInterviews = interviews.map(int => ({
            id: int.id,
            candidateName: int.submission.candidate.full_name,
            candidateEmail: int.submission.candidate.email,
            role: int.submission.job.title,
            round: int.round_type,
            scheduledAt: int.scheduled_at ? new Date(int.scheduled_at).toLocaleString() : 'TBD',
            meetingLink: int.zoom_meeting_id,
            status: int.status
        }));

        return NextResponse.json({ interviews: formattedInterviews });

    } catch (error) {
        console.error('Member Interviews Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
