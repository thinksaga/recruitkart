import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const createJobSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    salary_min: z.number().min(0),
    salary_max: z.number().min(0),
    success_fee_amount: z.number().min(0),
    location: z.string().optional(), // Not in schema yet, but good to have for validation if added later
    type: z.string().optional(), // e.g., Full-time, Contract
    skills: z.array(z.string()).optional()
});

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

        const jobs = await prisma.job.findMany({
            where: {
                organization_id: user.organization_id
            },
            orderBy: {
                created_at: 'desc'
            },
            include: {
                _count: {
                    select: { submissions: true }
                }
            }
        });

        const formattedJobs = jobs.map(job => ({
            id: job.id,
            title: job.title,
            status: job.status,
            posted: new Date(job.created_at).toLocaleDateString(),
            candidates: job._count.submissions,
            salary: job.salary_min && job.salary_max
                ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
                : 'Not disclosed',
            location: 'Remote' // Placeholder
        }));

        return NextResponse.json({ jobs: formattedJobs });

    } catch (error) {
        console.error('Company Jobs Error:', error);
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
                success_fee_amount: validatedData.success_fee_amount,
                status: 'OPEN', // Default to OPEN for now
                infra_fee_paid: true // Simulating payment
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
