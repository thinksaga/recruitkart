'use client';

import { motion } from 'framer-motion';
import { Briefcase, Building2, Activity, DollarSign } from 'lucide-react';

export default function OperatorDashboard() {
    const stats = [
        { name: 'Active Jobs', value: '24', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { name: 'Organizations', value: '12', icon: Building2, color: 'text-violet-500', bg: 'bg-violet-500/10' },
        { name: 'Total Submissions', value: '156', icon: Activity, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Revenue (MTD)', value: '₹2.4L', icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Operator Dashboard</h1>
                <p className="text-slate-400">Platform operations overview and insights.</p>
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

            {/* Activity Overview (Placeholder) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>
                <div className="text-center py-12 text-slate-500">
                    <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                </div>
            </motion.div>
        </div>
    );
}
