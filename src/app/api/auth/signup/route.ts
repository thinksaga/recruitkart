import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum([UserRole.COMPANY_ADMIN, UserRole.TAS]),
    // Optional fields for profile creation
    companyName: z.string().optional(),
    panNumber: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role, companyName, panNumber } = signupSchema.parse(body);

        const hashedPassword = await bcrypt.hash(password, 10);

        // Atomic transaction to create User and Profile
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    role,
                    verification_status: 'PENDING', // Default status
                },
            });

            if (role === UserRole.COMPANY_ADMIN) {
                if (!companyName) throw new Error('Company Name is required for Company Admin');
                await tx.organization.create({
                    data: {
                        name: companyName,
                        users: { connect: { id: user.id } }, // Connect user to organization
                    },
                });
                // Update user with organization_id is handled by the relation, but explicit update might be needed if not using nested connect in Organization create
                // Actually, Organization.users is a one-to-many. User has organization_id.
                // Let's do it the other way: Create Organization first? No, User first is fine, then update User or create Organization with user connection.
                // Better: Create Organization and connect User.
                // Wait, User has organization_id. Organization has users[].
                // So creating Organization with `users: { connect: { id: user.id } }` works.
            } else if (role === UserRole.TAS) {
                if (!panNumber) throw new Error('PAN Number is required for TAS');
                await tx.tASProfile.create({
                    data: {
                        user_id: user.id,
                        pan_number: panNumber,
                    },
                });
            }
        });

        return NextResponse.json({ message: 'User created successfully. Verification pending.' }, { status: 201 });
    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
    }
}
