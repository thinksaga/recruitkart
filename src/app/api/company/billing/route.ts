import { NextResponse } from 'next/server';
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

        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Mock Data
        const billingData = {
            balance: 0,
            currency: 'INR',
            paymentMethods: [
                { id: 'pm_1', type: 'Credit Card', last4: '4242', expiry: '12/25', brand: 'Visa' }
            ],
            invoices: [
                { id: 'inv_1', date: '2024-05-01', amount: 50000, status: 'PAID', description: 'Success Fee - Frontend Dev' },
                { id: 'inv_2', date: '2024-04-15', amount: 10000, status: 'PAID', description: 'Job Posting - Backend Dev' },
                { id: 'inv_3', date: '2024-03-10', amount: 10000, status: 'PAID', description: 'Job Posting - Product Manager' }
            ]
        };

        return NextResponse.json({ billing: billingData });

    } catch (error) {
        console.error('Company Billing Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
