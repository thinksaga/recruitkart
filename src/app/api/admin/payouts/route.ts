import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) return null;

        const decoded = await verifyJWT(token) as { userId: string } | null;
        if (!decoded) return null;

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });

        // Allow SUPER_ADMIN and FINANCE_CONTROLLER
        const allowedRoles = ['SUPER_ADMIN', 'FINANCE_CONTROLLER'];
        if (!user || !allowedRoles.includes(user.role)) return null;

        return user;
    } catch (error) {
        return null;
    }
}

// GET /api/admin/payouts - List payouts with filters
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

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        if (status !== 'all') {
            where.status = status;
        }

        // Get payouts with related data
        const payouts = await prisma.payoutLog.findMany({
            where,
            include: {
                tas: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        organization: {
                            select: {
                                display_name: true,
                            },
                        },
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
        const total = await prisma.payoutLog.count({ where });

        // Get stats
        const stats = await prisma.payoutLog.groupBy({
            by: ['status'],
            _count: {
                id: true,
            },
            _sum: {
                amount_gross: true,
                amount_net: true,
            },
        });

        return NextResponse.json({
            payouts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            stats,
        });
    } catch (error) {
        console.error('Error fetching payouts:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/admin/payouts - Approve/reject payouts
export async function PATCH(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { payoutId, action, reason } = await request.json();

        if (!payoutId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const validActions = ['APPROVE', 'REJECT', 'HOLD'];
        if (!validActions.includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Use transaction for safety
        const result = await prisma.$transaction(async (tx) => {
            // Get the payout
            const payout = await tx.payoutLog.findUnique({
                where: { id: payoutId },
                include: {
                    tas: {
                        include: {
                            user: true,
                        },
                    },
                    job: {
                        include: {
                            organization: true,
                        },
                    },
                },
            });

            if (!payout) {
                throw new Error('Payout not found');
            }

            if (payout.status !== 'PENDING') {
                throw new Error('Payout is not in pending status');
            }

            let newStatus: string = '';
            let updateData: any = {
                processed_at: new Date(),
                processed_by: admin.id,
            };

            if (action === 'APPROVE') {
                newStatus = 'APPROVED';
                // Create credit transaction for TAS
                await tx.creditTransaction.create({
                    data: {
                        tas_id: payout.tas_id,
                        type: 'CREDIT_USAGE',
                        amount: Math.floor(payout.amount_net), // Convert to int for credits
                        description: `Payout approved for job: ${payout.job.title}`,
                        balance_after: 0, // Will be calculated by DB trigger
                    },
                });
            } else if (action === 'REJECT') {
                newStatus = 'REJECTED';
                // Note: No escrow refund since payouts are created after escrow release
            } else if (action === 'HOLD') {
                newStatus = 'ON_HOLD';
            }

            updateData.status = newStatus;

            // Update payout
            const updatedPayout = await tx.payoutLog.update({
                where: { id: payoutId },
                data: updateData,
                include: {
                    tas: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    job: {
                        select: {
                            id: true,
                            title: true,
                            organization: {
                                select: {
                                    display_name: true,
                                },
                            },
                        },
                    },
                },
            });

            // Create audit log
            await tx.auditLog.create({
                data: {
                    actor_id: admin.id,
                    action: `PAYOUT_${action}`,
                    entity_type: 'PAYOUT_LOG',
                    entity_id: payoutId,
                    changes: {
                        payout_id: payoutId,
                        tas_id: payout.tas_id,
                        amount_gross: payout.amount_gross,
                        amount_net: payout.amount_net,
                        action,
                        reason,
                        job_id: payout.job_id,
                    },
                },
            });

            // Create notification for TAS
            await tx.notification.create({
                data: {
                    user_id: payout.tas.user.id,
                    type: 'PAYOUT_UPDATE',
                    title: `Payout ${action.toLowerCase()}`,
                    message: `Your payout of ₹${payout.amount_net.toLocaleString()} for job "${payout.job.title}" has been ${action.toLowerCase()}.`,
                    action_link: `/dashboard/payouts/${payoutId}`,
                },
            });

            return updatedPayout;
        });

        return NextResponse.json({ payout: result });
    } catch (error) {
        console.error('Error processing payout:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}