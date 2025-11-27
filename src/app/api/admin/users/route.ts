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

        // Check for internal staff roles
        const internalRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'SUPPORT_AGENT', 'OPERATOR', 'FINANCE_CONTROLLER'];
        if (!payload || typeof payload.role !== 'string' || !internalRoles.includes(payload.role)) {
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
                phone: true,
                role: true,
                verification_status: true,
                created_at: true,
                last_login_at: true,
                failed_login_attempts: true,
                organization: {
                    select: {
                        id: true,
                        legal_name: true,
                        display_name: true,
                        gstin: true,
                        domain: true,
                        website: true,
                    },
                },
                tas_profile: {
                    select: {
                        full_name: true,
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

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        // Check for admin roles
        const adminRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER'];
        if (!payload || typeof payload.role !== 'string' || !adminRoles.includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const { email, phone, role, organizationId, tasProfile } = await request.json();

        if (!email || !role) {
            return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 400 });
        }

        const userData: any = {
            email,
            phone,
            role,
            verification_status: 'PENDING',
        };

        if (organizationId) {
            userData.organization_id = organizationId;
        }

        const user = await prisma.user.create({
            data: userData,
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                verification_status: true,
                created_at: true,
                organization: {
                    select: {
                        id: true,
                        legal_name: true,
                        display_name: true,
                        gstin: true,
                        domain: true,
                        website: true,
                    },
                },
                tas_profile: {
                    select: {
                        full_name: true,
                        pan_number: true,
                        linkedin_url: true,
                        credits_balance: true,
                    },
                },
            },
        });

        // Create TAS profile if role is TAS
        if (role === 'TAS' && tasProfile) {
            await prisma.tASProfile.create({
                data: {
                    user_id: user.id,
                    full_name: tasProfile.fullName,
                    pan_number: tasProfile.panNumber,
                    linkedin_url: tasProfile.linkedinUrl,
                    credits_balance: tasProfile.creditsBalance || 0,
                },
            });
        }

        return NextResponse.json({ user, message: 'User created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Create user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        // Check for admin roles
        const adminRoles = ['SUPER_ADMIN', 'COMPLIANCE_OFFICER'];
        if (!payload || typeof payload.role !== 'string' || !adminRoles.includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
        }

        const { id, email, phone, role, organizationId, tasProfile } = await request.json();

        if (!id || !email || !role) {
            return NextResponse.json({ error: 'ID, email and role are required' }, { status: 400 });
        }

        const userData: any = {
            email,
            phone,
            role,
        };

        if (organizationId) {
            userData.organization_id = organizationId;
        }

        const user = await prisma.user.update({
            where: { id },
            data: userData,
            select: {
                id: true,
                email: true,
                phone: true,
                role: true,
                verification_status: true,
                created_at: true,
                organization: {
                    select: {
                        id: true,
                        legal_name: true,
                        display_name: true,
                        gstin: true,
                        domain: true,
                        website: true,
                    },
                },
                tas_profile: {
                    select: {
                        full_name: true,
                        pan_number: true,
                        linkedin_url: true,
                        credits_balance: true,
                    },
                },
            },
        });

        // Update TAS profile if role is TAS
        if (role === 'TAS' && tasProfile) {
            await prisma.tASProfile.upsert({
                where: { user_id: id },
                update: {
                    full_name: tasProfile.fullName,
                    pan_number: tasProfile.panNumber,
                    linkedin_url: tasProfile.linkedinUrl,
                    credits_balance: tasProfile.creditsBalance || 0,
                },
                create: {
                    user_id: id,
                    full_name: tasProfile.fullName,
                    pan_number: tasProfile.panNumber,
                    linkedin_url: tasProfile.linkedinUrl,
                    credits_balance: tasProfile.creditsBalance || 0,
                },
            });
        }

        return NextResponse.json({ user, message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        // Check for admin roles
        const adminRoles = ['SUPER_ADMIN'];
        if (!payload || typeof payload.role !== 'string' || !adminRoles.includes(payload.role)) {
            return NextResponse.json({ error: 'Forbidden - Super Admin access required' }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Delete TAS profile first if exists
        await prisma.tASProfile.deleteMany({
            where: { user_id: id },
        });

        // Delete user
        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
