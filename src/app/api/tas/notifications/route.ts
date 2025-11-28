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

        // Get recent notifications (last 10)
        // For now, we'll generate notifications based on recent activity
        // In a production app, you'd have a dedicated notifications table

        const notifications = [];

        // Check for recent submissions that need attention
        const recentSubmissions = await prisma.submission.findMany({
            where: {
                tas_id: tasProfile.id,
                status: {
                    in: ['PENDING_CONSENT', 'ACTIVE', 'SCREENING', 'INTERVIEWING', 'OFFER_EXTENDED'],
                },
            },
            include: {
                job: {
                    select: {
                        title: true,
                        organization: {
                            select: {
                                display_name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                updated_at: 'desc',
            },
            take: 5,
        });

        // Generate notifications from submissions
        for (const submission of recentSubmissions) {
            let title = '';
            let time = '';

            const timeDiff = Date.now() - new Date(submission.updated_at).getTime();
            const minutes = Math.floor(timeDiff / (1000 * 60));
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));
            const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

            if (minutes < 60) {
                time = `${minutes}m ago`;
            } else if (hours < 24) {
                time = `${hours}h ago`;
            } else {
                time = `${days}d ago`;
            }

            switch (submission.status) {
                case 'PENDING_CONSENT':
                    title = `Candidate consent pending for ${submission.job.title}`;
                    break;
                case 'ACTIVE':
                    title = `New submission accepted for ${submission.job.title}`;
                    break;
                case 'SCREENING':
                    title = `Your submission for ${submission.job.title} is being reviewed`;
                    break;
                case 'INTERVIEWING':
                    title = `Interview scheduled for ${submission.job.title}`;
                    break;
                case 'OFFER_EXTENDED':
                    title = `Offer extended for ${submission.job.title}`;
                    break;
            }

            if (title) {
                notifications.push({
                    id: `submission_${submission.id}`,
                    title,
                    time,
                    unread: minutes < 60, // Mark as unread if less than 1 hour old
                    type: 'submission',
                });
            }
        }

        // Check for recent payouts
        const recentPayouts = await prisma.payoutLog.findMany({
            where: {
                tas_id: tasProfile.id,
                status: 'PAID',
                created_at: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                },
            },
            include: {
                job: {
                    select: {
                        title: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            take: 3,
        });

        // Generate notifications from payouts
        for (const payout of recentPayouts) {
            const timeDiff = Date.now() - new Date(payout.created_at).getTime();
            const hours = Math.floor(timeDiff / (1000 * 60 * 60));

            notifications.push({
                id: `payout_${payout.id}`,
                title: `Payment received for ${payout.job.title}`,
                time: hours < 1 ? 'Just now' : `${hours}h ago`,
                unread: hours < 24,
                type: 'payment',
            });
        }

        // Check for low credits warning
        if (tasProfile.credits_balance <= 5) {
            notifications.push({
                id: 'low_credits',
                title: 'Low credits balance - Consider purchasing more credits',
                time: 'Now',
                unread: true,
                type: 'warning',
            });
        }

        // Sort notifications by time (most recent first)
        notifications.sort((a, b) => {
            const timeA = a.time.includes('m ago') ? parseInt(a.time) :
                a.time.includes('h ago') ? parseInt(a.time) * 60 :
                    a.time.includes('d ago') ? parseInt(a.time) * 1440 : 0;
            const timeB = b.time.includes('m ago') ? parseInt(b.time) :
                b.time.includes('h ago') ? parseInt(b.time) * 60 :
                    b.time.includes('d ago') ? parseInt(b.time) * 1440 : 0;
            return timeA - timeB;
        });

        // Take only the most recent 10
        const recentNotifications = notifications.slice(0, 10);

        return NextResponse.json({
            success: true,
            notifications: recentNotifications,
        });
    } catch (error) {
        console.error('Error fetching TAS notifications:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
