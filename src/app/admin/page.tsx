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
    TrendingUp,
    Activity,
    AlertCircle,
    ArrowRight,
    Sparkles,
    MoreVertical,
    Search,
    Filter
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

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

interface ChartDataPoint {
    name: string;
    users: number;
    jobs: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
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
                }
                throw new Error('Failed to fetch stats');
            }
            const data = await res.json();
            setStats(data.stats);
            setRecentUsers(data.recentUsers);
            setChartData(data.chartData);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = stats ? [
        {
            label: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            label: 'Pending Verification',
            value: stats.pendingUsers,
            icon: Clock,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        },
        {
            label: 'Active Jobs',
            value: stats.openJobs,
            icon: Briefcase,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            label: 'Companies',
            value: stats.totalCompanies,
            icon: Building2,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
    ] : [];

    const quickActions = [
        { title: 'Verify Users', description: 'Review pending accounts', icon: CheckCircle, color: 'emerald', route: '/admin/users?filter=pending' },
        { title: 'Manage Jobs', description: 'Review job postings', icon: Briefcase, color: 'blue', route: '/admin/jobs' },
        { title: 'Support Tickets', description: 'View open tickets', icon: AlertCircle, color: 'red', route: '/admin/tickets' },
        { title: 'System Settings', description: 'Platform configuration', icon: Sparkles, color: 'purple', route: '/admin/settings' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-emerald-500/20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-1">
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-400">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all w-64"
                            />
                        </div>
                        <button className="p-2 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 transition-colors">
                            <Filter className="w-4 h-4 text-slate-400" />
                        </button>
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-6 rounded-2xl border ${stat.border} bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all group`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                            <p className="text-sm text-slate-400">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Chart Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                Platform Activity
                            </h2>
                            <select className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1 text-sm text-slate-400 focus:outline-none">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>This Year</option>
                            </select>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                    />
                                    <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                                    <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorJobs)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
