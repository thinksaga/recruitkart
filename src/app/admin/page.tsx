'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users,
    Building2,
    Briefcase,
    CheckCircle,
    Clock,
    XCircle,
    TrendingUp,
    Activity,
    AlertCircle,
    ArrowRight,
    Sparkles
} from 'lucide-react';

interface Stats {
    totalUsers: number;
    pendingUsers: number;
    verifiedUsers: number;
    totalCompanies: number;
    totalTAS: number;
    totalJobs: number;
    openJobs: number;
}

interface RecentUser {
    id: string;
    email: string;
    role: string;
    verification_status: string;
    created_at: string;
    organization?: { name: string } | null;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                    return;
                }
                const errorText = await res.text();
                console.error('Failed to fetch stats:', res.status, errorText);
                throw new Error(`Failed to fetch stats: ${res.status} ${errorText}`);
            }
            const data = await res.json();
            setStats(data.stats);
            setRecentUsers(data.recentUsers);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = stats ? [
        { label: 'Total Users', value: stats.totalUsers, icon: Users, gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10' },
        { label: 'Pending Verification', value: stats.pendingUsers, icon: Clock, gradient: 'from-yellow-500 to-orange-500', bg: 'bg-yellow-500/10' },
        { label: 'Verified Users', value: stats.verifiedUsers, icon: CheckCircle, gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-500/10' },
        { label: 'Companies', value: stats.totalCompanies, icon: Building2, gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10' },
        { label: 'TAS Partners', value: stats.totalTAS, icon: Users, gradient: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-500/10' },
        { label: 'Total Jobs', value: stats.totalJobs, icon: Briefcase, gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10' },
        { label: 'Open Jobs', value: stats.openJobs, icon: TrendingUp, gradient: 'from-cyan-500 to-blue-500', bg: 'bg-cyan-500/10' },
    ] : [];

    const quickActions = [
        { title: 'Manage Users', description: 'View and verify accounts', icon: Users, color: 'emerald', route: '/admin/users' },
        { title: 'Organizations', description: 'Company profiles', icon: Building2, color: 'purple', route: '/admin/organizations' },
        { title: 'Manage Jobs', description: 'All job postings', icon: Briefcase, color: 'indigo', route: '/admin/jobs' },
        { title: 'Submissions', description: 'Candidate tracking', icon: Activity, color: 'cyan', route: '/admin/submissions' },
        { title: 'Analytics', description: 'Platform insights', icon: TrendingUp, color: 'yellow', route: '/admin/analytics' },
        { title: 'Support Tickets', description: 'User requests', icon: AlertCircle, color: 'red', route: '/admin/tickets' },
        { title: 'Audit Logs', description: 'Activity logs', icon: Activity, color: 'orange', route: '/admin/audit' },
        { title: 'System Settings', description: 'Configuration', icon: Sparkles, color: 'blue', route: '/admin/settings' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-emerald-500/20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-emerald-200 to-white bg-clip-text text-transparent mb-2">
                        Dashboard Overview
                    </h1>
                    <p className="text-slate-400">Welcome back! Here's what's happening with your platform.</p>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl blur-xl`}></div>
                            <div className={`relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-slate-700 transition-all ${stat.bg}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                                        <stat.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                </div>
                                <div className="text-4xl font-bold mb-2 bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-sm text-slate-400 font-medium">{stat.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-emerald-500" />
                        Quick Actions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {quickActions.map((action, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 + index * 0.05 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => router.push(action.route)}
                                className="group relative bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-6 text-left hover:border-emerald-500/50 transition-all overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/5 group-hover:to-emerald-500/10 transition-all"></div>
                                <div className="relative">
                                    <action.icon className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                                    <h3 className="text-lg font-bold mb-1 flex items-center justify-between">
                                        {action.title}
                                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h3>
                                    <p className="text-sm text-slate-400">{action.description}</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8"
                >
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-emerald-500" />
                        Recent Users
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Email</th>
                                    <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Role</th>
                                    <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Organization</th>
                                    <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Status</th>
                                    <th className="text-left py-4 px-4 text-slate-400 font-medium text-sm">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user, index) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7 + index * 0.05 }}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                                    >
                                        <td className="py-4 px-4 font-medium">{user.email}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 bg-slate-800/50 rounded-full text-xs font-medium border border-slate-700">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-slate-400">
                                            {user.organization?.name || '-'}
                                        </td>
                                        <td className="py-4 px-4">
                                            {user.verification_status === 'VERIFIED' && (
                                                <span className="flex items-center gap-2 text-green-500">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    Verified
                                                </span>
                                            )}
                                            {user.verification_status === 'PENDING' && (
                                                <span className="flex items-center gap-2 text-yellow-500">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                                                    Pending
                                                </span>
                                            )}
                                            {user.verification_status === 'REJECTED' && (
                                                <span className="flex items-center gap-2 text-red-500">
                                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-4 text-slate-400 text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
