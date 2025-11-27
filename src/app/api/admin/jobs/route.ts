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

        // Check for internal staff roles or COMPANY_ADMIN
        const internalRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'SUPPORT_AGENT', 'OPERATOR', 'FINANCE_CONTROLLER'];
        const allowedRoles = [...internalRoles, 'COMPANY_ADMIN'];
        
        if (!payload || typeof payload.role !== 'string' || !allowedRoles.includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // For COMPANY_ADMIN, only show jobs from their organization
        let whereClause = {};
        if (payload.role === 'COMPANY_ADMIN') {
            const user = await prisma.user.findUnique({
                where: { id: payload.userId as string },
                select: { organization_id: true }
            });
            
            if (!user?.organization_id) {
                return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
            }
            
            whereClause = { organization_id: user.organization_id };
        }

        const jobs = await prisma.job.findMany({
            where: whereClause,
            orderBy: { created_at: 'desc' },
            include: {
                organization: {
                    select: {
                        display_name: true,
                        legal_name: true,
                    },
                },
            },
        });

        return NextResponse.json({ jobs });
    } catch (error) {
        console.error('Get jobs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
