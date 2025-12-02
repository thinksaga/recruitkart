'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Users, Search, Filter, Loader2, Building2, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function SupportUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/users?role=${roleFilter}`);
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.organization?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/support')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">User Directory</h1>
                    <p className="text-slate-400">View user details and status</p>
                </div>

                {/* Filters */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by email or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <Filter className="w-5 h-5 text-slate-400" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="COMPANY_ADMIN">Company Admin</option>
                                <option value="TAS">TAS</option>
                                <option value="CANDIDATE">Candidate</option>
                            </select>
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">User</th>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">Role</th>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">Organization</th>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                            <td className="py-4 px-6">
                                                <div className="font-medium">{user.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-3 py-1 bg-slate-800 rounded-full text-xs font-medium border border-slate-700">
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-400">
                                                {user.organization ? (
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="w-4 h-4" />
                                                        {user.organization.name}
                                                    </div>
                                                ) : '-'}
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
                                            <td className="py-4 px-6 text-slate-400 text-sm">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
