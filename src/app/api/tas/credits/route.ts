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
        const limit = parseInt(searchParams.get('limit') || '20');
        const offset = (page - 1) * limit;

        // Get current credit balance
        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: userId },
            select: {
                id: true,
                credits_balance: true,
            },
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS profile not found' }, { status: 404 });
        }

        // Get credit transaction history
        const [transactions, totalCount] = await Promise.all([
            prisma.creditTransaction.findMany({
                where: {
                    tas_id: tasProfile.id,
                },
                orderBy: {
                    created_at: 'desc',
                },
                skip: offset,
                take: limit,
            }),
            prisma.creditTransaction.count({
                where: { tas_id: tasProfile.id },
            }),
        ]);

        const formattedTransactions = transactions.map(transaction => ({
            id: transaction.id,
            type: transaction.type,
            amount: transaction.amount,
            balanceAfter: transaction.balance_after,
            description: transaction.description,
            createdAt: transaction.created_at,
        }));

        return NextResponse.json({
            currentBalance: tasProfile.credits_balance,
            transactions: formattedTransactions,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });

    } catch (error) {
        console.error('Error fetching TAS credits:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST endpoint for purchasing credits
export async function POST(request: NextRequest) {
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
        const body = await request.json();
        const { amount, paymentMethod } = body;

        if (!amount || amount < 1) {
            return NextResponse.json({ error: 'Valid credit amount is required' }, { status: 400 });
        }

        // For now, we'll simulate credit purchase
        // In a real implementation, this would integrate with a payment gateway

        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: userId },
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS profile not found' }, { status: 404 });
        }

        const newBalance = tasProfile.credits_balance + amount;

        // Update credit balance
        await prisma.tASProfile.update({
            where: { user_id: userId },
            data: {
                credits_balance: newBalance,
            },
        });

        // Create credit transaction record
        const transaction = await prisma.creditTransaction.create({
            data: {
                tas_id: tasProfile.id,
                type: 'CREDIT_PURCHASE',
                amount: amount,
                description: `Credit purchase via ${paymentMethod || 'Online Payment'}`,
                balance_after: newBalance,
            },
        });

        return NextResponse.json({
            message: 'Credits purchased successfully',
            transaction: {
                id: transaction.id,
                amount: transaction.amount,
                balanceAfter: transaction.balance_after,
                createdAt: transaction.created_at,
            },
            newBalance,
        });

    } catch (error) {
        console.error('Error purchasing credits:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}