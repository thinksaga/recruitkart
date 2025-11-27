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

        // Get all invoices for the organization
        const invoices = await prisma.invoice.findMany({
            where: {
                organization_id: user.organization_id
            },
            select: {
                id: true,
                invoice_number: true,
                job_id: true,
                base_amount: true,
                gst_amount: true,
                total_amount: true,
                currency: true,
                status: true,
                pdf_url: true,
                created_at: true,
                job: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json({ invoices });
    } catch (error) {
        console.error('Invoices error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}