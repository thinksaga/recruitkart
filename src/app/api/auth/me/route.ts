import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = await verifyJWT(token);

    if (!payload) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // If user is TAS, fetch their profile data
    let tasProfile = null;
    if (payload.role === 'TAS') {
        try {
            tasProfile = await prisma.tASProfile.findUnique({
                where: { user_id: payload.userId as string },
                select: {
                    credits_balance: true,
                    reputation_score: true,
                },
            });
        } catch (error) {
            console.error('Error fetching TAS profile:', error);
        }
    }

    return NextResponse.json({
        user: {
            ...payload,
            tas_profile: tasProfile,
        },
        verificationStatus: payload.verificationStatus,
    });
}
