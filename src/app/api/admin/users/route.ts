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
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status');
        const role = searchParams.get('role');
        const sortBy = searchParams.get('sortBy') || 'created_at';
        const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

        const skip = (page - 1) * limit;

        const where: any = {};

        if (status && status !== 'ALL') where.verification_status = status;
        if (role && role !== 'ALL') where.role = role;

        if (search) {
            where.OR = [
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { organization: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: sortOrder },
                select: {
                    id: true,
                    email: true,
                    role: true,
                    verification_status: true,
                    created_at: true,
                    phone: true,
                    avatar_url: true,
                    last_login_at: true,
                    is_active: true,
                    organization: {
                        select: {
                            id: true,
                            name: true,
                            gstin: true,
                            domain: true,
                            website: true,
                            logo_url: true,
                        },
                    },
                    tas_profile: {
                        select: {
                            pan_number: true,
                            linkedin_url: true,
                            credits_balance: true,
                        },
                    },
                },
            }),
            prisma.user.count({ where }),
        ]);

        return NextResponse.json({
            users,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit,
            }
        });
    } catch (error) {
        console.error('Get users error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const createUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['SUPPORT', 'OPERATOR', 'FINANCIAL_CONTROLLER', 'COMPLIANCE_OFFICER', 'ADMIN']),
    name: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const { email, password, role, name } = createUserSchema.parse(body);

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                email,
                password_hash: hashedPassword,
                role,
                verification_status: 'VERIFIED', // Internal users are auto-verified
                // We can add name to a profile if needed, but User model doesn't have name directly usually
                // Assuming User model might be extended or we just use email for now.
                // Checking schema... User model usually has email, password_hash, role.
            },
        });

        return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email, role: newUser.role } });

    } catch (error: any) {
        console.error('Create user error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
