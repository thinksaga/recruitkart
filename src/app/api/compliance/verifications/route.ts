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
        if (!payload || !['COMPLIANCE_OFFICER', 'ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const pendingUsers = await prisma.user.findMany({
            where: { verification_status: 'PENDING' },
            orderBy: { created_at: 'desc' },
            include: {
                tas_profile: true,
                organization: true
            }
        });

        return NextResponse.json({ pendingUsers });
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
        if (!payload || !['COMPLIANCE_OFFICER', 'ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id, status } = await request.json();

        const user = await prisma.user.update({
            where: { id },
            data: { verification_status: status }
        });

        // Log audit
        await prisma.auditLog.create({
            data: {
                user_id: payload.userId as string,
                action: `USER_VERIFICATION_${status}`,
                entity_type: 'USER',
                entity_id: id,
                details: { status }
            }
        });

        return NextResponse.json({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
