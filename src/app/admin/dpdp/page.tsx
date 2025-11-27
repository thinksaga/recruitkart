'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Shield,
    Eye,
    Trash2,
    Edit,
    CheckCircle,
    XCircle,
    Clock,
    AlertTriangle,
    Download,
    User,
    FileText,
    Search,
    Filter,
    X,
    Calendar,
} from 'lucide-react';

interface DataSubjectRequest {
    id: string;
    user_id: string | null;
    candidate_id: string | null;
    type: string;
    status: string;
    requested_at: string;
    completed_at: string | null;
    admin_note: string | null;
    user: {
        id: string;
        email: string;
        phone: string | null;
        role: string;
        verification_status: string;
    } | null;
    candidate: {
        id: string;
        phone: string;
        email: string;
        full_name: string;
        is_blacklisted: boolean;
    } | null;
}

export default function DPDPPage() {
    const [requests, setRequests] = useState<DataSubjectRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('RECEIVED');
    const [typeFilter, setTypeFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<DataSubjectRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [processAction, setProcessAction] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [correctionData, setCorrectionData] = useState('');
    const [exportData, setExportData] = useState<any>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
    });
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        fetchRequests();
    }, [statusFilter, typeFilter, pagination.page]);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                status: statusFilter,
                type: typeFilter,
            });

            const response = await fetch(`/api/admin/dpdp?${params}`);
            const data = await response.json();

            if (response.ok) {
                setRequests(data.requests);
                setStats(data.stats);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching DPDP requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const processRequest = async () => {
        if (!selectedRequest || !processAction) return;

        setProcessing(true);
        try {
            let requestBody: any = {
                requestId: selectedRequest.id,
                action: processAction,
                adminNote: adminNote || undefined,
            };

            if (processAction === 'COMPLETE_CORRECTION' && correctionData) {
                try {
                    requestBody.correctionData = JSON.parse(correctionData);
                } catch (e) {
                    alert('Invalid JSON in correction data');
                    setProcessing(false);
                    return;
                }
            }

            const response = await fetch('/api/admin/dpdp', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();

            if (response.ok) {
                if (result.exportData) {
                    setExportData(result.exportData);
                    // Auto-download export data
                    downloadExportData(result.exportData);
                }

                fetchRequests();
                setShowProcessModal(false);
                setAdminNote('');
                setCorrectionData('');
                alert(`${processAction.replace(/_/g, ' ')} completed successfully!`);
            } else {
                alert(`Error: ${result.error || 'Failed to process request'}`);
            }
        } catch (error) {
            console.error('Error processing request:', error);
            alert('Failed to process request');
        } finally {
            setProcessing(false);
        }
    };

    const downloadExportData = (data: any) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `data-export-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const viewDetails = (request: DataSubjectRequest) => {
        setSelectedRequest(request);
        setShowDetailsModal(true);
    };

    const openProcessModal = (request: DataSubjectRequest, action: string) => {
        setSelectedRequest(request);
        setProcessAction(action);
        setShowProcessModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'RECEIVED':
                return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'COMPLETED':
                return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'REJECTED':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            default:
                return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'RECEIVED':
                return <Clock className="w-4 h-4" />;
            case 'COMPLETED':
                return <CheckCircle className="w-4 h-4" />;
            case 'REJECTED':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'EXPORT_DATA':
                return <Download className="w-4 h-4" />;
            case 'DELETE_DATA':
                return <Trash2 className="w-4 h-4" />;
            case 'CORRECT_DATA':
                return <Edit className="w-4 h-4" />;
            default:
                return <FileText className="w-4 h-4" />;
        }
    };

    const getTotalByStatus = (status: string) => {
        return stats.filter(s => s.status === status).reduce((sum, s) => sum + s._count.id, 0);
    };

    const getTotalByType = (type: string) => {
        return stats.filter(s => s.type === type).reduce((sum, s) => sum + s._count.id, 0);
    };

    const filteredRequests = requests.filter(request => {
        const subject = request.user || request.candidate;
        if (!subject) return false;

        const searchLower = searchTerm.toLowerCase();
        return (
            (request.user?.email || '').toLowerCase().includes(searchLower) ||
            (request.candidate?.email || '').toLowerCase().includes(searchLower) ||
            (request.candidate?.full_name || '').toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">DPDP Compliance</h1>
                    <p className="text-slate-400">
                        Manage data subject requests under India's Data Protection and Digital Privacy Act
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-6">
                    <div className="p-6 rounded-2xl border border-yellow-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Received</p>
                                <p className="text-2xl font-bold text-yellow-400">
                                    {getTotalByStatus('RECEIVED')}
                                </p>
                                <p className="text-xs text-slate-500">pending requests</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Completed</p>
                                <p className="text-2xl font-bold text-emerald-400">
                                    {getTotalByStatus('COMPLETED')}
                                </p>
                                <p className="text-xs text-slate-500">processed requests</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Export</p>
                                <p className="text-2xl font-bold text-blue-400">
                                    {getTotalByType('EXPORT_DATA')}
                                </p>
                                <p className="text-xs text-slate-500">data exports</p>
                            </div>
                            <Download className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-red-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Delete</p>
                                <p className="text-2xl font-bold text-red-400">
                                    {getTotalByType('DELETE_DATA')}
                                </p>
                                <p className="text-xs text-slate-500">data deletions</p>
                            </div>
                            <Trash2 className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-purple-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Correct</p>
                                <p className="text-2xl font-bold text-purple-400">
                                    {getTotalByType('CORRECT_DATA')}
                                </p>
                                <p className="text-xs text-slate-500">data corrections</p>
                            </div>
                            <Edit className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-slate-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Rejected</p>
                                <p className="text-2xl font-bold text-slate-400">
                                    {getTotalByStatus('REJECTED')}
                                </p>
                                <p className="text-xs text-slate-500">rejected requests</p>
                            </div>
                            <XCircle className="w-8 h-8 text-slate-500" />
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-400">Status Filter</label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            >
                                <option value="all">All Status</option>
                                <option value="RECEIVED">Received</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-400">Type Filter</label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            >
                                <option value="all">All Types</option>
                                <option value="EXPORT_DATA">Export Data</option>
                                <option value="DELETE_DATA">Delete Data</option>
                                <option value="CORRECT_DATA">Correct Data</option>
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-slate-400">Search</label>
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email or name..."
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
                                        Data Subject
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Request Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Requested
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
                                            No DPDP requests found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRequests.map((request) => (
                                        <tr key={request.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    {request.user ? (
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-blue-500" />
                                                            <div>
                                                                <p className="font-medium text-white">{request.user.email}</p>
                                                                <p className="text-sm text-slate-400">{request.user.role}</p>
                                                            </div>
                                                        </div>
                                                    ) : request.candidate ? (
                                                        <div className="flex items-center gap-2">
                                                            <User className="w-4 h-4 text-emerald-500" />
                                                            <div>
                                                                <p className="font-medium text-white">{request.candidate.full_name}</p>
                                                                <p className="text-sm text-slate-400">{request.candidate.email}</p>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-500">Unknown Subject</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {getTypeIcon(request.type)}
                                                    <span className="font-medium text-slate-200">
                                                        {request.type.replace(/_/g, ' ')}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${getStatusColor(
                                                        request.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(request.status)}
                                                    {request.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm text-slate-400">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(request.requested_at).toLocaleDateString()}
                                                </div>
                                                {request.completed_at && (
                                                    <p className="text-xs text-slate-500">
                                                        Completed: {new Date(request.completed_at).toLocaleDateString()}
                                                    </p>
                                                )}
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
                                                    {request.status === 'RECEIVED' && (
                                                        <>
                                                            {request.type === 'EXPORT_DATA' && (
                                                                <button
                                                                    onClick={() => openProcessModal(request, 'COMPLETE_EXPORT')}
                                                                    className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                                >
                                                                    <Download className="w-4 h-4" />
                                                                    Export
                                                                </button>
                                                            )}
                                                            {request.type === 'DELETE_DATA' && (
                                                                <button
                                                                    onClick={() => openProcessModal(request, 'COMPLETE_DELETE')}
                                                                    className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                    Delete
                                                                </button>
                                                            )}
                                                            {request.type === 'CORRECT_DATA' && (
                                                                <button
                                                                    onClick={() => openProcessModal(request, 'COMPLETE_CORRECTION')}
                                                                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                                >
                                                                    <Edit className="w-4 h-4" />
                                                                    Correct
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => openProcessModal(request, 'REJECT')}
                                                                className="text-slate-400 hover:text-slate-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <XCircle className="w-4 h-4" />
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

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
                            requests
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                disabled={pagination.page >= pagination.totalPages}
                                className="px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
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
                                {/* Request Info */}
                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                    <h3 className="font-semibold text-white mb-3">Request Information</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-slate-400">Type</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {getTypeIcon(selectedRequest.type)}
                                                <span className="font-medium text-slate-200">
                                                    {selectedRequest.type.replace(/_/g, ' ')}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">Status</p>
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 mt-1 ${getStatusColor(
                                                    selectedRequest.status
                                                )}`}
                                            >
                                                {getStatusIcon(selectedRequest.status)}
                                                {selectedRequest.status}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">Requested</p>
                                            <p className="font-medium text-white mt-1">
                                                {new Date(selectedRequest.requested_at).toLocaleString()}
                                            </p>
                                        </div>
                                        {selectedRequest.completed_at && (
                                            <div>
                                                <p className="text-sm text-slate-400">Completed</p>
                                                <p className="font-medium text-white mt-1">
                                                    {new Date(selectedRequest.completed_at).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Data Subject Info */}
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Data Subject</h3>
                                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                        {selectedRequest.user ? (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="w-5 h-5 text-blue-500" />
                                                    <span className="font-medium text-white">User Account</span>
                                                </div>
                                                <p className="text-slate-200"><strong className="text-slate-400">Email:</strong> {selectedRequest.user.email}</p>
                                                <p className="text-slate-200"><strong className="text-slate-400">Phone:</strong> {selectedRequest.user.phone || 'N/A'}</p>
                                                <p className="text-slate-200"><strong className="text-slate-400">Role:</strong> {selectedRequest.user.role}</p>
                                                <p className="text-slate-200"><strong className="text-slate-400">Verification:</strong> {selectedRequest.user.verification_status}</p>
                                            </div>
                                        ) : selectedRequest.candidate ? (
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <User className="w-5 h-5 text-emerald-500" />
                                                    <span className="font-medium text-white">Candidate Profile</span>
                                                </div>
                                                <p className="text-slate-200"><strong className="text-slate-400">Name:</strong> {selectedRequest.candidate.full_name}</p>
                                                <p className="text-slate-200"><strong className="text-slate-400">Email:</strong> {selectedRequest.candidate.email}</p>
                                                <p className="text-slate-200"><strong className="text-slate-400">Phone:</strong> {selectedRequest.candidate.phone}</p>
                                                <p className="text-slate-200"><strong className="text-slate-400">Blacklisted:</strong> {selectedRequest.candidate.is_blacklisted ? 'Yes' : 'No'}</p>
                                            </div>
                                        ) : (
                                            <p className="text-slate-500">Data subject information not available</p>
                                        )}
                                    </div>
                                </div>

                                {/* Admin Note */}
                                {selectedRequest.admin_note && (
                                    <div>
                                        <h3 className="font-semibold text-white mb-3">Admin Note</h3>
                                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                                            <p className="text-blue-200">{selectedRequest.admin_note}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Process Modal */}
                {showProcessModal && selectedRequest && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-lg w-full"
                        >
                            <div className="px-6 py-4 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white">
                                    {processAction === 'REJECT' ? 'Reject' : 'Complete'} Request
                                </h2>
                                <p className="text-sm text-slate-400">
                                    {selectedRequest.type.replace(/_/g, ' ')} request for{' '}
                                    {selectedRequest.user?.email || selectedRequest.candidate?.full_name}
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                {processAction === 'COMPLETE_CORRECTION' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-400">
                                            Correction Data (JSON) <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={correctionData}
                                            onChange={(e) => setCorrectionData(e.target.value)}
                                            placeholder='{"field": "new_value"}'
                                            rows={4}
                                            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">
                                            Enter the data corrections as valid JSON
                                        </p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-400">
                                        Admin Note <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Reason for this action..."
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
                                <button
                                    onClick={() => setShowProcessModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={processRequest}
                                    disabled={processing || !adminNote || (processAction === 'COMPLETE_CORRECTION' && !correctionData)}
                                    className={`flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${processAction === 'REJECT'
                                            ? 'bg-red-600 shadow-red-500/20'
                                            : 'bg-emerald-600 shadow-emerald-500/20'
                                        }`}
                                >
                                    {processing ? 'Processing...' : processAction === 'REJECT' ? 'Reject Request' : 'Complete Request'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}