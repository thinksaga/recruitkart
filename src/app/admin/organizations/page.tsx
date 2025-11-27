'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Building2, Globe, FileText, CheckCircle, XCircle, Plus, Edit, Trash2, X } from 'lucide-react';

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
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
    const [formData, setFormData] = useState({
        legalName: '',
        displayName: '',
        gstin: '',
        domain: '',
        website: '',
    });
    const [processing, setProcessing] = useState(false);

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

    const openCreateModal = () => {
        setFormData({
            legalName: '',
            displayName: '',
            gstin: '',
            domain: '',
            website: '',
        });
        setShowCreateModal(true);
    };

    const openEditModal = (organization: Organization) => {
        setSelectedOrganization(organization);
        setFormData({
            legalName: organization.name,
            displayName: organization.name,
            gstin: organization.gstin || '',
            domain: organization.domain || '',
            website: organization.website || '',
        });
        setShowEditModal(true);
    };

    const openDeleteModal = (organization: Organization) => {
        setSelectedOrganization(organization);
        setShowDeleteModal(true);
    };

    const handleCreateOrganization = async (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const res = await fetch('/api/admin/organizations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to create organization');
            }

            setShowCreateModal(false);
            fetchOrganizations();
            alert('Organization created successfully!');
        } catch (error: any) {
            console.error('Error creating organization:', error);
            alert(error.message || 'Failed to create organization');
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateOrganization = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrganization) return;

        setProcessing(true);

        try {
            const res = await fetch('/api/admin/organizations', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: selectedOrganization.id, ...formData }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to update organization');
            }

            setShowEditModal(false);
            fetchOrganizations();
            alert('Organization updated successfully!');
        } catch (error: any) {
            console.error('Error updating organization:', error);
            alert(error.message || 'Failed to update organization');
        } finally {
            setProcessing(false);
        }
    };

    const handleDeleteOrganization = async () => {
        if (!selectedOrganization) return;

        setProcessing(true);

        try {
            const res = await fetch(`/api/admin/organizations?id=${selectedOrganization.id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Failed to delete organization');
            }

            setShowDeleteModal(false);
            fetchOrganizations();
            alert('Organization deleted successfully!');
        } catch (error: any) {
            console.error('Error deleting organization:', error);
            alert(error.message || 'Failed to delete organization');
        } finally {
            setProcessing(false);
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Organizations</h1>
                            <p className="text-slate-400">Manage company profiles and details</p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Organization
                        </button>
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
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Users</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Jobs</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Created</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Actions</th>
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
                                        <td className="py-4 px-6">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => openEditModal(org)}
                                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition-colors"
                                                    title="Edit Organization"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(org)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded transition-colors"
                                                    title="Delete Organization"
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

                {/* Create Organization Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Create New Organization</h2>
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleCreateOrganization} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Legal Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.legalName}
                                            onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="ABC Corporation Pvt Ltd"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Display Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="ABC Corp"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">GSTIN</label>
                                        <input
                                            type="text"
                                            value={formData.gstin}
                                            onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="22AAAAA0000A1Z5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Domain</label>
                                        <input
                                            type="text"
                                            value={formData.domain}
                                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="https://www.example.com"
                                    />
                                </div>

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
                                        {processing ? 'Creating...' : 'Create Organization'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Organization Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Edit Organization</h2>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <form onSubmit={handleUpdateOrganization} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Legal Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.legalName}
                                            onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="ABC Corporation Pvt Ltd"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Display Name *</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.displayName}
                                            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="ABC Corp"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">GSTIN</label>
                                        <input
                                            type="text"
                                            value={formData.gstin}
                                            onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="22AAAAA0000A1Z5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">Domain</label>
                                        <input
                                            type="text"
                                            value={formData.domain}
                                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
                                    <input
                                        type="url"
                                        value={formData.website}
                                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="https://www.example.com"
                                    />
                                </div>

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
                                        {processing ? 'Updating...' : 'Update Organization'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Organization Modal */}
                {showDeleteModal && selectedOrganization && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-md w-full">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 bg-red-600/20 rounded-full">
                                        <Trash2 className="w-6 h-6 text-red-400" />
                                    </div>
                                    <h2 className="text-xl font-bold text-white">Delete Organization</h2>
                                </div>
                                <p className="text-slate-300 mb-6">
                                    Are you sure you want to delete <span className="font-medium text-white">{selectedOrganization.name}</span>?
                                    This action cannot be undone and will affect {selectedOrganization._count.users} users.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowDeleteModal(false)}
                                        className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDeleteOrganization}
                                        disabled={processing}
                                        className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-medium transition-colors"
                                    >
                                        {processing ? 'Deleting...' : 'Delete Organization'}
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
