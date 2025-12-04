import React from 'react';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-950 text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Left Side: Branding */}
            <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border-r border-slate-800/50">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 rounded-full"></div>
                            <Image
                                src="/logo.png"
                                alt="Recruitkart Logo"
                                width={48}
                                height={48}
                                className="object-contain rounded-full relative z-10"
                            />
                        </div>
                        <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Recruitkart</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <div className="space-y-6">
                        <blockquote className="text-2xl font-medium leading-relaxed text-slate-200">
                            "The trustless protocol has completely eliminated our agency disputes. We hire faster, with zero risk."
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 shadow-lg">
                                JD
                            </div>
                            <div>
                                <div className="font-semibold text-white">John Doe</div>
                                <div className="text-sm text-slate-400">CTO at FinTech Corp</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex flex-col justify-center items-center p-6 lg:p-12 relative z-10">
                <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="text-center lg:text-left space-y-2">
                        <h2 className="text-4xl font-bold tracking-tight text-white">{title}</h2>
                        <p className="text-slate-400 text-lg">{subtitle}</p>
                    </div>

                    <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 lg:p-8 shadow-xl ring-1 ring-white/5">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
