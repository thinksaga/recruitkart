import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-white">
            {/* Left Side: Branding */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-slate-900">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                        <ShieldCheck className="w-8 h-8 text-emerald-500" />
                        <span className="text-2xl font-bold tracking-tight">Recruitkart</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <blockquote className="text-2xl font-medium leading-relaxed text-slate-200">
                        "The trustless protocol has completely eliminated our agency disputes. We hire faster, with zero risk."
                    </blockquote>
                    <div className="mt-6 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-400">
                            JD
                        </div>
                        <div>
                            <div className="font-semibold">John Doe</div>
                            <div className="text-sm text-slate-400">CTO at FinTech Corp</div>
                            <p className="text-xl text-blue-100">&quot;The most transparent recruitment platform I&apos;ve ever used.&quot;</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex flex-col justify-center items-center p-8 lg:p-12 bg-slate-950">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
                        <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
