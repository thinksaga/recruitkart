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

        // Get all invitations for the organization
        const invitations = await prisma.invitation.findMany({
            where: {
                organization_id: user.organization_id
            },
            select: {
                id: true,
                email: true,
                role: true,
                status: true,
                expires_at: true,
                created_at: true,
            },
            orderBy: { created_at: 'desc' }
        });

        return NextResponse.json({ invitations });
    } catch (error) {
        console.error('Team invitations error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}