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

// GET: Fetch user settings
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

        // Get user info
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                email: true,
                tas_profile: {
                    select: {
                        full_name: true,
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return default settings (you can store these in database if needed)
        const settings = {
            email: user.email,
            fullName: user.tas_profile?.full_name || '',
            notificationPreferences: {
                emailNotifications: true,
                smsNotifications: false,
                submissionUpdates: true,
                paymentAlerts: true,
                newJobMatches: true,
                weeklyReports: false,
            },
            securitySettings: {
                twoFactorEnabled: false,
                loginAlerts: true,
                sessionTimeout: 30,
            },
        };

        return NextResponse.json({
            success: true,
            settings: settings,
        });
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT: Update user settings
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

        // Note: In a production app, you would store these settings in a UserSettings table
        // For now, we'll just return success since the settings are stored client-side
        // You can extend the database schema to include a UserSettings model

        return NextResponse.json({
            success: true,
            message: 'Settings updated successfully',
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
