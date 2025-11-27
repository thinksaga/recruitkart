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
        const category = searchParams.get('category');
        const assigned_to = searchParams.get('assigned_to');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        const where: any = {};
        if (status) where.status = status;
        if (category) where.category = category;
        if (assigned_to) where.assigned_to_id = assigned_to;

        // For SUPPORT_AGENT, only show tickets assigned to them or unassigned
        if (payload.role === 'SUPPORT_AGENT') {
            where.OR = [
                { assigned_to_id: payload.id },
                { assigned_to_id: null }
            ];
        }

        const [tickets, total] = await Promise.all([
            prisma.ticket.findMany({
                where,
                orderBy: { created_at: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    raised_by: {
                        select: {
                            id: true,
                            email: true,
                            role: true
                        }
                    },
                    assigned_to: {
                        select: {
                            id: true,
                            email: true,
                            role: true
                        }
                    },
                    job: {
                        select: {
                            id: true,
                            title: true,
                            organization: {
                                select: {
                                    display_name: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.ticket.count({ where })
        ]);

        return NextResponse.json({
            tickets,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Tickets API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
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

        const body = await request.json();
        const { subject, description, category, priority, job_id, assigned_to_id } = body;

        if (!subject || !description || !category) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate category
        const validCategories = ['PAYMENT_FAILURE', 'ESCROW_DISPUTE', 'CANDIDATE_NO_SHOW', 'EARLY_ATTRITION', 'DATA_PRIVACY', 'HARASSMENT', 'PLATFORM_BUG', 'OTHER'];
        if (!validCategories.includes(category)) {
            return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
        }

        const ticket = await prisma.ticket.create({
            data: {
                raised_by_id: payload.id as string,
                subject,
                description,
                category: category as any,
                priority: priority || 'MEDIUM',
                job_id: job_id || null,
                assigned_to_id: assigned_to_id || null,
                status: 'OPEN'
            },
            include: {
                raised_by: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                },
                assigned_to: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        organization: {
                            select: {
                                display_name: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(ticket, { status: 201 });
    } catch (error) {
        console.error('Create ticket error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
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

        const body = await request.json();
        const { id, status, assigned_to_id, resolution_note } = body;

        if (!id) {
            return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
        }

        // Find the ticket first
        const ticket = await prisma.ticket.findUnique({
            where: { id: id.toString() }
        });

        if (!ticket) {
            return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
        }

        // For SUPPORT_AGENT, they can only update tickets assigned to them
        if (payload.role === 'SUPPORT_AGENT' && ticket.assigned_to_id !== payload.id && ticket.assigned_to_id !== null) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (assigned_to_id !== undefined) updateData.assigned_to_id = assigned_to_id;
        if (resolution_note) updateData.resolution_note = resolution_note;
        if (status === 'RESOLVED' || status === 'CLOSED') {
            updateData.updated_at = new Date();
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: id.toString() },
            data: updateData,
            include: {
                raised_by: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                },
                assigned_to: {
                    select: {
                        id: true,
                        email: true,
                        role: true
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        organization: {
                            select: {
                                display_name: true
                            }
                        }
                    }
                }
            }
        });

        return NextResponse.json(updatedTicket);
    } catch (error) {
        console.error('Update ticket error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}