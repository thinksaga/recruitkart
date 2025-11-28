'use client';

import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    DollarSign,
    CreditCard,
    User,
    Zap
} from 'lucide-react';
import { BaseDashboardLayout } from '../ui/dashboard';
import { CurrentUser, Notification, NavItem } from '../ui/dashboard/types';

interface TASLayoutProps {
    children: ReactNode;
}

export default function TASLayout({ children }: TASLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Only fetch user data once on mount, not on every navigation
        if (!currentUser) {
            fetchCurrentUser();
        }
    }, []);

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

    // Navigation configuration
    const navigation: NavItem[] = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard/tas' },
        { name: 'Browse Jobs', icon: Briefcase, path: '/dashboard/tas/jobs', badge: 'New' },
        { name: 'My Submissions', icon: FileText, path: '/dashboard/tas/submissions' },
        { name: 'Earnings', icon: DollarSign, path: '/dashboard/tas/earnings' },
        { name: 'Buy Credits', icon: CreditCard, path: '/dashboard/tas/credits' },
        { name: 'Profile', icon: User, path: '/dashboard/tas/profile' },
    ];

    // Logo configuration
    const logo = {
        icon: Zap,
        text: 'RecruitKart',
        subtitle: 'TAS Portal'
    };

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
        <BaseDashboardLayout
            currentUser={currentUser}
            notifications={notifications}
            navigation={navigation}
            logo={logo}
            profilePath="/dashboard/tas/profile"
            settingsPath="/dashboard/tas/settings"
            onLogout={handleLogout}
        >
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
        </BaseDashboardLayout>
    );
}
