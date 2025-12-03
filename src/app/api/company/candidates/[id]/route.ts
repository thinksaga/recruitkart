import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const { id } = await params; // This is the Submission ID

        const submission = await prisma.submission.findUnique({
            where: { id },
            include: {
                candidate: {
                    include: {
                        experience: true,
                        education: true,
                        projects: true
                    }
                },
                job: {
                    select: {
                        id: true,
                        title: true,
                        organization_id: true
                    }
                },
                interviews: {
                    orderBy: { created_at: 'desc' }
                }
            }
        });

        if (!submission) {
            return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
        }

        // Verify the submission belongs to the company's job
        if (submission.job.organization_id !== user.organization_id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const formattedCandidate = {
            id: submission.id,
            candidateId: submission.candidate.id,
            name: submission.candidate.full_name,
            email: submission.candidate.email,
            phone: submission.candidate.phone,
            role: submission.job.title,
            jobId: submission.job.id,
            experience: submission.candidate.years_of_experience,
            location: submission.candidate.personal_details ? (submission.candidate.personal_details as any).current_location : '',
            bio: submission.candidate.bio,
            skills: submission.candidate.skills_primary,
            resumeUrl: submission.candidate.resume_url,
            status: submission.status,
            appliedAt: new Date(submission.created_at).toLocaleDateString(),

            // Detailed Profile
            workHistory: submission.candidate.experience.map(exp => ({
                id: exp.id,
                title: exp.role,
                company: exp.company,
                duration: `${new Date(exp.start_date).getFullYear()} - ${exp.end_date ? new Date(exp.end_date).getFullYear() : 'Present'}`,
                description: exp.description
            })),
            education: submission.candidate.education.map(edu => ({
                id: edu.id,
                degree: edu.degree,
                school: edu.institution,
                year: `${new Date(edu.start_date).getFullYear()} - ${edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}`
            })),

            // Interviews
            interviews: submission.interviews.map(int => ({
                id: int.id,
                round: int.round_type,
                status: int.status,
                outcome: int.outcome,
                date: int.scheduled_at ? new Date(int.scheduled_at).toLocaleDateString() : 'Not scheduled',
                feedback: int.feedback_json
            }))
        };

        return NextResponse.json({ candidate: formattedCandidate });

    } catch (error) {
        console.error('Candidate Details Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
