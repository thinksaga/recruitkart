import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params;

        const job = await prisma.job.findUnique({
            where: {
                id,
                organization_id: user.organization_id
            },
            include: {
                _count: {
                    select: { submissions: true }
                }
            }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Fetch candidates for this job
        const submissions = await prisma.submission.findMany({
            where: { job_id: id },
            include: {
                candidate: {
                    select: {
                        full_name: true,
                        email: true,
                        phone: true,
                        years_of_experience: true,
                        skills_primary: true
                    }
                },
                interviews: {
                    orderBy: { created_at: 'desc' },
                    take: 1
                }
            },
            orderBy: { created_at: 'desc' }
        });

        const formattedCandidates = submissions.map(sub => {
            const latestInterview = sub.interviews[0];
            return {
                id: sub.id, // Submission ID
                name: sub.candidate.full_name,
                email: sub.candidate.email,
                phone: sub.candidate.phone,
                experience: sub.candidate.years_of_experience ? `${sub.candidate.years_of_experience} years` : 'Fresher',
                skills: sub.candidate.skills_primary || [],
                status: sub.status,
                stage: latestInterview ? latestInterview.round_type : 'Screening',
                applied: new Date(sub.created_at).toLocaleDateString()
            };
        });

        const formattedJob = {
            id: job.id,
            title: job.title,
            description: job.description,
            status: job.status,
            salary: job.salary_min && job.salary_max
                ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
                : 'Not disclosed',
            location: 'Remote', // Placeholder
            type: 'Full-time', // Placeholder
            posted: new Date(job.created_at).toLocaleDateString(),
            bounty: `₹${job.success_fee_amount.toLocaleString()}`,
            candidatesCount: job._count.submissions
        };

        return NextResponse.json({ job: formattedJob, candidates: formattedCandidates });

    } catch (error) {
        console.error('Job Details Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
