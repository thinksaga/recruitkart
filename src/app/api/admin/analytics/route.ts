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

        if (!payload || !['ADMIN', 'SUPPORT', 'OPERATOR'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Mocking some time-series data for now as we might not have enough historical data
        // In a real scenario, we would aggregate data from the database using groupBy

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

        const submissionTrends = {
            labels: months,
            data: [12, 19, 3, 5, 2, 3].map(n => n * 10) // Mock data
        };

        const revenueTrends = {
            labels: months,
            data: [5000, 10000, 7500, 15000, 12000, 20000] // Mock data
        };

        const jobStats = {
            open: await prisma.job.count({ where: { status: 'OPEN' } }),
            filled: await prisma.job.count({ where: { status: 'FILLED' } }),
            closed: await prisma.job.count({ where: { status: 'CLOSED' } }),
        };

        const userDistribution = {
            company: await prisma.user.count({ where: { role: 'COMPANY_ADMIN' } }),
            tas: await prisma.user.count({ where: { role: 'TAS' } }),
            candidate: await prisma.user.count({ where: { role: 'CANDIDATE' } }),
        };

        return NextResponse.json({
            submissionTrends,
            revenueTrends,
            jobStats,
            userDistribution
        });

    } catch (error) {
        console.error('Admin analytics error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
