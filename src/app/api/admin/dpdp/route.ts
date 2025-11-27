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

        // Allow SUPER_ADMIN and COMPLIANCE_OFFICER
        const allowedRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER'];
        if (!user || !allowedRoles.includes(user.role)) return null;

        return user;
    } catch (error) {
        return null;
    }
}

// GET /api/admin/dpdp - List data subject requests
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
        const type = searchParams.get('type') || 'all';

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {};
        if (status !== 'all') {
            where.status = status;
        }
        if (type !== 'all') {
            where.type = type;
        }

        // Get data subject requests with related data
        const requests = await prisma.dataSubjectRequest.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        phone: true,
                        role: true,
                        verification_status: true,
                    },
                },
                candidate: {
                    select: {
                        id: true,
                        phone: true,
                        email: true,
                        full_name: true,
                        is_blacklisted: true,
                    },
                },
            },
            orderBy: {
                requested_at: 'desc',
            },
            skip,
            take: limit,
        });

        // Get total count
        const total = await prisma.dataSubjectRequest.count({ where });

        // Get stats
        const stats = await prisma.dataSubjectRequest.groupBy({
            by: ['status', 'type'],
            _count: {
                id: true,
            },
        });

        return NextResponse.json({
            requests,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
            stats,
        });
    } catch (error) {
        console.error('Error fetching DPDP requests:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/admin/dpdp - Process data subject requests
export async function PATCH(request: NextRequest) {
    try {
        const admin = await verifyAdmin(request);
        if (!admin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { requestId, action, adminNote, correctionData } = await request.json();

        if (!requestId || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const validActions = ['COMPLETE_EXPORT', 'COMPLETE_DELETE', 'COMPLETE_CORRECTION', 'REJECT'];
        if (!validActions.includes(action)) {
            return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }

        // Get the request
        const dataRequest = await prisma.dataSubjectRequest.findUnique({
            where: { id: requestId },
            include: {
                user: true,
                candidate: true,
            },
        });

        if (!dataRequest) {
            return NextResponse.json({ error: 'Data subject request not found' }, { status: 404 });
        }

        if (dataRequest.status === 'COMPLETED') {
            return NextResponse.json({ error: 'Request already completed' }, { status: 400 });
        }

        // Use transaction for safety
        const result = await prisma.$transaction(async (tx) => {
            let exportData = null;
            let updatedEntity = null;

            if (action === 'COMPLETE_EXPORT') {
                // Export user/candidate data
                if (dataRequest.user_id) {
                    const userData = await tx.user.findUnique({
                        where: { id: dataRequest.user_id },
                        include: {
                            tas_profile: true,
                            organization: true,
                            sessions: {
                                select: {
                                    ip_address: true,
                                    user_agent: true,
                                    created_at: true,
                                },
                            },
                            security_logs: {
                                select: {
                                    event: true,
                                    ip_address: true,
                                    created_at: true,
                                },
                            },
                            audit_logs: {
                                select: {
                                    action: true,
                                    entity_type: true,
                                    created_at: true,
                                },
                            },
                        },
                    });
                    exportData = { type: 'USER_DATA', data: userData };
                } else if (dataRequest.candidate_id) {
                    const candidateData = await tx.candidate.findUnique({
                        where: { id: dataRequest.candidate_id },
                        include: {
                            submissions: {
                                include: {
                                    job: {
                                        select: {
                                            title: true,
                                            organization: {
                                                select: {
                                                    display_name: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                            consents: true,
                        },
                    });
                    exportData = { type: 'CANDIDATE_DATA', data: candidateData };
                }
            } else if (action === 'COMPLETE_DELETE') {
                // Soft delete with PII removal
                if (dataRequest.user_id) {
                    // Anonymize user data
                    await tx.user.update({
                        where: { id: dataRequest.user_id },
                        data: {
                            email: `deleted_${dataRequest.user_id}@anonymous.local`,
                            phone: null,
                            is_active: false,
                            verification_status: 'SUSPENDED',
                        },
                    });

                    // Check if user has TAS profile and remove sensitive data
                    const tasProfile = await tx.tASProfile.findUnique({
                        where: { user_id: dataRequest.user_id },
                    });
                    if (tasProfile) {
                        await tx.tASProfile.update({
                            where: { id: tasProfile.id },
                            data: {
                                pan_number: 'DELETED',
                                gstin: null,
                                bank_account_last4: null,
                                ifsc_code: null,
                            },
                        });
                    }
                } else if (dataRequest.candidate_id) {
                    // Anonymize candidate data
                    await tx.candidate.update({
                        where: { id: dataRequest.candidate_id },
                        data: {
                            phone: `deleted_${dataRequest.candidate_id}`,
                            email: `deleted_${dataRequest.candidate_id}@anonymous.local`,
                            full_name: 'DELETED',
                            personal_details: {},
                            work_history: [],
                            education_history: [],
                            social_links: {},
                            skills_primary: [],
                            skills_secondary: [],
                            video_resume_url: null,
                            is_blacklisted: true,
                        },
                    });
                }
            } else if (action === 'COMPLETE_CORRECTION') {
                // Apply data corrections
                if (dataRequest.user_id && correctionData) {
                    await tx.user.update({
                        where: { id: dataRequest.user_id },
                        data: correctionData,
                    });
                    updatedEntity = 'USER';
                } else if (dataRequest.candidate_id && correctionData) {
                    await tx.candidate.update({
                        where: { id: dataRequest.candidate_id },
                        data: correctionData,
                    });
                    updatedEntity = 'CANDIDATE';
                }
            }

            // Update the request
            const updatedRequest = await tx.dataSubjectRequest.update({
                where: { id: requestId },
                data: {
                    status: action === 'REJECT' ? 'REJECTED' : 'COMPLETED',
                    completed_at: new Date(),
                    admin_note: adminNote,
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                        },
                    },
                    candidate: {
                        select: {
                            id: true,
                            email: true,
                            full_name: true,
                        },
                    },
                },
            });

            // Create audit log
            await tx.auditLog.create({
                data: {
                    actor_id: admin.id,
                    action: `DPDP_${action}`,
                    entity_type: 'DATA_SUBJECT_REQUEST',
                    entity_id: requestId,
                    changes: {
                        request_id: requestId,
                        action,
                        admin_note: adminNote,
                        correction_data: correctionData,
                        export_performed: !!exportData,
                        deletion_performed: action === 'COMPLETE_DELETE',
                        correction_applied: !!updatedEntity,
                    },
                },
            });

            // Create notification for the data subject
            const notificationUserId = dataRequest.user_id || (dataRequest.candidate ? null : null);
            if (notificationUserId) {
                await tx.notification.create({
                    data: {
                        user_id: notificationUserId,
                        type: 'COMPLIANCE_UPDATE',
                        title: 'Data Request Processed',
                        message: `Your ${dataRequest.type.replace(/_/g, ' ').toLowerCase()} request has been ${action === 'REJECT' ? 'rejected' : 'completed'}.`,
                        action_link: '/dashboard/privacy',
                    },
                });
            }

            return {
                request: updatedRequest,
                exportData,
                updatedEntity,
            };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error processing DPDP request:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}