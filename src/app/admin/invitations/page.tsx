'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Mail,
    Plus,
    RefreshCw,
    XCircle,
    Clock,
    CheckCircle,
    AlertTriangle,
    Users,
    Building,
    Search,
    Filter,
    X,
    Calendar,
    Copy,
    Download,
} from 'lucide-react';

interface Invitation {
    id: string;
    email: string;
    role: string;
    status: string;
    token: string;
    expires_at: string;
    created_at: string;
    organization: {
        id: string;
        display_name: string;
    };
}

interface Organization {
    id: string;
    display_name: string;
}

export default function InvitationsPage() {
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('PENDING');
    const [orgFilter, setOrgFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null);
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [bulkInvitations, setBulkInvitations] = useState('');
    const [selectedOrg, setSelectedOrg] = useState('');
    const [selectedRole, setSelectedRole] = useState('COMPANY_MEMBER');
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
    });
    const [stats, setStats] = useState<any[]>([]);

    useEffect(() => {
        fetchInvitations();
    }, [statusFilter, orgFilter, pagination.page]);

    const fetchInvitations = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
                status: statusFilter,
                organizationId: orgFilter,
            });

            const response = await fetch(`/api/admin/invitations?${params}`);
            const data = await response.json();

            if (response.ok) {
                setInvitations(data.invitations);
                setOrganizations(data.organizations || []);
                setStats(data.stats);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching invitations:', error);
        } finally {
            setLoading(false);
        }
    };

    const createBulkInvitations = async () => {
        if (!bulkInvitations.trim() || !selectedOrg) {
            alert('Please provide emails and select an organization');
            return;
        }

        const emails = bulkInvitations
            .split('\n')
            .map(email => email.trim())
            .filter(email => email && email.includes('@'));

        if (emails.length === 0) {
            alert('Please provide valid email addresses');
            return;
        }

        if (emails.length > 100) {
            alert('Maximum 100 invitations per batch');
            return;
        }

        setProcessing(true);
        try {
            const invitationData = emails.map(email => ({
                email,
                role: selectedRole,
                organizationId: selectedOrg,
            }));

            const response = await fetch('/api/admin/invitations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invitations: invitationData }),
            });

            const result = await response.json();

            if (response.ok) {
                fetchInvitations();
                setShowBulkModal(false);
                setBulkInvitations('');
                alert(`Successfully created ${result.invitations.length} invitations!`);
            } else {
                alert(`Error: ${result.error || 'Failed to create invitations'}`);
            }
        } catch (error) {
            console.error('Error creating invitations:', error);
            alert('Failed to create invitations');
        } finally {
            setProcessing(false);
        }
    };

    const updateInvitation = async (invitationId: string, action: string) => {
        setProcessing(true);
        try {
            const response = await fetch('/api/admin/invitations', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    invitationId,
                    action,
                }),
            });

            if (response.ok) {
                fetchInvitations();
                alert(`${action.toLowerCase()} successful!`);
            } else {
                const error = await response.json();
                alert(`Error: ${error.error || 'Failed to update invitation'}`);
            }
        } catch (error) {
            console.error('Error updating invitation:', error);
            alert('Failed to update invitation');
        } finally {
            setProcessing(false);
        }
    };

    const copyInvitationLink = (invitation: Invitation) => {
        const link = `${window.location.origin}/invite/${invitation.token}`;
        navigator.clipboard.writeText(link);
        alert('Invitation link copied to clipboard!');
    };

    const exportInvitations = () => {
        const csvContent = [
            ['Email', 'Role', 'Organization', 'Status', 'Created', 'Expires', 'Invitation Link'],
            ...filteredInvitations.map(invite => [
                invite.email,
                invite.role,
                invite.organization.display_name,
                invite.status,
                new Date(invite.created_at).toLocaleDateString(),
                new Date(invite.expires_at).toLocaleDateString(),
                `${window.location.origin}/invite/${invite.token}`,
            ]),
        ]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invitations-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const viewDetails = (invitation: Invitation) => {
        setSelectedInvitation(invitation);
        setShowDetailsModal(true);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
            case 'ACCEPTED':
                return 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30';
            case 'EXPIRED':
                return 'bg-red-500/20 text-red-400 border border-red-500/30';
            case 'CANCELLED':
                return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
            default:
                return 'bg-slate-500/20 text-slate-400 border border-slate-500/30';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING':
                return <Clock className="w-4 h-4" />;
            case 'ACCEPTED':
                return <CheckCircle className="w-4 h-4" />;
            case 'EXPIRED':
                return <AlertTriangle className="w-4 h-4" />;
            case 'CANCELLED':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getTotalByStatus = (status: string) => {
        const stat = stats.find(s => s.status === status);
        return stat ? stat._count.id : 0;
    };

    const filteredInvitations = invitations.filter(invite =>
        invite.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invite.organization.display_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isExpired = (expiresAt: string) => {
        return new Date(expiresAt) < new Date();
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
                    <h1 className="text-3xl font-bold text-white mb-2">Invitations Management</h1>
                    <p className="text-slate-400">
                        Send and track platform invitations for new users
                    </p>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
                    <div className="p-6 rounded-2xl border border-yellow-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Pending</p>
                                <p className="text-2xl font-bold text-yellow-400">
                                    {getTotalByStatus('PENDING')}
                                </p>
                                <p className="text-xs text-slate-500">awaiting response</p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Accepted</p>
                                <p className="text-2xl font-bold text-emerald-400">
                                    {getTotalByStatus('ACCEPTED')}
                                </p>
                                <p className="text-xs text-slate-500">successful joins</p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-red-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Expired</p>
                                <p className="text-2xl font-bold text-red-400">
                                    {getTotalByStatus('EXPIRED')}
                                </p>
                                <p className="text-xs text-slate-500">needs resend</p>
                            </div>
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-slate-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Cancelled</p>
                                <p className="text-2xl font-bold text-slate-400">
                                    {getTotalByStatus('CANCELLED')}
                                </p>
                                <p className="text-xs text-slate-500">manually cancelled</p>
                            </div>
                            <XCircle className="w-8 h-8 text-slate-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Total Sent</p>
                                <p className="text-2xl font-bold text-blue-400">
                                    {stats.reduce((sum, stat) => sum + stat._count.id, 0)}
                                </p>
                                <p className="text-xs text-slate-500">all invitations</p>
                            </div>
                            <Mail className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm mb-6">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            Bulk Invite
                        </button>
                        <button
                            onClick={exportInvitations}
                            className="flex items-center gap-2 px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
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
                                <option value="PENDING">Pending</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="EXPIRED">Expired</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        {organizations.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-2 text-slate-400">Organization Filter</label>
                                <select
                                    value={orgFilter}
                                    onChange={(e) => setOrgFilter(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                >
                                    <option value="all">All Organizations</option>
                                    {organizations.map(org => (
                                        <option key={org.id} value={org.id}>{org.display_name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2 text-slate-400">Search</label>
                            <div className="relative">
                                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email or organization..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Invitations Table */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/80 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Email & Role
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Organization
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Expires
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
                                ) : filteredInvitations.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                            No invitations found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvitations.map((invitation) => (
                                        <tr key={invitation.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{invitation.email}</p>
                                                    <p className="text-sm text-slate-400">{invitation.role.replace(/_/g, ' ')}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Building className="w-4 h-4 text-slate-400" />
                                                    <span className="font-medium text-slate-200">{invitation.organization.display_name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 w-fit ${getStatusColor(
                                                        invitation.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(invitation.status)}
                                                    {invitation.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-sm">
                                                    <Calendar className="w-4 h-4 text-slate-400" />
                                                    <span className={isExpired(invitation.expires_at) ? 'text-red-400' : 'text-slate-400'}>
                                                        {new Date(invitation.expires_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {isExpired(invitation.expires_at) && invitation.status === 'PENDING' && (
                                                    <p className="text-xs text-red-500">Expired</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => viewDetails(invitation)}
                                                        className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                        View
                                                    </button>
                                                    <button
                                                        onClick={() => copyInvitationLink(invitation)}
                                                        className="text-slate-400 hover:text-slate-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                        Copy
                                                    </button>
                                                    {invitation.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateInvitation(invitation.id, 'RESEND')}
                                                                disabled={processing}
                                                                className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <RefreshCw className="w-4 h-4" />
                                                                Resend
                                                            </button>
                                                            <button
                                                                onClick={() => updateInvitation(invitation.id, 'CANCEL')}
                                                                disabled={processing}
                                                                className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-1"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                                Cancel
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
                            invitations
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

                {/* Bulk Invite Modal */}
                {showBulkModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Bulk Invite Users</h2>
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-400">Organization</label>
                                        <select
                                            value={selectedOrg}
                                            onChange={(e) => setSelectedOrg(e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        >
                                            <option value="">Select Organization</option>
                                            {organizations.map(org => (
                                                <option key={org.id} value={org.id}>{org.display_name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-slate-400">Role</label>
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        >
                                            <option value="COMPANY_MEMBER">Company Member</option>
                                            <option value="COMPANY_ADMIN">Company Admin</option>
                                            <option value="TAS">TAS Recruiter</option>
                                            <option value="INTERVIEWER">Interviewer</option>
                                            <option value="DECISION_MAKER">Decision Maker</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-slate-400">
                                        Email Addresses <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={bulkInvitations}
                                        onChange={(e) => setBulkInvitations(e.target.value)}
                                        placeholder="Enter email addresses, one per line (max 100)"
                                        rows={8}
                                        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 font-mono text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Enter one email address per line. Maximum 100 invitations per batch.
                                    </p>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-800 flex gap-3">
                                <button
                                    onClick={() => setShowBulkModal(false)}
                                    className="flex-1 px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createBulkInvitations}
                                    disabled={processing || !bulkInvitations.trim() || !selectedOrg}
                                    className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Creating Invitations...' : 'Send Invitations'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Details Modal */}
                {showDetailsModal && selectedInvitation && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-lg w-full"
                        >
                            <div className="px-6 py-4 border-b border-slate-800">
                                <h2 className="text-xl font-bold text-white">Invitation Details</h2>
                                <p className="text-sm text-slate-400">{selectedInvitation.email}</p>
                            </div>

                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-slate-400">Role</p>
                                        <p className="font-medium text-white">{selectedInvitation.role.replace(/_/g, ' ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">Status</p>
                                        <span
                                            className={`px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 ${getStatusColor(
                                                selectedInvitation.status
                                            )}`}
                                        >
                                            {getStatusIcon(selectedInvitation.status)}
                                            {selectedInvitation.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">Organization</p>
                                        <p className="font-medium text-white">{selectedInvitation.organization.display_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-400">Expires</p>
                                        <p className={`font-medium ${isExpired(selectedInvitation.expires_at) ? 'text-red-400' : 'text-slate-400'}`}>
                                            {new Date(selectedInvitation.expires_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-slate-400 mb-2">Invitation Link</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={`${window.location.origin}/invite/${selectedInvitation.token}`}
                                            readOnly
                                            className="flex-1 px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm focus:outline-none"
                                        />
                                        <button
                                            onClick={() => copyInvitationLink(selectedInvitation)}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                        >
                                            <Copy className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-4 border-t border-slate-800">
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="w-full px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-all"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}