import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
    try {
        const { targetUserId, newPassword } = await request.json();

        if (!targetUserId || !newPassword) {
            return NextResponse.json({ error: 'Target user ID and new password are required' }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
        }

        // Get admin user from session
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || !payload.id) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const adminId = payload.id as string;

        // Check if requester is a COMPANY_ADMIN
        const adminUser = await prisma.user.findUnique({
            where: { id: adminId },
        });

        if (!adminUser || adminUser.role !== 'COMPANY_ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Only Company Admins can reset team passwords' }, { status: 403 });
        }

        // Verify target user belongs to the same organization
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        });

        if (!targetUser) {
            return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
        }

        if (targetUser.organization_id !== adminUser.organization_id) {
            return NextResponse.json({ error: 'Forbidden: You can only manage users in your organization' }, { status: 403 });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await prisma.user.update({
            where: { id: targetUserId },
            data: {
                password_hash: hashedPassword,
            },
        });

        return NextResponse.json({ message: 'Team member password reset successfully' });

    } catch (error) {
        console.error('Reset team member password error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
