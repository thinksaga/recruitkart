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
    // TAS specific fields
    fullName: z.string().optional(),
    panNumber: z.string().optional(),
    phone: z.string().optional(),
    linkedinUrl: z.string().optional(),
    // Company specific fields
    companyName: z.string().optional(),
    gstin: z.string().optional(),
    domain: z.string().optional(),
    website: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role, companyName, panNumber, fullName, phone, linkedinUrl, gstin, domain, website } = signupSchema.parse(body);

        const hashedPassword = await bcrypt.hash(password, 10);

        // Atomic transaction to create User and Profile
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    role,
                    phone: phone || null,
                    verification_status: 'PENDING', // Default status
                },
            });

            if (role === UserRole.COMPANY_ADMIN) {
                if (!companyName) throw new Error('Company Name is required for Company Admin');
                const org = await tx.organization.create({
                    data: {
                        legal_name: companyName,
                        display_name: companyName,
                        gstin: gstin || null,
                        domain: domain || null,
                        website: website || null,
                    },
                });
                // Update user with organization_id
                await tx.user.update({
                    where: { id: user.id },
                    data: { organization_id: org.id },
                });
            } else if (role === UserRole.TAS) {
                if (!panNumber) throw new Error('PAN Number is required for TAS');
                if (!fullName) throw new Error('Full Name is required for TAS');
                await tx.tASProfile.create({
                    data: {
                        user_id: user.id,
                        pan_number: panNumber,
                        full_name: fullName,
                        linkedin_url: linkedinUrl || null,
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
