'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Building2,
    Briefcase,
    Activity,
    TrendingUp,
    AlertCircle,
    Shield,
    Settings,
    DollarSign,
    CreditCard,
    FileText,
    UserCheck,
    Mail,
    Wallet,
    Lock
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { BaseDashboardLayout } from '../../components/ui/dashboard';
import { CurrentUser, Notification, NavItem } from '../../components/ui/dashboard/types';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [notifications] = useState<Notification[]>([]); // Admin layout doesn't use notifications currently
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        } finally {
            setLoading(false);
        }
    };

    // Role-based navigation
    const getNavigation = (role: string): NavItem[] => {
        const baseNavigation: NavItem[] = [
            { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        ];

        if (role === 'SUPPORT_AGENT') {
            return [
                ...baseNavigation,
                { name: 'Support Tickets', icon: AlertCircle, path: '/admin/tickets' },
                { name: 'Users', icon: Users, path: '/admin/users' },
                { name: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
                { name: 'Audit Logs', icon: Shield, path: '/admin/audit' },
            ];
        }

        if (role === 'COMPANY_ADMIN') {
            return [
                ...baseNavigation,
                { name: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
                { name: 'Team Members', icon: Users, path: '/admin/team' },
                { name: 'Submissions', icon: Activity, path: '/admin/submissions' },
                { name: 'Payments', icon: DollarSign, path: '/admin/payments' },
                { name: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
            ];
        }

        // Full admin navigation for other roles
        return [
            ...baseNavigation,
            { name: 'Users', icon: Users, path: '/admin/users' },
            { name: 'Organizations', icon: Building2, path: '/admin/organizations' },
            { name: 'Jobs', icon: Briefcase, path: '/admin/jobs' },
            { name: 'Submissions', icon: Activity, path: '/admin/submissions' },
            { name: 'Candidates', icon: UserCheck, path: '/admin/candidates' },
            { name: 'Job Change Requests', icon: FileText, path: '/admin/job-change-requests' },
            { name: 'Invitations', icon: Mail, path: '/admin/invitations' },
            { name: 'Escrow', icon: Wallet, path: '/admin/escrow' },
            { name: 'Payouts', icon: DollarSign, path: '/admin/payouts' },
            { name: 'Credits & Wallet', icon: CreditCard, path: '/admin/credits' },
            { name: 'DPDP Compliance', icon: Lock, path: '/admin/dpdp' },
            { name: 'Analytics', icon: TrendingUp, path: '/admin/analytics' },
            { name: 'Support Tickets', icon: AlertCircle, path: '/admin/tickets' },
            { name: 'Audit Logs', icon: Shield, path: '/admin/audit' },
            { name: 'Settings', icon: Settings, path: '/admin/settings' },
        ];
    };

    const navigation = currentUser ? getNavigation(currentUser.role) : [];

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Logo configuration
    const logo = {
        icon: Shield,
        text: 'Recruitkart',
        subtitle: 'Admin Panel'
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
            profilePath="/admin/profile" // Admin might not have a profile page, but keeping for consistency
            settingsPath="/admin/settings"
            onLogout={handleLogout}
        >
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {children}
            </motion.div>
        </BaseDashboardLayout>
    );
}
