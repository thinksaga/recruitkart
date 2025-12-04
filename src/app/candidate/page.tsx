'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, FileText, Calendar, Eye, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CandidateDashboard() {
    const [stats, setStats] = useState({
        activeApplications: 0,
        interviews: 0,
        profileCompletion: 0,
        profileViews: 0,
    });
    const [recentApplications, setRecentApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/candidate/dashboard');
                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.error || `Failed to fetch data: ${res.status}`);
                }
                const data = await res.json();
                setRecentApplications(data.recentApplications || []);
                setStats(data.stats);
            } catch (error: any) {
                console.error('Error fetching dashboard data:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        { name: 'Profile Completion', value: `${stats.profileCompletion}%`, icon: User, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
        { name: 'Active Applications', value: stats.activeApplications.toString(), icon: FileText, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { name: 'Upcoming Interviews', value: stats.interviews.toString(), icon: Calendar, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Profile Views', value: stats.profileViews.toString(), icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
                <p className="text-slate-400">Track your job applications and interview schedule.</p>
            </div>

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-2">
                    <Loader2 className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-2xl font-bold text-white">{stat.value}</span>
                        </div>
                        <h3 className="text-sm font-medium text-slate-400">{stat.name}</h3>
                    </motion.div>
                ))}
            </div>

            {/* Recent Applications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Recent Applications</h2>
                    <Link href="/candidate/applications" className="text-sm text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 text-cyan-500 animate-spin" />
                    </div>
                ) : recentApplications.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent applications</p>
                        <Link href="/candidate/jobs" className="text-cyan-400 hover:underline mt-2 inline-block">
                            Browse Jobs
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentApplications.map((app) => (
                            <div key={app.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800">
                                <div>
                                    <h3 className="font-medium text-white">{app.job.title}</h3>
                                    <p className="text-sm text-slate-400">{app.job.organization.name}</p>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                                    {app.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
