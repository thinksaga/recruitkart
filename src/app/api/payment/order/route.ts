import { NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';
import shortid from 'shortid';
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
        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { amount, currency = 'INR', receipt = shortid.generate() } = await request.json();

        const isMock = process.env.RAZORPAY_KEY_ID === 'rzp_test_placeholder' || !process.env.RAZORPAY_KEY_ID;

        if (isMock) {
            console.warn('⚠️ Razorpay Keys missing. Using MOCK order.');
            const mockOrder = {
                id: `order_mock_${shortid.generate()}`,
                entity: 'order',
                amount: amount * 100,
                amount_paid: 0,
                amount_due: amount * 100,
                currency,
                receipt,
                status: 'created',
                attempts: 0,
                notes: [],
                created_at: Math.floor(Date.now() / 1000),
            };
            return NextResponse.json(mockOrder);
        }

        const options = {
            amount: amount * 100, // Amount in paise
            currency,
            receipt,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);

    } catch (error) {
        console.error('Razorpay Order Error:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
