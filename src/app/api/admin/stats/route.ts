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

        // Check if user is ADMIN, SUPPORT, or OPERATOR
        if (!payload || !['ADMIN', 'SUPPORT', 'OPERATOR'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const cacheKey = 'admin:dashboard:stats';
        const cachedStats = await cache.get(cacheKey);

        if (cachedStats) {
            return NextResponse.json(cachedStats);
        }

        // Get dashboard statistics
        const [
            totalUsers,
            pendingUsers,
            verifiedUsers,
            totalCompanies,
            totalTAS,
            totalJobs,
            openJobs,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { verification_status: 'PENDING' } }),
            prisma.user.count({ where: { verification_status: 'VERIFIED' } }),
            prisma.user.count({ where: { role: 'COMPANY_ADMIN' } }),
            prisma.user.count({ where: { role: 'TAS' } }),
            prisma.job.count(),
            prisma.job.count({ where: { status: 'OPEN' } }),
        ]);

        // Get recent users
        const recentUsers = await prisma.user.findMany({
            take: 10,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                email: true,
                role: true,
                verification_status: true,
                created_at: true,
                organization: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        const responseData = {
            stats: {
                totalUsers,
                pendingUsers,
                verifiedUsers,
                totalCompanies,
                totalTAS,
                totalJobs,
                openJobs,
            },
            recentUsers,
        };

        await cache.set(cacheKey, responseData, 60); // Cache for 1 minute

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
