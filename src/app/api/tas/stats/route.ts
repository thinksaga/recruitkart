import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        console.log('TAS Stats API: All cookies:', allCookies.map(c => c.name));
        const token = cookieStore.get('token')?.value;

        if (!token) {
            console.log('TAS Stats API: No token found');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Get TAS Profile
        const tasProfile = await prisma.tASProfile.findUnique({
            where: { user_id: payload.userId as string },
        });

        if (!tasProfile) {
            return NextResponse.json({ error: 'TAS Profile not found' }, { status: 404 });
        }

        // 1. Total Candidates (All candidates in the system for now)
        const totalCandidates = await prisma.candidate.count();

        // 2. Active Submissions (My submissions that are not rejected or hired yet)
        const activeSubmissions = await prisma.submission.count({
            where: {
                tas_id: tasProfile.id,
                status: {
                    in: ['PENDING_CONSENT', 'LOCKED', 'ACTIVE', 'INTERVIEWING']
                }
            }
        });

        // 3. Credits Balance
        const creditsBalance = tasProfile.credits_balance;

        // 4. Success Rate
        const totalMySubmissions = await prisma.submission.count({
            where: { tas_id: tasProfile.id }
        });

        const successfulSubmissions = await prisma.submission.count({
            where: {
                tas_id: tasProfile.id,
                status: 'HIRED'
            }
        });

        const successRate = totalMySubmissions > 0
            ? Math.round((successfulSubmissions / totalMySubmissions) * 100)
            : 0;

        return NextResponse.json({
            stats: [
                { name: 'Total Candidates', value: totalCandidates.toString(), icon: 'Users', color: 'text-orange-500', bg: 'bg-orange-500/10' },
                { name: 'Active Submissions', value: activeSubmissions.toString(), icon: 'Send', color: 'text-amber-500', bg: 'bg-amber-500/10' },
                { name: 'Credits Balance', value: creditsBalance.toString(), icon: 'Coins', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                { name: 'Success Rate', value: `${successRate}%`, icon: 'TrendingUp', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
            ]
        });

    } catch (error) {
        console.error('TAS Stats Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
