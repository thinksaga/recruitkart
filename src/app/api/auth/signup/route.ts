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
    role: z.enum([UserRole.COMPANY_ADMIN, UserRole.TAS, UserRole.CANDIDATE]),
    // Optional fields for profile creation
    companyName: z.string().optional(),
    panNumber: z.string().optional(),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, role, companyName, panNumber, fullName, phoneNumber } = signupSchema.parse(body);

        const hashedPassword = await bcrypt.hash(password, 10);

        // Atomic transaction to create User and Profile
        await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    password_hash: hashedPassword,
                    role,
                    verification_status: role === UserRole.CANDIDATE ? 'VERIFIED' : 'PENDING',
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
            } else if (role === UserRole.TAS) {
                if (!panNumber) throw new Error('PAN Number is required for TAS');
                await tx.tASProfile.create({
                    data: {
                        user_id: user.id,
                        pan_number: panNumber,
                    },
                });
            } else if (role === UserRole.CANDIDATE) {
                if (!fullName || !phoneNumber) throw new Error('Full Name and Phone Number are required for Candidate');
                await tx.candidate.create({
                    data: {
                        user_id: user.id,
                        full_name: fullName,
                        phone: phoneNumber,
                        email: email, // Candidate schema has email field
                    },
                });
            }
        });

        return NextResponse.json({
            message: 'User created successfully.',
            role: role,
            verification_status: role === UserRole.CANDIDATE ? 'VERIFIED' : 'PENDING'
        }, { status: 201 });
    } catch (error: any) {
        console.error('Signup Error:', error);
        if (error.code === 'P2002') {
            const target = error.meta?.target;
            if (Array.isArray(target)) {
                if (target.includes('email')) {
                    return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
                }
                if (target.includes('phone')) {
                    return NextResponse.json({ error: 'Phone number already exists' }, { status: 400 });
                }
                if (target.includes('pan_number')) {
                    return NextResponse.json({ error: 'PAN number already exists' }, { status: 400 });
                }
            }
            return NextResponse.json({ error: 'A record with this information already exists' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 400 });
    }
}
