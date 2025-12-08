'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Calendar, UserCheck, Plus, UserPlus, FileText, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { ApplicationsTrendChart } from '@/components/dashboard/company/ApplicationsTrendChart';

export default function CompanyDashboard() {
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalCandidates: 0,
        interviewsScheduled: 0,
        hiresThisMonth: 0
    });
    const [applicationsTrend, setApplicationsTrend] = useState<any[]>([]);
    const [recentApplications, setRecentApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/company/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data.stats);
                    setApplicationsTrend(data.applicationsTrend || []);
                    setRecentApplications(data.recentApplications || []);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { label: 'Active Jobs', value: stats.activeJobs, icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { label: 'Total Candidates', value: stats.totalCandidates, icon: Users, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { label: 'Interviews Scheduled', value: stats.interviewsScheduled, icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { label: 'Hires This Month', value: stats.hiresThisMonth, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Company Dashboard</h1>
                    <p className="text-slate-400">Manage your hiring pipeline and team.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/dashboard/company/jobs/new"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Post Job
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <StatsCard
                        key={stat.label}
                        {...stat}
                        delay={index * 0.1}
                    />
                ))}
            </div>

            {/* Applications Trend Chart */}
            <div className="w-full h-[400px]">
                <ApplicationsTrendChart data={applicationsTrend} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Applications */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Recent Applications</h2>
                        <Link href="/dashboard/company/candidates" className="text-sm text-emerald-400 hover:text-emerald-300">
                            View All
                        </Link>
                    </div>

                    {recentApplications.length === 0 ? (
                        <div className="text-center py-12 text-slate-500">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No recent applications</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {recentApplications.map((app) => (
                                <div key={app.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-medium">
                                            {app.candidate.full_name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">{app.candidate.full_name}</h3>
                                            <p className="text-sm text-slate-400">Applied for {app.job.title}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                        ${app.status === 'HIRED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            app.status === 'INTERVIEWING' ? 'bg-purple-500/10 text-purple-500' :
                                                'bg-blue-500/10 text-blue-500'}`}>
                                        {app.status.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm h-fit"
                >
                    <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link href="/dashboard/company/jobs/new" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group">
                            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                <Plus className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Post New Job</span>
                        </Link>
                        <Link href="/dashboard/company/team" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <UserPlus className="w-5 h-5" />
                            </div>
                            <span className="font-medium">Invite Team Member</span>
                        </Link>
                        <Link href="/dashboard/company/billing" className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group">
                            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <FileText className="w-5 h-5" />
                            </div>
                            <span className="font-medium">View Invoices</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
