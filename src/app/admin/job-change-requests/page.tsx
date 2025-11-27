'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    GitPullRequest,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    ThumbsUp,
    ThumbsDown,
    AlertCircle,
    Building2,
    User,
    Calendar,
    FileText,
    X,
    Search,
    Filter,
} from 'lucide-react';

interface JobChangeRequest {
    id: string;
    job_id: string;
    proposed_changes: any;
    reason: string | null;
    status: string;
    requested_by_id: string;
    reviewed_by_id: string | null;
    admin_note: string | null;
    created_at: string;
    updated_at: string;
    job: {
        id: string;
        title: string;
        status: string;
        organization: {
            display_name: string;
        };
    };
    requestor: {
        id: string;
        email: string;
        role: string;
    };
    reviewer: {
        email: string;
    } | null;
}

export default function JobChangeRequestsPage() {
    const [requests, setRequests] = useState<JobChangeRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<JobChangeRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, [statusFilter]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/job-change-requests?status=${statusFilter}`);
            const data = await response.json();
            if (response.ok) {
                setRequests(data.requests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateRequest = async (requestId: string, action: string, note?: string) => {
        setProcessing(true);
        try {
            const response = await fetch('/api/admin/job-change-requests', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId,
                    action,
                    adminNote: note,
                }),
            });

            if (response.ok) {
                fetchRequests();
                setShowDetailsModal(false);
                alert(`${action.toLowerCase()} successful!`);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'Failed to update request'}`);
            }
        } catch (error) {
            console.error('Error updating request:', error);
            alert('Failed to update request');
        } finally {
            setProcessing(false);
        }
    };

    const viewDetails = (request: JobChangeRequest) => {
        setSelectedRequest(request);
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
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const filteredRequests = requests.filter(request =>
        request.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requestor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.job.organization.display_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        pending: requests.filter(r => r.status === 'PENDING').length,
        approved: requests.filter(r => r.status === 'APPROVED').length,
        rejected: requests.filter(r => r.status === 'REJECTED').length,
        total: requests.length,
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
                    <h1 className="text-3xl font-bold text-white mb-2">Job Change Requests</h1>
                    <p className="text-slate-400">
                        Review and approve job modification requests from recruiters
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="p-6 rounded-2xl border border-yellow-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                                <p className="text-xs text-slate-500">awaiting review</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Approved</p>
                                <p className="text-2xl font-bold text-emerald-400">{stats.approved}</p>
                                <p className="text-xs text-slate-500">changes applied</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-red-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Rejected</p>
                                <p className="text-2xl font-bold text-red-400">{stats.rejected}</p>
                                <p className="text-xs text-slate-500">changes denied</p>
                            </div>
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Total</p>
                                <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
                                <p className="text-xs text-slate-500">all requests</p>
                            </div>
                            <GitPullRequest className="w-8 h-8 text-blue-500" />
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
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-slate-400">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by job title, email, or organization..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/80 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Job & Organization
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Requested By
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
                                ) : filteredRequests.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                            No requests found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{request.job.title}</p>
                                                    <p className="text-sm text-slate-400 flex items-center gap-1">
                                                        <Building2 className="w-4 h-4" />
                                                        {request.job.organization.display_name}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <p className="font-medium text-white">{request.requestor.email}</p>
                                                        <p className="text-sm text-slate-400">{request.requestor.role.replace(/_/g, ' ')}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 ${getStatusColor(request.status)}`}>
                                                    {getStatusIcon(request.status)}
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(request.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => viewDetails(request)}
                                                        className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View
                                                    </button>
                                                    {request.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateRequest(request.id, 'APPROVE')}
                                                                disabled={processing}
                                                                className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <ThumbsUp className="w-4 h-4" />
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => updateRequest(request.id, 'REJECT')}
                                                                disabled={processing}
                                                                className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <ThumbsDown className="w-4 h-4" />
                                                                Reject
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
                {showDetailsModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Request Details</h2>
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
                                                <p className="font-medium text-white">{selectedRequest.job.title}</p>
                                                <p className="text-sm text-slate-400 flex items-center gap-1 mt-1">
                                                    <Building2 className="w-4 h-4" />
                                                    {selectedRequest.job.organization.display_name}
                                                </p>
                                                <p className="text-sm text-slate-400 mt-1">Status: {selectedRequest.job.status}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Requestor</h3>
                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                <p className="font-medium text-white">{selectedRequest.requestor.email}</p>
                                                <p className="text-sm text-slate-400">{selectedRequest.requestor.role.replace(/_/g, ' ')}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-white mb-2">Proposed Changes</h3>
                                            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 max-h-48 overflow-y-auto">
                                                <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                                                    {JSON.stringify(selectedRequest.proposed_changes, null, 2)}
                                                </pre>
                                            </div>
                                        </div>

                                        {selectedRequest.reason && (
                                            <div>
                                                <h3 className="text-lg font-semibold text-white mb-2">Reason</h3>
                                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                    <p className="text-sm text-slate-300">{selectedRequest.reason}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {selectedRequest.admin_note && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-white mb-2">Admin Note</h3>
                                        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                            <p className="text-sm text-slate-300">{selectedRequest.admin_note}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {selectedRequest.status === 'PENDING' && (
                                <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
                                    <button
                                        onClick={() => updateRequest(selectedRequest.id, 'APPROVE')}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        {processing ? 'Processing...' : 'Approve Changes'}
                                    </button>
                                    <button
                                        onClick={() => updateRequest(selectedRequest.id, 'REJECT')}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                                    >
                                        {processing ? 'Processing...' : 'Reject Changes'}
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