'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    User,
    FileText,
    Calendar,
    LogOut,
    Menu,
    X,
    Briefcase,
    ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface CandidateLayoutProps {
    children: ReactNode;
}

export default function CandidateLayout({ children }: CandidateLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);

    const navigation = [
        { name: 'Dashboard', href: '/candidate', icon: LayoutDashboard },
        { name: 'My Profile', href: '/candidate/profile', icon: User },
        { name: 'Applications', href: '/candidate/applications', icon: FileText },
        { name: 'Interviews', href: '/candidate/interviews', icon: Calendar },
    ];

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('/api/candidate/profile');
                if (res.ok) {
                    const data = await res.json();
                    if (data.profile) {
                        setUser({
                            name: data.profile.full_name,
                            email: data.profile.email
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

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
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '700ms' }}></div>
            </div>

            {/* Sidebar */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: sidebarOpen ? 0 : -300 }}
                className="relative z-20 w-72 bg-slate-900/50 backdrop-blur-xl border-r border-slate-800/50 flex flex-col"
            >
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
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
                                Recruitkart
                            </h1>
                            <p className="text-xs text-slate-400">Candidate Portal</p>
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
                                        ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/20'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">{item.name}</span>
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Bar */}
                <header className="relative z-30 h-16 bg-slate-900/30 backdrop-blur-xl border-b border-slate-800/50 flex items-center justify-between px-6">
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

                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="flex items-center gap-4 hover:bg-slate-800/50 p-2 rounded-lg transition-colors"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{user?.name || 'Loading...'}</p>
                                <p className="text-xs text-slate-400">{user?.email || ''}</p>
                            </div>
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </span>
                            </div>
                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-xl overflow-hidden">
                                <button
                                    id="logout-button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </div>
                        )}
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
