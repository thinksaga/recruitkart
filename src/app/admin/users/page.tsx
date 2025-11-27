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
} from 'lucide-react';

interface User {
    id: string;
    email: string;
    phone?: string;
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
        full_name?: string;
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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        role: 'COMPANY_ADMIN',
        organizationId: '',
        tasProfile: {
            fullName: '',
            panNumber: '',
            linkedinUrl: '',
            creditsBalance: 0,
        },
    });
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchCurrentUser();
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, searchTerm, statusFilter, roleFilter]);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

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

    const fetchOrganizations = async () => {
        try {
            const res = await fetch('/api/admin/organizations');
            if (res.ok) {
                const data = await res.json();
                setOrganizations(data.organizations || []);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    const openCreateModal = () => {
        setFormData({
            email: '',
            phone: '',
            role: 'COMPANY_ADMIN',
            organizationId: '',
            tasProfile: {
                fullName: '',
                panNumber: '',
                linkedinUrl: '',
                creditsBalance: 0,
            },
        });
        setShowCreateModal(true);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            email: user.email,
            phone: user.phone || '',
            role: user.role,
            organizationId: user.organization?.id || '',
            tasProfile: {
                fullName: user.tas_profile?.full_name || '',
                panNumber: user.tas_profile?.pan_number || '',
                linkedinUrl: user.tas_profile?.linkedin_url || '',
                creditsBalance: user.tas_profile?.credits_balance || 0,
            },
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create user');
            }

            setShowCreateModal(false);
            fetchUsers();
            alert('User created successfully!');
        } catch (error: any) {
            console.error('Error creating user:', error);
            alert(error.message || 'Failed to create user');
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setProcessing(true);

        try {
            const res = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedUser.id, ...formData }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to update user');
            }

            setShowEditModal(false);
            fetchUsers();
            alert('User updated successfully!');
        } catch (error: any) {
            console.error('Error updating user:', error);
            alert(error.message || 'Failed to update user');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedUser) return;

        setProcessing(true);

        try {
            const res = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to delete user');
            }

            setShowDeleteModal(false);
            fetchUsers();
            alert('User deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting user:', error);
            alert(error.message || 'Failed to delete user');
        } finally {
            setProcessing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchOrganizations();
    }, []);

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
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">User Management</h1>
                            <p className="text-slate-400">
                                {currentUser?.role === 'SUPPORT_AGENT'
                                    ? 'View user information to assist with support requests'
                                    : 'View and manage all platform users'
                                }
                            </p>
                        </div>
                        {currentUser?.role !== 'SUPPORT_AGENT' && (
                            <button
                                onClick={openCreateModal}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add User
                            </button>
                        )}
                    </div>
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
                                                {currentUser?.role !== 'SUPPORT_AGENT' && (
                                                    <>
                                                        <button
                                                            onClick={() => openEditModal(user)}
                                                            className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                                                            title="Edit User"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteModal(user)}
                                                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                                {user.verification_status !== 'VERIFIED' && currentUser?.role !== 'SUPPORT_AGENT' && (
                                                    <button
                                                        onClick={() => updateUserStatus(user.id, 'VERIFIED')}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs font-medium transition-colors"
                                                    >
                                                        Verify
                                                    </button>
                                                )}
                                                {user.verification_status !== 'REJECTED' && currentUser?.role !== 'SUPPORT_AGENT' && (
                                                    <button
                                                        onClick={() => updateUserStatus(user.id, 'REJECTED')}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-xs font-medium transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Create User Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Create New User</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateUser} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="user@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Role *</label>
                                        <select
                                            required
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="COMPANY_ADMIN">Company Admin</option>
                                            <option value="TAS">TAS</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="SUPPORT">Support</option>
                                            <option value="OPERATOR">Operator</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
                                        <select
                                            value={formData.organizationId}
                                            onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="">No Organization</option>
                                            {organizations.map((org) => (
                                                <option key={org.id} value={org.id}>{org.display_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {formData.role === 'TAS' && (
                                    <div className="border-t border-slate-800 pt-6">
                                        <h3 className="text-lg font-medium text-white mb-4">TAS Profile</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.tasProfile.fullName}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tasProfile: { ...formData.tasProfile, fullName: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">PAN Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.tasProfile.panNumber}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tasProfile: { ...formData.tasProfile, panNumber: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="ABCDE1234F"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.tasProfile.linkedinUrl}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tasProfile: { ...formData.tasProfile, linkedinUrl: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Credits Balance</label>
                                                <input
                                                    type="number"
                                                    value={formData.tasProfile.creditsBalance}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tasProfile: { ...formData.tasProfile, creditsBalance: parseInt(e.target.value) || 0 }
                                                    })}
                                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                                    >
                                        {processing ? 'Creating...' : 'Create User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Edit User</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateUser} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="user@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="+91 9876543210"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Role *</label>
                                        <select
                                            required
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="COMPANY_ADMIN">Company Admin</option>
                                            <option value="TAS">TAS</option>
                                            <option value="ADMIN">Admin</option>
                                            <option value="SUPPORT">Support</option>
                                            <option value="OPERATOR">Operator</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Organization</label>
                                        <select
                                            value={formData.organizationId}
                                            onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        >
                                            <option value="">No Organization</option>
                                            {organizations.map((org) => (
                                                <option key={org.id} value={org.id}>{org.display_name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {formData.role === 'TAS' && (
                                    <div className="border-t border-slate-800 pt-6">
                                        <h3 className="text-lg font-medium text-white mb-4">TAS Profile</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.tasProfile.fullName}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tasProfile: { ...formData.tasProfile, fullName: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">PAN Number</label>
                                                <input
                                                    type="text"
                                                    value={formData.tasProfile.panNumber}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tasProfile: { ...formData.tasProfile, panNumber: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="ABCDE1234F"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">LinkedIn URL</label>
                                                <input
                                                    type="url"
                                                    value={formData.tasProfile.linkedinUrl}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tasProfile: { ...formData.tasProfile, linkedinUrl: e.target.value }
                                                    })}
                                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="https://linkedin.com/in/username"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-300 mb-2">Credits Balance</label>
                                                <input
                                                    type="number"
                                                    value={formData.tasProfile.creditsBalance}
                                                    onChange={(e) => setFormData({
                                                        ...formData,
                                                        tasProfile: { ...formData.tasProfile, creditsBalance: parseInt(e.target.value) || 0 }
                                                    })}
                                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-6 border-t border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditModal(false)}
                                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                                    >
                                        {processing ? 'Updating...' : 'Update User'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete User Modal */}
                {showDeleteModal && selectedUser && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-red-600/20 rounded-full">
                                        <Trash2 className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Delete User</h2>
                                </div>
                                <p className="text-slate-300 mb-6">
                                    Are you sure you want to delete <span className="font-medium text-white">{selectedUser.email}</span>?
                                    This action cannot be undone.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteUser}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                                    >
                                        {processing ? 'Deleting...' : 'Delete User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
