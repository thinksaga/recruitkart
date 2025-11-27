import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || typeof payload.role !== 'string' || payload.role !== 'COMPANY_ADMIN') {
            return NextResponse.json({ error: 'Forbidden - Company admin access required' }, { status: 403 });
        }

        const { email, role } = await request.json();

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }

        // Validate role
        const allowedRoles = ['COMPANY_MEMBER', 'INTERVIEWER', 'DECISION_MAKER'];
        if (!allowedRoles.includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Get the user's organization
        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        // Check if user already exists with this email
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, organization_id: true }
        });

        if (existingUser) {
            if (existingUser.organization_id === user.organization_id) {
                return NextResponse.json({ error: 'User is already a member of your organization' }, { status: 400 });
            } else {
                return NextResponse.json({ error: 'User is already a member of another organization' }, { status: 400 });
            }
        }

        // Check if invitation already exists
        const existingInvitation = await prisma.invitation.findFirst({
            where: {
                email,
                organization_id: user.organization_id,
                status: 'PENDING'
            }
        });

        if (existingInvitation) {
            return NextResponse.json({ error: 'Invitation already sent to this email' }, { status: 400 });
        }

        // Generate invitation token
        const tokenBytes = randomBytes(32);
        const invitationToken = tokenBytes.toString('hex');

        // Create invitation (expires in 7 days)
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const invitation = await prisma.invitation.create({
            data: {
                email,
                role: role as any,
                organization_id: user.organization_id,
                token: invitationToken,
                expires_at: expiresAt,
            }
        });

        // TODO: Send invitation email
        // For now, just return success

        return NextResponse.json({
            message: 'Invitation sent successfully',
            invitation: {
                id: invitation.id,
                email: invitation.email,
                role: invitation.role,
                expires_at: invitation.expires_at
            }
        });
    } catch (error) {
        console.error('Team invite error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}