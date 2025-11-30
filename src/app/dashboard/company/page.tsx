'use client';

import { motion } from 'framer-motion';
import { Briefcase, Users, Calendar, UserCheck } from 'lucide-react';

export default function CompanyDashboard() {
    const stats = [
        { name: 'Active Jobs', value: '8', icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { name: 'Total Candidates', value: '42', icon: Users, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { name: 'Interviews Scheduled', value: '6', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Hires This Month', value: '2', icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Company Dashboard</h1>
                <p className="text-slate-400">Manage your hiring pipeline and team.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
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

            {/* Recent Activity (Placeholder) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">Recent Candidates</h2>
                <div className="text-center py-12 text-slate-500">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent candidates</p>
                </div>
            </motion.div>
        </div>
    );
}
