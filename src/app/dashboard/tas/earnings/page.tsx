'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Calendar, Download, Filter, BarChart3, CheckCircle, Clock, XCircle, Wallet, Award, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TASLayout from '@/components/dashboard/TASLayout';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

interface Payout {
    id: string;
    amount: {
        gross: number;
        commission: number;
        gst: number;
        tds: number;
        net: number;
    };
    status: string;
    bankRef: string | null;
    job: {
        title: string;
        company: string;
    };
    taxSection: string;
    createdAt: string;
}

interface Summary {
    totalEarned: number;
    monthlyEarned: number;
    pendingPayouts: number;
}

interface ChartData {
    month: string;
    earnings: number;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function TASEarningsPage() {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [chartData, setChartData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [chartView, setChartView] = useState<'area' | 'bar'>('area');

    const fetchEarnings = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });

            const response = await fetch(`/api/tas/earnings?${params}`);
            const data = await response.json();

            if (response.ok) {
                setPayouts(data.payouts);
                setSummary(data.summary);
                setChartData(data.chartData);
                setPagination(data.pagination);
                setCurrentPage(page);
            } else {
                alert(data.error || 'Failed to fetch earnings');
            }
        } catch (error) {
            alert('Failed to fetch earnings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEarnings();
    }, []);

    const handlePageChange = (page: number) => {
        fetchEarnings(page);
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { icon: any; color: string; bg: string; label: string }> = {
            'PAID': { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Paid' },
            'PROCESSING': { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Processing' },
            'FAILED': { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Failed' },
        };
        return configs[status] || configs['PROCESSING'];
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <TASLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20">
                                    <DollarSign className="w-6 h-6 text-white" />
                                </div>
                                Earnings Dashboard
                            </h1>
                            <p className="text-slate-400 mt-2">Track your payouts and earnings performance</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <span className="hidden md:inline">Filter</span>
                            </button>
                            <button className="px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-green-500/20">
                                <Download className="w-4 h-4" />
                                <span>Export Report</span>
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    {summary && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                whileHover={{ y: -4 }}
                                className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-green-500/10 via-slate-900 to-slate-900 overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                                            <Wallet className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                                            <ArrowUpRight className="w-4 h-4" />
                                            <span>+12.5%</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-1">Total Earned</p>
                                    <p className="text-3xl font-bold text-white mb-2">{formatCurrency(summary.totalEarned)}</p>
                                    <p className="text-xs text-slate-500">All time earnings</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ y: -4 }}
                                className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                            <TrendingUp className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-medium text-blue-400">
                                            <ArrowUpRight className="w-4 h-4" />
                                            <span>+8.3%</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-1">This Month</p>
                                    <p className="text-3xl font-bold text-white mb-2">{formatCurrency(summary.monthlyEarned)}</p>
                                    <p className="text-xs text-slate-500">Current month earnings</p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                whileHover={{ y: -4 }}
                                className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-yellow-500/10 via-slate-900 to-slate-900 overflow-hidden group cursor-pointer"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                            <Clock className="w-6 h-6 text-yellow-400" />
                                        </div>
                                        <span className="text-xs font-medium text-yellow-400">Pending</span>
                                    </div>
                                    <p className="text-slate-400 text-sm mb-1">Pending Payouts</p>
                                    <p className="text-3xl font-bold text-white mb-2">{summary.pendingPayouts}</p>
                                    <p className="text-xs text-slate-500">Awaiting processing</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>

                {/* Earnings Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-green-500" />
                            Earnings Trend
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setChartView('area')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${chartView === 'area'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Area
                            </button>
                            <button
                                onClick={() => setChartView('bar')}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${chartView === 'bar'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                    }`}
                            >
                                Bar
                            </button>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            {chartView === 'area' ? (
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', padding: '12px' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                        labelStyle={{ color: '#94a3b8' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="earnings"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#earningsGradient)"
                                    />
                                </AreaChart>
                            ) : (
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', padding: '12px' }}
                                        itemStyle={{ color: '#e2e8f0' }}
                                        labelStyle={{ color: '#94a3b8' }}
                                    />
                                    <Bar dataKey="earnings" fill="#10b981" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Payout History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Payout History</h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-3 flex-1">
                                            <div className="h-5 bg-slate-800 rounded w-1/3"></div>
                                            <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                                        </div>
                                        <div className="h-10 bg-slate-800 rounded w-24"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : payouts.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                            <DollarSign className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No payouts yet</h3>
                            <p className="text-slate-400">Your payout history will appear here once you make placements</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {payouts.map((payout, index) => {
                                const statusConfig = getStatusConfig(payout.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={payout.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ x: 4 }}
                                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-green-500/30 transition-all group"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
                                                        <DollarSign className="w-6 h-6 text-green-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-white">{payout.job.title}</h3>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color}`}>
                                                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>
                                                        <p className="text-slate-400 text-sm mb-3">{payout.job.company}</p>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <p className="text-xs text-slate-500">Gross Amount</p>
                                                                <p className="text-sm font-semibold text-white">{formatCurrency(payout.amount.gross)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500">Commission</p>
                                                                <p className="text-sm font-semibold text-emerald-400">{formatCurrency(payout.amount.commission)}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500">Tax (GST+TDS)</p>
                                                                <p className="text-sm font-semibold text-orange-400">
                                                                    -{formatCurrency(payout.amount.gst + payout.amount.tds)}
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <p className="text-xs text-slate-500">Net Amount</p>
                                                                <p className="text-sm font-semibold text-green-400">{formatCurrency(payout.amount.net)}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-white">{formatCurrency(payout.amount.net)}</p>
                                                    <p className="text-xs text-slate-500">{new Date(payout.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                                                </div>
                                                {payout.bankRef && (
                                                    <p className="text-xs text-slate-500">Ref: {payout.bankRef}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-xl font-medium transition-all ${page === currentPage
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20'
                                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </TASLayout>
    );
}
