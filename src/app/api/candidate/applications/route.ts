import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (typeof payload.role !== 'string' || payload.role !== 'CANDIDATE') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const candidate = await prisma.candidate.findUnique({
            where: { user_id: payload.userId as string },
        });

        if (!candidate) {
            return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
        }

        const applications = await prisma.submission.findMany({
            where: {
                candidate_id: candidate.id,
            },
            include: {
                job: {
                    select: {
                        title: true,
                        organization: {
                            select: {
                                name: true,
                                logo_url: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });

        return NextResponse.json({ applications });
    } catch (error) {
        console.error('Get applications error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
