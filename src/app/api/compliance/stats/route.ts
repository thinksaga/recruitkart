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

        if (!payload || !['COMPLIANCE_OFFICER', 'ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [
            pendingVerifications,
            flaggedAccounts,
            totalAudits,
            recentAudits
        ] = await Promise.all([
            prisma.user.count({
                where: { verification_status: 'PENDING' }
            }),
            prisma.user.count({
                where: { verification_status: 'REJECTED' }
            }),
            prisma.auditLog.count(),
            prisma.auditLog.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                include: {
                    user: {
                        select: { email: true, role: true }
                    }
                }
            })
        ]);

        return NextResponse.json({
            stats: {
                pendingVerifications,
                flaggedAccounts,
                totalAudits,
                complianceScore: 98 // Mock score for now
            },
            recentAudits
        });

    } catch (error) {
        console.error('Compliance stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
