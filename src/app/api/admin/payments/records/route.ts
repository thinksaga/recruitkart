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

        if (!payload || typeof payload.role !== 'string' || payload.role !== 'COMPANY_ADMIN') {
            return NextResponse.json({ error: 'Forbidden - Company admin access required' }, { status: 403 });
        }

        // Get the user's organization
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        // Get all payment records for the organization
        const payments = await prisma.paymentRecord.findMany({
            where: {
                job: {
                    organization_id: user.organization_id
                }
            },
            select: {
                id: true,
                amount: true,
                payment_type: true,
                status: true,
                gateway_id: true,
                created_at: true,
                job: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json({ payments });
    } catch (error) {
        console.error('Payment records error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}