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

        if (!payload || !['ADMIN', 'SUPPORT'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const where: any = {};
        if (status && status !== 'ALL') where.status = status;

        const tickets = await prisma.ticket.findMany({
            where,
            orderBy: { created_at: 'desc' },
            include: {
                raised_by: {
                    select: {
                        email: true,
                        role: true,
                        id: true,
                        // name: true // Assuming name exists on User or related profile
                    }
                },
                related_job: {
                    select: {
                        title: true
                    }
                },
                assigned_to: {
                    select: {
                        email: true,
                        // name: true
                    }
                }
            }
        });

        return NextResponse.json({ tickets });

    } catch (error) {
        console.error('Admin tickets error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['ADMIN', 'SUPPORT'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { id, status, resolution_note, priority, category, assigned_to_id } = body;

        const ticket = await prisma.ticket.update({
            where: { id },
            data: {
                status,
                resolution_note,
                priority,
                category,
                assigned_to_id
            },
            include: {
                assigned_to: {
                    select: { email: true }
                }
            }
        });

        // Log audit
        await prisma.auditLog.create({
            data: {
                user_id: payload.userId as string,
                action: 'UPDATE_TICKET',
                entity_type: 'TICKET',
                entity_id: id,
                details: { status, resolution_note, priority, category, assigned_to_id }
            }
        });

        return NextResponse.json({ ticket });

    } catch (error) {
        console.error('Update ticket error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
