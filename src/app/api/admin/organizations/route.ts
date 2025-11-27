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

        // Check for internal staff roles
        const internalRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'SUPPORT_AGENT', 'OPERATOR', 'FINANCE_CONTROLLER'];
        if (!payload || typeof payload.role !== 'string' || !internalRoles.includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const organizations = await prisma.organization.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: {
                        users: true,
                        jobs: true,
                    },
                },
            },
        });

        return NextResponse.json({ organizations });
    } catch (error) {
        console.error('Get organizations error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
