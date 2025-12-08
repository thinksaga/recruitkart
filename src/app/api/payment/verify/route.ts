import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER', 'TAS'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId, purchaseType, credits } = await request.json();

        // purchaseType: 'JOB_POSTING' | 'CREDIT_PURCHASE'

        const isMock = process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder' || !process.env.RAZORPAY_KEY_ID;
        let isSignatureValid = false;

        if (isMock && razorpay_signature === 'mock_signature') {
            isSignatureValid = true;
        } else {
            const body = razorpay_order_id + "|" + razorpay_payment_id;
            const expectedSignature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder')
                .update(body.toString())
                .digest('hex');

            if (expectedSignature === razorpay_signature) {
                isSignatureValid = true;
            }
        }

        if (isSignatureValid) {
            if (purchaseType === 'CREDIT_PURCHASE') {
                // Handle Credit Purchase
                const result = await prisma.$transaction(async (tx) => {
                    const tasProfile = await tx.tASProfile.findUnique({
                        where: { user_id: payload.userId as string }
                    });

                    if (!tasProfile) throw new Error('TAS Profile not found');

                    // Create transaction
                    const transaction = await tx.creditTransaction.create({
                        data: {
                            tas_id: tasProfile.id,
                            type: 'CREDIT',
                            amount: Number(credits), // number of credits
                            description: `Purchased ${credits} credits`,
                            status: 'COMPLETED'
                        }
                    });

                    // Update balance
                    const updatedProfile = await tx.tASProfile.update({
                        where: { id: tasProfile.id },
                        data: {
                            credits_balance: { increment: Number(credits) }
                        }
                    });

                    return { transaction, balance: updatedProfile.credits_balance };
                });

                return NextResponse.json({ success: true, ...result });

            } else {
                // Default: Job Posting Fee
                const updatedJob = await prisma.job.update({
                    where: { id: jobId },
                    data: {
                        infra_fee_paid: true,
                        status: 'OPEN'
                    }
                });
                return NextResponse.json({ success: true, job: updatedJob });
            }

        } else {
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }

    } catch (error) {
        console.error('Payment Verification Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
