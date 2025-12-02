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

        if (!payload || !['FINANCIAL_CONTROLLER', 'ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [
            pendingPayouts,
            escrowBalance,
            openInvoices,
            monthlyRevenue,
            recentTransactions
        ] = await Promise.all([
            prisma.payout.aggregate({
                where: { status: 'PENDING' },
                _sum: { amount: true }
            }),
            prisma.escrowLedger.aggregate({
                where: { status: 'HELD' },
                _sum: { amount: true }
            }),
            prisma.invoice.count({
                where: { status: { in: ['SENT', 'OVERDUE'] } }
            }),
            // Mocking monthly revenue for now as we don't have a direct revenue table yet, 
            // or we could sum up paid invoices for this month
            prisma.invoice.aggregate({
                where: {
                    status: 'PAID',
                    updated_at: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                },
                _sum: { amount: true }
            }),
            prisma.creditTransaction.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                include: {
                    tas: {
                        select: {
                            user: {
                                select: { email: true }
                            }
                        }
                    }
                }
            })
        ]);

        return NextResponse.json({
            stats: {
                pendingPayouts: pendingPayouts._sum.amount || 0,
                escrowBalance: escrowBalance._sum.amount || 0,
                openInvoices,
                monthlyRevenue: monthlyRevenue._sum.amount || 0
            },
            recentTransactions
        });

    } catch (error) {
        console.error('Finance stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
