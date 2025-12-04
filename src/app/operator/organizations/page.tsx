'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Users, Briefcase, Globe, Loader2 } from 'lucide-react';

export default function OperatorOrganizationsPage() {
    const router = useRouter();
    const [organizations, setOrganizations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const fetchOrganizations = async () => {
        try {
            const res = await fetch('/api/admin/organizations');
            if (res.ok) {
                const data = await res.json();
                setOrganizations(data.organizations);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/operator')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Organizations</h1>
                    <p className="text-slate-400">View registered companies</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {organizations.map((org) => (
                            <div key={org.id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{org.name}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <Globe className="w-3 h-3" />
                                            {org.domain || 'No domain'}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                                    <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                        <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
                                            <Users className="w-4 h-4" />
                                            <span className="text-xs font-medium">Users</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">{org._count?.users || 0}</span>
                                    </div>
                                    <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                                        <div className="flex items-center justify-center gap-2 text-slate-400 mb-1">
                                            <Briefcase className="w-4 h-4" />
                                            <span className="text-xs font-medium">Jobs</span>
                                        </div>
                                        <span className="text-xl font-bold text-white">{org._count?.jobs || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
