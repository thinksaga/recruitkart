import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const payload = await verifyJWT(token);
        if (!payload || !['FINANCIAL_CONTROLLER', 'ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const payouts = await prisma.payout.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                tas: {
                    select: {
                        user: { select: { email: true } },
                        pan_number: true
                    }
                }
            }
        });

        return NextResponse.json({ payouts });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        const payload = await verifyJWT(token);
        if (!payload || !['FINANCIAL_CONTROLLER', 'ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id, status, notes } = await request.json();

        const payout = await prisma.payout.update({
            where: { id },
            data: {
                status,
                notes,
                processed_at: status === 'COMPLETED' ? new Date() : undefined
            }
        });

        return NextResponse.json({ payout });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
