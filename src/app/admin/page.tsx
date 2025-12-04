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
    TrendingUp
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

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
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
            </div>
        </div>
    );
}
