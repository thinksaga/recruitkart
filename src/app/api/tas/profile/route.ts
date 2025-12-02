import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const updateProfileSchema = z.object({
    linkedin_url: z.string().url().optional().or(z.literal('')),
    pan_number: z.string().min(10).max(10).optional(),
});

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: payload.userId as string },
            include: {
                user: {
                    select: {
                        email: true,
                        verification_status: true
                    }
                }
            }
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS Profile not found' }, { status: 404 });
        }

        return NextResponse.json({ profile: tasProfile });

    } catch (error) {
        console.error('TAS Profile Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);

        const tasProfile = await prisma.tASProfile.update({
            where: { user_id: payload.userId as string },
            data: {
                linkedin_url: validatedData.linkedin_url,
                pan_number: validatedData.pan_number
            }
        });

        return NextResponse.json({ profile: tasProfile });

    } catch (error) {
        console.error('TAS Profile Update Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
