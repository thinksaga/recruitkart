import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const inviteMemberSchema = z.object({
    email: z.string().email("Invalid email"),
    role: z.enum(['COMPANY_ADMIN', 'COMPANY_MEMBER', 'INTERVIEWER', 'DECISION_MAKER'])
});

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['COMPANY_ADMIN', 'COMPANY_MEMBER'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const teamMembers = await prisma.user.findMany({
            where: {
                organization_id: user.organization_id
            },
            select: {
                id: true,
                email: true,
                role: true,
                created_at: true,
                verification_status: true
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        const formattedMembers = teamMembers.map(member => ({
            id: member.id,
            email: member.email,
            role: member.role.replace('COMPANY_', '').replace('_', ' '), // Format role
            status: member.verification_status,
            joined: new Date(member.created_at).toLocaleDateString()
        }));

        return NextResponse.json({ members: formattedMembers });

    } catch (error) {
        console.error('Company Team Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'COMPANY_ADMIN') { // Only Admins can invite
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id: payload.userId as string },
            select: { organization_id: true }
        });

        if (!user?.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const body = await request.json();
        const { email, role } = inviteMemberSchema.parse(body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }

        // Create Invitation (Mocking email sending)
        const invitation = await prisma.invitation.create({
            data: {
                email,
                role: role as any,
                organization_id: user.organization_id,
                token: crypto.randomUUID(), // Generate random token
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days expiry
            }
        });

        return NextResponse.json({ success: true, invitation });

    } catch (error: any) {
        console.error('Invite Member Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
