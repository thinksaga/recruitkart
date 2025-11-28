'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    DollarSign,
    CreditCard,
    User,
    Bell,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronDown,
    Search,
    Moon,
    Sun,
    Zap,
    TrendingUp,
    Trophy,
    Target,
    Star
} from 'lucide-react';

interface TASLayoutProps {
    children: ReactNode;
}

interface CurrentUser {
    id: string;
    email: string;
    full_name?: string;
    role: string;
    tas_profile?: {
        credits_balance: number;
        reputation_score: number;
    };
}

interface Notification {
    id: string;
    title: string;
    time: string;
    unread: boolean;
    type: string;
}

export default function TASLayout({ children }: TASLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [pageTransition, setPageTransition] = useState(false);

    useEffect(() => {
        // Only fetch user data once on mount, not on every navigation
        if (!currentUser) {
            fetchCurrentUser();
        }
    }, []);

    // Trigger smooth page transition on route change
    useEffect(() => {
        setPageTransition(true);
        const timer = setTimeout(() => setPageTransition(false), 50);
        return () => clearTimeout(timer);
    }, [pathname]);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
                // Fetch notifications after user is loaded
                fetchNotifications();
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetch('/api/tas/notifications');
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/tas', badge: null },
        { name: 'Browse Jobs', icon: Briefcase, path: '/dashboard/tas/jobs', badge: 'New' },
        { name: 'My Submissions', icon: FileText, path: '/dashboard/tas/submissions', badge: null },
        { name: 'Earnings', icon: DollarSign, path: '/dashboard/tas/earnings', badge: null },
        { name: 'Buy Credits', icon: CreditCard, path: '/dashboard/tas/credits', badge: null },
        { name: 'Profile', icon: User, path: '/dashboard/tas/profile', badge: null },
        { name: 'Settings', icon: Settings, path: '/dashboard/tas/settings', badge: null },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="relative">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-emerald-500"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border border-emerald-500/20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            {/* Sidebar - Desktop */}
            <aside
                className={`fixed left-0 top-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 z-30 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} hidden lg:block`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-slate-800">
                        <Link href="/dashboard/tas" className="flex items-center gap-3 group">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-all">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-xl text-white">RecruitKart</h2>
                                <p className="text-xs text-slate-400">TAS Portal</p>
                            </div>
                        </Link>
                    </div>

                    {/* Stats Quick View */}
                    <div className="p-6 border-b border-slate-800">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <CreditCard className="w-4 h-4 text-blue-400" />
                                    <span className="text-xs text-slate-400">Credits</span>
                                </div>
                                <p className="text-xl font-bold text-white">{currentUser?.tas_profile?.credits_balance || 0}</p>
                            </div>
                            <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border border-yellow-500/20 rounded-xl p-3">
                                <div className="flex items-center gap-2 mb-1">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span className="text-xs text-slate-400">Score</span>
                                </div>
                                <p className="text-xl font-bold text-white">{currentUser?.tas_profile?.reputation_score?.toFixed(1) || '0.0'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    prefetch={true}
                                    scroll={false}
                                    className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                                        : 'text-slate-400 hover:bg-slate-800/50 hover:text-white hover:scale-[1.02]'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Footer Actions */}
                    <div className="p-4 border-t border-slate-800 space-y-2">
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all">
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            className="fixed left-0 top-0 h-full w-72 bg-slate-900 border-r border-slate-800 z-50 lg:hidden"
                        >
                            <div className="flex flex-col h-full">
                                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                    <Link href="/dashboard/tas" className="flex items-center gap-3">
                                        <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                            <Zap className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-xl text-white">RecruitKart</h2>
                                            <p className="text-xs text-slate-400">TAS Portal</p>
                                        </div>
                                    </Link>
                                    <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-slate-800 rounded-lg">
                                        <X className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                                    {navItems.map((item) => {
                                        const isActive = pathname === item.path;
                                        return (
                                            <Link
                                                key={item.path}
                                                href={item.path}
                                                prefetch={true}
                                                scroll={false}
                                                onClick={(e) => {
                                                    // Close menu after a short delay to allow navigation to start
                                                    setTimeout(() => setMobileMenuOpen(false), 100);
                                                }}
                                                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white'
                                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white active:scale-95'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="w-5 h-5" />
                                                    <span className="font-medium">{item.name}</span>
                                                </div>
                                                {item.badge && (
                                                    <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-20 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="hidden lg:block p-2 hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <Menu className="w-5 h-5 text-slate-400" />
                            </button>
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition-colors"
                            >
                                <Menu className="w-5 h-5 text-slate-400" />
                            </button>

                            {/* Search Bar */}
                            <div className="hidden md:block relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search jobs, candidates..."
                                    className="bg-slate-800/50 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all w-64 lg:w-80"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="relative p-2 hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <Bell className="w-5 h-5 text-slate-400" />
                                    {notifications.filter(n => n.unread).length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                            {notifications.filter(n => n.unread).length > 9 ? '9+' : notifications.filter(n => n.unread).length}
                                        </span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {notificationsOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-slate-800">
                                                <h3 className="font-semibold text-white">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.map((notif) => (
                                                    <div
                                                        key={notif.id}
                                                        className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer ${notif.unread ? 'bg-slate-800/30' : ''
                                                            }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.unread ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                                                            <div className="flex-1">
                                                                <p className="text-sm text-white">{notif.title}</p>
                                                                <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* User Menu */}
                            <div className="relative">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-xl transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {currentUser?.full_name?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                                        </span>
                                    </div>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium text-white">
                                            {currentUser?.full_name || currentUser?.email}
                                        </p>
                                        <p className="text-xs text-slate-400">TAS Account</p>
                                    </div>
                                    <ChevronDown className="w-4 h-4 text-slate-400" />
                                </button>

                                <AnimatePresence>
                                    {userMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden"
                                        >
                                            <div className="p-4 border-b border-slate-800">
                                                <p className="font-medium text-white">{currentUser?.full_name || 'User'}</p>
                                                <p className="text-sm text-slate-400">{currentUser?.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <Link
                                                    href="/dashboard/tas/profile"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                                                >
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-300">Profile</span>
                                                </Link>
                                                <Link
                                                    href="/dashboard/tas/settings"
                                                    onClick={() => setUserMenuOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 text-slate-400" />
                                                    <span className="text-sm text-slate-300">Settings</span>
                                                </Link>
                                            </div>
                                            <div className="p-2 border-t border-slate-800">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span className="text-sm">Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{
                                duration: 0.2,
                                ease: "easeInOut"
                            }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
