import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cache } from '@/lib/cache';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(req: Request) {
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

        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const status = searchParams.get('status');
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { organization: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        if (status && status !== 'ALL') {
            where.status = status;
        }

        const [jobs, total] = await Promise.all([
            prisma.job.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                include: {
                    organization: {
                        select: {
                            name: true,
                        },
                    },
                    _count: {
                        select: {
                            submissions: true
                        }
                    }
                },
            }),
            prisma.job.count({ where })
        ]);

        return NextResponse.json({
            jobs,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });
    } catch (error) {
        console.error('Get jobs error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
