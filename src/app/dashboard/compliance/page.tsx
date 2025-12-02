'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, FileSearch, AlertTriangle, UserCheck, Loader2, Activity } from 'lucide-react';

export default function ComplianceDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentAudits, setRecentAudits] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/compliance/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setRecentAudits(data.recentAudits);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
            </div>
        );
    }

    const statCards = [
        { name: 'Pending Verifications', value: stats?.pendingVerifications || 0, icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Total Audits', value: stats?.totalAudits || 0, icon: FileSearch, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { name: 'Flagged Accounts', value: stats?.flaggedAccounts || 0, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { name: 'Compliance Score', value: `${stats?.complianceScore || 0}%`, icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Compliance Overview</h1>
                <p className="text-slate-400">Monitor system compliance and verification status.</p>
            </div>

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

            {/* Recent Audits */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">Recent System Activity</h2>
                {recentAudits.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent activity</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentAudits.map((log) => (
                            <div key={log.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-lg bg-slate-700/50 text-slate-400">
                                        <Activity className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{log.action}</h4>
                                        <p className="text-sm text-slate-400">
                                            {log.user.email} • {log.entity_type}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-slate-500">
                                        {new Date(log.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
