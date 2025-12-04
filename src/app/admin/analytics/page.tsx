'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Users, Briefcase, DollarSign, Loader2 } from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

export default function AdminAnalyticsPage() {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch('/api/admin/analytics');
            if (res.ok) {
                const analyticsData = await res.json();
                setData(analyticsData);
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            </div>
        );
    }

    // Transform data for charts
    const submissionData = data?.submissionTrends.labels.map((label: string, i: number) => ({
        name: label,
        submissions: data.submissionTrends.data[i]
    }));

    const revenueData = data?.revenueTrends.labels.map((label: string, i: number) => ({
        name: label,
        revenue: data.revenueTrends.data[i]
    }));

    const userDistributionData = [
        { name: 'Companies', value: data?.userDistribution.company },
        { name: 'TAS', value: data?.userDistribution.tas },
        { name: 'Candidates', value: data?.userDistribution.candidate },
    ];

    const COLORS = ['#10b981', '#6366f1', '#f59e0b'];

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
                    <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
                    <p className="text-slate-400">Insights into platform performance and growth</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Submission Trends */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Submission Trends
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={submissionData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey="submissions" stroke="#10b981" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Revenue Trends */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-500" />
                            Revenue Growth
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    />
                                    <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Distribution */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Users className="w-5 h-5 text-emerald-500" />
                            User Distribution
                        </h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={userDistributionData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {userDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Job Stats */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-emerald-500" />
                            Job Statistics
                        </h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="text-sm text-slate-400 mb-1">Open Jobs</div>
                                <div className="text-3xl font-bold text-emerald-400">{data?.jobStats.open}</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="text-sm text-slate-400 mb-1">Filled Jobs</div>
                                <div className="text-3xl font-bold text-blue-400">{data?.jobStats.filled}</div>
                            </div>
                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="text-sm text-slate-400 mb-1">Closed Jobs</div>
                                <div className="text-3xl font-bold text-slate-400">{data?.jobStats.closed}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
