'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    UserPlus,
    CreditCard,
    LogOut,
    Menu,
    X,
    Building2
} from 'lucide-react';
import { useState } from 'react';

interface CompanyLayoutProps {
    children: ReactNode;
}

export default function CompanyLayout({ children }: CompanyLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navigation = [
        { name: 'Dashboard', href: '/dashboard/company', icon: LayoutDashboard },
        { name: 'Job Postings', href: '/dashboard/company/jobs', icon: Briefcase },
        { name: 'Candidates', href: '/dashboard/company/candidates', icon: Users },
        { name: 'Team', href: '/dashboard/company/team', icon: UserPlus },
        { name: 'Billing', href: '/dashboard/company/billing', icon: CreditCard },
    ];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
            </div>

            {/* Sidebar */}
            <motion.aside
                initial={{ width: 288 }}
                animate={{ width: sidebarOpen ? 288 : 0 }}
                className="relative z-20 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col overflow-hidden"
            >
                <div className="w-72 flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-800/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 relative flex items-center justify-center">
                                <Image
                                    src="/logo.png"
                                    alt="Recruitkart Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain rounded-full"
                                />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-white to-rose-200 bg-clip-text text-transparent">
                                    Recruitkart
                                </h1>
                                <p className="text-xs text-slate-400">Company Portal</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <button
                                        key={item.name}
                                        onClick={() => router.push(item.href)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-slate-800/50">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="relative z-10 h-16 bg-slate-900/30 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-6">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
                    >
                        {sidebarOpen ? (
                            <X className="w-5 h-5 text-slate-400" />
                        ) : (
                            <Menu className="w-5 h-5 text-slate-400" />
                        )}
                    </button>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium text-white">Acme Corp</p>
                            <p className="text-xs text-slate-400">hr@acme.com</p>
                        </div>
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto relative z-10">
                    {children}
                </main>
            </div>
        </div>
    );
}
