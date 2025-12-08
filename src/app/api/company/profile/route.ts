import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET: Fetch Company Profile
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

        // Get user and organization
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { organization: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.role !== 'COMPANY_ADMIN' && user.role !== 'COMPANY_MEMBER') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (!user.organization) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        return NextResponse.json(user.organization);

    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PATCH: Update Company Profile
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

        // Get user and check role
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { organization: true }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (user.role !== 'COMPANY_ADMIN') {
            return NextResponse.json({ error: 'Forbidden: Only admins can update profile' }, { status: 403 });
        }

        if (!user.organization_id) {
            return NextResponse.json({ error: 'Organization not found' }, { status: 404 });
        }

        const data = await request.json();

        // Whitelist fields to update for security
        const {
            description,
            industry,
            size,
            founded_year,
            address,
            social_links,
            branding_color,
            website,
            gstin,
            gst_certificate_url,
            documents // [{ name, url, type }]
        } = data;

        const updatedOrg = await prisma.organization.update({
            where: { id: user.organization_id },
            data: {
                description,
                industry,
                size,
                founded_year: founded_year ? parseInt(founded_year) : undefined,
                address,
                social_links,
                branding_color,
                website,
                gstin,
                gst_certificate_url,
                documents: documents || undefined
            }
        });

        return NextResponse.json(updatedOrg);

    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
