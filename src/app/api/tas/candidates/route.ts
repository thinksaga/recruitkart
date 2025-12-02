import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const candidates = await prisma.candidate.findMany({
            orderBy: {
                created_at: 'desc'
            }
        });

        const formattedCandidates = candidates.map(candidate => {
            const personalDetails = candidate.personal_details as any || {};
            return {
                id: candidate.id,
                name: candidate.full_name,
                role: 'Candidate', // Default
                experience: candidate.years_of_experience ? `${candidate.years_of_experience} years` : 'Fresher',
                location: personalDetails.current_location || 'Not specified',
                email: candidate.email,
                phone: candidate.phone,
                status: 'Available', // Default
                skills: candidate.skills_primary || []
            };
        });

        return NextResponse.json({ candidates: formattedCandidates });

    } catch (error) {
        console.error('TAS Candidates Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

const createCandidateSchema = z.object({
    full_name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    years_of_experience: z.number().min(0).optional(),
    current_location: z.string().optional(),
    skills_primary: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'TAS') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const validatedData = createCandidateSchema.parse(body);

        // Check for duplicates
        const existingCandidate = await prisma.candidate.findFirst({
            where: {
                OR: [
                    { email: validatedData.email },
                    { phone: validatedData.phone }
                ]
            }
        });

        if (existingCandidate) {
            return NextResponse.json({
                error: 'Candidate already exists',
                details: existingCandidate.email === validatedData.email ? 'Email already registered' : 'Phone number already registered'
            }, { status: 409 });
        }

        // Create Candidate
        const newCandidate = await prisma.candidate.create({
            data: {
                full_name: validatedData.full_name,
                email: validatedData.email,
                phone: validatedData.phone,
                years_of_experience: validatedData.years_of_experience || 0,
                skills_primary: validatedData.skills_primary || [],
                personal_details: {
                    current_location: validatedData.current_location || ''
                }
            }
        });

        return NextResponse.json({ success: true, candidate: newCandidate });

    } catch (error: any) {
        console.error('Create Candidate Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
