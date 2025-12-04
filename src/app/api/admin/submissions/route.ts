import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['ADMIN', 'SUPPORT', 'OPERATOR'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const where: any = {};
        if (status && status !== 'ALL') where.status = status;

        if (search) {
            where.OR = [
                { candidate: { full_name: { contains: search, mode: 'insensitive' } } },
                { job: { title: { contains: search, mode: 'insensitive' } } },
                { tas: { user: { email: { contains: search, mode: 'insensitive' } } } }
            ];
        }

        const [submissions, total] = await Promise.all([
            prisma.submission.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    candidate: {
                        select: {
                            full_name: true,
                            email: true,
                        }
                    },
                    job: {
                        select: {
                            title: true,
                            organization: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    },
                    tas: {
                        select: {
                            user: {
                                select: {
                                    email: true
                                }
                            }
                        }
                    }
                }
            }),
            prisma.submission.count({ where })
        ]);

        return NextResponse.json({
            submissions,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                current: page
            }
        });

    } catch (error) {
        console.error('Admin submissions error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
