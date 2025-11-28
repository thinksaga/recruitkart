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
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Get payout history with pagination
        const [payouts, totalCount] = await Promise.all([
            prisma.payoutLog.findMany({
                where: {
                    tas_id: userId,
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
                skip: offset,
                take: limit,
            }),
            prisma.payoutLog.count({
                where: { tas_id: userId },
            }),
        ]);

        // Get organization names
        const organizationIds = [...new Set(payouts.map(p => p.job.organization_id))];
        const organizations = await prisma.organization.findMany({
            where: {
                id: { in: organizationIds },
            },
            select: {
                id: true,
                display_name: true,
            },
        });

        const orgMap = organizations.reduce((acc, org) => {
            acc[org.id] = org.display_name;
            return acc;
        }, {} as Record<string, string>);

        // Calculate earnings summary
        const totalEarned = await prisma.payoutLog.aggregate({
            where: {
                tas_id: userId,
                status: 'PAID',
            },
            _sum: {
                amount_net: true,
            },
        });

        const thisMonth = new Date();
        thisMonth.setDate(1);
        const monthlyEarned = await prisma.payoutLog.aggregate({
            where: {
                tas_id: userId,
                status: 'PAID',
                created_at: {
                    gte: thisMonth,
                },
            },
            _sum: {
                amount_net: true,
            },
        });

        const pendingPayouts = await prisma.payoutLog.count({
            where: {
                tas_id: userId,
                status: 'PROCESSING',
            },
        });

        // Get earnings by month for chart (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const monthlyData = await prisma.payoutLog.findMany({
            where: {
                tas_id: userId,
                status: 'PAID',
                created_at: {
                    gte: twelveMonthsAgo,
                },
            },
            select: {
                amount_net: true,
                created_at: true,
            },
            orderBy: {
                created_at: 'asc',
            },
        });

        // Group by month
        const earningsByMonth = monthlyData.reduce((acc: Record<string, number>, payout: any) => {
            const month = payout.created_at.toISOString().slice(0, 7); // YYYY-MM
            acc[month] = (acc[month] || 0) + payout.amount_net;
            return acc;
        }, {} as Record<string, number>);

        const chartData = Object.entries(earningsByMonth).map(([month, amount]) => ({
            month,
            earnings: amount,
        }));

        const formattedPayouts = payouts.map(payout => ({
            id: payout.id,
            amount: {
                gross: payout.amount_gross,
                commission: payout.commission_fee,
                gst: payout.gst_on_fee,
                tds: payout.tax_deducted,
                net: payout.amount_net,
            },
            status: payout.status,
            bankRef: payout.bank_ref_no,
            job: {
                title: payout.job.title,
                company: orgMap[payout.job.organization_id] || 'Unknown Company',
            },
            taxSection: payout.tds_section,
            createdAt: payout.created_at,
        }));

        return NextResponse.json({
            summary: {
                totalEarned: totalEarned._sum?.amount_net || 0,
                monthlyEarned: monthlyEarned._sum?.amount_net || 0,
                pendingPayouts,
            },
            payouts: formattedPayouts,
            chartData,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });

    } catch (error) {
        console.error('Error fetching TAS earnings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}