'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Building2,
    Globe,
    FileText,
    CheckCircle,
    XCircle,
    Search,
    Plus,
    Edit,
    Ban,
    Trash2,
    X,
    Loader2,
    Shield
} from 'lucide-react';

interface Organization {
    id: string;
    name: string;
    gstin?: string;
    domain?: string;
    website?: string;
    status: string;
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
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'CREATE' | 'EDIT'>('CREATE');
    const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        domain: '',
        website: '',
        gstin: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchOrganizations();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/organizations?search=${searchTerm}`);
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

    const handleCreateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/admin/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to create organization');
            }

            setIsModalOpen(false);
            fetchOrganizations();
            resetForm();
        } catch (error: any) {
            console.error('Error creating organization:', error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateOrg = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrg) return;
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/organizations/${selectedOrg.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error('Failed to update organization');

            setIsModalOpen(false);
            fetchOrganizations();
            resetForm();
        } catch (error) {
            console.error('Error updating organization:', error);
            alert('Failed to update organization');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusChange = async (orgId: string, newStatus: string) => {
        if (!confirm(`Are you sure you want to ${newStatus === 'BLOCKED' ? 'block' : 'activate'} this organization?`)) return;
        try {
            const res = await fetch(`/api/admin/organizations/${orgId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) throw new Error('Failed to update status');

            fetchOrganizations();
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const openCreateModal = () => {
        setModalMode('CREATE');
        resetForm();
        setIsModalOpen(true);
    };

    const openEditModal = (org: Organization) => {
        setModalMode('EDIT');
        setSelectedOrg(org);
        setFormData({
            name: org.name,
            domain: org.domain || '',
            website: org.website || '',
            gstin: org.gstin || ''
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            domain: '',
            website: '',
            gstin: ''
        });
        setSelectedOrg(null);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <div>
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
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        Add Organization
                    </button>
                </div>

                {/* Search */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, domain, or GSTIN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Company</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">GSTIN</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Domain</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Stats</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center">
                                            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                                        </td>
                                    </tr>
                                ) : organizations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            No organizations found
                                        </td>
                                    </tr>
                                ) : (
                                    organizations.map((org) => (
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
                                            <td className="py-4 px-6">
                                                <div className="text-sm">
                                                    <span className="text-slate-400">Users:</span> {org._count.users}
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-slate-400">Jobs:</span> {org._count.jobs}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${org.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                                                        org.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500' :
                                                            'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {org.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => openEditModal(org)}
                                                        className="p-1 text-slate-400 hover:text-white transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    {org.status === 'BLOCKED' ? (
                                                        <button
                                                            onClick={() => handleStatusChange(org.id, 'ACTIVE')}
                                                            className="p-1 text-slate-400 hover:text-green-500 transition-colors"
                                                            title="Activate"
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleStatusChange(org.id, 'BLOCKED')}
                                                            className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Block"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
                                {modalMode === 'CREATE' ? 'Add Organization' : 'Edit Organization'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={modalMode === 'CREATE' ? handleCreateOrg : handleUpdateOrg} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Domain (e.g., company.com)</label>
                                <input
                                    type="text"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Website</label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">GSTIN</label>
                                <input
                                    type="text"
                                    value={formData.gstin}
                                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
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
                                    modalMode === 'CREATE' ? 'Create Organization' : 'Update Organization'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
