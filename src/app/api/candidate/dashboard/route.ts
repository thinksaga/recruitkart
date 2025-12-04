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

        if (!payload || typeof payload.role !== 'string' || payload.role !== 'CANDIDATE') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const candidate = await prisma.candidate.findUnique({
            where: { user_id: payload.userId as string },
            include: {
                experience: true,
                education: true,
                projects: true,
                certifications: true,
                languages: true,
            },
        });

        if (!candidate) {
            return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
        }

        // Calculate Profile Completion
        let completedFields = 0;
        const totalFields = 5; // Bio, Skills, Experience, Education, Resume

        if (candidate.bio) completedFields++;
        if (candidate.skills_primary && candidate.skills_primary.length > 0) completedFields++;
        if (candidate.experience && candidate.experience.length > 0) completedFields++;
        if (candidate.education && candidate.education.length > 0) completedFields++;
        if (candidate.resume_url) completedFields++;

        const profileCompletion = Math.round((completedFields / totalFields) * 100);

        // Fetch Applications
        const applications = await prisma.submission.findMany({
            where: {
                candidate_id: candidate.id,
            },
            include: {
                job: {
                    select: {
                        title: true,
                        organization: {
                            select: {
                                name: true,
                                logo_url: true,
                            },
                        },
                    },
                },
            },
            orderBy: { created_at: 'desc' },
        });

        const activeApplications = applications.filter(app => !['HIRED', 'REJECTED'].includes(app.status)).length;
        const interviews = applications.filter(app => app.status === 'INTERVIEWING').length;
        const recentApplications = applications.slice(0, 5);

        return NextResponse.json({
            stats: {
                profileCompletion,
                activeApplications,
                interviews,
                profileViews: 0, // Placeholder as we don't track views yet
            },
            recentApplications,
        });
    } catch (error) {
        console.error('Get dashboard data error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
