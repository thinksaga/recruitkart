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

// GET /api/admin/credits - List TAS credit balances and transactions
export async function GET(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');
        const tasId = searchParams.get('tasId');
        const type = searchParams.get('type') || 'all';

        const skip = (page - 1) * limit;

        // Build where clause for transactions
        const where: any = {};
        if (tasId) {
            where.tas_id = tasId;
        }
        if (type !== 'all') {
            where.type = type;
        }

        // Get TAS profiles with current balances
        const tasProfiles = await prisma.tASProfile.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
                credit_history: {
                    where,
                    orderBy: {
                        created_at: 'desc',
                    },
                    skip,
                    take: limit,
                },
                _count: {
                    select: {
                        credit_history: true,
                    },
                },
            },
            orderBy: {
                credits_balance: 'desc',
            },
        });

        // Get transaction stats
        const transactionStats = await prisma.creditTransaction.groupBy({
            by: ['type'],
            _count: {
                id: true,
            },
            _sum: {
                amount: true,
            },
        });

        // Calculate total credits in system
        const totalCredits = await prisma.tASProfile.aggregate({
            _sum: {
                credits_balance: true,
            },
        });

        return NextResponse.json({
            tasProfiles,
            transactionStats,
            totalCredits: totalCredits._sum.credits_balance || 0,
            pagination: {
                page,
                limit,
                total: tasProfiles.length, // This is approximate for TAS profiles
            },
        });
    } catch (error) {
        console.error('Error fetching credits:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/admin/credits - Adjust TAS credits (add/remove)
export async function PATCH(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { tasId, amount, type, description, reason } = await request.json();

        if (!tasId || !amount || !type || !reason) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const validTypes = ['CREDIT_PURCHASE', 'CREDIT_REFUND', 'CREDIT_USAGE'];
        if (!validTypes.includes(type)) {
            return NextResponse.json({ error: 'Invalid transaction type' }, { status: 400 });
        }

        // Verify TAS exists
        const tas = await prisma.tASProfile.findUnique({
            where: { id: tasId },
            include: {
                user: true,
            },
        });

        if (!tas) {
            return NextResponse.json({ error: 'TAS not found' }, { status: 404 });
        }

        // Use transaction for safety
        const result = await prisma.$transaction(async (tx) => {
            // Create credit transaction
            const transaction = await tx.creditTransaction.create({
                data: {
                    tas_id: tasId,
                    amount,
                    type,
                    description: description || `${type.replace(/_/g, ' ')} by admin`,
                    balance_after: 0, // Will be calculated by DB trigger
                },
            });

            // Update TAS balance (this should be handled by DB trigger, but let's ensure it)
            const newBalance = tas.credits_balance + amount;
            await tx.tASProfile.update({
                where: { id: tasId },
                data: { credits_balance: newBalance },
            });

            // Create audit log
            await tx.auditLog.create({
                data: {
                    actor_id: admin.id,
                    action: 'CREDIT_ADJUSTMENT',
                    entity_type: 'CREDIT_TRANSACTION',
                    entity_id: transaction.id,
                    changes: {
                        tas_id: tasId,
                        amount,
                        type,
                        reason,
                        new_balance: newBalance,
                    },
                },
            });

            // Create notification for TAS
            await tx.notification.create({
                data: {
                    user_id: tas.user.id,
                    type: 'CREDIT_UPDATE',
                    title: 'Credits Updated',
                    message: `Your credits have been ${amount > 0 ? 'increased' : 'decreased'} by ${Math.abs(amount)}. New balance: ${newBalance}`,
                    action_link: '/dashboard/wallet',
                },
            });

            return {
                transaction,
                newBalance,
                tas: {
                    id: tas.id,
                    user: { email: tas.user.email },
                },
            };
        });

        return NextResponse.json({ result });
    } catch (error) {
        console.error('Error adjusting credits:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}