import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cache } from '@/lib/cache';
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

        if (!payload || !['ADMIN', 'SUPPORT', 'OPERATOR'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const cacheKey = 'admin:jobs:list';
        const cachedJobs = await cache.get(cacheKey);

        if (cachedJobs) {
            return NextResponse.json({ jobs: cachedJobs });
        }

        const jobs = await prisma.job.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                organization: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        await cache.set(cacheKey, jobs, 300); // Cache for 5 minutes

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Get jobs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
