import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { TicketPriority, TicketCategory } from '@prisma/client';

const createTicketSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(100),
    reason: z.string().min(10, 'Please provide more details (min 10 chars)').max(1000),
    priority: z.nativeEnum(TicketPriority).optional().default(TicketPriority.MEDIUM),
});

export async function POST(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { subject, reason, priority } = createTicketSchema.parse(body);

        const ticket = await prisma.ticket.create({
            data: {
                raised_by_id: payload.id as string,
                subject,
                reason,
                priority,
                status: 'OPEN',
                category: TicketCategory.OTHER, // Using OTHER as default since VERIFICATION_ISSUE might not exist in enum yet
            },
        });

        return NextResponse.json({ success: true, ticket });

    } catch (error: any) {
        console.error('Create ticket error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input', details: (error as any).errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
