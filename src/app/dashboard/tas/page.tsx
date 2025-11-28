'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import TASLayout from '@/components/dashboard/TASLayout';
import {
    DollarSign,
    TrendingUp,
    Activity,
    Star,
    Users,
    Briefcase,
    CheckCircle,
    Clock,
    ArrowRight,
    Search,
    Filter,
    CreditCard,
    Trophy,
    Target,
    Zap,
    MoreVertical,
    TrendingDown,
    AlertCircle,
    Calendar,
    Award,
    BarChart3,
    PieChart,
    Sparkles,
    Rocket
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar
} from 'recharts';

interface TASStats {
    creditsBalance: number;
    reputationScore: number;
    totalPlacements: number;
    activeSubmissions: number;
    monthlyEarnings: number;
    successRate: number;
    creditsGrowth: number;
}

interface RecentSubmission {
    id: string;
    status: string;
    created_at: string;
    candidate: { full_name: string; email: string };
    job: { title: string; organization: { display_name: string } };
}

interface EarningsData {
    month: string;
    earnings: number;
    placements: number;
}

interface CurrentUser {
    id: string;
    email: string;
    full_name?: string;
    role: string;
    tas_profile?: {
        credits_balance: number;
        reputation_score: number;
        total_placements: number;
    };
}

