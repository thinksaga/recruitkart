'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, FileSearch, AlertTriangle, UserCheck } from 'lucide-react';

export default function ComplianceDashboard() {
    const stats = [
        { name: 'Pending Verifications', value: '12', icon: UserCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Active Audits', value: '3', icon: FileSearch, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        { name: 'Flagged Accounts', value: '5', icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { name: 'Compliance Score', value: '98%', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Compliance Overview</h1>
                <p className="text-slate-400">Monitor system compliance and verification status.</p>
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

            {/* Recent Alerts (Placeholder) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">Recent Alerts</h2>
                <div className="text-center py-12 text-slate-500">
                    <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent compliance alerts</p>
                </div>
            </motion.div>
        </div>
    );
}
