import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
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

        const organizations = await prisma.organization.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                _count: {
                    select: {
                        users: true,
                        jobs: true,
                    },
                },
            },
        });

        return NextResponse.json({ organizations });
    } catch (error) {
        console.error('Get organizations error:', error);
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

        const { legalName, displayName, gstin, domain, website } = await request.json();

        if (!legalName || !displayName) {
            return NextResponse.json({ error: 'Legal name and display name are required' }, { status: 400 });
        }

        const organization = await prisma.organization.create({
            data: {
                legal_name: legalName,
                display_name: displayName,
                gstin,
                domain,
                website,
            },
            include: {
                _count: {
                    select: {
                        users: true,
                        jobs: true,
                    },
                },
            },
        });

        return NextResponse.json({ organization, message: 'Organization created successfully' }, { status: 201 });
    } catch (error) {
        console.error('Create organization error:', error);
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

        const { id, legalName, displayName, gstin, domain, website } = await request.json();

        if (!id || !legalName || !displayName) {
            return NextResponse.json({ error: 'ID, legal name and display name are required' }, { status: 400 });
        }

        const organization = await prisma.organization.update({
            where: { id },
            data: {
                legal_name: legalName,
                display_name: displayName,
                gstin,
                domain,
                website,
            },
            include: {
                _count: {
                    select: {
                        users: true,
                        jobs: true,
                    },
                },
            },
        });

        return NextResponse.json({ organization, message: 'Organization updated successfully' });
    } catch (error) {
        console.error('Update organization error:', error);
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
            return NextResponse.json({ error: 'Organization ID is required' }, { status: 400 });
        }

        // Check if organization has users
        const userCount = await prisma.user.count({
            where: { organization_id: id },
        });

        if (userCount > 0) {
            return NextResponse.json({ error: 'Cannot delete organization with existing users' }, { status: 400 });
        }

        await prisma.organization.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Organization deleted successfully' });
    } catch (error) {
        console.error('Delete organization error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
