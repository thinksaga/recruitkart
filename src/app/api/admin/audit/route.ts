import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['ADMIN', 'COMPLIANCE_OFFICER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const logs = await prisma.auditLog.findMany({
            take: 100,
            orderBy: { created_at: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        role: true
                    }
                }
            }
        });

        return NextResponse.json({ logs });

    } catch (error) {
        console.error('Admin audit error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
