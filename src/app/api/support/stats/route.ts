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

        if (!payload || !['SUPPORT', 'ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const [
            openTickets,
            inProgressTickets,
            resolvedToday,
            urgentTickets,
            recentTickets
        ] = await Promise.all([
            prisma.ticket.count({ where: { status: 'OPEN' } }),
            prisma.ticket.count({ where: { status: 'IN_PROGRESS' } }),
            prisma.ticket.count({
                where: {
                    status: 'RESOLVED',
                    updated_at: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            // Assuming we might add priority later, for now just a placeholder or specific logic
            prisma.ticket.count({ where: { status: 'OPEN' } }), // Placeholder for urgent
            prisma.ticket.findMany({
                take: 5,
                orderBy: { created_at: 'desc' },
                include: {
                    raised_by: {
                        select: {
                            email: true
                        }
                    }
                }
            })
        ]);

        return NextResponse.json({
            stats: {
                openTickets,
                inProgressTickets,
                resolvedToday,
                urgentTickets
            },
            recentTickets
        });

    } catch (error) {
        console.error('Support stats error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
