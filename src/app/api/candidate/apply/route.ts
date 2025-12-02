import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';

const applySchema = z.object({
    jobId: z.string().uuid(),
});

export async function POST(req: Request) {
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
        const { jobId } = applySchema.parse(body);

        // Get candidate profile
        const candidate = await prisma.candidate.findUnique({
            where: { user_id: payload.userId as string },
        });

        if (!candidate) {
            return NextResponse.json({ error: 'Candidate profile not found' }, { status: 404 });
        }

        // Check if already applied
        const existingSubmission = await prisma.submission.findFirst({
            where: {
                job_id: jobId,
                candidate_id: candidate.id,
            },
        });

        if (existingSubmission) {
            return NextResponse.json({ error: 'Already applied to this job' }, { status: 400 });
        }

        // Find a default TAS to assign (temporary solution until we have proper assignment logic)
        const tas = await prisma.tASProfile.findFirst();

        if (!tas) {
            return NextResponse.json({ error: 'No TAS available to process application' }, { status: 500 });
        }

        // Create submission
        const submission = await prisma.submission.create({
            data: {
                job_id: jobId,
                candidate_id: candidate.id,
                tas_id: tas.id,
                status: 'PENDING_CONSENT', // Initial status
            },
        });

        return NextResponse.json({ message: 'Application submitted successfully', submission });
    } catch (error: any) {
        console.error('Apply job error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
