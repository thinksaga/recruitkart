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

        // Check for internal staff roles
        const internalRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'SUPPORT_AGENT', 'OPERATOR', 'FINANCE_CONTROLLER'];
        if (!payload || typeof payload.role !== 'string' || !internalRoles.includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const role = searchParams.get('role');

        const where: any = {};
        if (status) where.verification_status = status;
        if (role) where.role = role;

        const users = await prisma.user.findMany({
            where,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                verification_status: true,
                created_at: true,
                last_login_at: true,
                failed_login_attempts: true,
                organization: {
                    select: {
                        id: true,
                        legal_name: true,
                        display_name: true,
                        gstin: true,
                        domain: true,
                        website: true,
                    },
                },
                tas_profile: {
                    select: {
                        full_name: true,
                        pan_number: true,
                        linkedin_url: true,
                        credits_balance: true,
                    },
                },
            },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
