'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserCheck, CheckCircle, XCircle, Loader2, Building2, User } from 'lucide-react';

export default function ComplianceVerificationsPage() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const res = await fetch('/api/compliance/verifications');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.pendingUsers);
            }
        } catch (error) {
            console.error('Error fetching pending users:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerification = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/compliance/verifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) fetchPendingUsers();
        } catch (error) {
            console.error('Error updating verification:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard/compliance')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Pending Verifications</h1>
                    <p className="text-slate-400">Review and verify user accounts</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {users.map((user) => (
                            <div key={user.id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-slate-800 rounded-lg">
                                            {user.role === 'COMPANY_ADMIN' ? (
                                                <Building2 className="w-6 h-6 text-purple-500" />
                                            ) : (
                                                <User className="w-6 h-6 text-blue-500" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-1">{user.email}</h3>
                                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                                <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-medium">
                                                    {user.role}
                                                </span>
                                                <span className="text-sm">• Joined {new Date(user.created_at).toLocaleDateString()}</span>
                                            </div>

                                            {user.tas_profile && (
                                                <div className="text-sm text-slate-300 mt-2 p-3 bg-slate-800/50 rounded-lg">
                                                    <p>PAN: {user.tas_profile.pan_number}</p>
                                                    <p>LinkedIn: {user.tas_profile.linkedin_url || 'N/A'}</p>
                                                </div>
                                            )}

                                            {user.organization && (
                                                <div className="text-sm text-slate-300 mt-2 p-3 bg-slate-800/50 rounded-lg">
                                                    <p>Organization: {user.organization.name}</p>
                                                    <p>GSTIN: {user.organization.gstin || 'N/A'}</p>
                                                    <p>Domain: {user.organization.domain || 'N/A'}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleVerification(user.id, 'VERIFIED')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg font-medium transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Verify
                                        </button>
                                        <button
                                            onClick={() => handleVerification(user.id, 'REJECTED')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-medium transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {users.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No pending verifications</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
