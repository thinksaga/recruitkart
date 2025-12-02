'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, FileText, TrendingUp, Loader2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function FinanceDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/finance/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
                setRecentTransactions(data.recentTransactions);
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
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
            </div>
        );
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const statCards = [
        { name: 'Pending Payouts', value: formatCurrency(stats?.pendingPayouts || 0), icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { name: 'Escrow Balance', value: formatCurrency(stats?.escrowBalance || 0), icon: CreditCard, color: 'text-teal-500', bg: 'bg-teal-500/10' },
        { name: 'Open Invoices', value: stats?.openInvoices || 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { name: 'Monthly Revenue', value: formatCurrency(stats?.monthlyRevenue || 0), icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-500/10' },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Financial Overview</h1>
                <p className="text-slate-400">Monitor financial health and manage transactions.</p>
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

            {/* Recent Transactions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">Recent Credit Transactions</h2>
                {recentTransactions.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No recent transactions</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recentTransactions.map((tx) => (
                            <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${tx.type === 'CREDIT' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                                        }`}>
                                        {tx.type === 'CREDIT' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-white">{tx.description}</h4>
                                        <p className="text-sm text-slate-400">{tx.tas.user.email}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-lg font-bold ${tx.type === 'CREDIT' ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {tx.type === 'CREDIT' ? '+' : '-'}{tx.amount} Credits
                                    </span>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {new Date(tx.created_at).toLocaleDateString()}
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
