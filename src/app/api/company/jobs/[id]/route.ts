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
            department: job.department,
            status: job.status,
            salary_min: job.salary_min,
            salary_max: job.salary_max,
            salary: job.salary_min && job.salary_max
                ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
                : 'Not disclosed',
            location: job.location || 'Remote',
            type: job.job_type,
            work_mode: job.work_mode,
            experience_min: job.experience_min,
            experience_max: job.experience_max,
            experience: job.experience_min && job.experience_max ? `${job.experience_min}-${job.experience_max} Yrs` : 'Fresher',
            skills: job.skills,
            benefits: job.benefits,
            posted: new Date(job.created_at).toLocaleDateString(),
            bounty: `₹${job.success_fee_amount.toLocaleString()}`,
            success_fee_amount: job.success_fee_amount,
            candidatesCount: job._count.submissions
        };

        return NextResponse.json({ job: formattedJob, candidates: formattedCandidates });

    } catch (error) {
        console.error('Job Details Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(
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

        const { id } = await params;
        const data = await request.json();

        // Validate ownership
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const job = await prisma.job.findUnique({
            where: { id, organization_id: user.organization_id }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found or access denied' }, { status: 404 });
        }

        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                title: data.title,
                department: data.department,
                location: data.location,
                job_type: data.type,
                work_mode: data.work_mode,
                experience_min: Number(data.experience_min),
                experience_max: Number(data.experience_max),
                skills: typeof data.skills === 'string' ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(data.skills) ? data.skills : []),
                benefits: typeof data.benefits === 'string' ? data.benefits.split(',').map((s: string) => s.trim()).filter(Boolean) : (Array.isArray(data.benefits) ? data.benefits : []),
                salary_min: Number(data.salary_min),
                salary_max: Number(data.salary_max),
                description: data.description,
                success_fee_amount: Number(data.success_fee_amount),
            }
        });

        return NextResponse.json({ success: true, job: updatedJob });

    } catch (error) {
        console.error('Update Job Error:', error);
        return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }
}

export async function DELETE(
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
        if (!payload || !['COMPANY_ADMIN'].includes(payload.role as string)) {
            // Only Admins can delete
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;

        // Validate ownership
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const job = await prisma.job.findUnique({
            where: { id, organization_id: user.organization_id }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found or access denied' }, { status: 404 });
        }

        // 5. Manual Cascade Delete
        // First, fetch all submissions to delete their interviews
        const submissions = await prisma.submission.findMany({
            where: { job_id: id },
            select: { id: true }
        });

        const submissionIds = submissions.map(s => s.id);

        await prisma.$transaction([
            // Delete Interviews for these submissions
            prisma.interview.deleteMany({
                where: { submission_id: { in: submissionIds } }
            }),
            // Delete Submissions
            prisma.submission.deleteMany({
                where: { job_id: id }
            }),
            // Delete Escrow Transactions
            prisma.escrowTransaction.deleteMany({
                where: { job_id: id }
            }),
            // Delete Escrow Ledger
            prisma.escrowLedger.deleteMany({
                where: { job_id: id }
            }),
            // Delete Tickets
            prisma.ticket.deleteMany({
                where: { related_job_id: id }
            }),
            // Finally, Delete Job
            prisma.job.delete({
                where: { id }
            })
        ]);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Delete Job Error:', error);
        return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }
}
