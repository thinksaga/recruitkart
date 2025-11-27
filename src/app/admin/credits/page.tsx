'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    TrendingUp,
    TrendingDown,
    Plus,
    Minus,
    Eye,
    User,
    Calendar,
    X,
    Search,
    Filter,
} from 'lucide-react';

interface TASProfile {
    id: string;
    credits_balance: number;
    user: {
        email: string;
    };
    _count: {
        credit_transactions: number;
    };
}

interface CreditTransaction {
    id: string;
    type: string;
    amount: number;
    description: string | null;
    created_at: string;
    tas_profile: {
        user: {
            email: string;
        };
    };
}

export default function CreditsPage() {
    const [tasProfiles, setTasProfiles] = useState<TASProfile[]>([]);
    const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProfile, setSelectedProfile] = useState<TASProfile | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [adjustmentAmount, setAdjustmentAmount] = useState('');
    const [adjustmentType, setAdjustmentType] = useState('ADD');
    const [adjustmentReason, setAdjustmentReason] = useState('');

    useEffect(() => {
        fetchCreditsData();
    }, []);

    const fetchCreditsData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/admin/credits');
            const data = await response.json();
            if (response.ok) {
                setTasProfiles(data.profiles);
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error('Error fetching credits data:', error);
        } finally {
            setLoading(false);
        }
    };

    const adjustCredits = async () => {
        if (!selectedProfile || !adjustmentAmount || !adjustmentReason) {
            alert('Please fill in all fields');
            return;
        }

        const amount = parseFloat(adjustmentAmount);
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid positive amount');
            return;
        }

        setProcessing(true);
        try {
            const response = await fetch('/api/admin/credits', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tasProfileId: selectedProfile.id,
                    type: adjustmentType,
                    amount,
                    reason: adjustmentReason,
                }),
            });

            if (response.ok) {
                fetchCreditsData();
                setShowAdjustModal(false);
                setAdjustmentAmount('');
                setAdjustmentReason('');
                alert('Credits adjusted successfully!');
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'Failed to adjust credits'}`);
            }
        } catch (error) {
            console.error('Error adjusting credits:', error);
            alert('Failed to adjust credits');
        } finally {
            setProcessing(false);
        }
    };

    const viewDetails = (profile: TASProfile) => {
        setSelectedProfile(profile);
        setShowDetailsModal(true);
    };

    const openAdjustModal = (profile: TASProfile) => {
        setSelectedProfile(profile);
        setShowAdjustModal(true);
    };

    const filteredProfiles = tasProfiles.filter(profile =>
        profile.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalProfiles: tasProfiles.length,
        totalCredits: tasProfiles.reduce((sum, p) => sum + p.credits_balance, 0),
        averageCredits: tasProfiles.length > 0 ? tasProfiles.reduce((sum, p) => sum + p.credits_balance, 0) / tasProfiles.length : 0,
        lowBalanceProfiles: tasProfiles.filter(p => p.credits_balance < 100).length,
    };

    const recentTransactions = transactions.slice(0, 10);

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Credits & Wallet Management</h1>
                    <p className="text-slate-400">
                        Manage TAS recruiter credit balances and transaction history
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Total Profiles</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.totalProfiles}</p>
                                <p className="text-xs text-slate-500">active TAS recruiters</p>
                            </div>
                            <User className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Total Credits</p>
                                <p className="text-2xl font-bold text-emerald-400">{stats.totalCredits.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">in circulation</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-purple-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Average Balance</p>
                                <p className="text-2xl font-bold text-purple-400">{stats.averageCredits.toFixed(0)}</p>
                                <p className="text-xs text-slate-500">per recruiter</p>
                            </div>
                            <TrendingUp className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-red-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Low Balance</p>
                                <p className="text-2xl font-bold text-red-400">{stats.lowBalanceProfiles}</p>
                                <p className="text-xs text-slate-500">under 100 credits</p>
                            </div>
                            <TrendingDown className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2">
                        {/* Search */}
                        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* TAS Profiles Table */}
                        <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-900/80 border-b border-slate-800">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                TAS Recruiter
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                Credit Balance
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                Transactions
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredProfiles.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                                    No TAS profiles found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProfiles.map((profile) => (
                                                <tr key={profile.id} className="hover:bg-slate-800/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-slate-400" />
                                                            <span className="font-medium text-white">{profile.user.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1">
                                                            <CreditCard className="w-4 h-4 text-emerald-400" />
                                                            <span className={`font-medium ${profile.credits_balance < 100 ? 'text-red-400' : 'text-emerald-400'}`}>
                                                                {profile.credits_balance.toLocaleString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm text-slate-400">{profile._count.credit_transactions}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => viewDetails(profile)}
                                                                className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                            <button
                                                                onClick={() => openAdjustModal(profile)}
                                                                className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <Plus className="w-4 h-4" />
                                                                Adjust
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions Sidebar */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm">
                            <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                {recentTransactions.length === 0 ? (
                                    <p className="text-slate-400 text-sm">No recent transactions</p>
                                ) : (
                                    recentTransactions.map((transaction) => (
                                        <div key={transaction.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">{transaction.tas_profile.user.email}</p>
                                                <p className="text-xs text-slate-400 capitalize">{transaction.type.toLowerCase()}</p>
                                                {transaction.description && (
                                                    <p className="text-xs text-slate-500">{transaction.description}</p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-sm font-medium ${transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                    {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(transaction.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedProfile && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Credit Details</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-white">{selectedProfile.user.email}</p>
                                            <p className="text-sm text-slate-400">TAS Recruiter</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-emerald-400">{selectedProfile.credits_balance.toLocaleString()}</p>
                                            <p className="text-sm text-slate-400">Current Balance</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => {
                                            setShowDetailsModal(false);
                                            openAdjustModal(selectedProfile);
                                        }}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        Adjust Credits
                                    </button>
                                    <button
                                        onClick={() => setShowDetailsModal(false)}
                                        className="px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Adjust Credits Modal */}
                {showAdjustModal && selectedProfile && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full"
                        >
                            <div className="px-6 py-4 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white">Adjust Credits</h2>
                                <p className="text-sm text-slate-400">{selectedProfile.user.email}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-400">Adjustment Type</label>
                                    <select
                                        value={adjustmentType}
                                        onChange={(e) => setAdjustmentType(e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    >
                                        <option value="ADD">Add Credits</option>
                                        <option value="SUBTRACT">Subtract Credits</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-400">Amount</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={adjustmentAmount}
                                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                                        placeholder="Enter amount..."
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-400">Reason</label>
                                    <textarea
                                        value={adjustmentReason}
                                        onChange={(e) => setAdjustmentReason(e.target.value)}
                                        placeholder="Reason for adjustment..."
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
                                <button
                                    onClick={() => setShowAdjustModal(false)}
                                    className="flex-1 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={adjustCredits}
                                    disabled={processing || !adjustmentAmount || !adjustmentReason}
                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Processing...' : 'Adjust Credits'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}