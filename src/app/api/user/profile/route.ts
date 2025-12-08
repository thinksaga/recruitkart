import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch User Profile
export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = payload.userId as string;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                full_name: true,
                phone: true,
                designation: true,
                avatar_url: true,
                role: true,
                created_at: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);

    } catch (error) {
        console.error('Get user profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH: Update User Profile
export async function PATCH(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.userId) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const userId = payload.userId as string;

        const data = await request.json();

        // Whitelist fields
        const { full_name, phone, designation, avatar_url } = data;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                full_name,
                phone,
                designation,
                avatar_url
            },
            select: {
                id: true,
                email: true,
                full_name: true,
                phone: true,
                designation: true,
                avatar_url: true,
                role: true,
                updated_at: true
            }
        });

        return NextResponse.json(updatedUser);

    } catch (error) {
        console.error('Update user profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
