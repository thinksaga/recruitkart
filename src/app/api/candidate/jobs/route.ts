import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { cache } from '@/lib/cache';

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || typeof payload.role !== 'string' || payload.role !== 'CANDIDATE') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q') || '';
        const location = searchParams.get('location') || '';

        const cacheKey = `candidate:jobs:${query}:${location}`;
        const cachedJobs = await cache.get(cacheKey);

        if (cachedJobs) {
            return NextResponse.json({ jobs: cachedJobs });
        }

        const where: any = {
            status: 'OPEN',
        };

        if (query) {
            where.OR = [
                { title: { contains: query, mode: 'insensitive' } },
                { description: { contains: query, mode: 'insensitive' } },
            ];
        }

        // Note: Location filtering would require a location field in Job model or relation
        // For now, we'll just filter by query

        const jobs = await prisma.job.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                organization: {
                    select: {
                        name: true,
                        logo_url: true,
                    },
                },
            },
        });

        await cache.set(cacheKey, jobs, 60); // Cache for 1 minute

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Get candidate jobs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
