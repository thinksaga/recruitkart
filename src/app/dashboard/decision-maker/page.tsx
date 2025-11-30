'use client';

import { motion } from 'framer-motion';
import { CheckCircle, Briefcase, TrendingUp, Clock } from 'lucide-react';

export default function DecisionMakerDashboard() {
    const stats = [
        { name: 'Pending Approvals', value: '4', icon: CheckCircle, color: 'text-slate-300', bg: 'bg-slate-500/10' },
        { name: 'Active Positions', value: '8', icon: Briefcase, color: 'text-gray-300', bg: 'bg-gray-500/10' },
        { name: 'Offer Acceptance', value: '85%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Avg Time to Hire', value: '21d', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Executive Dashboard</h1>
                <p className="text-slate-400">High-level hiring metrics and approvals.</p>
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

            {/* Pending Approvals (Placeholder) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">Pending Approvals</h2>
                <div className="text-center py-12 text-slate-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No pending approvals</p>
                </div>
            </motion.div>
        </div>
    );
}
