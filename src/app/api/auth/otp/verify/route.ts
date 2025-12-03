import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { type, otp } = await req.json();

        // Mock verification: OTP must be '123456'
        if (otp !== '123456') {
            return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
        }

        // For signup flow, we don't update the user in DB yet because they don't exist.
        // We just return success, and the frontend will mark the step as verified.
        // In a real app, we might return a signed token proving verification.

        return NextResponse.json({ message: 'Verification successful' });
    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
