import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const buyCreditsSchema = z.object({
    amount: z.number().min(100), // Minimum purchase amount
});

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: payload.userId as string },
            include: {
                transactions: {
                    orderBy: { created_at: 'desc' },
                    take: 10
                }
            }
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS Profile not found' }, { status: 404 });
        }

        // Map transactions to match frontend expectations
        const transactions = tasProfile.transactions.map(tx => ({
            id: tx.id,
            type: tx.type === 'CREDIT' ? 'Purchase' : 'Usage',
            amount: tx.amount,
            date: tx.created_at.toISOString().split('T')[0],
            status: tx.status,
            description: tx.description
        }));

        return NextResponse.json({
            balance: tasProfile.credits_balance,
            transactions
        });

    } catch (error) {
        console.error('TAS Credits Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { amount } = buyCreditsSchema.parse(body);

        // In a real app, this would integrate with a payment gateway.
        // For now, we'll simulate a successful transaction.

        const result = await prisma.$transaction(async (tx) => {
            const tasProfile = await tx.tASProfile.findUnique({
                where: { user_id: payload.userId as string }
            });

            if (!tasProfile) {
                throw new Error('TAS Profile not found');
            }

            // Create transaction record
            const transaction = await tx.creditTransaction.create({
                data: {
                    tas_id: tasProfile.id,
                    type: 'CREDIT',
                    amount: amount,
                    description: `Purchased ${amount} credits`,
                    status: 'COMPLETED'
                }
            });

            // Update balance
            const updatedProfile = await tx.tASProfile.update({
                where: { id: tasProfile.id },
                data: {
                    credits_balance: { increment: amount }
                }
            });

            return { transaction, balance: updatedProfile.credits_balance };
        });

        return NextResponse.json({
            success: true,
            balance: result.balance,
            transaction: result.transaction
        });

    } catch (error) {
        console.error('Buy Credits Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
