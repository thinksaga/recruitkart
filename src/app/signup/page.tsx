'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, Building2, UserCheck, Briefcase, Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import { UserRole } from '@prisma/client';

// Define schemas for different roles
const baseFields = {
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
};

const companySchema = z.object({
    ...baseFields,
    role: z.literal(UserRole.COMPANY_ADMIN),
    companyName: z.string().min(1, 'Company Name is required'),
    gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format').optional().or(z.literal('')),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    domain: z.string().min(1, 'Company domain is required (e.g., acme.com)'),
    contactPerson: z.string().min(1, 'Contact person name is required'),
    designation: z.string().min(1, 'Designation is required'),
    panNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const tasSchema = z.object({
    ...baseFields,
    role: z.literal(UserRole.TAS),
    panNumber: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN Number format'),
    fullName: z.string().min(1, 'Full name is required'),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number (10 digits starting with 6-9)'),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    companyName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Candidate Schema
const candidateSchema = z.object({
    ...baseFields,
    role: z.literal(UserRole.CANDIDATE),
    fullName: z.string().min(1, 'Full name is required'),
    phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number (10 digits starting with 6-9)'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Union schema for form validation
const signupSchema = z.discriminatedUnion('role', [companySchema, tasSchema, candidateSchema]);

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
    const router = useRouter();
    const [role, setRole] = useState<UserRole | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: undefined,
        }
    });

    const handleRoleSelect = (selectedRole: typeof UserRole.COMPANY_ADMIN | typeof UserRole.TAS | typeof UserRole.CANDIDATE) => {
        setRole(selectedRole);
        setValue('role', selectedRole);
    };

    const onSubmit = async (data: SignupFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            let responseData;
            try {
                responseData = await res.json();
            } catch (e) {
                throw new Error('Failed to parse response');
            }

            if (!res.ok) {
                throw new Error(responseData.error || 'Signup failed');
            }

            if (responseData.role === UserRole.CANDIDATE) {
                router.push('/login');
            } else {
                router.push('/verification-pending');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Join the trustless recruitment protocol"
        >
            {!role ? (
                <div className="grid grid-cols-1 gap-4">
                    <button
                        onClick={() => handleRoleSelect(UserRole.COMPANY_ADMIN)}
                        className="p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-emerald-500 hover:bg-slate-800 transition-all group text-left"
                    >
                        <Building2 className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold text-white">I am a Company</h3>
                        <p className="text-sm text-slate-400 mt-1">Hiring talent securely.</p>
                    </button>

                    <button
                        onClick={() => handleRoleSelect(UserRole.TAS)}
                        className="p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-indigo-500 hover:bg-slate-800 transition-all group text-left"
                    >
                        <UserCheck className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold text-white">I am a Recruiter (TAS)</h3>
                        <p className="text-sm text-slate-400 mt-1">Monetizing my network.</p>
                    </button>

                    <button
                        onClick={() => handleRoleSelect(UserRole.CANDIDATE)}
                        className="p-6 bg-slate-900 border border-slate-800 rounded-lg hover:border-cyan-500 hover:bg-slate-800 transition-all group text-left"
                    >
                        <Briefcase className="w-8 h-8 text-cyan-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-lg font-semibold text-white">I am a Candidate</h3>
                        <p className="text-sm text-slate-400 mt-1">Looking for jobs.</p>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                    <button
                        type="button"
                        onClick={() => setRole(null)}
                        className="text-sm text-slate-400 hover:text-white mb-4 flex items-center gap-1"
                    >
                        ← Back to role selection
                    </button>

                    {error && (
                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-200">Email</label>
                        <input
                            {...register('email')}
                            type="email"
                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            placeholder="name@example.com"
                        />
                        {errors.email && (
                            <p className="text-xs text-red-400">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Password</label>
                            <div className="relative">
                                <input
                                    {...register('password')}
                                    type={showPassword ? "text" : "password"}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-400">{errors.password.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-200">Confirm</label>
                            <div className="relative">
                                <input
                                    {...register('confirmPassword')}
                                    type={showConfirmPassword ? "text" : "password"}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent pr-10"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>
                            )}
                        </div>
                    </div>

                    {role === UserRole.COMPANY_ADMIN && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Company Name *</label>
                                <input
                                    {...register('companyName')}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="Acme Corp"
                                />
                                {'companyName' in errors && (errors as any).companyName && (
                                    <p className="text-xs text-red-400">{(errors as any).companyName.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-200">GSTIN (Optional)</label>
                                    <input
                                        {...register('gstin')}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="22AAAAA0000A1Z5"
                                        maxLength={15}
                                    />
                                    {'gstin' in errors && (errors as any).gstin && (
                                        <p className="text-xs text-red-400">{(errors as any).gstin.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-200">Company Domain *</label>
                                    <input
                                        {...register('domain')}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="acme.com"
                                    />
                                    {'domain' in errors && (errors as any).domain && (
                                        <p className="text-xs text-red-400">{(errors as any).domain.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Company Website (Optional)</label>
                                <input
                                    {...register('website')}
                                    type="url"
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="https://acme.com"
                                />
                                {'website' in errors && (errors as any).website && (
                                    <p className="text-xs text-red-400">{(errors as any).website.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-200">Contact Person *</label>
                                    <input
                                        {...register('contactPerson')}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="John Doe"
                                    />
                                    {'contactPerson' in errors && (errors as any).contactPerson && (
                                        <p className="text-xs text-red-400">{(errors as any).contactPerson.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-200">Designation *</label>
                                    <input
                                        {...register('designation')}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="HR Manager"
                                    />
                                    {'designation' in errors && (errors as any).designation && (
                                        <p className="text-xs text-red-400">{(errors as any).designation.message}</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {role === UserRole.TAS && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Full Name *</label>
                                <input
                                    {...register('fullName')}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="John Doe"
                                />
                                {'fullName' in errors && (errors as any).fullName && (
                                    <p className="text-xs text-red-400">{(errors as any).fullName.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-200">PAN Number *</label>
                                    <input
                                        {...register('panNumber')}
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                    />
                                    {'panNumber' in errors && (errors as any).panNumber && (
                                        <p className="text-xs text-red-400">{(errors as any).panNumber.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-200">Phone Number *</label>
                                    <input
                                        {...register('phoneNumber')}
                                        type="tel"
                                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="9876543210"
                                        maxLength={10}
                                    />
                                    {'phoneNumber' in errors && (errors as any).phoneNumber && (
                                        <p className="text-xs text-red-400">{(errors as any).phoneNumber.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">LinkedIn Profile (Optional)</label>
                                <input
                                    {...register('linkedinUrl')}
                                    type="url"
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="https://linkedin.com/in/yourprofile"
                                />
                                {'linkedinUrl' in errors && (errors as any).linkedinUrl && (
                                    <p className="text-xs text-red-400">{(errors as any).linkedinUrl.message}</p>
                                )}
                            </div>
                        </>
                    )}

                    {role === UserRole.CANDIDATE && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Full Name *</label>
                                <input
                                    {...register('fullName')}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="John Doe"
                                />
                                {'fullName' in errors && (errors as any).fullName && (
                                    <p className="text-xs text-red-400">{(errors as any).fullName.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Phone Number *</label>
                                <input
                                    {...register('phoneNumber')}
                                    type="tel"
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    placeholder="9876543210"
                                    maxLength={10}
                                />
                                {'phoneNumber' in errors && errors.phoneNumber && (
                                    <p className="text-xs text-red-400">{errors.phoneNumber.message}</p>
                                )}
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Create Account'
                        )}
                    </button>

                    <div className="text-center text-sm text-slate-400">
                        Already have an account?{' '}
                        <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium">
                            Sign in
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}
