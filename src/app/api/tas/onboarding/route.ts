import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const { panNumber, panFileUrl } = await req.json();

        if (!panNumber || !panFileUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const payload = await verifyJWT(token);
        if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

        // Create TAS Profile
        await prisma.tASProfile.create({
            data: {
                user_id: payload.userId as string,
                pan_number: panNumber,
                pan_file_url: panFileUrl,
            },
        });

        // Update user status to PENDING_VERIFICATION (if not already)
        // Actually, it should already be PENDING. 
        // We might want to trigger a notification to admin here.

        return NextResponse.json({ message: 'Onboarding completed successfully' });
    } catch (error: any) {
        console.error('Onboarding Error:', error);
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'PAN number already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
