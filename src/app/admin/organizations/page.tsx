'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Globe, FileText, CheckCircle, XCircle } from 'lucide-react';

interface Organization {
    id: string;
    name: string;
    gstin?: string;
    domain?: string;
    website?: string;
    created_at: string;
    _count: {
        users: number;
        jobs: number;
    };
}

export default function AdminOrganizationsPage() {
    const router = useRouter();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const res = await fetch('/api/admin/organizations');
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
                throw new Error('Failed to fetch organizations');
            }
            const data = await res.json();
            setOrganizations(data.organizations || []);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setLoading(false);
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
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Organizations</h1>
                    <p className="text-slate-400">Manage company profiles and details</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Company</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">GSTIN</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Domain</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Users</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Jobs</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {organizations.map((org) => (
                                    <tr key={org.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <Building2 className="w-5 h-5 text-purple-500" />
                                                <div>
                                                    <div className="font-medium">{org.name}</div>
                                                    {org.website && (
                                                        <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-xs text-emerald-500 hover:underline flex items-center gap-1">
                                                            <Globe className="w-3 h-3" />
                                                            {org.website}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400">{org.gstin || '-'}</td>
                                        <td className="py-4 px-6 text-slate-400">{org.domain || '-'}</td>
                                        <td className="py-4 px-6">{org._count.users}</td>
                                        <td className="py-4 px-6">{org._count.jobs}</td>
                                        <td className="py-4 px-6 text-slate-400 text-sm">
                                            {new Date(org.created_at).toLocaleDateString()}
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
