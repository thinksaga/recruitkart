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

        // Allow SUPER_ADMIN, OPERATOR (job management)
        const allowedRoles = ['SUPER_ADMIN', 'OPERATOR'];
        if (!user || !allowedRoles.includes(user.role)) return null;

        return user;
    } catch (error) {
        return null;
    }
}

// GET /api/admin/job-change-requests - List all change requests
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

        const [changeRequests, total] = await Promise.all([
            prisma.jobChangeRequest.findMany({
                where,
                include: {
                    job: {
                        select: {
                            id: true,
                            title: true,
                            status: true,
                            organization: {
                                select: {
                                    display_name: true,
                                },
                            },
                        },
                    },
                    requestor: {
                        select: {
                            id: true,
                            email: true,
                            role: true,
                        },
                    },
                    reviewer: {
                        select: {
                            email: true,
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            prisma.jobChangeRequest.count({ where }),
        ]);

        return NextResponse.json({
            changeRequests,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching change requests:', error);
        return NextResponse.json(
            { error: 'Failed to fetch change requests' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/job-change-requests/:id - Approve/reject change request
export async function PATCH(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { requestId, action, admin_notes } = body;

        if (!requestId || !action) {
            return NextResponse.json(
                { error: 'requestId and action are required' },
                { status: 400 }
            );
        }

        if (!['APPROVED', 'REJECTED'].includes(action)) {
            return NextResponse.json(
                { error: 'action must be APPROVED or REJECTED' },
                { status: 400 }
            );
        }

        // Get the change request
        const changeRequest = await prisma.jobChangeRequest.findUnique({
            where: { id: requestId },
            include: {
                job: true,
            },
        });

        if (!changeRequest) {
            return NextResponse.json(
                { error: 'Change request not found' },
                { status: 404 }
            );
        }

        if (changeRequest.status !== 'PENDING') {
            return NextResponse.json(
                { error: 'Change request has already been processed' },
                { status: 400 }
            );
        }

        // Use transaction to ensure atomicity
        const proposedChanges = changeRequest.proposed_changes as any;

        const result = await prisma.$transaction(async (tx) => {
            // Update change request status
            const updatedRequest = await tx.jobChangeRequest.update({
                where: { id: requestId },
                data: {
                    status: action,
                    admin_note: admin_notes,
                    reviewed_by_id: admin.id,
                },
            });

            // If approved, apply changes to the job
            if (action === 'APPROVED') {

                // Create snapshot before changes
                await tx.jobSnapshot.create({
                    data: {
                        job_id: changeRequest.job_id,
                        success_fee_amount: changeRequest.job.success_fee_amount,
                        salary_range: `${changeRequest.job.salary_min}-${changeRequest.job.salary_max}`,
                    },
                });

                // Apply changes
                await tx.job.update({
                    where: { id: changeRequest.job_id },
                    data: {
                        ...proposedChanges,
                        status: 'OPEN', // Reset to OPEN after approval
                    },
                });

                // Create notification for requester
                await tx.notification.create({
                    data: {
                        user_id: changeRequest.requested_by_id,
                        type: 'INFO',
                        title: 'Job Change Request Approved',
                        message: `Your change request for "${changeRequest.job.title}" has been approved.`,
                        action_link: `/jobs/${changeRequest.job_id}`,
                    },
                });
            } else {
                // Create notification for rejection
                await tx.notification.create({
                    data: {
                        user_id: changeRequest.requested_by_id,
                        type: 'WARNING',
                        title: 'Job Change Request Rejected',
                        message: `Your change request for "${changeRequest.job.title}" was rejected.${admin_notes ? ` Reason: ${admin_notes}` : ''}`,
                        action_link: `/jobs/${changeRequest.job_id}`,
                    },
                });
            }

            // Create audit log
            await tx.auditLog.create({
                data: {
                    actor_id: admin.id,
                    action: action === 'APPROVED' ? 'APPROVE_JOB_CHANGE_REQUEST' : 'REJECT_JOB_CHANGE_REQUEST',
                    entity_type: 'JobChangeRequest',
                    entity_id: requestId,
                    changes: {
                        status: action,
                        admin_notes,
                        proposed_changes: proposedChanges,
                    },
                },
            });

            return updatedRequest;
        });

        return NextResponse.json({ success: true, changeRequest: result });
    } catch (error) {
        console.error('Error processing change request:', error);
        return NextResponse.json(
            { error: 'Failed to process change request' },
            { status: 500 }
        );
    }
}
