import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!['ADMIN', 'SUPPORT'].includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden - Admin or Support access required' }, { status: 403 });
        }

        const { id } = params;
        const { verification_status } = await request.json();

        if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(verification_status)) {
            return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { verification_status },
        });

        return NextResponse.json({ user, message: 'User verification status updated' });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
