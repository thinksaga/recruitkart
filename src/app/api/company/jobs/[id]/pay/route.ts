import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const { id } = await params;

        // Verify job belongs to organization
        const job = await prisma.job.findUnique({
            where: { id },
            select: { organization_id: true, status: true, infra_fee_paid: true }
        });

        if (!job) {
            return NextResponse.json({ error: 'Job not found' }, { status: 404 });
        }

        if (job.organization_id !== user.organization_id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (job.infra_fee_paid) {
            return NextResponse.json({ error: 'Fee already paid' }, { status: 400 });
        }

        // Simulate Payment Processing
        // In a real app, verify Stripe/Razorpay payment here

        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                infra_fee_paid: true,
                status: 'OPEN'
            }
        });

        return NextResponse.json({ success: true, job: updatedJob });

    } catch (error) {
        console.error('Job Payment Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
