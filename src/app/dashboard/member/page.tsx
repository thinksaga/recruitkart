'use client';

import { motion } from 'framer-motion';
import { CheckSquare, Briefcase, Users, Calendar } from 'lucide-react';

export default function MemberDashboard() {
    const stats = [
        { name: 'Assigned Tasks', value: '5', icon: CheckSquare, color: 'text-fuchsia-500', bg: 'bg-fuchsia-500/10' },
        { name: 'Jobs I\'m Tracking', value: '3', icon: Briefcase, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        { name: 'Candidates Reviewed', value: '12', icon: Users, color: 'text-pink-500', bg: 'bg-pink-500/10' },
        { name: 'Interviews This Week', value: '4', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Member Dashboard</h1>
                <p className="text-slate-400">Track your tasks and contributions.</p>
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

            {/* My Tasks (Placeholder) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">My Tasks</h2>
                <div className="text-center py-12 text-slate-500">
                    <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No tasks assigned</p>
                </div>
            </motion.div>
        </div>
    );
}
