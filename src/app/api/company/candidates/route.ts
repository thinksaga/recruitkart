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

        const submissions = await prisma.submission.findMany({
            where: {
                job: {
                    organization_id: user.organization_id
                }
            },
            include: {
                candidate: {
                    select: {
                        full_name: true,
                        email: true,
                        phone: true,
                        years_of_experience: true,
                        skills_primary: true
                    }
                },
                job: {
                    select: {
                        title: true
                    }
                },
                interviews: {
                    orderBy: { created_at: 'desc' },
                    take: 1
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        const formattedCandidates = submissions.map(sub => {
            const latestInterview = sub.interviews[0];
            return {
                id: sub.id,
                name: sub.candidate.full_name,
                role: sub.job.title, // Applied for
                experience: sub.candidate.years_of_experience ? `${sub.candidate.years_of_experience} years` : 'Fresher',
                email: sub.candidate.email,
                phone: sub.candidate.phone,
                status: sub.status,
                stage: latestInterview ? latestInterview.round_type : 'Screening',
                applied: new Date(sub.created_at).toLocaleDateString(),
                skills: sub.candidate.skills_primary || []
            };
        });

        return NextResponse.json({ candidates: formattedCandidates });

    } catch (error) {
        console.error('Company Candidates Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
