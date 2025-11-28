import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

interface JWTPayload {
    userId: string;
    role: string;
    organizationId?: string;
    verificationStatus: string;
}

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token) as JWTPayload | null;
        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.userId;
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const offset = (page - 1) * limit;

        // Build where clause
        const where: any = {
            tas_id: userId,
        };

        if (status) {
            where.status = status;
        }

        // Get submissions with pagination
        const [submissions, totalCount] = await Promise.all([
            prisma.submission.findMany({
                where,
                include: {
                    job: {
                        select: {
                            id: true,
                            title: true,
                            location: true,
                            salary_min: true,
                            salary_max: true,
                            currency: true,
                            organization_id: true,
                        },
                    },
                    candidate: {
                        select: {
                            id: true,
                            full_name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
                orderBy: {
                    created_at: 'desc',
                },
                skip: offset,
                take: limit,
            }),
            prisma.submission.count({ where }),
        ]);

        // Get organization names for the jobs
        const organizationIds = [...new Set(submissions.map(s => s.job.organization_id))];
        const organizations = await prisma.organization.findMany({
            where: {
                id: { in: organizationIds },
            },
            select: {
                id: true,
                display_name: true,
            },
        });

        const orgMap = organizations.reduce((acc, org) => {
            acc[org.id] = org.display_name;
            return acc;
        }, {} as Record<string, string>);

        const formattedSubmissions = submissions.map(submission => ({
            id: submission.id,
            status: submission.status,
            createdAt: submission.created_at,
            lockedUntil: submission.locked_until,
            acceptedAt: submission.accepted_at,
            joinedAt: submission.joined_at,
            job: {
                id: submission.job.id,
                title: submission.job.title,
                location: submission.job.location,
                salaryRange: `${submission.job.currency} ${submission.job.salary_min.toLocaleString()} - ${submission.job.salary_max.toLocaleString()}`,
                company: orgMap[submission.job.organization_id] || 'Unknown Company',
            },
            candidate: {
                id: submission.candidate.id,
                name: submission.candidate.full_name,
                email: submission.candidate.email,
                phone: submission.candidate.phone,
            },
        }));

        return NextResponse.json({
            submissions: formattedSubmissions,
            pagination: {
                page,
                limit,
                total: totalCount,
                totalPages: Math.ceil(totalCount / limit),
            },
        });

    } catch (error) {
        console.error('Error fetching TAS submissions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}