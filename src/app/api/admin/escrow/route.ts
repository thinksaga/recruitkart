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

// GET /api/admin/escrow - List escrow ledgers with filters
export async function GET(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        const where: any = {};

        if (status && status !== 'all') {
            where.status = status;
        }

        const [ledgers, total] = await Promise.all([
            prisma.escrowLedger.findMany({
                where,
                include: {
                    job: {
                        select: {
                            id: true,
                            title: true,
                            organization: {
                                select: { display_name: true },
                            },
                        },
                    },
                    transactions: {
                        orderBy: { created_at: 'desc' },
                        take: 5,
                    },
                    _count: {
                        select: {
                            transactions: true,
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { deposited_at: 'desc' },
            }),
            prisma.escrowLedger.count({ where }),
        ]);

        // Calculate totals for stats
        const stats = await prisma.escrowLedger.groupBy({
            by: ['status'],
            _count: { id: true },
            _sum: { amount: true },
        });

        return NextResponse.json({
            ledgers,
            stats,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching escrow ledgers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch escrow ledgers' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/escrow/:id - Release escrow or process refund
export async function PATCH(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { ledgerId, action, amount, reason } = body;

        if (!ledgerId || !action) {
            return NextResponse.json(
                { error: 'ledgerId and action are required' },
                { status: 400 }
            );
        }

        // Get the escrow ledger
        const ledger = await prisma.escrowLedger.findUnique({
            where: { id: ledgerId },
            include: {
                job: {
                    include: {
                        submissions: {
                            where: { status: 'HIRED' },
                            include: {
                                tas: {
                                    include: {
                                        user: true,
                                    },
                                },
                            },
                            take: 1,
                        },
                    },
                },
            },
        });

        if (!ledger) {
            return NextResponse.json(
                { error: 'Escrow ledger not found' },
                { status: 404 }
            );
        }

        const hiredSubmission = ledger.job.submissions[0];
        if (!hiredSubmission) {
            return NextResponse.json(
                { error: 'No hired submission found for this job' },
                { status: 400 }
            );
        }

        // Use transaction for atomic operations
        const result = await prisma.$transaction(async (tx) => {
            let newStatus: string;
            let transactionType: string;
            let transactionAmount: number;

            switch (action) {
                case 'RELEASE_TO_TAS':
                    if (ledger.status !== 'HELD') {
                        throw new Error('Can only release held escrow');
                    }
                    newStatus = 'RELEASED_TO_TAS';
                    transactionType = 'RELEASE_TO_TAS';
                    transactionAmount = ledger.amount;

                    // Create payout record
                    await tx.payoutLog.create({
                        data: {
                            tas_id: hiredSubmission.tas_id,
                            job_id: ledger.job_id,
                            amount_gross: ledger.amount,
                            commission_fee: 0, // Will be calculated later
                            gst_on_fee: 0,
                            tax_deducted: 0,
                            tds_section: 'GST_18',
                            amount_net: ledger.amount,
                            status: 'PENDING',
                        },
                    });

                    // Create notification for TAS
                    await tx.notification.create({
                        data: {
                            user_id: hiredSubmission.tas.user_id,
                            type: 'INFO',
                            title: 'Escrow Released',
                            message: `₹${ledger.amount} has been released from escrow for your placement.`,
                            action_link: `/dashboard/payouts`,
                        },
                    });
                    break;

                case 'REFUND_TO_COMPANY':
                    if (ledger.status !== 'HELD') {
                        throw new Error('Can only refund held escrow');
                    }
                    newStatus = 'REFUNDED_TO_COMPANY';
                    transactionType = 'REFUND_TO_COMPANY';
                    transactionAmount = ledger.amount;
                    break;

                case 'PARTIAL_REFUND':
                    if (ledger.status !== 'HELD' || !amount) {
                        throw new Error('Amount required for partial refund');
                    }
                    if (amount >= ledger.amount) {
                        throw new Error('Partial refund amount must be less than total');
                    }
                    newStatus = 'PARTIALLY_REFUNDED';
                    transactionType = 'PARTIAL_REFUND';
                    transactionAmount = amount;
                    break;

                case 'MARK_DISPUTED':
                    newStatus = 'DISPUTED';
                    transactionType = 'DISPUTE_OPENED';
                    transactionAmount = 0;
                    break;

                default:
                    throw new Error('Invalid action');
            }

            // Update ledger status
            const updatedLedger = await tx.escrowLedger.update({
                where: { id: ledgerId },
                data: {
                    status: newStatus as any,
                    updated_at: new Date(),
                },
            });

            // Create transaction record
            await tx.escrowTransaction.create({
                data: {
                    ledger_id: ledgerId,
                    amount: transactionAmount,
                    type: transactionType,
                    description: reason || `${action} by admin`,
                },
            });

            // Create audit log
            await tx.auditLog.create({
                data: {
                    actor_id: admin.id,
                    action: action,
                    entity_type: 'EscrowLedger',
                    entity_id: ledgerId,
                    changes: {
                        status: newStatus,
                        amount: transactionAmount,
                        reason,
                    },
                },
            });

            return updatedLedger;
        });

        return NextResponse.json({ success: true, ledger: result });
    } catch (error: any) {
        console.error('Error processing escrow action:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to process escrow action' },
            { status: 500 }
        );
    }
}
