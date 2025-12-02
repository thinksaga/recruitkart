import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['ADMIN', 'SUPPORT'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status, name, domain, website, gstin } = body;

        const organization = await prisma.organization.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(name && { name }),
                ...(domain && { domain }),
                ...(website && { website }),
                ...(gstin && { gstin }),
            },
        });

        return NextResponse.json({ organization });
    } catch (error) {
        console.error('Update organization error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || !['ADMIN'].includes(payload.role as string)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = await params;

        // Check if organization has users or jobs
        const org = await prisma.organization.findUnique({
            where: { id },
            include: {
                _count: {
                    select: { users: true, jobs: true }
                }
            }
        });

        if (org && (org._count.users > 0 || org._count.jobs > 0)) {
            return NextResponse.json({
                error: 'Cannot delete organization with associated users or jobs. Block it instead.'
            }, { status: 400 });
        }

        await prisma.organization.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete organization error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
