import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

interface JWTPayload {
    userId: string;
    role: string;
    organizationId?: string;
    verificationStatus: string;
}

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token) as JWTPayload | null;
        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.userId;

        // Get TAS profile
        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: userId },
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS profile not found' }, { status: 404 });
        }

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                created_at: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get credits balance
        const creditsBalance = tasProfile.credits_balance || 0;

        // Get reputation score
        const reputationScore = tasProfile.reputation_score || 0;

        // Get total placements (successful submissions)
        const totalPlacements = await prisma.submission.count({
            where: {
                tas_id: tasProfile.id,
                status: 'HIRED',
            },
        });

        // Get active submissions (pending or in review)
        const activeSubmissions = await prisma.submission.count({
            where: {
                tas_id: tasProfile.id,
                status: {
                    in: ['PENDING_CONSENT', 'LOCKED_BY_TAS', 'ACTIVE', 'SCREENING', 'INTERVIEWING', 'OFFER_EXTENDED'],
                },
            },
        });

        // Get monthly earnings (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const monthlyEarnings = await prisma.payoutLog.aggregate({
            where: {
                tas_id: tasProfile.id,
                created_at: {
                    gte: thirtyDaysAgo,
                },
                status: 'PAID',
            },
            _sum: {
                amount_net: true,
            },
        });

        // Get previous month's earnings for growth calculation
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const previousMonthEarnings = await prisma.payoutLog.aggregate({
            where: {
                tas_id: tasProfile.id,
                created_at: {
                    gte: sixtyDaysAgo,
                    lt: thirtyDaysAgo,
                },
                status: 'PAID',
            },
            _sum: {
                amount_net: true,
            },
        });

        // Calculate growth percentage
        const currentMonthTotal = monthlyEarnings._sum?.amount_net || 0;
        const previousMonthTotal = previousMonthEarnings._sum?.amount_net || 0;
        const creditsGrowth = previousMonthTotal > 0
            ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100
            : 0;

        // Calculate success rate (hired / total submissions)
        const totalSubmissions = await prisma.submission.count({
            where: {
                tas_id: tasProfile.id,
            },
        });
        const successRate = totalSubmissions > 0 ? (totalPlacements / totalSubmissions) * 100 : 0;

        // Get recent submissions (last 5)
        const recentSubmissions = await prisma.submission.findMany({
            where: {
                tas_id: tasProfile.id,
            },
            include: {
                job: {
                    select: {
                        title: true,
                        organization_id: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            take: 5,
        });

        // Get earnings data for chart (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const earningsData = await prisma.payoutLog.findMany({
            where: {
                tas_id: tasProfile.id,
                created_at: {
                    gte: sixMonthsAgo,
                },
                status: 'PAID',
            },
            select: {
                amount_net: true,
                created_at: true,
            },
            orderBy: {
                created_at: 'asc',
            },
        });

        // Group earnings by month for chart
        const monthlyEarningsData = earningsData.reduce((acc: Record<string, number>, earning: any) => {
            const month = earning.created_at.toISOString().slice(0, 7); // YYYY-MM
            acc[month] = (acc[month] || 0) + earning.amount_net;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(monthlyEarningsData).map(([month, amount]) => ({
            month: new Date(month).toLocaleDateString('en-US', { month: 'short' }),
            earnings: amount,
            placements: 0, // Could be enhanced to count placements per month
        }));

        return NextResponse.json({
            stats: {
                creditsBalance,
                reputationScore,
                totalPlacements,
                activeSubmissions,
                monthlyEarnings: currentMonthTotal,
                successRate: Math.round(successRate),
                creditsGrowth: Math.round(creditsGrowth * 10) / 10, // Round to 1 decimal
            },
            earningsData: chartData,
        });

    } catch (error) {
        console.error('Error fetching TAS dashboard stats:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}