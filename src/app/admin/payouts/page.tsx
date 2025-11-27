'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Eye,
    TrendingUp,
    Building2,
    User,
    Calendar,
    X,
    Search,
    Filter,
} from 'lucide-react';

interface Payout {
    id: string;
    amount: number;
    currency: string;
    status: string;
    description: string | null;
    created_at: string;
    processed_at: string | null;
    approved_at: string | null;
    rejected_at: string | null;
    rejection_reason: string | null;
    tas_profile: {
        id: string;
        user: {
            email: string;
        };
    };
    job?: {
        id: string;
        title: string;
        organization: {
            display_name: string;
        };
    } | null;
    escrow_ledger?: {
        id: string;
        job: {
            title: string;
            organization: {
                display_name: string;
            };
        };
    } | null;
}

export default function PayoutsPage() {
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchPayouts();
    }, [statusFilter]);

    const fetchPayouts = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/payouts?status=${statusFilter}`);
            const data = await response.json();
            if (response.ok) {
                setPayouts(data.payouts);
            }
        } catch (error) {
            console.error('Error fetching payouts:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePayout = async (payoutId: string, action: string, notes?: string) => {
        setProcessing(true);
        try {
            const response = await fetch('/api/admin/payouts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    payoutId,
                    action,
                    notes,
                }),
            });

            if (response.ok) {
                fetchPayouts();
                setShowDetailsModal(false);
                alert(`${action.toLowerCase()} successful!`);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'Failed to update payout'}`);
            }
        } catch (error) {
            console.error('Error updating payout:', error);
            alert('Failed to update payout');
        } finally {
            setProcessing(false);
        }
    };

    const viewDetails = (payout: Payout) => {
        setSelectedPayout(payout);
        setShowDetailsModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
            case 'APPROVED':
                return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            case 'REJECTED':
                return 'bg-red-500/10 text-red-400 border border-red-500/20';
            case 'HOLD':
                return 'bg-orange-500/10 text-orange-400 border border-orange-500/20';
            default:
                return 'bg-slate-500/10 text-slate-400 border border-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-4 h-4" />;
            case 'APPROVED':
                return <CheckCircle className="w-4 h-4" />;
            case 'REJECTED':
                return <XCircle className="w-4 h-4" />;
            case 'HOLD':
                return <AlertTriangle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const filteredPayouts = payouts.filter(payout =>
        payout.tas_profile.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (payout.job?.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (payout.job?.organization.display_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const stats = {
        pending: payouts.filter(p => p.status === 'PENDING').length,
        approved: payouts.filter(p => p.status === 'APPROVED').length,
        rejected: payouts.filter(p => p.status === 'REJECTED').length,
        hold: payouts.filter(p => p.status === 'HOLD').length,
        total: payouts.length,
        totalAmount: payouts.reduce((sum, p) => sum + p.amount, 0),
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
                    <h1 className="text-3xl font-bold text-white mb-2">Payouts Approval</h1>
                    <p className="text-slate-400">
                        Review and approve TAS recruiter payout requests
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                    <div className="p-6 rounded-2xl border border-yellow-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                                <p className="text-xs text-slate-500">awaiting approval</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Approved</p>
                                <p className="text-2xl font-bold text-emerald-400">{stats.approved}</p>
                                <p className="text-xs text-slate-500">processed payments</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-red-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Rejected</p>
                                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                                <p className="text-xs text-slate-500">denied requests</p>
                            </div>
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-orange-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">On Hold</p>
                                <p className="text-2xl font-bold text-orange-400">{stats.hold}</p>
                                <p className="text-xs text-slate-500">under review</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-purple-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Total Value</p>
                                <p className="text-2xl font-bold text-purple-400">₹{stats.totalAmount.toLocaleString()}</p>
                                <p className="text-xs text-slate-500">payout requests</p>
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
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                                <option value="HOLD">On Hold</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-slate-400">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email, job title, or organization..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payouts Table */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/80 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Recipient & Job
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Amount
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Created
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
                                ) : filteredPayouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                            No payouts found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayouts.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white flex items-center gap-2">
                                                        <User className="w-4 h-4 text-slate-400" />
                                                        {payout.tas_profile.user.email}
                                                    </p>
                                                    {payout.job && (
                                                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                                            <Building2 className="w-4 h-4" />
                                                            {payout.job.title} - {payout.job.organization.display_name}
                                                        </p>
                                                    )}
                                                    {payout.escrow_ledger && (
                                                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                                            <Building2 className="w-4 h-4" />
                                                            {payout.escrow_ledger.job.title} - {payout.escrow_ledger.job.organization.display_name}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                                    <span className="font-medium text-white">{payout.amount.toLocaleString()}</span>
                                                    <span className="text-sm text-slate-400">{payout.currency}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 ${getStatusColor(payout.status)}`}>
                                                    {getStatusIcon(payout.status)}
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(payout.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => viewDetails(payout)}
                                                        className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                    {payout.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => updatePayout(payout.id, 'APPROVE')}
                                                                disabled={processing}
                                                                className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updatePayout(payout.id, 'REJECT')}
                                                                disabled={processing}
                                                                className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                Reject
                                                            </button>
                                                            <button
                                                                onClick={() => updatePayout(payout.id, 'HOLD')}
                                                                disabled={processing}
                                                                className="text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <AlertTriangle className="w-4 h-4" />
                                                                Hold
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
                {showDetailsModal && selectedPayout && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Payout Details</h2>
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
                                            <h3 className="text-lg font-semibold text-white mb-2">Recipient Information</h3>
                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                <p className="font-medium text-white">{selectedPayout.tas_profile.user.email}</p>
                                                <p className="text-sm text-slate-400">TAS Recruiter</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Payout Details</h3>
                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Amount:</span>
                                                    <span className="font-medium text-white">₹{selectedPayout.amount.toLocaleString()} {selectedPayout.currency}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Status:</span>
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedPayout.status)}`}>
                                                        {selectedPayout.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-400">Created:</span>
                                                    <span className="text-sm text-slate-300">{new Date(selectedPayout.created_at).toLocaleString()}</span>
                                                </div>
                                                {selectedPayout.processed_at && (
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-400">Processed:</span>
                                                        <span className="text-sm text-slate-300">{new Date(selectedPayout.processed_at).toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Job Information</h3>
                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                {selectedPayout.job ? (
                                                    <>
                                                        <p className="font-medium text-white">{selectedPayout.job.title}</p>
                                                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                                            <Building2 className="w-4 h-4" />
                                                            {selectedPayout.job.organization.display_name}
                                                        </p>
                                                    </>
                                                ) : selectedPayout.escrow_ledger ? (
                                                    <>
                                                        <p className="font-medium text-white">{selectedPayout.escrow_ledger.job.title}</p>
                                                        <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                                            <Building2 className="w-4 h-4" />
                                                            {selectedPayout.escrow_ledger.job.organization.display_name}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <p className="text-slate-400">No associated job</p>
                                                )}
                                            </div>
                                        </div>

                                        {selectedPayout.description && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                    <p className="text-sm text-slate-300">{selectedPayout.description}</p>
                                                </div>
                                            </div>
                                        )}

                                        {selectedPayout.rejection_reason && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">Rejection Reason</h3>
                                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                    <p className="text-sm text-red-300">{selectedPayout.rejection_reason}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedPayout.status === 'PENDING' && (
                                <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
                                    <button
                                        onClick={() => updatePayout(selectedPayout.id, 'APPROVE')}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        {processing ? 'Processing...' : 'Approve Payout'}
                                    </button>
                                    <button
                                        onClick={() => updatePayout(selectedPayout.id, 'REJECT')}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                                    >
                                        {processing ? 'Processing...' : 'Reject Payout'}
                                    </button>
                                    <button
                                        onClick={() => updatePayout(selectedPayout.id, 'HOLD')}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-500/20"
                                    >
                                        {processing ? 'Processing...' : 'Put on Hold'}
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