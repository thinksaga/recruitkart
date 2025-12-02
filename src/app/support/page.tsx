'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ticket, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react';

export default function SupportDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentTickets, setRecentTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/support/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setRecentTickets(data.recentTickets);
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
        { name: 'Open Tickets', value: stats?.openTickets || 0, icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'In Progress', value: stats?.inProgressTickets || 0, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { name: 'Resolved Today', value: stats?.resolvedToday || 0, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Urgent', value: stats?.urgentTickets || 0, icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Support Dashboard</h1>
                <p className="text-slate-400">Welcome back, here's what's happening today.</p>
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
                <h2 className="text-xl font-bold text-white mb-6">Recent Tickets</h2>
                <p className="text-gray-600 mb-6">Can&apos;t find what you&apos;re looking for? Create a support ticket.</p>
                {recentTickets.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent tickets found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentTickets.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${ticket.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500' :
                                        ticket.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        <Ticket className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{ticket.reason}</h4>
                                        <p className="text-sm text-slate-400">Raised by {ticket.raised_by.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${ticket.status === 'OPEN' ? 'bg-blue-500/10 text-blue-500' :
                                        ticket.status === 'RESOLVED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {ticket.status}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(ticket.created_at).toLocaleDateString()}
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
