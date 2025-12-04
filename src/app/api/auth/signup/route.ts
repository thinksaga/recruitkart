import { NextResponse } from 'next/server';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import prisma from '@/lib/prisma';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { z } from 'zod';

const signupSchema = z.object({
    role: z.nativeEnum(UserRole),
    email: z.string().email(),
    password: z.string().min(8),
    // TAS & Candidate
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    linkedinUrl: z.string().optional(),
    countryCode: z.string().optional(),
    // Company
    companyName: z.string().optional(),
    domain: z.string().optional(),
    website: z.string().optional(),
    contactPerson: z.string().optional(),
    designation: z.string().optional(),
    gstin: z.string().optional(),
    gstCertificateUrl: z.string().optional(),
    address: z.any().optional(),
    // TAS specific
    panNumber: z.string().optional(),
    panFileUrl: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            role, email, password,
            fullName, phoneNumber, linkedinUrl, countryCode,
            companyName, domain, website, contactPerson, designation, gstin, gstCertificateUrl, address,
            panNumber, panFileUrl
        } = signupSchema.parse(body);

        const hashedPassword = await bcrypt.hash(password, 10);

        // Atomic transaction to create User and Profile
        await prisma.$transaction(async (tx) => {
            let user;

            if (role === UserRole.COMPANY_ADMIN) {
                if (!companyName || !gstin || !gstCertificateUrl) {
                    throw new Error('Missing required company fields');
                }

                // Create Organization
                const org = await tx.organization.create({
                    data: {
                        name: companyName,
                        domain: domain,
                        website: website,
                        gstin: gstin,
                        gst_certificate_url: gstCertificateUrl,
                        address: address || {},
                    },
                });

                // Create User linked to Organization
                user = await tx.user.create({
                    data: {
                        email,
                        password_hash: hashedPassword,
                        role,
                        organization_id: org.id,
                        full_name: contactPerson,
                        designation: designation,
                        phone: phoneNumber,
                        is_phone_verified: true,
                        is_email_verified: true,
                        verification_status: 'PENDING',
                    },
                });
            } else {
                // Create User for TAS or Candidate
                user = await tx.user.create({
                    data: {
                        email,
                        password_hash: hashedPassword,
                        role,
                        full_name: fullName,
                        phone: phoneNumber,
                        is_phone_verified: role === UserRole.TAS, // TAS verifies in wizard
                        is_email_verified: role === UserRole.TAS, // TAS verifies in wizard
                        verification_status: role === UserRole.CANDIDATE ? 'VERIFIED' : 'PENDING',
                    },
                });

                if (role === UserRole.TAS) {
                    if (!panNumber || !panFileUrl) throw new Error('PAN Number and File are required for TAS');
                    await tx.tASProfile.create({
                        data: {
                            user_id: user.id,
                            pan_number: panNumber,
                            pan_file_url: panFileUrl,
                            linkedin_url: linkedinUrl,
                        },
                    });
                } else if (role === UserRole.CANDIDATE) {
                    if (!fullName || !phoneNumber) throw new Error('Full Name and Phone Number are required for Candidate');
                    await tx.candidate.create({
                        data: {
                            user_id: user.id,
                            full_name: fullName,
                            phone: phoneNumber,
                            email: email,
                        },
                    });
                }
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
