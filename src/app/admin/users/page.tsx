'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Users,
    CheckCircle,
    Clock,
    XCircle,
    Search,
    Filter,
    ArrowLeft,
    Building2,
    User,
    Plus,
    Edit,
    Trash2,
    X,
    Loader2,
    Eye
} from 'lucide-react';

interface User {
    id: string;
    email: string;
    role: string;
    verification_status: string;
    created_at: string;
    organization?: {
        id: string;
        name: string;
        gstin?: string;
        domain?: string;
        website?: string;
    } | null;
    tas_profile?: {
        pan_number: string;
        linkedin_url?: string;
        credits_balance: number;
    } | null;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'SUPPORT',
        name: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [viewUser, setViewUser] = useState<User | null>(null);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create user');
            }

            setIsModalOpen(false);
            fetchUsers();
            resetForm();
        } catch (error: any) {
            console.error('Error creating user:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: formData.role }),
            });

            if (!res.ok) throw new Error('Failed to update user');

            setIsModalOpen(false);
            fetchUsers();
            resetForm();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete user');

            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const openCreateModal = () => {
        setModalMode('CREATE');
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (user: User) => {
        setModalMode('EDIT');
        setSelectedUser(user);
        setFormData({
            email: user.email,
            password: '',
            role: user.role,
            name: ''
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            role: 'SUPPORT',
            name: ''
        });
        setSelectedUser(null);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, statusFilter, roleFilter]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
                throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            setUsers(data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;

        if (searchTerm) {
            filtered = filtered.filter(user =>
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(user => user.verification_status === statusFilter);
        }

        if (roleFilter !== 'ALL') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        setFilteredUsers(filtered);
    };

    const updateUserStatus = async (userId: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ verification_status: status }),
            });

            if (!res.ok) throw new Error('Failed to update user');

            // Refresh users
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
            alert('Failed to update user status');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <button
                            onClick={() => router.push('/admin')}
                            className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                        <h1 className="text-4xl font-bold mb-2">User Management</h1>
                        <p className="text-slate-400">View and manage all platform users</p>
                    </div>
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Create User
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by email or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                        </select>

                        {/* Role Filter */}
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="ALL">All Roles</option>
                            <option value="COMPANY_ADMIN">Company Admin</option>
                            <option value="TAS">TAS</option>
                            <option value="ADMIN">Admin</option>
                            <option value="SUPPORT">Support</option>
                            <option value="OPERATOR">Operator</option>
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold">{filteredUsers.length}</div>
                        <div className="text-sm text-slate-400">Total Users</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-yellow-500">
                            {filteredUsers.filter(u => u.verification_status === 'PENDING').length}
                        </div>
                        <div className="text-sm text-slate-400">Pending</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-500">
                            {filteredUsers.filter(u => u.verification_status === 'VERIFIED').length}
                        </div>
                        <div className="text-sm text-slate-400">Verified</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-red-500">
                            {filteredUsers.filter(u => u.verification_status === 'REJECTED').length}
                        </div>
                        <div className="text-sm text-slate-400">Rejected</div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">User</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Role</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Details</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                        <td className="py-4 px-6">
                                            <div>
                                                <div className="font-medium">{user.email}</div>
                                                <div className="text-sm text-slate-400">
                                                    Joined {new Date(user.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.organization && (
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <div className="text-sm">{user.organization.name}</div>
                                                        {user.organization.domain && (
                                                            <div className="text-xs text-slate-400">{user.organization.domain}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {user.tas_profile && (
                                                <div className="flex items-center gap-2">
                                                    <User className="w-4 h-4 text-slate-400" />
                                                    <div>
                                                        <div className="text-sm">PAN: {user.tas_profile.pan_number}</div>
                                                        <div className="text-xs text-slate-400">
                                                            Credits: {user.tas_profile.credits_balance}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            {user.verification_status === 'VERIFIED' && (
                                                <span className="flex items-center gap-1 text-green-500">
                                                    <CheckCircle className="w-4 h-4" />
                                                    Verified
                                                </span>
                                            )}
                                            {user.verification_status === 'PENDING' && (
                                                <span className="flex items-center gap-1 text-yellow-500">
                                                    <Clock className="w-4 h-4" />
                                                    Pending
                                                </span>
                                            )}
                                            {user.verification_status === 'REJECTED' && (
                                                <span className="flex items-center gap-1 text-red-500">
                                                    <XCircle className="w-4 h-4" />
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                {user.verification_status !== 'VERIFIED' && (
                                                    <button
                                                        onClick={() => updateUserStatus(user.id, 'VERIFIED')}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                {user.verification_status !== 'REJECTED' && (
                                                    <button
                                                        onClick={() => updateUserStatus(user.id, 'REJECTED')}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => setViewUser(user)}
                                                    className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="p-1 text-slate-400 hover:text-white transition-colors"
                                                    title="Edit Role"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {modalMode === 'CREATE' ? 'Create New User' : 'Edit User'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={modalMode === 'CREATE' ? handleCreateUser : handleUpdateUser} className="space-y-4">
                            {modalMode === 'CREATE' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            )}

                            {modalMode === 'CREATE' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="SUPPORT">Support</option>
                                    <option value="OPERATOR">Operator</option>
                                    <option value="FINANCIAL_CONTROLLER">Financial Controller</option>
                                    <option value="COMPLIANCE_OFFICER">Compliance Officer</option>
                                    <option value="ADMIN">Admin</option>
                                    <option value="TAS">TAS</option>
                                    <option value="COMPANY_ADMIN">Company Admin</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    modalMode === 'CREATE' ? 'Create User' : 'Update User'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* View Details Modal */}
            {viewUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-lg shadow-2xl">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">User Details</h3>
                            <button onClick={() => setViewUser(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-slate-400">Email</h4>
                                <p className="text-white text-lg">{viewUser.email}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Role</h4>
                                    <span className="px-2 py-1 bg-slate-800 rounded text-sm font-medium mt-1 inline-block">
                                        {viewUser.role}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Status</h4>
                                    <span className={`px-2 py-1 rounded text-sm font-medium mt-1 inline-block ${viewUser.verification_status === 'VERIFIED' ? 'text-green-500 bg-green-500/10' :
                                        viewUser.verification_status === 'REJECTED' ? 'text-red-500 bg-red-500/10' :
                                            'text-yellow-500 bg-yellow-500/10'
                                        }`}>
                                        {viewUser.verification_status}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-slate-400">Joined On</h4>
                                <p className="text-white">{new Date(viewUser.created_at).toLocaleString()}</p>
                            </div>

                            {viewUser.organization && (
                                <div className="border-t border-slate-800 pt-4 mt-4">
                                    <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                                        <Building2 className="w-4 h-4" /> Organization
                                    </h4>
                                    <div className="bg-slate-800/50 p-3 rounded-lg space-y-2">
                                        <p><span className="text-slate-400 text-sm">Name:</span> {viewUser.organization.name}</p>
                                        <p><span className="text-slate-400 text-sm">Domain:</span> {viewUser.organization.domain || 'N/A'}</p>
                                        <p><span className="text-slate-400 text-sm">GSTIN:</span> {viewUser.organization.gstin || 'N/A'}</p>
                                    </div>
                                </div>
                            )}

                            {viewUser.tas_profile && (
                                <div className="border-t border-slate-800 pt-4 mt-4">
                                    <h4 className="text-md font-bold text-white mb-2 flex items-center gap-2">
                                        <User className="w-4 h-4" /> TAS Profile
                                    </h4>
                                    <div className="bg-slate-800/50 p-3 rounded-lg space-y-2">
                                        <p><span className="text-slate-400 text-sm">PAN:</span> {viewUser.tas_profile.pan_number}</p>
                                        <p><span className="text-slate-400 text-sm">Credits:</span> {viewUser.tas_profile.credits_balance}</p>
                                        {viewUser.tas_profile.linkedin_url && (
                                            <p>
                                                <span className="text-slate-400 text-sm">LinkedIn:</span>{' '}
                                                <a href={viewUser.tas_profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                                                    View Profile
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
