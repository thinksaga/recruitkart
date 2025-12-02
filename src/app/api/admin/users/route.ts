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
        const role = searchParams.get('role');

        const where: any = {};
        if (status) where.verification_status = status;
        if (role) where.role = role;

        const users = await prisma.user.findMany({
            where,
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                email: true,
                role: true,
                verification_status: true,
                created_at: true,
                organization: {
                    select: {
                        id: true,
                        name: true,
                        gstin: true,
                        domain: true,
                        website: true,
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
        });

        return NextResponse.json({ users });
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
