'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Activity, DollarSign, Loader2, Users } from 'lucide-react';

export default function OperatorDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentUsers, setRecentUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
                setRecentUsers(data.recentUsers);
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
                <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
            </div>
        );
    }

    const statCards = [
        { name: 'Total Users', value: stats?.userCounts?.total || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Active Jobs', value: stats?.jobCounts?.open || 0, icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Organizations', value: stats?.companyCount || 0, icon: Building2, color: 'text-violet-500', bg: 'bg-violet-500/10' },
        { name: 'Pending Verification', value: stats?.userCounts?.pending || 0, icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Operator Dashboard</h1>
                <p className="text-slate-400">Platform operations overview and insights.</p>
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

            {/* Recent Activity */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">Recent User Signups</h2>
                {recentUsers.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent activity</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentUsers.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                        {user.email[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{user.email}</h4>
                                        <p className="text-sm text-slate-400">{user.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.verification_status === 'VERIFIED' ? 'bg-green-500/10 text-green-500' :
                                            user.verification_status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-red-500/10 text-red-500'
                                        }`}>
                                        {user.verification_status}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
