'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Users, Building2, Briefcase, DollarSign, Calendar } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminAnalyticsPage() {
    const router = useRouter();

    // Mock data - replace with real API data
    const userGrowthData = [
        { month: 'Jan', users: 45, companies: 12, tas: 33 },
        { month: 'Feb', users: 78, companies: 23, tas: 55 },
        { month: 'Mar', users: 112, companies: 34, tas: 78 },
        { month: 'Apr', users: 156, companies: 45, tas: 111 },
        { month: 'May', users: 203, companies: 58, tas: 145 },
        { month: 'Jun', users: 267, companies: 72, tas: 195 },
    ];

    const jobStatsData = [
        { month: 'Jan', posted: 15, filled: 8 },
        { month: 'Feb', posted: 28, filled: 15 },
        { month: 'Mar', posted: 42, filled: 24 },
        { month: 'Apr', posted: 56, filled: 31 },
        { month: 'May', posted: 73, filled: 45 },
        { month: 'Jun', posted: 91, filled: 58 },
    ];

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
                            <span className="text-green-500 text-sm font-medium">+23%</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">267</div>
                        <div className="text-sm text-slate-400">Total Users</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Building2 className="w-8 h-8 text-purple-500" />
                            <span className="text-green-500 text-sm font-medium">+18%</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">72</div>
                        <div className="text-sm text-slate-400">Companies</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <Briefcase className="w-8 h-8 text-emerald-500" />
                            <span className="text-green-500 text-sm font-medium">+31%</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">91</div>
                        <div className="text-sm text-slate-400">Jobs Posted</div>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <DollarSign className="w-8 h-8 text-yellow-500" />
                            <span className="text-green-500 text-sm font-medium">+42%</span>
                        </div>
                        <div className="text-3xl font-bold mb-1">₹5.2L</div>
                        <div className="text-sm text-slate-400">Revenue (MTD)</div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {/* User Growth Chart */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h2 className="text-xl font-bold mb-6">User Growth</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userGrowthData}>
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
                            <BarChart data={jobStatsData}>
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="border-l-4 border-blue-500 pl-4">
                            <div className="text-2xl font-bold mb-1">64%</div>
                            <div className="text-sm text-slate-400">Verification Rate</div>
                        </div>
                        <div className="border-l-4 border-emerald-500 pl-4">
                            <div className="text-2xl font-bold mb-1">3.2 days</div>
                            <div className="text-sm text-slate-400">Avg. Time to Fill</div>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4">
                            <div className="text-2xl font-bold mb-1">87%</div>
                            <div className="text-sm text-slate-400">Success Rate</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
