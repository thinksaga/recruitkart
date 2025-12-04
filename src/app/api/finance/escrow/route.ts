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

        const escrowTransactions = await prisma.escrowTransaction.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                job: {
                    select: {
                        title: true,
                        organization: { select: { name: true } }
                    }
                }
            }
        });

        return NextResponse.json({ escrowTransactions });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
