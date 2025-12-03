import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['ADMIN', 'SUPPORT', 'OPERATOR'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const submission = await prisma.submission.findUnique({
            where: { id },
            include: {
                candidate: {
                    include: {
                        experience: true,
                        education: true,
                        projects: true
                    }
                },
                job: {
                    include: {
                        organization: true
                    }
                },
                tas: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                phone: true,
                                avatar_url: true
                            }
                        }
                    }
                },
                interviews: {
                    orderBy: { created_at: 'desc' }
                }
            }
        });

        if (!submission) {
            return NextResponse.json({ error: 'Submission not found' }, { status: 404 });
        }

        return NextResponse.json({ submission });
    } catch (error) {
        console.error('Get submission details error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
