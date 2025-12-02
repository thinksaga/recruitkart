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

        const interviews = await prisma.interview.findMany({
            where: {
                submission: {
                    tas_id: tasProfile.id
                }
            },
            include: {
                submission: {
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
                        }
                    }
                }
            },
            orderBy: {
                scheduled_at: 'asc' // Upcoming first
            }
        });

        const formattedInterviews = interviews.map(interview => ({
            id: interview.id,
            candidate: interview.submission.candidate.full_name,
            job: interview.submission.job.title,
            company: interview.submission.job.organization.name,
            date: interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleDateString() : 'TBD',
            time: interview.scheduled_at ? new Date(interview.scheduled_at).toLocaleTimeString() : 'TBD',
            type: interview.round_type,
            platform: 'Zoom', // Mock or add to schema
            interviewer: 'Hiring Manager', // Mock or add to schema
            status: interview.status
        }));

        return NextResponse.json({ interviews: formattedInterviews });

    } catch (error) {
        console.error('TAS Interviews Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
