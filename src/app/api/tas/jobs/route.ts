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

        const jobs = await prisma.job.findMany({
            where: {
                status: 'OPEN',
            },
            include: {
                organization: {
                    select: {
                        name: true,
                        logo_url: true,
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        const formattedJobs = jobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.organization.name,
            location: 'Remote', // Default as schema lacks location
            salary: job.salary_min && job.salary_max
                ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L`
                : 'Not disclosed',
            type: 'Full-time', // Default
            posted: new Date(job.created_at).toLocaleDateString(),
            bounty: `₹${job.success_fee_amount.toLocaleString()}`,
            skills: [], // Schema lacks skills
            logo: job.organization.name.charAt(0)
        }));

        return NextResponse.json({ jobs: formattedJobs });

    } catch (error) {
        console.error('TAS Jobs Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
