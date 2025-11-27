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
    User
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
                <div className="mb-8">
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
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
