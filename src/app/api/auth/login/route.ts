import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { signJWT } from '@/lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        // Get client IP and user agent
        const forwardedFor = req.headers.get('x-forwarded-for');
        const ip_address = forwardedFor ? forwardedFor.split(',')[0] : req.headers.get('x-real-ip') || 'unknown';
        const user_agent = req.headers.get('user-agent') || 'unknown';

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Check if account is locked
        if (user.locked_until && user.locked_until > new Date()) {
            return NextResponse.json({
                error: `Account is locked until ${user.locked_until.toISOString()}. Too many failed login attempts.`
            }, { status: 423 });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            // Increment failed login attempts
            const newFailedAttempts = user.failed_login_attempts + 1;
            const shouldLock = newFailedAttempts >= 5;

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    failed_login_attempts: newFailedAttempts,
                    locked_until: shouldLock ? new Date(Date.now() + 30 * 60 * 1000) : null, // Lock for 30 minutes
                },
            });

            if (shouldLock) {
                return NextResponse.json({
                    error: 'Account locked due to too many failed login attempts. Try again in 30 minutes.'
                }, { status: 423 });
            }

            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Successful login - reset failed attempts and update login metadata
        await prisma.user.update({
            where: { id: user.id },
            data: {
                failed_login_attempts: 0,
                locked_until: null,
                last_login_at: new Date(),
                last_ip_address: ip_address,
            },
        });

        const token = await signJWT({
            userId: user.id,
            role: user.role,
            organizationId: user.organization_id,
            verificationStatus: user.verification_status,
        });

        const response = NextResponse.json({
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                verificationStatus: user.verification_status,
            }
        });
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return response;
    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
