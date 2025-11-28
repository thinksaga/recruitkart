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

        // Get TAS profile
        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: userId },
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS profile not found' }, { status: 404 });
        }

        // Get recent submissions (last 10)
        const submissions = await prisma.submission.findMany({
            where: {
                tas_id: tasProfile.id,
            },
            include: {
                candidate: {
                    select: {
                        full_name: true,
                        email: true,
                    },
                },
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
            orderBy: {
                created_at: 'desc',
            },
            take: 10,
        });

        return NextResponse.json({
            success: true,
            submissions: submissions,
        });
    } catch (error) {
        console.error('Error fetching recent submissions:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
