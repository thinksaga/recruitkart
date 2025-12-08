import { NextResponse } from 'next/server';
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

        const orgId = user.organization_id;

        // 1. Active Jobs
        const activeJobs = await prisma.job.count({
            where: {
                organization_id: orgId,
                status: 'OPEN'
            }
        });

        // 2. Total Candidates (Unique candidates applied to company jobs)
        const uniqueCandidates = await prisma.submission.findMany({
            where: {
                job: { organization_id: orgId }
            },
            distinct: ['candidate_id'],
            select: { candidate_id: true }
        });
        const totalCandidates = uniqueCandidates.length;

        // 3. Interviews Scheduled
        const interviewsScheduled = await prisma.interview.count({
            where: {
                submission: { job: { organization_id: orgId } },
                status: 'SCHEDULED'
            }
        });

        // 4. Hires This Month
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const hiresThisMonth = await prisma.submission.count({
            where: {
                job: { organization_id: orgId },
                status: 'HIRED',
                updated_at: {
                    gte: firstDayOfMonth
                }
            }
        });

        // 5. Applications Trend (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(now.getMonth() - 5);
        sixMonthsAgo.setDate(1); // Start of the month 6 months ago

        const trendSubmissions = await prisma.submission.findMany({
            where: {
                job: { organization_id: orgId },
                created_at: {
                    gte: sixMonthsAgo
                }
            },
            select: {
                created_at: true
            }
        });

        // Aggregate by month in JS
        const monthlyStats = new Map<string, number>();
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        // Initialize last 6 months with 0
        for (let i = 0; i < 6; i++) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`; // e.g. "Dec 2024"
            monthlyStats.set(key, 0);
        }

        trendSubmissions.forEach(sub => {
            const d = new Date(sub.created_at);
            const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`;
            if (monthlyStats.has(key)) {
                monthlyStats.set(key, (monthlyStats.get(key) || 0) + 1);
            }
        });

        const applicationsTrend = Array.from(monthlyStats.entries())
            .map(([date, count]) => ({ date, count }))
            .reverse(); // Show oldest to newest

        // 6. Recent Applications
        const recentApplications = await prisma.submission.findMany({
            where: {
                job: { organization_id: orgId }
            },
            take: 5,
            orderBy: { created_at: 'desc' },
            include: {
                candidate: {
                    select: {
                        full_name: true,
                        email: true,
                        user: {
                            select: {
                                avatar_url: true
                            }
                        }
                    }
                },
                job: {
                    select: {
                        title: true
                    }
                }
            }
        });

        return NextResponse.json({
            stats: {
                activeJobs,
                totalCandidates,
                interviewsScheduled,
                hiresThisMonth
            },
            applicationsTrend,
            recentApplications
        });

    } catch (error) {
        console.error('Company Stats Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
