import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import * as bcrypt from 'bcryptjs';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['ADMIN', 'SUPPORT', 'OPERATOR'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                organization: true,
                tas_profile: true,
                candidate: {
                    include: {
                        experience: true,
                        education: true,
                        projects: true,
                        certifications: true,
                        languages: true,
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ user });
    } catch (error) {
        console.error('Get user details error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['ADMIN', 'SUPPORT'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden - Admin or Support access required' }, { status: 403 });
        }

        const { verification_status, role, phone, is_active, password } = await request.json();

        const updateData: any = {};
        if (verification_status) {
            if (!['PENDING', 'VERIFIED', 'REJECTED'].includes(verification_status)) {
                return NextResponse.json({ error: 'Invalid verification status' }, { status: 400 });
            }
            updateData.verification_status = verification_status;
        }

        if (role) {
            if (!['SUPPORT', 'OPERATOR', 'FINANCIAL_CONTROLLER', 'COMPLIANCE_OFFICER', 'ADMIN', 'TAS', 'COMPANY_ADMIN', 'COMPANY_MEMBER', 'INTERVIEWER', 'DECISION_MAKER', 'CANDIDATE'].includes(role)) {
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            }
            updateData.role = role;
        }

        if (phone !== undefined) updateData.phone = phone;
        if (is_active !== undefined) updateData.is_active = is_active;

        if (password) {
            // Only admins can reset passwords
            if (payload.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Only admins can reset passwords' }, { status: 403 });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password_hash = hashedPassword;
        }

        const user = await prisma.user.update({
            where: { id },
            data: updateData,
        });

        return NextResponse.json({ user, message: 'User updated successfully' });
    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.user.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
