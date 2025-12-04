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

        const invoices = await prisma.invoice.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                organization: {
                    select: { name: true, gstin: true }
                }
            }
        });

        return NextResponse.json({ invoices });
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

        const { id, status } = await request.json();

        const invoice = await prisma.invoice.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json({ invoice });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
