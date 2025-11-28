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

        // Check for internal staff roles or COMPANY_ADMIN
        const internalRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'SUPPORT_AGENT', 'OPERATOR', 'FINANCE_CONTROLLER'];
        const allowedRoles = [...internalRoles, 'COMPANY_ADMIN'];

        if (!payload || typeof payload.role !== 'string' || !allowedRoles.includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        // For COMPANY_ADMIN, get their organization ID
        let organizationFilter = {};
        if (payload.role === 'COMPANY_ADMIN') {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId as string },
                select: { organization_id: true }
            });

            if (!user?.organization_id) {
                return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
            }

            organizationFilter = { organization_id: user.organization_id };
        }

        // Get current date ranges
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Get last 6 months data for growth charts
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        // Fetch all users, organizations, and jobs created in last 6 months
        const [usersData, jobsData, totalRevenue, monthlyRevenue] = await Promise.all([
            prisma.user.findMany({
                where: {
                    created_at: { gte: sixMonthsAgo },
                    ...organizationFilter
                },
                select: { created_at: true, role: true },
            }),
            prisma.job.findMany({
                where: {
                    created_at: { gte: sixMonthsAgo },
                    ...organizationFilter
                },
                select: { created_at: true, status: true },
            }),
            // Calculate total revenue from infra fees and success fees
            prisma.paymentRecord.aggregate({
                where: {
                    status: 'SUCCESS',
                    job: organizationFilter
                },
                _sum: { amount: true },
            }),
            // Monthly revenue
            prisma.paymentRecord.aggregate({
                where: {
                    status: 'SUCCESS',
                    created_at: { gte: startOfMonth },
                    job: organizationFilter
                },
                _sum: { amount: true },
            }),
        ]);

        // Calculate growth data by month
        const monthlyData = [];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        for (let i = 5; i >= 0; i--) {
            const monthDate = new Date();
            monthDate.setMonth(monthDate.getMonth() - i);
            const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
            const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59);

            const monthUsers = usersData.filter(u => {
                const date = new Date(u.created_at);
                return date >= monthStart && date <= monthEnd;
            });

            const monthJobs = jobsData.filter(j => {
                const date = new Date(j.created_at);
                return date >= monthStart && date <= monthEnd;
            });

            monthlyData.push({
                month: monthNames[monthDate.getMonth()],
                users: monthUsers.length,
                companies: monthUsers.filter(u => u.role === 'COMPANY_ADMIN').length,
                tas: monthUsers.filter(u => u.role === 'TAS').length,
                posted: monthJobs.length,
                filled: monthJobs.filter(j => j.status === 'FILLED').length,
            });
        }

        // Calculate current month stats
        const currentMonthUsers = usersData.filter(u => {
            const date = new Date(u.created_at);
            return date >= startOfMonth;
        }).length;

        const lastMonthUsers = usersData.filter(u => {
            const date = new Date(u.created_at);
            return date >= startOfLastMonth && date <= endOfLastMonth;
        }).length;

        const userGrowthPercent = lastMonthUsers > 0
            ? Math.round(((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100)
            : 0;

        // Get all-time stats
        const [totalUsers, totalCompanies, totalJobs, totalSubmissions] = await Promise.all([
            prisma.user.count({ where: organizationFilter }),
            prisma.user.count({ where: { role: 'COMPANY_ADMIN', ...organizationFilter } }),
            prisma.job.count({ where: organizationFilter }),
            prisma.submission.count({ where: { job: organizationFilter } }),
        ]);

        // Calculate platform metrics
        const [verifiedUsers, totalCandidates, hiredSubmissions] = await Promise.all([
            prisma.user.count({ where: { verification_status: 'VERIFIED', ...organizationFilter } }),
            prisma.candidate.count(), // Candidates are global, not organization-specific
            prisma.submission.count({ where: { status: 'HIRED', job: organizationFilter } }),
        ]);

        const verificationRate = totalUsers > 0 ? Math.round((verifiedUsers / totalUsers) * 100) : 0;
        const successRate = totalSubmissions > 0 ? Math.round((hiredSubmissions / totalSubmissions) * 100) : 0;

        // Calculate average time to fill (days)
        const filledJobs = await prisma.job.findMany({
            where: { status: 'FILLED', ...organizationFilter },
            select: { published_at: true, updated_at: true },
        });

        const avgTimeToFill = filledJobs.length > 0
            ? filledJobs.reduce((acc, job) => {
                if (job.published_at) {
                    const days = Math.floor((new Date(job.updated_at).getTime() - new Date(job.published_at).getTime()) / (1000 * 60 * 60 * 24));
                    return acc + days;
                }
                return acc;
            }, 0) / filledJobs.length
            : 0;

        return NextResponse.json({
            kpis: {
                totalUsers: {
                    value: totalUsers,
                    growth: userGrowthPercent,
                },
                totalCompanies: {
                    value: totalCompanies,
                    growth: 0, // Can be calculated similarly
                },
                totalJobs: {
                    value: totalJobs,
                    growth: 0,
                },
                monthlyRevenue: {
                    value: monthlyRevenue._sum.amount || 0,
                    growth: 0,
                },
            },
            charts: {
                userGrowth: monthlyData.map(m => ({
                    month: m.month,
                    users: m.users,
                    companies: m.companies,
                    tas: m.tas,
                })),
                jobStats: monthlyData.map(m => ({
                    month: m.month,
                    posted: m.posted,
                    filled: m.filled,
                })),
            },
            metrics: {
                verificationRate,
                avgTimeToFill: avgTimeToFill.toFixed(1),
                successRate,
                totalRevenue: totalRevenue._sum.amount || 0,
                totalCandidates,
            },
        });
    } catch (error) {
        console.error('Analytics error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
