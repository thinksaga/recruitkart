import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const profileSchema = z.object({
    full_name: z.string().min(2),
    phone: z.string().min(10),
    summary: z.string().optional(),
    years_of_experience: z.number().optional(),
    resume_url: z.string().optional(),
    skills_primary: z.array(z.string()),
    skills_secondary: z.array(z.string()),
    personal_details: z.object({
        current_location: z.string().optional(),
        preferred_locations: z.array(z.string()).optional(),
        notice_period: z.string().optional(),
        ctc: z.string().optional(),
        expected_ctc: z.string().optional(),
    }).optional(),
    social_links: z.object({
        linkedin: z.string().url().optional().or(z.literal('')),
        github: z.string().url().optional().or(z.literal('')),
        portfolio: z.string().url().optional().or(z.literal('')),
    }).optional(),
    experience: z.array(z.object({
        company: z.string(),
        role: z.string(),
        location: z.string().optional(),
        start_date: z.string(), // ISO Date string
        end_date: z.string().optional().nullable(),
        is_current: z.boolean().optional(),
        description: z.string().optional(),
        skills_used: z.array(z.string()).optional(),
    })).optional(),
    education: z.array(z.object({
        institution: z.string(),
        degree: z.string(),
        field_of_study: z.string().optional(),
        start_date: z.string(),
        end_date: z.string().optional().nullable(),
        grade: z.string().optional(),
        activities: z.string().optional(),
    })).optional(),
    projects: z.array(z.object({
        title: z.string(),
        description: z.string().optional(),
        url: z.string().optional(),
        start_date: z.string().optional().nullable(),
        end_date: z.string().optional().nullable(),
        skills_used: z.array(z.string()).optional(),
    })).optional(),
    languages: z.array(z.object({
        language: z.string(),
        proficiency: z.string(),
    })).optional(),
});

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
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json({ profile: candidate });
    } catch (error) {
        console.error('Get profile error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
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

        const body = await req.json();
        const validatedData = profileSchema.parse(body);

        // Extract relational data
        const { experience, education, projects, languages, ...candidateData } = validatedData;

        // Transaction to update candidate and replace relations
        const candidate = await prisma.$transaction(async (tx) => {
            // Update main candidate details
            const updatedCandidate = await tx.candidate.update({
                where: { user_id: payload.userId as string },
                data: candidateData,
            });

            // Handle Experience
            if (experience) {
                await tx.candidateExperience.deleteMany({ where: { candidate_id: updatedCandidate.id } });
                if (experience.length > 0) {
                    await tx.candidateExperience.createMany({
                        data: experience.map(exp => ({
                            ...exp,
                            candidate_id: updatedCandidate.id,
                            start_date: new Date(exp.start_date),
                            end_date: exp.end_date ? new Date(exp.end_date) : null,
                        })),
                    });
                }
            }

            // Handle Education
            if (education) {
                await tx.candidateEducation.deleteMany({ where: { candidate_id: updatedCandidate.id } });
                if (education.length > 0) {
                    await tx.candidateEducation.createMany({
                        data: education.map(edu => ({
                            ...edu,
                            candidate_id: updatedCandidate.id,
                            start_date: new Date(edu.start_date),
                            end_date: edu.end_date ? new Date(edu.end_date) : null,
                        })),
                    });
                }
            }

            // Handle Projects
            if (projects) {
                await tx.candidateProject.deleteMany({ where: { candidate_id: updatedCandidate.id } });
                if (projects.length > 0) {
                    await tx.candidateProject.createMany({
                        data: projects.map(proj => ({
                            ...proj,
                            candidate_id: updatedCandidate.id,
                            start_date: proj.start_date ? new Date(proj.start_date) : null,
                            end_date: proj.end_date ? new Date(proj.end_date) : null,
                        })),
                    });
                }
            }

            // Handle Languages
            if (languages) {
                await tx.candidateLanguage.deleteMany({ where: { candidate_id: updatedCandidate.id } });
                if (languages.length > 0) {
                    await tx.candidateLanguage.createMany({
                        data: languages.map(lang => ({
                            ...lang,
                            candidate_id: updatedCandidate.id,
                        })),
                    });
                }
            }

            return updatedCandidate;
        });

        // Fetch updated profile with relations
        const finalProfile = await prisma.candidate.findUnique({
            where: { id: candidate.id },
            include: {
                experience: true,
                education: true,
                projects: true,
                certifications: true,
                languages: true,
            },
        });

        return NextResponse.json({ message: 'Profile updated successfully', profile: finalProfile });
    } catch (error: any) {
        console.error('Update profile error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
