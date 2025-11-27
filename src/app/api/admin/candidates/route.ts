import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return null;
        }

        const decoded = await verifyJWT(token) as { userId: string } | null;
        if (!decoded) {
            return null;
        }

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, role: true },
        });

        if (!user) {
            return null;
        }

        // Allow internal staff roles
        const allowedRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'OPERATOR'];
        if (!allowedRoles.includes(user.role)) {
            return null;
        }

        return user;
    } catch (error) {
        return null;
    }
}

// GET /api/admin/candidates - List candidates with filters
export async function GET(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const skill = searchParams.get('skill') || '';
    const location = searchParams.get('location') || '';
    const blacklistFilter = searchParams.get('blacklist');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    try {
        const where: any = {};

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
            ];
        }

        if (skill) {
            where.skills_primary = {
                has: skill,
            };
        }

        if (location) {
            where.personal_details = {
                path: ['current_location'],
                string_contains: location,
            };
        }

        if (blacklistFilter === 'true') {
            where.is_blacklisted = true;
        } else if (blacklistFilter === 'false') {
            where.is_blacklisted = false;
        }

        const [candidates, total] = await Promise.all([
            prisma.candidate.findMany({
                where,
                include: {
                    submissions: {
                        select: {
                            id: true,
                            status: true,
                            created_at: true,
                            job: {
                                select: {
                                    id: true,
                                    title: true,
                                    organization: {
                                        select: { display_name: true },
                                    },
                                },
                            },
                        },
                        orderBy: { created_at: 'desc' },
                        take: 5,
                    },
                    _count: {
                        select: {
                            submissions: true,
                        },
                    },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            prisma.candidate.count({ where }),
        ]);

        return NextResponse.json({
            candidates,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        return NextResponse.json(
            { error: 'Failed to fetch candidates' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/candidates/:id - Update candidate (blacklist toggle)
export async function PATCH(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only SUPER_ADMIN and COMPLIANCE_OFFICER can blacklist
    if (!['SUPER_ADMIN', 'COMPLIANCE_OFFICER'].includes(admin.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { candidateId, blacklisted, blacklist_reason } = body;

        if (!candidateId) {
            return NextResponse.json(
                { error: 'candidateId is required' },
                { status: 400 }
            );
        }

        const candidate = await prisma.candidate.update({
            where: { id: candidateId },
            data: {
                is_blacklisted: blacklisted === true,
                // Note: blacklist_reason would need to be added to schema if needed
            },
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                actor_id: admin.id,
                action: blacklisted ? 'BLACKLIST_CANDIDATE' : 'UNBLACKLIST_CANDIDATE',
                entity_type: 'Candidate',
                entity_id: candidateId,
                changes: {
                    is_blacklisted: blacklisted,
                    reason: blacklist_reason,
                },
            },
        });

        return NextResponse.json({ candidate });
    } catch (error) {
        console.error('Error updating candidate:', error);
        return NextResponse.json(
            { error: 'Failed to update candidate' },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/candidates/:id - Delete candidate data (DPDP compliance)
export async function DELETE(request: NextRequest) {
    const admin = await verifyAdmin(request);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only SUPER_ADMIN and COMPLIANCE_OFFICER can delete
    if (!['SUPER_ADMIN', 'COMPLIANCE_OFFICER'].includes(admin.role)) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const candidateId = searchParams.get('id');

        if (!candidateId) {
            return NextResponse.json(
                { error: 'candidateId is required' },
                { status: 400 }
            );
        }

        // Soft delete - set blacklisted and clear PII
        const candidate = await prisma.candidate.update({
            where: { id: candidateId },
            data: {
                is_blacklisted: true,
                email: `deleted_${candidateId}@deleted.com`,
                phone: `deleted_${candidateId}`,
                full_name: 'DELETED',
                personal_details: {},
                work_history: [],
                education_history: [],
                video_resume_url: null,
            },
        });

        // Create audit log
        await prisma.auditLog.create({
            data: {
                actor_id: admin.id,
                action: 'DELETE_CANDIDATE_DATA',
                entity_type: 'Candidate',
                entity_id: candidateId,
                changes: {
                    reason: 'DPDP_COMPLIANCE',
                },
            },
        });

        return NextResponse.json({ success: true, candidate });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        return NextResponse.json(
            { error: 'Failed to delete candidate' },
            { status: 500 }
        );
    }
}
