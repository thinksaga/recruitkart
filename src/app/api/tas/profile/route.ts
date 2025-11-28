import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

interface JWTPayload {
    userId: string;
    role: string;
    organizationId?: string;
    verificationStatus: string;
}

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token) as JWTPayload | null;
        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.userId;

        // Get TAS profile
        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: userId },
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS profile not found' }, { status: 404 });
        }

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                phone: true,
                verification_status: true,
                created_at: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            profile: {
                id: tasProfile.id,
                fullName: tasProfile.full_name,
                panNumber: tasProfile.pan_number,
                gstin: tasProfile.gstin,
                tdsCategory: tasProfile.tds_category,
                linkedinUrl: tasProfile.linkedin_url,
                bankAccountLast4: tasProfile.bank_account_last4,
                ifscCode: tasProfile.ifsc_code,
                creditsBalance: tasProfile.credits_balance,
                reputationScore: tasProfile.reputation_score,
                totalPlacements: tasProfile.total_placements,
                email: user.email,
                phone: user.phone,
                verificationStatus: user.verification_status,
                joinedAt: user.created_at,
            },
        });

    } catch (error) {
        console.error('Error fetching TAS profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token) as JWTPayload | null;
        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.userId;
        const body = await request.json();

        // Validate input
        const allowedFields = [
            'fullName', 'panNumber', 'gstin', 'linkedinUrl',
            'bankAccountLast4', 'ifscCode', 'phone'
        ];

        const updateData: any = {};
        const userUpdateData: any = {};

        for (const [key, value] of Object.entries(body)) {
            if (allowedFields.includes(key)) {
                if (key === 'phone') {
                    userUpdateData.phone = value;
                } else {
                    // Convert camelCase to snake_case
                    const dbKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
                    updateData[dbKey] = value;
                }
            }
        }

        // Update TAS profile
        if (Object.keys(updateData).length > 0) {
            await prisma.tASProfile.update({
                where: { user_id: userId },
                data: updateData,
            });
        }

        // Update user info
        if (Object.keys(userUpdateData).length > 0) {
            await prisma.user.update({
                where: { id: userId },
                data: userUpdateData,
            });
        }

        return NextResponse.json({
            message: 'Profile updated successfully',
        });

    } catch (error) {
        console.error('Error updating TAS profile:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}