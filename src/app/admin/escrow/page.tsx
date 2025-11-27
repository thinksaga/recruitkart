'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    TrendingUp,
    Eye,
    RefreshCw,
    Undo2,
    AlertCircle,
    X,
    Search,
    Filter,
    Building2,
    Calendar,
} from 'lucide-react';

interface EscrowLedger {
    id: string;
    job_id: string;
    amount: number;
    currency: string;
    status: string;
    deposited_at: string;
    release_date: string | null;
    released_at: string | null;
    updated_at: string;
    job: {
        id: string;
        title: string;
        organization: {
            display_name: string;
        };
    };
    transactions: Array<{
        id: string;
        type: string;
        amount: number;
        description: string | null;
        created_at: string;
    }>;
    _count: {
        transactions: number;
    };
}

export default function EscrowPage() {
    const [ledgers, setLedgers] = useState<EscrowLedger[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLedger, setSelectedLedger] = useState<EscrowLedger | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchLedgers();
    }, [statusFilter]);

    const fetchLedgers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/escrow?status=${statusFilter}`);
            const data = await response.json();
            if (response.ok) {
                setLedgers(data.ledgers);
            }
        } catch (error) {
            console.error('Error fetching ledgers:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateLedger = async (ledgerId: string, action: string, notes?: string) => {
        setProcessing(true);
        try {
            const response = await fetch('/api/admin/escrow', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ledgerId,
                    action,
                    notes,
                }),
            });

            if (response.ok) {
                fetchLedgers();
                setShowDetailsModal(false);
                alert(`${action.toLowerCase()} successful!`);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'Failed to update ledger'}`);
            }
        } catch (error) {
            console.error('Error updating ledger:', error);
            alert('Failed to update ledger');
        } finally {
            setProcessing(false);
        }
    };

    const viewDetails = (ledger: EscrowLedger) => {
        setSelectedLedger(ledger);
        setShowDetailsModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'HELD':
                return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
            case 'RELEASED':
                return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            case 'REFUNDED':
                return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
            case 'DISPUTED':
                return 'bg-red-500/10 text-red-400 border border-red-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'HELD':
                return <Clock className="w-4 h-4" />;
            case 'RELEASED':
                return <CheckCircle className="w-4 h-4" />;
            case 'REFUNDED':
                return <Undo2 className="w-4 h-4" />;
            case 'DISPUTED':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const filteredLedgers = ledgers.filter(ledger =>
        ledger.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ledger.job.organization.display_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        held: ledgers.filter(l => l.status === 'HELD').length,
        released: ledgers.filter(l => l.status === 'RELEASED').length,
        refunded: ledgers.filter(l => l.status === 'REFUNDED').length,
        disputed: ledgers.filter(l => l.status === 'DISPUTED').length,
        total: ledgers.length,
        totalAmount: ledgers.reduce((sum, l) => sum + l.amount, 0),
    };

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Escrow Management</h1>
                    <p className="text-slate-400">
                        Manage job escrow funds and financial transactions
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                    <div className="p-6 rounded-2xl border border-yellow-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Held</p>
                                <p className="text-2xl font-bold text-yellow-400">{stats.held}</p>
                                <p className="text-xs text-slate-500">awaiting release</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Released</p>
                                <p className="text-2xl font-bold text-emerald-400">{stats.released}</p>
                                <p className="text-xs text-slate-500">funds transferred</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Refunded</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.refunded}</p>
                                <p className="text-xs text-slate-500">returned to company</p>
                            </div>
                            <Undo2 className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-red-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Disputed</p>
                                <p className="text-2xl font-bold text-red-400">{stats.disputed}</p>
                                <p className="text-xs text-slate-500">under review</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-purple-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Total Value</p>
                                <p className="text-2xl font-bold text-purple-400">₹{stats.totalAmount.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">escrow funds</p>
                            </div>
                            <DollarSign className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-400">Status Filter</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="HELD">Held</option>
                                <option value="RELEASED">Released</option>
                                <option value="REFUNDED">Refunded</option>
                                <option value="DISPUTED">Disputed</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-slate-400">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by job title or organization..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ledgers Table */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/80 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Job & Organization
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Deposited
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredLedgers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                            No escrow ledgers found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredLedgers.map((ledger) => (
                                        <tr key={ledger.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{ledger.job.title}</p>
                                                    <p className="text-sm text-slate-400 flex items-center gap-1">
                                                        <Building2 className="w-4 h-4" />
                                                        {ledger.job.organization.display_name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                                    <span className="font-medium text-white">{ledger.amount.toLocaleString()}</span>
                                                    <span className="text-sm text-slate-400">{ledger.currency}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 ${getStatusColor(ledger.status)}`}>
                                                    {getStatusIcon(ledger.status)}
                                                    {ledger.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(ledger.deposited_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => viewDetails(ledger)}
                                                        className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                    {ledger.status === 'HELD' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateLedger(ledger.id, 'RELEASE')}
                                                                disabled={processing}
                                                                className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Release
                                                            </button>
                                                            <button
                                                                onClick={() => updateLedger(ledger.id, 'REFUND')}
                                                                disabled={processing}
                                                                className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <Undo2 className="w-4 h-4" />
                                                                Refund
                                                            </button>
                                                            <button
                                                                onClick={() => updateLedger(ledger.id, 'DISPUTE')}
                                                                disabled={processing}
                                                                className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                                Dispute
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedLedger && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Escrow Details</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Job Information</h3>
                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                <p className="font-medium text-white">{selectedLedger.job.title}</p>
                                                <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                                    <Building2 className="w-4 h-4" />
                                                    {selectedLedger.job.organization.display_name}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Escrow Details</h3>
                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Amount:</span>
                                                    <span className="font-medium text-white">₹{selectedLedger.amount.toLocaleString()} {selectedLedger.currency}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Status:</span>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedLedger.status)}`}>
                                                        {selectedLedger.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Deposited:</span>
                                                    <span className="text-sm text-slate-300">{new Date(selectedLedger.deposited_at).toLocaleString()}</span>
                                                </div>
                                                {selectedLedger.released_at && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Released:</span>
                                                        <span className="text-sm text-slate-300">{new Date(selectedLedger.released_at).toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Transaction History</h3>
                                            <div className="bg-slate-900/50 rounded-lg border border-slate-800 max-h-64 overflow-y-auto">
                                                {selectedLedger.transactions.length === 0 ? (
                                                    <p className="p-4 text-slate-400 text-center">No transactions yet</p>
                                                ) : (
                                                    <div className="divide-y divide-slate-800/50">
                                                        {selectedLedger.transactions.map((transaction) => (
                                                            <div key={transaction.id} className="p-4">
                                                                <div className="flex justify-between items-start">
                                                                    <div>
                                                                        <p className="font-medium text-white capitalize">{transaction.type}</p>
                                                                        {transaction.description && (
                                                                            <p className="text-sm text-slate-400">{transaction.description}</p>
                                                                        )}
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <p className={`font-medium ${transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                                            {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedLedger.status === 'HELD' && (
                                <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
                                    <button
                                        onClick={() => updateLedger(selectedLedger.id, 'RELEASE')}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        {processing ? 'Processing...' : 'Release Funds'}
                                    </button>
                                    <button
                                        onClick={() => updateLedger(selectedLedger.id, 'REFUND')}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        {processing ? 'Processing...' : 'Refund to Company'}
                                    </button>
                                    <button
                                        onClick={() => updateLedger(selectedLedger.id, 'DISPUTE')}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                                    >
                                        {processing ? 'Processing...' : 'Mark as Disputed'}
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}