export default function TASDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<TASStats | null>(null);
    const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
    const [earningsData, setEarningsData] = useState<EarningsData[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchDashboardData();
        }
    }, [currentUser]);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
            router.push('/login');
        }
    };

    const fetchDashboardData = async () => {
        try {
            const [statsRes, submissionsRes] = await Promise.all([
                fetch('/api/tas/dashboard/stats'),
                fetch('/api/tas/dashboard/recent-submissions')
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData.stats);
                setEarningsData(statsData.earningsData || []);
            }

            if (submissionsRes.ok) {
                const submissionsData = await submissionsRes.json();
                setRecentSubmissions(submissionsData.submissions || []);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const quickActions = [
        { title: 'Browse Jobs', description: 'Find new opportunities', icon: Briefcase, color: 'blue', route: '/dashboard/tas/jobs' },
        { title: 'My Submissions', description: 'Track your applications', icon: Activity, color: 'emerald', route: '/dashboard/tas/submissions' },
        { title: 'Buy Credits', description: 'Purchase more credits', icon: CreditCard, color: 'purple', route: '/dashboard/tas/credits' },
        { title: 'Earnings', description: 'View your payouts', icon: DollarSign, color: 'green', route: '/dashboard/tas/earnings' },
    ];

    if (loading) {
        return (
            <TASLayout>
                <div className="space-y-8">
                    {/* Header Skeleton */}
                    <div className="h-48 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl animate-pulse"></div>

                    {/* Stats Grid Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array(4).fill(null).map((_, i) => (
                            <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 animate-pulse">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
                                        <div className="w-16 h-4 bg-slate-800 rounded"></div>
                                    </div>
                                    <div className="w-24 h-4 bg-slate-800 rounded"></div>
                                    <div className="w-20 h-8 bg-slate-700 rounded"></div>
                                    <div className="w-32 h-3 bg-slate-800 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TASLayout>
        );
    }

    return (
        <TASLayout>
            <div className="space-y-8">
                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-8"
                >
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-white" />
                            <span className="text-white/90 text-sm font-medium">Welcome back!</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {currentUser?.full_name || 'Recruiter'}
                        </h1>
                        <p className="text-white/90 text-lg max-w-2xl">
                            Track your recruitment success and discover new opportunities
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 backdrop-blur-sm overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <CreditCard className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="text-xs text-blue-400 font-medium">Available</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-1">Credits Balance</p>
                            <p className="text-3xl font-bold text-white mb-2">{stats?.creditsBalance || 0}</p>
                            <div className="flex items-center gap-2 text-xs">
                                {stats && stats.creditsGrowth >= 0 ? (
                                    <>
                                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                                        <span className="text-emerald-500 font-medium">+{stats.creditsGrowth}% from last month</span>
                                    </>
                                ) : (
                                    <>
                                        <TrendingDown className="w-3 h-3 text-red-500" />
                                        <span className="text-red-500 font-medium">{stats?.creditsGrowth || 0}% from last month</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-yellow-500/10 via-slate-900 to-slate-900 backdrop-blur-sm overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                    <Star className="w-6 h-6 text-yellow-400" />
                                </div>
                                <span className="text-xs text-yellow-400 font-medium">Rating</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-1">Reputation Score</p>
                            <p className="text-3xl font-bold text-white mb-2">{stats?.reputationScore?.toFixed(1) || '0.0'}</p>
                            <div className="flex items-center gap-2 text-xs">
                                <Award className="w-3 h-3 text-yellow-500" />
                                <span className="text-yellow-500 font-medium">
                                    {stats && stats.reputationScore >= 4.5 ? 'Excellent Rating' :
                                        stats && stats.reputationScore >= 4.0 ? 'Great Rating' :
                                            stats && stats.reputationScore >= 3.5 ? 'Good Rating' :
                                                stats && stats.reputationScore >= 3.0 ? 'Average Rating' : 'Building Reputation'}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-emerald-500/10 via-slate-900 to-slate-900 backdrop-blur-sm overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                    <Trophy className="w-6 h-6 text-emerald-400" />
                                </div>
                                <span className="text-xs text-emerald-400 font-medium">Success</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-1">Total Placements</p>
                            <p className="text-3xl font-bold text-white mb-2">{stats?.totalPlacements || 0}</p>
                            <div className="flex items-center gap-2 text-xs">
                                <CheckCircle className="w-3 h-3 text-emerald-500" />
                                <span className="text-emerald-500 font-medium">{stats?.successRate || 0}% success rate</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ y: -4, transition: { duration: 0.2 } }}
                        className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-900 backdrop-blur-sm overflow-hidden group cursor-pointer"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                                    <Activity className="w-6 h-6 text-purple-400" />
                                </div>
                                <span className="text-xs text-purple-400 font-medium">Active</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-1">Active Submissions</p>
                            <p className="text-3xl font-bold text-white mb-2">{stats?.activeSubmissions || 0}</p>
                            <div className="flex items-center gap-2 text-xs">
                                <Clock className="w-3 h-3 text-purple-500" />
                                <span className="text-purple-500 font-medium">In progress</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {quickActions.map((action, index) => (
                        <Link
                            key={action.title}
                            href={action.route}
                            scroll={false}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                                whileTap={{ scale: 0.98 }}
                                className={`relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:border-${action.color}-500/50 hover:shadow-2xl hover:shadow-${action.color}-500/10 transition-all duration-300 cursor-pointer group overflow-hidden`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br from-${action.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-${action.color}-500/10 border border-${action.color}-500/20 group-hover:bg-${action.color}-500/20 transition-all`}>
                                            <action.icon className={`w-6 h-6 text-${action.color}-500`} />
                                        </div>
                                        <ArrowRight className={`w-5 h-5 text-slate-400 group-hover:text-${action.color}-500 group-hover:translate-x-1 transition-all`} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                                    <p className="text-slate-400 text-sm">{action.description}</p>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Earnings Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                Monthly Earnings
                            </h2>
                        </div>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={earningsData}>
                                    <defs>
                                        <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                    />
                                    <Area type="monotone" dataKey="earnings" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEarnings)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Recent Submissions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                Recent Submissions
                            </h2>
                            <Link
                                href="/dashboard/tas/submissions"
                                scroll={false}
                                className="text-emerald-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="space-y-4">
                            {recentSubmissions.slice(0, 5).map((submission, index) => (
                                <div key={submission.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${submission.status === 'PENDING_CONSENT' ? 'bg-yellow-500/20 text-yellow-400' :
                                                submission.status === 'ACTIVE' ? 'bg-blue-500/20 text-blue-400' :
                                                    submission.status === 'SCREENING' ? 'bg-purple-500/20 text-purple-400' :
                                                        submission.status === 'INTERVIEWING' ? 'bg-orange-500/20 text-orange-400' :
                                                            submission.status === 'OFFER_EXTENDED' ? 'bg-emerald-500/20 text-emerald-400' :
                                                                submission.status === 'HIRED' ? 'bg-green-500/20 text-green-400' :
                                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {submission.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="font-medium text-white mb-1">{submission.candidate.full_name}</h3>
                                        <p className="text-sm text-slate-400">
                                            {submission.job.title} • {submission.job.organization.display_name}
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {new Date(submission.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </TASLayout>
    );
}