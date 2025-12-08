import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createJobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    salary_min: z.number().min(0, "Minimum salary is required"),
    salary_max: z.number().min(0, "Maximum salary is required"),
    success_fee_amount: z.number().min(0, "Success fee must be non-negative"),
    location: z.string().min(1, "Location is required"),
    job_type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP']),
    work_mode: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
    currency: z.string().default('INR'),
    experience_min: z.number().min(0, "Minimum experience is required"),
    experience_max: z.number().min(0, "Maximum experience is required"),
    skills: z.array(z.string()).min(1, "At least one skill is required"),
    benefits: z.array(z.string()).min(1, "At least one benefit is required"),
    department: z.string().min(1, "Department is required"),
});

// GET: Fetch Company Jobs
export async function GET(request: Request) {
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

        const jobs = await prisma.job.findMany({
            where: { organization_id: user.organization_id },
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: { submissions: true }
                }
            }
        });

        const formattedJobs = jobs.map(job => ({
            ...job,
            salary: job.salary_min && job.salary_max
                ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
                : 'Not disclosed',
            experience: job.experience_min && job.experience_max
                ? `${job.experience_min}-${job.experience_max} Yrs`
                : 'Fresher',
            bounty: `₹${job.success_fee_amount.toLocaleString()}`,
            candidates: job._count.submissions
        }));

        return NextResponse.json({ jobs: formattedJobs });

    } catch (error) {
        console.error('Get Jobs Error:', error);
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

        const body = await request.json();
        const validatedData = createJobSchema.parse(body);

        const newJob = await prisma.job.create({
            data: {
                organization_id: user.organization_id,
                title: validatedData.title,
                description: validatedData.description,
                salary_min: validatedData.salary_min,
                salary_max: validatedData.salary_max,
                success_fee_amount: validatedData.success_fee_amount || 0,
                status: 'DRAFT',
                infra_fee_paid: false,
                location: validatedData.location,
                job_type: validatedData.job_type as any, // Cast to any to avoid enum issues if types aren't perfectly synced yet
                work_mode: validatedData.work_mode as any,
                currency: validatedData.currency,
                experience_min: validatedData.experience_min,
                experience_max: validatedData.experience_max,
                skills: validatedData.skills || [],
                benefits: validatedData.benefits || [],
                department: validatedData.department,
            }
        });

        return NextResponse.json({ success: true, job: newJob });

    } catch (error: any) {
        console.error('Create Job Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
