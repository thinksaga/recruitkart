'use client';

import { useState, useEffect } from 'react';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle, Building2, UserCheck, Briefcase, Eye, EyeOff, Smartphone, Mail, CheckCircle, Upload, FileText, ArrowRight, ArrowLeft } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

// Define UserRole locally to avoid importing from @prisma/client in client component
enum UserRole {
    COMPANY_ADMIN = 'COMPANY_ADMIN',
    TAS = 'TAS',
    CANDIDATE = 'CANDIDATE'
}

import { countries } from '@/lib/constants/countries';

const baseFields = {
    email: z.string().email('Invalid email address'),
    password: z.string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character'),
    confirmPassword: z.string(),
    countryCode: z.string(),
};

// Removed local countries array in favor of imported one

const companySchema = z.object({
    ...baseFields,
    role: z.literal(UserRole.COMPANY_ADMIN),
    companyName: z.string().min(1, 'Company Name is required'),
    gstin: z.string().regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format'),
    website: z.string().url('Invalid website URL').optional().or(z.literal('')),
    domain: z.string().min(1, 'Company domain is required (e.g., acme.com)'),
    contactPerson: z.string().min(1, 'Contact person name is required'),
    designation: z.string().min(1, 'Designation is required'),
    phoneNumber: z.string().regex(/^\d{7,15}$/, 'Invalid phone number'),
    // Address fields
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(1, 'ZIP code is required'),
    country: z.string().min(1, 'Country is required'),
    // Step 2 fields
    panNumber: z.string().optional(),
    panFileUrl: z.string().optional(),
    gstCertificateUrl: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const tasSchema = z.object({
    ...baseFields,
    role: z.literal(UserRole.TAS),
    fullName: z.string().min(1, 'Full name is required'),
    phoneNumber: z.string().regex(/^\d{7,15}$/, 'Invalid phone number'),
    linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
    companyName: z.string().optional(),
    // Step 2 fields (initially optional, but validated before final submission)
    panNumber: z.string().optional(),
    panFileUrl: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Candidate Schema
const candidateSchema = z.object({
    ...baseFields,
    role: z.literal(UserRole.CANDIDATE),
    fullName: z.string().min(1, 'Full name is required'),
    phoneNumber: z.string().regex(/^\d{7,15}$/, 'Invalid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

// Union schema for form validation
const signupSchema = z.discriminatedUnion('role', [companySchema, tasSchema, candidateSchema]);

type SignupFormValues = z.infer<typeof signupSchema>;

function ProgressBar({ current, total }: { current: number; total: number }) {
    return (
        <div className="w-full h-1 bg-slate-800 rounded-full mb-8 overflow-hidden">
            <div
                className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${(current / total) * 100}%` }}
            />
        </div>
    );
}

function PasswordStrengthMeter({ password }: { password: string }) {
    if (!password) return null;

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const getColor = (s: number) => {
        if (s <= 2) return 'bg-red-500';
        if (s <= 3) return 'bg-yellow-500';
        if (s <= 4) return 'bg-blue-500';
        return 'bg-emerald-500';
    };

    const getLabel = (s: number) => {
        if (s <= 2) return 'Weak';
        if (s <= 3) return 'Fair';
        if (s <= 4) return 'Good';
        return 'Strong';
    };

    return (
        <div className="mt-2 space-y-1">
            <div className="flex gap-1 h-1">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`h-full flex-1 rounded-full transition-colors ${strength >= level ? getColor(strength) : 'bg-slate-800'
                            }`}
                    />
                ))}
            </div>
            <p className={`text-xs text-right ${strength <= 2 ? 'text-red-400' : strength <= 3 ? 'text-yellow-400' : strength <= 4 ? 'text-blue-400' : 'text-emerald-400'}`}>
                {getLabel(strength)}
            </p>
        </div>
    );
}

export default function SignupPage() {
    const router = useRouter();
    const [role, setRole] = useState<UserRole | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // TAS Wizard State
    const [step, setStep] = useState(1);
    const [phoneOtp, setPhoneOtp] = useState('');
    const [emailOtp, setEmailOtp] = useState('');
    const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [verifyingPhone, setVerifyingPhone] = useState(false);
    const [verifyingEmail, setVerifyingEmail] = useState(false);
    const [panFile, setPanFile] = useState<File | null>(null);
    const [gstFile, setGstFile] = useState<File | null>(null);

    // OTP Resend Timers
    const [phoneResendTimer, setPhoneResendTimer] = useState(0);
    const [emailResendTimer, setEmailResendTimer] = useState(0);

    // Auto-send OTPs when entering verification step
    useEffect(() => {
        const isVerificationStep = (role === UserRole.COMPANY_ADMIN && step === 3) || (role === UserRole.TAS && step === 2);

        if (isVerificationStep) {
            if (!isPhoneOtpSent && !isPhoneVerified) {
                sendOtp('phone');
            }
            if (!isEmailOtpSent && !isEmailVerified) {
                sendOtp('email');
            }
        }
    }, [step, role, isPhoneOtpSent, isPhoneVerified, isEmailOtpSent, isEmailVerified]);

    // Handle timers
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (phoneResendTimer > 0 || emailResendTimer > 0) {
            interval = setInterval(() => {
                setPhoneResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
                setEmailResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [phoneResendTimer, emailResendTimer]);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        trigger,
        formState: { errors },
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            role: undefined,
            countryCode: '+91',
            email: '',
            password: '',
            confirmPassword: '',
            companyName: '',
            domain: '',
            website: '',
            gstin: '',
            contactPerson: '',
            designation: '',
            phoneNumber: '',
            street: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            fullName: '',
            linkedinUrl: '',
            panNumber: '',
        }
    });

    const handleRoleSelect = (selectedRole: typeof UserRole.COMPANY_ADMIN | typeof UserRole.TAS | typeof UserRole.CANDIDATE) => {
        setRole(selectedRole);
        setValue('role', selectedRole);
        setStep(1);
    };

    const handleNextStep = async () => {
        let fieldsToValidate: any[] = [];

        if (step === 1) {
            if (role === UserRole.COMPANY_ADMIN) {
                fieldsToValidate = [
                    'companyName', 'domain', 'website', 'gstin',
                    'street', 'city', 'state', 'zip', 'country'
                ];
            } else {
                // TAS & Candidate
                fieldsToValidate = ['email', 'password', 'confirmPassword', 'fullName', 'phoneNumber'];
                if (role === UserRole.TAS) {
                    fieldsToValidate.push('linkedinUrl');
                }
            }
        } else if (step === 2 && role === UserRole.COMPANY_ADMIN) {
            fieldsToValidate = [
                'contactPerson', 'designation', 'email', 'phoneNumber',
                'password', 'confirmPassword'
            ];
        }

        const isValid = await trigger(fieldsToValidate);
        if (isValid) {
            setStep(prev => prev + 1);
        }
    };

    const sendOtp = async (type: 'phone' | 'email') => {
        const value = type === 'phone' ? watch('phoneNumber') : watch('email');
        const countryCode = type === 'phone' ? watch('countryCode') : undefined; // Only for phone
        if (!value) {
            setError(`Please enter your ${type === 'phone' ? 'phone number' : 'email address'} first.`);
            return;
        }
        setError(null);

        // Start cooldown
        if (type === 'phone') setPhoneResendTimer(30);
        else setEmailResendTimer(30);

        try {
            const res = await fetch('/api/auth/otp/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, value, countryCode }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || `Failed to send ${type} OTP`);
            }

            if (type === 'phone') setIsPhoneOtpSent(true);
            else setIsEmailOtpSent(true);
        } catch (error: any) {
            console.error('Failed to send OTP', error);
            setError(error.message || 'Failed to send OTP. Please try again.');
            if (type === 'phone') setPhoneResendTimer(0); // Reset timer on error
            else setEmailResendTimer(0); // Reset timer on error
        }
    };

    const verifyOtp = async (type: 'phone' | 'email') => {
        const otp = type === 'phone' ? phoneOtp : emailOtp;
        const setVerifying = type === 'phone' ? setVerifyingPhone : setVerifyingEmail;
        const setVerified = type === 'phone' ? setIsPhoneVerified : setIsEmailVerified;
        const value = type === 'phone' ? watch('phoneNumber') : watch('email');

        if (!otp) {
            setError('Please enter the OTP.');
            return;
        }
        setError(null);

        setVerifying(true);
        try {
            const res = await fetch('/api/auth/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, otp, value }),
            });

            if (res.ok) {
                setVerified(true);
                setError(null);
            } else {
                const errorData = await res.json();
                setError(errorData.error || 'Invalid OTP');
            }
        } catch (error: any) {
            console.error('Verification failed', error);
            setError(error.message || 'Verification failed. Please try again.');
        } finally {
            setVerifying(false);
        }
    };

    const onSubmit = async (data: any) => {
        // Validation for TAS (Step 2)
        if (data.role === UserRole.TAS && step === 2) {
            if (!isPhoneVerified || !isEmailVerified) {
                setError('Please verify both phone and email before proceeding.');
                return;
            }
            if (!panFile && !data.panFileUrl) {
                setError('Please upload your PAN card.');
                return;
            }
            if (!data.panNumber) {
                setError('Please enter your PAN number.');
                return;
            }
            // Upload file if present (Mock)
            if (panFile) {
                data.panFileUrl = `https://fake-storage.com/${panFile.name}`;
            }
        }

        // Validation for Company (Step 3)
        if (data.role === UserRole.COMPANY_ADMIN && step === 3) {
            if (!isPhoneVerified || !isEmailVerified) {
                setError('Please verify both phone and email before proceeding.');
                return;
            }
            if (!gstFile && !data.gstCertificateUrl) {
                setError('Please upload your GST Certificate.');
                return;
            }
            // Upload file if present (Mock)
            if (gstFile) {
                data.gstCertificateUrl = `https://fake-storage.com/${gstFile.name}`;
            }
        }

        setIsLoading(true);
        setError(null);

        try {
            // Construct payload
            const payload = { ...data };
            if (data.role === UserRole.COMPANY_ADMIN) {
                // Combine address fields into JSON object if needed by backend,
                // OR send them as is if backend schema accepts them.
                // The plan said "Construct address JSON object".
                // Let's assume backend expects 'address' field as JSON.
                (payload as any).address = {
                    street: (data as any).street,
                    city: (data as any).city,
                    state: (data as any).state,
                    zip: (data as any).zip,
                    country: (data as any).country,
                };
                // Remove individual address fields from the top-level payload if they are now nested
                delete (payload as any).street;
                delete (payload as any).city;
                delete (payload as any).state;
                delete (payload as any).zip;
                delete (payload as any).country;
            }

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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

    const getPageTitle = () => {
        if (role === UserRole.TAS && step === 2) return "Verify your identity";
        if (role === UserRole.COMPANY_ADMIN) {
            if (step === 2) return "Organization Details";
            if (step === 3) return "Verify Organization";
        }
        return "Create an account";
    };

    const getPageSubtitle = () => {
        if (role === UserRole.TAS && step === 2) return "Complete verification to activate your account";
        if (role === UserRole.COMPANY_ADMIN) {
            if (step === 2) return "Tell us more about your company";
            if (step === 3) return "Complete verification to activate your account";
        }
        return "Join the trustless recruitment protocol";
    };

    return (
        <AuthLayout
            title={getPageTitle()}
            subtitle={getPageSubtitle()}
        >
            {!role ? (
                <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <button
                        onClick={() => handleRoleSelect(UserRole.COMPANY_ADMIN)}
                        className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-emerald-500 hover:bg-slate-800/80 transition-all group text-left hover:shadow-lg hover:shadow-emerald-500/10"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-emerald-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <Building2 className="w-8 h-8 text-emerald-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">I am a Company</h3>
                                <p className="text-sm text-slate-400 mt-1">Hiring talent securely with smart contracts.</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect(UserRole.TAS)}
                        className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500 hover:bg-slate-800/80 transition-all group text-left hover:shadow-lg hover:shadow-indigo-500/10"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <UserCheck className="w-8 h-8 text-indigo-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">I am a Recruiter (TAS)</h3>
                                <p className="text-sm text-slate-400 mt-1">Monetizing my network by referring candidates.</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleRoleSelect(UserRole.CANDIDATE)}
                        className="p-6 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-cyan-500 hover:bg-slate-800/80 transition-all group text-left hover:shadow-lg hover:shadow-cyan-500/10"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-cyan-500/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
                                <Briefcase className="w-8 h-8 text-cyan-500" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">I am a Candidate</h3>
                                <p className="text-sm text-slate-400 mt-1">Looking for jobs and career opportunities.</p>
                            </div>
                        </div>
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            type="button"
                            onClick={() => {
                                if (step > 1) setStep(prev => prev - 1);
                                else setRole(null);
                            }}
                            className="text-sm text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" /> {step > 1 ? 'Back' : 'Change Role'}
                        </button>
                        <div className="text-sm font-medium text-slate-400">
                            Step {step} of {role === UserRole.COMPANY_ADMIN ? 3 : 2}
                        </div>
                    </div>

                    <ProgressBar current={step} total={role === UserRole.COMPANY_ADMIN ? 3 : 2} />

                    {error && (
                        <div className="p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Step 1: Basic Info (All Roles) */}
                    {step === 1 && (
                        <>
                            {/* TAS & Candidate Common Fields (Email, Password) */}
                            {role !== UserRole.COMPANY_ADMIN && (
                                <>
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
                                            <PasswordStrengthMeter password={watch('password') || ''} />
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
                                </>
                            )}

                            {/* Role Specific Fields for Step 1 */}
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
                                            <label className="text-sm font-medium text-slate-200">Company Domain *</label>
                                            <input
                                                {...register('domain')}
                                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="acme.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-200">Website</label>
                                            <input
                                                {...register('website')}
                                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="https://acme.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-200">GSTIN *</label>
                                        <input
                                            {...register('gstin')}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="22AAAAA0000A1Z5"
                                        />
                                        {'gstin' in errors && (errors as any).gstin && (
                                            <p className="text-xs text-red-400">{(errors as any).gstin.message}</p>
                                        )}
                                    </div>

                                    {/* Address Fields */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-200">Address *</label>
                                        <input
                                            {...register('street')}
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent mb-2"
                                            placeholder="Street Address"
                                        />
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                {...register('city')}
                                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="City"
                                            />
                                            <input
                                                {...register('state')}
                                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="State"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <input
                                                {...register('zip')}
                                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="ZIP Code"
                                            />
                                            <input
                                                {...register('country')}
                                                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="Country"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* TAS & Candidate Specific Fields (remain same) */}
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

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-200">Phone Number *</label>
                                        <div className="flex gap-2">
                                            <select
                                                {...register('countryCode')}
                                                className="w-24 px-2 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                {countries.map((c) => (
                                                    <option key={c.name} value={c.code}>
                                                        {c.flag} {c.code} ({c.name})
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                {...register('phoneNumber')}
                                                type="tel"
                                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                        {'phoneNumber' in errors && (errors as any).phoneNumber && (
                                            <p className="text-xs text-red-400">{(errors as any).phoneNumber.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-200">LinkedIn Profile (Optional)</label>
                                        <input
                                            {...register('linkedinUrl')}
                                            type="url"
                                            className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="https://linkedin.com/in/yourprofile"
                                        />
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
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-200">Phone Number *</label>
                                        <div className="flex gap-2">
                                            <select
                                                {...register('countryCode')}
                                                className="w-24 px-2 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            >
                                                {countries.map((c) => (
                                                    <option key={c.name} value={c.code}>
                                                        {c.flag} {c.code} ({c.name})
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                {...register('phoneNumber')}
                                                type="tel"
                                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="9876543210"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {/* Step 2: Personal Info (Company Only) */}
                    {role === UserRole.COMPANY_ADMIN && step === 2 && (
                        <>
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
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Email *</label>
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

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-200">Phone Number *</label>
                                <div className="flex gap-2">
                                    <select
                                        {...register('countryCode')}
                                        className="w-24 px-2 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                    >
                                        {countries.map((c) => (
                                            <option key={c.name} value={c.code}>
                                                {c.flag} {c.code} ({c.name})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        {...register('phoneNumber')}
                                        type="tel"
                                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="9876543210"
                                    />
                                </div>
                                {'phoneNumber' in errors && (errors as any).phoneNumber && (
                                    <p className="text-xs text-red-400">{(errors as any).phoneNumber.message}</p>
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
                                    <PasswordStrengthMeter password={watch('password') || ''} />
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
                        </>
                    )}

                    {/* Step 3: Verification (Company) OR Step 2: Verification (TAS) */}
                    {((role === UserRole.COMPANY_ADMIN && step === 3) || (role === UserRole.TAS && step === 2)) && (
                        <div className="space-y-6">

                            {/* Company Specific Verification Fields */}
                            {role === UserRole.COMPANY_ADMIN && (
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-200 mb-2">Upload GST Certificate *</label>
                                    <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer relative">
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => setGstFile(e.target.files?.[0] || null)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                        {gstFile ? (
                                            <div className="flex flex-col items-center">
                                                <FileText className="w-8 h-8 text-emerald-500 mb-2" />
                                                <p className="text-sm text-white">{gstFile.name}</p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center">
                                                <Upload className="w-8 h-8 text-slate-500 mb-2" />
                                                <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Phone Verification (Common) */}
                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Smartphone className="w-5 h-5 text-slate-400" />
                                        <h3 className="text-white font-medium">Phone Verification</h3>
                                    </div>
                                    {isPhoneVerified ? (
                                        <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                                            <CheckCircle className="w-4 h-4" /> Verified
                                        </span>
                                    ) : (
                                        <span className="text-yellow-500 text-sm font-medium">Pending</span>
                                    )}
                                </div>

                                {!isPhoneVerified && (
                                    <>
                                        <div className="flex gap-2">
                                            <select
                                                {...register('countryCode')}
                                                disabled={isPhoneOtpSent}
                                                className="w-24 px-2 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                                            >
                                                {countries.map((c) => (
                                                    <option key={c.name} value={c.code}>
                                                        {c.flag} {c.code} ({c.name})
                                                    </option>
                                                ))}
                                            </select>
                                            <input
                                                {...register('phoneNumber')}
                                                disabled={isPhoneOtpSent}
                                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                                            />
                                            {!isPhoneOtpSent ? (
                                                <button
                                                    type="button"
                                                    onClick={() => sendOtp('phone')}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                                >
                                                    Send OTP
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsPhoneOtpSent(false);
                                                        setPhoneOtp('');
                                                        setPhoneResendTimer(0);
                                                        setError(null);
                                                    }}
                                                    className="px-3 py-2 text-sm text-slate-400 hover:text-white border border-slate-800 rounded-md hover:bg-slate-800 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {isPhoneOtpSent && !isPhoneVerified && (
                                            <div className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                                                <input
                                                    value={phoneOtp}
                                                    onChange={(e) => setPhoneOtp(e.target.value)}
                                                    placeholder="Enter OTP"
                                                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => verifyOtp('phone')}
                                                    disabled={verifyingPhone || !phoneOtp}
                                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {verifyingPhone ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => sendOtp('phone')}
                                                    disabled={phoneResendTimer > 0}
                                                    className="px-3 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-50"
                                                >
                                                    {phoneResendTimer > 0 ? `Resend in ${phoneResendTimer}s` : 'Resend'}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Email Verification (Common) */}
                            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                        <h3 className="text-white font-medium">Email Verification</h3>
                                    </div>
                                    {isEmailVerified ? (
                                        <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                                            <CheckCircle className="w-4 h-4" /> Verified
                                        </span>
                                    ) : (
                                        <span className="text-yellow-500 text-sm font-medium">Pending</span>
                                    )}
                                </div>

                                {!isEmailVerified && (
                                    <>
                                        <div className="flex gap-2">
                                            <input
                                                {...register('email')}
                                                disabled={isEmailOtpSent}
                                                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50"
                                            />
                                            {!isEmailOtpSent ? (
                                                <button
                                                    type="button"
                                                    onClick={() => sendOtp('email')}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                                                >
                                                    Send OTP
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsEmailOtpSent(false);
                                                        setEmailOtp('');
                                                        setEmailResendTimer(0);
                                                        setError(null);
                                                    }}
                                                    className="px-3 py-2 text-sm text-slate-400 hover:text-white border border-slate-800 rounded-md hover:bg-slate-800 transition-colors"
                                                >
                                                    Edit
                                                </button>
                                            )}
                                        </div>

                                        {isEmailOtpSent && !isEmailVerified && (
                                            <div className="mt-4 flex gap-2 animate-in fade-in slide-in-from-top-2">
                                                <input
                                                    value={emailOtp}
                                                    onChange={(e) => setEmailOtp(e.target.value)}
                                                    placeholder="Enter OTP"
                                                    className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => verifyOtp('email')}
                                                    disabled={verifyingEmail || !emailOtp}
                                                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {verifyingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => sendOtp('email')}
                                                    disabled={emailResendTimer > 0}
                                                    className="px-3 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-50"
                                                >
                                                    {emailResendTimer > 0 ? `Resend in ${emailResendTimer}s` : 'Resend'}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* PAN Verification (TAS Only) */}
                            {role === UserRole.TAS && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-200 mb-2">PAN Number *</label>
                                        <input
                                            {...register('panNumber')}
                                            maxLength={10}
                                            placeholder="ABCDE1234F"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-white text-sm uppercase"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-200 mb-2">Upload PAN Card *</label>
                                        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors cursor-pointer relative">
                                            <input
                                                type="file"
                                                accept="image/*,.pdf"
                                                onChange={(e) => setPanFile(e.target.files?.[0] || null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            {panFile ? (
                                                <div className="flex flex-col items-center">
                                                    <FileText className="w-8 h-8 text-emerald-500 mb-2" />
                                                    <p className="text-sm text-white">{panFile.name}</p>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <Upload className="w-8 h-8 text-slate-500 mb-2" />
                                                    <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4">
                        {((role === UserRole.TAS && step === 1) || (role === UserRole.COMPANY_ADMIN && step < 3)) ? (
                            <button
                                type="button"
                                onClick={handleNextStep}
                                className="w-full flex items-center justify-center py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors"
                            >
                                Next Step <ArrowRight className="w-4 h-4 ml-2" />
                            </button>
                        ) : (
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
                        )}
                    </div>

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
