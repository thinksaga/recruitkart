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
    phone?: string;
    avatar_url?: string;
    last_login_at?: string;
    is_active?: boolean;
    organization?: {
        id: string;
        name: string;
        gstin?: string;
        domain?: string;
        website?: string;
        logo_url?: string;
        description?: string;
        industry?: string;
        size?: string;
        founded_year?: number;
        address?: any;
        social_links?: any;
    } | null;
    tas_profile?: {
        pan_number: string;
        linkedin_url?: string;
        credits_balance: number;
    } | null;
    candidate?: {
        id: string;
        full_name: string;
        phone: string;
        bio?: string;
        current_ctc?: number;
        expected_ctc?: number;
        notice_period?: string;
        skills_primary: string[];
        experience: any[];
        education: any[];
        projects: any[];
        languages: any[];
    } | null;
}

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter & Search State
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);

    // Sorting State
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'SUPPORT',
        name: '',
        phone: '',
        is_active: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1); // Reset to first page on new search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

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
            const updatePayload: any = {
                role: formData.role,
                phone: formData.phone,
                is_active: formData.is_active
            };

            if (formData.password) {
                updatePayload.password = formData.password;
            }

            const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
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
            name: '',
            phone: user.phone || '',
            is_active: user.is_active ?? true
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            email: '',
            password: '',
            role: 'SUPPORT',
            name: '',
            phone: '',
            is_active: true
        });
        setSelectedUser(null);
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit, debouncedSearch, statusFilter, roleFilter, sortBy, sortOrder]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: debouncedSearch,
                status: statusFilter,
                role: roleFilter,
                sortBy,
                sortOrder
            });

            const res = await fetch(`/api/admin/users?${params}`);
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
                throw new Error('Failed to fetch users');
            }
            const data = await res.json();
            setUsers(data.users);
            setTotalPages(data.pagination.pages);
            setTotalUsers(data.pagination.total);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc'); // Default to desc for new field
        }
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

    const handleViewDetails = async (userId: string) => {
        try {
            const res = await fetch(`/api/admin/users/${userId}`);
            if (!res.ok) throw new Error('Failed to fetch user details');
            const data = await res.json();
            setViewUser(data.user);
        } catch (error) {
            console.error('Error fetching user details:', error);
            alert('Failed to fetch user details');
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
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <div className="text-sm text-slate-400">Total Users</div>
                    </div>
                    {/* Note: Detailed stats for Pending/Verified/Rejected would require separate API calls or returning counts from API. 
                        For now, we can remove them or fetch them separately if critical. 
                        Let's keep Total Users and maybe add "Current Page Users" or just remove specific status counts if they are not returned by the paginated API.
                        Actually, the previous implementation filtered client-side. 
                        To keep it simple and performant, let's just show Total Users and maybe Page Info.
                    */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-emerald-500">{page}</div>
                        <div className="text-sm text-slate-400">Current Page</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-500">{totalPages}</div>
                        <div className="text-sm text-slate-400">Total Pages</div>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th
                                        className="text-left py-4 px-6 text-slate-300 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('email')}
                                    >
                                        User {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 text-slate-300 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('role')}
                                    >
                                        Role {sortBy === 'role' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Details</th>
                                    <th
                                        className="text-left py-4 px-6 text-slate-300 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('verification_status')}
                                    >
                                        Status {sortBy === 'verification_status' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors"
                                        onClick={() => handleViewDetails(user.id)}
                                    >
                                        <td className="py-4 px-6">
                                            <div>
                                                <div className="font-medium">{user.email}</div>
                                                {user.phone && <div className="text-xs text-slate-400">{user.phone}</div>}
                                                <div className="text-xs text-slate-400">
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
                                        <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
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

                    {/* Pagination Controls */}
                    <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalUsers)} of {totalUsers} users
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
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

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">
                                    {modalMode === 'CREATE' ? 'Password' : 'Reset Password (Optional)'}
                                </label>
                                <input
                                    type="password"
                                    required={modalMode === 'CREATE'}
                                    minLength={6}
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    placeholder={modalMode === 'EDIT' ? 'Leave blank to keep current' : ''}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

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

                            {modalMode === 'EDIT' && (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium text-slate-400">
                                        Is Active
                                    </label>
                                </div>
                            )}

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
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                            <h3 className="text-xl font-bold text-white">User Details</h3>
                            <button onClick={() => setViewUser(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Email</h4>
                                    <p className="text-white text-lg">{viewUser.email}</p>
                                </div>
                                {viewUser.phone && (
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-400">Phone</h4>
                                        <p className="text-white text-lg">{viewUser.phone}</p>
                                    </div>
                                )}
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Role</h4>
                                    <span className="px-2 py-1 bg-slate-800 rounded text-sm font-medium mt-1 inline-block">
                                        {viewUser.role}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Status</h4>
                                    <div className="flex gap-2 mt-1">
                                        <span className={`px-2 py-1 rounded text-sm font-medium inline-block ${viewUser.verification_status === 'VERIFIED' ? 'text-green-500 bg-green-500/10' :
                                            viewUser.verification_status === 'REJECTED' ? 'text-red-500 bg-red-500/10' :
                                                'text-yellow-500 bg-yellow-500/10'
                                            }`}>
                                            {viewUser.verification_status}
                                        </span>
                                        {viewUser.is_active !== undefined && (
                                            <span className={`px-2 py-1 rounded text-sm font-medium inline-block ${viewUser.is_active ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                                                {viewUser.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Joined On</h4>
                                    <p className="text-white">{new Date(viewUser.created_at).toLocaleString()}</p>
                                </div>
                                {viewUser.last_login_at && (
                                    <div>
                                        <h4 className="text-sm font-medium text-slate-400">Last Login</h4>
                                        <p className="text-white">{new Date(viewUser.last_login_at).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            {/* Organization Details */}
                            {viewUser.organization && (
                                <div className="border-t border-slate-800 pt-6">
                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <Building2 className="w-5 h-5 text-emerald-500" /> Organization
                                    </h4>
                                    <div className="bg-slate-800/50 p-4 rounded-xl space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-slate-400 text-sm">Name</p>
                                                <p className="font-medium">{viewUser.organization.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">Domain</p>
                                                <p className="font-medium">{viewUser.organization.domain || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">GSTIN</p>
                                                <p className="font-medium">{viewUser.organization.gstin || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">Website</p>
                                                <p className="font-medium">{viewUser.organization.website || 'N/A'}</p>
                                            </div>
                                            {viewUser.organization.industry && (
                                                <div>
                                                    <p className="text-slate-400 text-sm">Industry</p>
                                                    <p className="font-medium">{viewUser.organization.industry}</p>
                                                </div>
                                            )}
                                            {viewUser.organization.size && (
                                                <div>
                                                    <p className="text-slate-400 text-sm">Size</p>
                                                    <p className="font-medium">{viewUser.organization.size}</p>
                                                </div>
                                            )}
                                        </div>
                                        {viewUser.organization.description && (
                                            <div>
                                                <p className="text-slate-400 text-sm">Description</p>
                                                <p className="text-sm text-slate-300 mt-1">{viewUser.organization.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TAS Profile */}
                            {viewUser.tas_profile && (
                                <div className="border-t border-slate-800 pt-6">
                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-emerald-500" /> TAS Profile
                                    </h4>
                                    <div className="bg-slate-800/50 p-4 rounded-xl space-y-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-slate-400 text-sm">PAN</p>
                                                <p className="font-medium">{viewUser.tas_profile.pan_number}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">Credits Balance</p>
                                                <p className="font-medium text-emerald-500">{viewUser.tas_profile.credits_balance}</p>
                                            </div>
                                        </div>
                                        {viewUser.tas_profile.linkedin_url && (
                                            <div>
                                                <p className="text-slate-400 text-sm">LinkedIn</p>
                                                <a href={viewUser.tas_profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline">
                                                    {viewUser.tas_profile.linkedin_url}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Candidate Profile */}
                            {viewUser.candidate && (
                                <div className="border-t border-slate-800 pt-6">
                                    <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <User className="w-5 h-5 text-emerald-500" /> Candidate Profile
                                    </h4>
                                    <div className="bg-slate-800/50 p-4 rounded-xl space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-slate-400 text-sm">Full Name</p>
                                                <p className="font-medium">{viewUser.candidate.full_name}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">Phone</p>
                                                <p className="font-medium">{viewUser.candidate.phone}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">Current CTC</p>
                                                <p className="font-medium">{viewUser.candidate.current_ctc ? `₹${viewUser.candidate.current_ctc}` : 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">Expected CTC</p>
                                                <p className="font-medium">{viewUser.candidate.expected_ctc ? `₹${viewUser.candidate.expected_ctc}` : 'N/A'}</p>
                                            </div>
                                        </div>

                                        {viewUser.candidate.skills_primary && viewUser.candidate.skills_primary.length > 0 && (
                                            <div>
                                                <p className="text-slate-400 text-sm mb-2">Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {viewUser.candidate.skills_primary.map((skill, i) => (
                                                        <span key={i} className="px-2 py-1 bg-slate-700 rounded text-xs text-white">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {viewUser.candidate.experience && viewUser.candidate.experience.length > 0 && (
                                            <div>
                                                <p className="text-slate-400 text-sm mb-2">Experience</p>
                                                <div className="space-y-2">
                                                    {viewUser.candidate.experience.map((exp: any) => (
                                                        <div key={exp.id} className="bg-slate-900/50 p-3 rounded border border-slate-700/50">
                                                            <p className="font-medium text-white">{exp.role} at {exp.company}</p>
                                                            <p className="text-xs text-slate-400">
                                                                {new Date(exp.start_date).toLocaleDateString()} - {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
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
