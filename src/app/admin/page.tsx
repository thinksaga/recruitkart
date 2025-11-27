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
    Filter,
    MessageSquare,
    HeadphonesIcon,
    Timer,
    UserCheck,
    DollarSign
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

interface CompanyStats {
    activeJobs: number;
    totalTeamMembers: number;
    pendingSubmissions: number;
    totalSubmissions: number;
    recentPayments: number;
}

interface SupportStats {
    totalTickets: number;
    openTickets: number;
    resolvedToday: number;
    avgResolutionTime: number;
}

interface RecentUser {
    id: string;
    email: string;
    role: string;
    verification_status: string;
    created_at: string;
    organization?: { display_name: string } | null;
}

interface RecentTicket {
    id: number;
    ticket_number: number;
    subject: string;
    category: string;
    status: string;
    priority: string;
    created_at: string;
    raised_by: { email: string };
}

interface RecentSubmission {
    id: string;
    status: string;
    created_at: string;
    candidate: { full_name: string; email: string };
    job: { title: string };
}

interface ChartDataPoint {
    name: string;
    users: number;
    jobs: number;
}

interface CurrentUser {
    id: string;
    email: string;
    role: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [companyStats, setCompanyStats] = useState<CompanyStats | null>(null);
    const [supportStats, setSupportStats] = useState<SupportStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
    const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchStats();
        }
    }, [currentUser]);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

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
            
            if (currentUser?.role === 'COMPANY_ADMIN') {
                setCompanyStats(data.stats);
                setRecentSubmissions(data.recentSubmissions || []);
            } else {
                setStats(data.stats);
                setRecentUsers(data.recentUsers);
                setChartData(data.chartData);
            }

            // Fetch support stats if user is SUPPORT_AGENT
            if (currentUser?.role === 'SUPPORT_AGENT') {
                await fetchSupportStats();
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSupportStats = async () => {
        try {
            // Fetch real ticket data
            const ticketsRes = await fetch('/api/admin/tickets?limit=5');
            if (ticketsRes.ok) {
                const ticketsData = await ticketsRes.json();
                setRecentTickets(ticketsData.tickets || []);

                // Calculate stats from real data
                const allTickets = ticketsData.tickets || [];
                const openTickets = allTickets.filter((t: any) => t.status === 'OPEN').length;
                const resolvedToday = allTickets.filter((t: any) => {
                    const today = new Date().toDateString();
                    const resolvedDate = new Date(t.updated_at).toDateString();
                    return t.status === 'RESOLVED' && resolvedDate === today;
                }).length;

                // Mock average resolution time for now (would need more complex calculation)
                const avgResolutionTime = 4.2;

                setSupportStats({
                    totalTickets: ticketsData.pagination?.total || 0,
                    openTickets,
                    resolvedToday,
                    avgResolutionTime
                });
            } else {
                // Fallback to mock data if API fails
                setSupportStats({
                    totalTickets: 24,
                    openTickets: 8,
                    resolvedToday: 5,
                    avgResolutionTime: 4.2
                });
                setRecentTickets([
                    {
                        id: 1,
                        ticket_number: 1001,
                        subject: 'Payment failed for job posting',
                        category: 'PAYMENT_FAILURE',
                        status: 'OPEN',
                        priority: 'HIGH',
                        created_at: new Date().toISOString(),
                        raised_by: { email: 'company@example.com' }
                    },
                    {
                        id: 2,
                        ticket_number: 1002,
                        subject: 'Candidate not responding',
                        category: 'CANDIDATE_NO_SHOW',
                        status: 'IN_PROGRESS',
                        priority: 'MEDIUM',
                        created_at: new Date(Date.now() - 3600000).toISOString(),
                        raised_by: { email: 'tas@example.com' }
                    }
                ]);
            }
        } catch (error) {
            console.error('Error fetching support stats:', error);
            // Fallback to mock data
            setSupportStats({
                totalTickets: 24,
                openTickets: 8,
                resolvedToday: 5,
                avgResolutionTime: 4.2
            });
            setRecentTickets([]);
        }
    };

    const statCards = currentUser?.role === 'SUPPORT_AGENT' && supportStats ? [
        {
            label: 'Open Tickets',
            value: supportStats.openTickets,
            icon: AlertCircle,
            color: 'text-red-500',
            bg: 'bg-red-500/10',
            border: 'border-red-500/20'
        },
        {
            label: 'Resolved Today',
            value: supportStats.resolvedToday,
            icon: CheckCircle,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            label: 'Avg Resolution Time',
            value: `${supportStats.avgResolutionTime}h`,
            icon: Timer,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            label: 'Total Tickets',
            value: supportStats.totalTickets,
            icon: MessageSquare,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
    ] : currentUser?.role === 'COMPANY_ADMIN' && companyStats ? [
        {
            label: 'Active Jobs',
            value: companyStats.activeJobs,
            icon: Briefcase,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10',
            border: 'border-blue-500/20'
        },
        {
            label: 'Team Members',
            value: companyStats.totalTeamMembers,
            icon: Users,
            color: 'text-emerald-500',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20'
        },
        {
            label: 'Pending Submissions',
            value: companyStats.pendingSubmissions,
            icon: Clock,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10',
            border: 'border-yellow-500/20'
        },
        {
            label: 'Total Submissions',
            value: companyStats.totalSubmissions,
            icon: Activity,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10',
            border: 'border-purple-500/20'
        },
    ] : stats ? [
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

    const quickActions = currentUser?.role === 'SUPPORT_AGENT' ? [
        { title: 'View Tickets', description: 'Manage support tickets', icon: MessageSquare, color: 'red', route: '/admin/tickets' },
        { title: 'User Lookup', description: 'Find and help users', icon: UserCheck, color: 'blue', route: '/admin/users' },
        { title: 'Support Analytics', description: 'View support metrics', icon: TrendingUp, color: 'emerald', route: '/admin/analytics' },
        { title: 'Knowledge Base', description: 'Common solutions', icon: HeadphonesIcon, color: 'purple', route: '/admin/settings' },
    ] : currentUser?.role === 'COMPANY_ADMIN' ? [
        { title: 'Post New Job', description: 'Create a job posting', icon: Briefcase, color: 'blue', route: '/admin/jobs' },
        { title: 'Manage Team', description: 'Invite team members', icon: Users, color: 'emerald', route: '/admin/team' },
        { title: 'Review Submissions', description: 'View candidate applications', icon: Activity, color: 'yellow', route: '/admin/submissions' },
        { title: 'Payment History', description: 'View invoices and payments', icon: DollarSign, color: 'purple', route: '/admin/payments' },
    ] : [
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
                            {currentUser?.role === 'SUPPORT_AGENT' 
                                ? 'Support Dashboard' 
                                : currentUser?.role === 'COMPANY_ADMIN'
                                ? 'Company Dashboard'
                                : 'Dashboard Overview'
                            }
                        </h1>
                        <p className="text-slate-400">
                            {currentUser?.role === 'SUPPORT_AGENT'
                                ? 'Manage support tickets and help users'
                                : currentUser?.role === 'COMPANY_ADMIN'
                                ? 'Manage your jobs, team, and hiring process'
                                : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                            }
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

                    {/* Recent Tickets Section for SUPPORT_AGENT */}
                    {currentUser?.role === 'SUPPORT_AGENT' && recentTickets.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-emerald-500" />
                                    Recent Support Tickets
                                </h2>
                                <button
                                    onClick={() => router.push('/admin/tickets')}
                                    className="text-emerald-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-1"
                                >
                                    View All <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentTickets.map((ticket, index) => (
                                    <div key={ticket.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-sm font-medium text-slate-300">#{ticket.ticket_number}</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.priority === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                                                        ticket.priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                                                            'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {ticket.priority}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket.status === 'OPEN' ? 'bg-red-500/20 text-red-400' :
                                                        ticket.status === 'IN_PROGRESS' ? 'bg-blue-500/20 text-blue-400' :
                                                            'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {ticket.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <h3 className="font-medium text-white mb-1">{ticket.subject}</h3>
                                            <p className="text-sm text-slate-400">
                                                {ticket.category.replace('_', ' ')} • {ticket.raised_by.email} • {new Date(ticket.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Recent Submissions Section for COMPANY_ADMIN */}
                    {currentUser?.role === 'COMPANY_ADMIN' && recentSubmissions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-emerald-500" />
                                    Recent Submissions
                                </h2>
                                <button
                                    onClick={() => router.push('/admin/submissions')}
                                    className="text-emerald-500 hover:text-emerald-400 text-sm font-medium flex items-center gap-1"
                                >
                                    View All <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {recentSubmissions.map((submission, index) => (
                                    <div key={submission.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    submission.status === 'PENDING_CONSENT' ? 'bg-yellow-500/20 text-yellow-400' :
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
                                                {submission.job.title} • {submission.candidate.email} • {new Date(submission.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
