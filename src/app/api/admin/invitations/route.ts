import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import crypto from 'crypto';

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return null;

        const decoded = await verifyJWT(token) as { userId: string } | null;
        if (!decoded) return null;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true, organization_id: true },
        });

        // Allow SUPER_ADMIN and OPERATOR
        const allowedRoles = ['SUPER_ADMIN', 'OPERATOR'];
        if (!user || !allowedRoles.includes(user.role)) return null;

        return user;
    } catch (error) {
        return null;
    }
}

// GET /api/admin/invitations - List invitations with filters
export async function GET(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status') || 'all';
        const organizationId = searchParams.get('organizationId') || (admin.role === 'OPERATOR' ? admin.organization_id : 'all');

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        if (status !== 'all') {
            where.status = status;
        }
        if (organizationId && organizationId !== 'all') {
            where.organization_id = organizationId;
        }

        // Get invitations with related data
        const invitations = await prisma.invitation.findMany({
            where,
            include: {
                organization: {
                    select: {
                        id: true,
                        display_name: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            skip,
            take: limit,
        });

        // Get total count
        const total = await prisma.invitation.count({ where });

        // Get stats
        const stats = await prisma.invitation.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
        });

        // Get organizations for filter (if SUPER_ADMIN)
        let organizations: any[] = [];
        if (admin.role === 'SUPER_ADMIN') {
            organizations = await prisma.organization.findMany({
                select: {
                    id: true,
                    display_name: true,
                },
                orderBy: {
                    display_name: 'asc',
                },
            });
        }

        return NextResponse.json({
            invitations,
            organizations,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            stats,
        });
    } catch (error) {
        console.error('Error fetching invitations:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/admin/invitations - Create bulk invitations
export async function POST(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { invitations } = await request.json();

        if (!invitations || !Array.isArray(invitations) || invitations.length === 0) {
            return NextResponse.json({ error: 'Invalid invitations data' }, { status: 400 });
        }

        if (invitations.length > 100) {
            return NextResponse.json({ error: 'Maximum 100 invitations per request' }, { status: 400 });
        }

        // Validate each invitation
        for (const invite of invitations) {
            if (!invite.email || !invite.role || !invite.organizationId) {
                return NextResponse.json({ error: 'Each invitation must have email, role, and organizationId' }, { status: 400 });
            }

            // Check if organization exists and user has access
            if (admin.role === 'OPERATOR' && invite.organizationId !== admin.organization_id) {
                return NextResponse.json({ error: 'Cannot create invitations for other organizations' }, { status: 403 });
            }

            const org = await prisma.organization.findUnique({
                where: { id: invite.organizationId },
            });
            if (!org) {
                return NextResponse.json({ error: `Organization ${invite.organizationId} not found` }, { status: 400 });
            }

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email: invite.email },
            });
            if (existingUser) {
                return NextResponse.json({ error: `User with email ${invite.email} already exists` }, { status: 400 });
            }

            // Check if invitation already exists and is pending
            const existingInvite = await prisma.invitation.findUnique({
                where: {
                    email_organization_id: {
                        email: invite.email,
                        organization_id: invite.organizationId,
                    },
                },
            });
            if (existingInvite && existingInvite.status === 'PENDING') {
                return NextResponse.json({ error: `Pending invitation already exists for ${invite.email}` }, { status: 400 });
            }
        }

        // Create invitations in transaction
        const createdInvitations = await prisma.$transaction(async (tx) => {
            const results = [];

            for (const invite of invitations) {
                // Generate unique token
                const token = crypto.randomBytes(32).toString('hex');

                // Create invitation (expires in 7 days)
                const invitation = await tx.invitation.create({
                    data: {
                        email: invite.email,
                        role: invite.role,
                        organization_id: invite.organizationId,
                        token,
                        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                    },
                    include: {
                        organization: {
                            select: {
                                display_name: true,
                            },
                        },
                    },
                });

                results.push(invitation);

                // Create audit log
                await tx.auditLog.create({
                    data: {
                        actor_id: admin.id,
                        action: 'INVITATION_CREATED',
                        entity_type: 'INVITATION',
                        entity_id: invitation.id,
                        changes: {
                            email: invite.email,
                            role: invite.role,
                            organization_id: invite.organizationId,
                        },
                    },
                });

                // TODO: Send invitation email (would integrate with email service)
                // For now, we'll just create the invitation
            }

            return results;
        });

        return NextResponse.json({ invitations: createdInvitations });
    } catch (error) {
        console.error('Error creating invitations:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/invitations - Update invitation status (resend/cancel)
export async function PATCH(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { invitationId, action } = await request.json();

        if (!invitationId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const validActions = ['RESEND', 'CANCEL'];
        if (!validActions.includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Get the invitation
        const invitation = await prisma.invitation.findUnique({
            where: { id: invitationId },
            include: {
                organization: true,
            },
        });

        if (!invitation) {
            return NextResponse.json({ error: 'Invitation not found' }, { status: 404 });
        }

        // Check permissions
        if (admin.role === 'OPERATOR' && invitation.organization_id !== admin.organization_id) {
            return NextResponse.json({ error: 'Cannot modify invitations for other organizations' }, { status: 403 });
        }

        // Use transaction for safety
        const result = await prisma.$transaction(async (tx) => {
            let updateData: any = {};

            if (action === 'RESEND') {
                if (invitation.status !== 'PENDING') {
                    throw new Error('Can only resend pending invitations');
                }

                // Generate new token and extend expiry
                const newToken = crypto.randomBytes(32).toString('hex');
                updateData = {
                    token: newToken,
                    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Extend by 7 days
                };
            } else if (action === 'CANCEL') {
                if (invitation.status !== 'PENDING') {
                    throw new Error('Can only cancel pending invitations');
                }

                updateData = {
                    status: 'CANCELLED',
                };
            }

            // Update invitation
            const updatedInvitation = await tx.invitation.update({
                where: { id: invitationId },
                data: updateData,
                include: {
                    organization: {
                        select: {
                            display_name: true,
                        },
                    },
                },
            });

            // Create audit log
            await tx.auditLog.create({
                data: {
                    actor_id: admin.id,
                    action: `INVITATION_${action}`,
                    entity_type: 'INVITATION',
                    entity_id: invitationId,
                    changes: {
                        action,
                        old_status: invitation.status,
                        new_status: updatedInvitation.status,
                    },
                },
            });

            // TODO: Send resend email if action is RESEND

            return updatedInvitation;
        });

        return NextResponse.json({ invitation: result });
    } catch (error) {
        console.error('Error updating invitation:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}