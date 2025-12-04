'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const responseData = await res.json();
            const userRole = responseData.user?.role;

            // Redirect based on role
            if (userRole === 'ADMIN') {
                router.push('/admin');
            } else if (userRole === 'OPERATOR') {
                router.push('/operator');
            } else if (userRole === 'SUPPORT') {
                router.push('/support');
            } else if (userRole === 'COMPANY_ADMIN') {
                router.push('/dashboard/company');
            } else if (userRole === 'COMPANY_MEMBER') {
                router.push('/dashboard/member');
            } else if (userRole === 'INTERVIEWER') {
                router.push('/dashboard/interviewer');
            } else if (userRole === 'DECISION_MAKER') {
                router.push('/dashboard/decision-maker');
            } else if (userRole === 'TAS') {
                router.push('/tas');
            } else if (userRole === 'CANDIDATE') {
                router.push('/candidate');
            } else if (userRole === 'FINANCIAL_CONTROLLER') {
                router.push('/dashboard/finance');
            } else if (userRole === 'COMPLIANCE_OFFICER') {
                router.push('/dashboard/compliance');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your account"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                        placeholder="name@company.com"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-400">{errors.email.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-200">Password</label>
                    <input
                        {...register('password')}
                        type="password"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="••••••••"
                    />
                    {errors.password && (
                        <p className="text-xs text-red-400">{errors.password.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        'Sign In'
                    )}
                </button>

                <div className="flex items-center justify-between text-sm text-slate-400">
                    <Link href="/forgot-password" className="text-emerald-500 hover:text-emerald-400 font-medium">
                        Forgot password?
                    </Link>
                    <div>
                        New here?{' '}
                        <Link href="/signup" className="text-emerald-500 hover:text-emerald-400 font-medium">
                            Sign up
                        </Link>
                    </div>
                </div>
            </form>
        </AuthLayout>
    );
}
