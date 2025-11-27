'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Users, Building2, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
    kpis: {
        totalUsers: { value: number; growth: number };
        totalCompanies: { value: number; growth: number };
        totalJobs: { value: number; growth: number };
        monthlyRevenue: { value: number; growth: number };
    };
    charts: {
        userGrowth: Array<{ month: string; users: number; companies: number; tas: number }>;
        jobStats: Array<{ month: string; posted: number; filled: number }>;
    };
    metrics: {
        verificationRate: number;
        avgTimeToFill: string;
        successRate: number;
        totalRevenue: number;
        totalCandidates: number;
    };
}

export default function AdminAnalyticsPage() {
    const router = useRouter();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/admin/analytics');
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
                throw new Error('Failed to fetch analytics');
            }
            const analyticsData = await res.json();
            setData(analyticsData);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) {
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
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Analytics & Insights</h1>
                    <p className="text-slate-400">Platform performance metrics and trends</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Users className="w-8 h-8 text-blue-500" />
                            <span className={`text-sm font-medium ${data.kpis.totalUsers.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {data.kpis.totalUsers.growth > 0 ? '+' : ''}{data.kpis.totalUsers.growth}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{data.kpis.totalUsers.value}</div>
                        <div className="text-sm text-slate-400">Total Users</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Building2 className="w-8 h-8 text-purple-500" />
                            <span className={`text-sm font-medium ${data.kpis.totalCompanies.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {data.kpis.totalCompanies.growth > 0 ? '+' : ''}{data.kpis.totalCompanies.growth}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{data.kpis.totalCompanies.value}</div>
                        <div className="text-sm text-slate-400">Companies</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Briefcase className="w-8 h-8 text-emerald-500" />
                            <span className={`text-sm font-medium ${data.kpis.totalJobs.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {data.kpis.totalJobs.growth > 0 ? '+' : ''}{data.kpis.totalJobs.growth}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">{data.kpis.totalJobs.value}</div>
                        <div className="text-sm text-slate-400">Jobs Posted</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="w-8 h-8 text-yellow-500" />
                            <span className={`text-sm font-medium ${data.kpis.monthlyRevenue.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {data.kpis.monthlyRevenue.growth > 0 ? '+' : ''}{data.kpis.monthlyRevenue.growth}%
                            </span>
                        </div>
                        <div className="text-3xl font-bold mb-1">₹{(data.kpis.monthlyRevenue.value / 100000).toFixed(1)}L</div>
                        <div className="text-sm text-slate-400">Revenue (MTD)</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* User Growth Chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-6">User Growth</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={data.charts.userGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} />
                                <Line type="monotone" dataKey="companies" stroke="#a855f7" strokeWidth={2} />
                                <Line type="monotone" dataKey="tas" stroke="#10b981" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Job Stats Chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-6">Job Statistics</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={data.charts.jobStats}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} />
                                <Legend />
                                <Bar dataKey="posted" fill="#3b82f6" />
                                <Bar dataKey="filled" fill="#10b981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <h2 className="text-xl font-bold mb-6">Platform Metrics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <div className="text-2xl font-bold mb-1">{data.metrics.verificationRate}%</div>
                            <div className="text-sm text-slate-400">Verification Rate</div>
                        </div>
                        <div className="border-l-4 border-emerald-500 pl-4">
                            <div className="text-2xl font-bold mb-1">{data.metrics.avgTimeToFill} days</div>
                            <div className="text-sm text-slate-400">Avg. Time to Fill</div>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <div className="text-2xl font-bold mb-1">{data.metrics.successRate}%</div>
                            <div className="text-sm text-slate-400">Success Rate</div>
                        </div>
                        <div className="border-l-4 border-yellow-500 pl-4">
                            <div className="text-2xl font-bold mb-1">{data.metrics.totalCandidates}</div>
                            <div className="text-sm text-slate-400">Total Candidates</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
