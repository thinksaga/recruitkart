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

        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const orgId = user.organization_id;

        // Fetch stats in parallel
        const [activeJobs, totalCandidates, interviewsScheduled, hires] = await Promise.all([
            prisma.job.count({
                where: {
                    organization_id: orgId,
                    status: 'OPEN'
                }
            }),
            prisma.submission.count({
                where: {
                    job: { organization_id: orgId }
                }
            }),
            prisma.interview.count({
                where: {
                    submission: { job: { organization_id: orgId } },
                    status: 'SCHEDULED'
                }
            }),
            prisma.submission.count({
                where: {
                    job: { organization_id: orgId },
                    status: 'HIRED' // Assuming HIRED is a valid status, will verify with enums
                }
            })
        ]);

        return NextResponse.json({
            stats: {
                activeJobs,
                totalCandidates,
                interviewsScheduled,
                hires
            }
        });

    } catch (error) {
        console.error('Company Stats Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
