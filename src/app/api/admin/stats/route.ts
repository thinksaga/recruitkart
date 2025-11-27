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

        // Check for internal staff roles
        const internalRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'SUPPORT_AGENT', 'OPERATOR', 'FINANCE_CONTROLLER'];
        if (!payload || typeof payload.role !== 'string' || !internalRoles.includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
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
                        display_name: true,
                    },
                },
            },
        });

        // Get chart data (Last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const [usersLast7Days, jobsLast7Days] = await Promise.all([
            prisma.user.findMany({
                where: { created_at: { gte: sevenDaysAgo } },
                select: { created_at: true },
            }),
            prisma.job.findMany({
                where: { created_at: { gte: sevenDaysAgo } },
                select: { created_at: true },
            }),
        ]);

        const chartData = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(date.getDate() + i);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

            const usersCount = usersLast7Days.filter((u: { created_at: Date }) => {
                const d = new Date(u.created_at);
                return d.getDate() === date.getDate() && d.getMonth() === date.getMonth();
            }).length;

            const jobsCount = jobsLast7Days.filter((j: { created_at: Date }) => {
                const d = new Date(j.created_at);
                return d.getDate() === date.getDate() && d.getMonth() === date.getMonth();
            }).length;

            chartData.push({
                name: dayName,
                users: usersCount,
                jobs: jobsCount,
            });
        }

        return NextResponse.json({
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
            chartData,
        });
    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
