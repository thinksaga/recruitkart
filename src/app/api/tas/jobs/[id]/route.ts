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

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;

        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                organization: {
                    select: {
                        name: true,
                        logo_url: true,
                        domain: true,
                        website: true
                    }
                }
            }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        // Format job details
        const formattedJob = {
            id: job.id,
            title: job.title,
            company: job.organization.name,
            logo: job.organization.logo_url || job.organization.name.charAt(0),
            description: job.description,
            salary: job.salary_min && job.salary_max
                ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
                : 'Not disclosed',
            location: 'Remote', // Placeholder as location isn't in Job model yet
            type: 'Full-time', // Placeholder
            posted: new Date(job.created_at).toLocaleDateString(),
            bounty: `₹${job.success_fee_amount.toLocaleString()}`,
            skills: ['React', 'Node.js', 'TypeScript'], // Placeholder
            requirements: [
                '3+ years of experience in full-stack development',
                'Strong proficiency in React and Node.js',
                'Experience with PostgreSQL and Prisma',
                'Excellent communication skills'
            ] // Placeholder
        };

        return NextResponse.json({ job: formattedJob });

    } catch (error) {
        console.error('Job Details Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
