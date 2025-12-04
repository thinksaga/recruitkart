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
    description?: string;
    industry?: string;
    size?: string;
    founded_year?: number;
    branding_color?: string;
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
        gstin: '',
        description: '',
        industry: '',
        size: '',
        founded_year: '',
        branding_color: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrgs, setTotalOrgs] = useState(0);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const [viewOrg, setViewOrg] = useState<Organization | null>(null);

    // Debounce Search
    const [debouncedSearch, setDebouncedSearch] = useState('');
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchOrganizations();
    }, [page, limit, debouncedSearch, sortBy, sortOrder]);

    const fetchOrganizations = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: debouncedSearch,
                sortBy,
                sortOrder
            });
            const res = await fetch(`/api/admin/organizations?${params}`);
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
                throw new Error('Failed to fetch organizations');
            }
            const data = await res.json();
            setOrganizations(data.organizations || []);
            setTotalPages(data.pagination.pages);
            setTotalOrgs(data.pagination.total);
        } catch (error) {
            console.error('Error fetching organizations:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const handleViewDetails = async (orgId: string) => {
        try {
            const res = await fetch(`/api/admin/organizations/${orgId}`);
            if (!res.ok) throw new Error('Failed to fetch organization details');
            const data = await res.json();
            setViewOrg(data.organization);
        } catch (error) {
            console.error('Error fetching organization details:', error);
            alert('Failed to fetch organization details');
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
            gstin: org.gstin || '',
            description: org.description || '',
            industry: org.industry || '',
            size: org.size || '',
            founded_year: org.founded_year?.toString() || '',
            branding_color: org.branding_color || ''
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            domain: '',
            website: '',
            gstin: '',
            description: '',
            industry: '',
            size: '',
            founded_year: '',
            branding_color: ''
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

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold">{totalOrgs}</div>
                        <div className="text-sm text-slate-400">Total Organizations</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-emerald-500">{page}</div>
                        <div className="text-sm text-slate-400">Current Page</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-500">{totalPages}</div>
                        <div className="text-sm text-slate-400">Total Pages</div>
                    </div>
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
                                    <th
                                        className="text-left py-4 px-6 text-slate-300 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('name')}
                                    >
                                        Company {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 text-slate-300 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('industry')}
                                    >
                                        Industry {sortBy === 'industry' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Domain</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Stats</th>
                                    <th
                                        className="text-left py-4 px-6 text-slate-300 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('status')}
                                    >
                                        Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
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
                                        <tr
                                            key={org.id}
                                            className="border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors"
                                            onClick={() => handleViewDetails(org.id)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <Building2 className="w-5 h-5 text-purple-500" />
                                                    <div>
                                                        <div className="font-medium">{org.name}</div>
                                                        {org.website && (
                                                            <a
                                                                href={org.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-emerald-500 hover:underline flex items-center gap-1"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <Globe className="w-3 h-3" />
                                                                {org.website}
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-slate-400">{org.industry || '-'}</td>
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
                                            <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
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

                    {/* Pagination Controls */}
                    <div className="p-4 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalOrgs)} of {totalOrgs} organizations
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
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {modalMode === 'CREATE' ? 'Add Organization' : 'Edit Organization'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={modalMode === 'CREATE' ? handleCreateOrg : handleUpdateOrg} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Industry</label>
                                    <input
                                        type="text"
                                        value={formData.industry}
                                        onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Domain</label>
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
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">GSTIN</label>
                                    <input
                                        type="text"
                                        value={formData.gstin}
                                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Founded Year</label>
                                    <input
                                        type="number"
                                        value={formData.founded_year}
                                        onChange={(e) => setFormData({ ...formData, founded_year: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Size</label>
                                    <select
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="">Select...</option>
                                        <option value="1-10">1-10</option>
                                        <option value="11-50">11-50</option>
                                        <option value="51-200">51-200</option>
                                        <option value="201-500">201-500</option>
                                        <option value="500+">500+</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Brand Color</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="color"
                                            value={formData.branding_color || '#000000'}
                                            onChange={(e) => setFormData({ ...formData, branding_color: e.target.value })}
                                            className="h-10 w-10 bg-transparent border-none cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={formData.branding_color}
                                            onChange={(e) => setFormData({ ...formData, branding_color: e.target.value })}
                                            placeholder="#000000"
                                            className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

            {/* View Details Modal */}
            {viewOrg && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Building2 className="w-6 h-6 text-emerald-500" />
                                {viewOrg.name}
                            </h3>
                            <button onClick={() => setViewOrg(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Status</h4>
                                    <span className={`px-2 py-1 rounded text-sm font-medium mt-1 inline-block ${viewOrg.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' :
                                        viewOrg.status === 'BLOCKED' ? 'bg-red-500/10 text-red-500' :
                                            'bg-yellow-500/10 text-yellow-500'
                                        }`}>
                                        {viewOrg.status}
                                    </span>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Founded Year</h4>
                                    <p className="text-white text-lg">{viewOrg.founded_year || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Industry</h4>
                                    <p className="text-white text-lg">{viewOrg.industry || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Size</h4>
                                    <p className="text-white text-lg">{viewOrg.size || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">GSTIN</h4>
                                    <p className="text-white text-lg">{viewOrg.gstin || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Brand Color</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div
                                            className="w-6 h-6 rounded-full border border-slate-700"
                                            style={{ backgroundColor: viewOrg.branding_color || '#000000' }}
                                        />
                                        <span className="text-white">{viewOrg.branding_color || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Domain</h4>
                                    <p className="text-white">{viewOrg.domain || 'N/A'}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400">Website</h4>
                                    {viewOrg.website ? (
                                        <a href={viewOrg.website} target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline flex items-center gap-1">
                                            <Globe className="w-4 h-4" />
                                            {viewOrg.website}
                                        </a>
                                    ) : (
                                        <p className="text-white">N/A</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-2">Description</h4>
                                <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300">
                                    {viewOrg.description || 'No description provided.'}
                                </div>
                            </div>

                            <div className="border-t border-slate-800 pt-6">
                                <h4 className="text-lg font-bold text-white mb-4">Platform Stats</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-800/50 p-4 rounded-xl">
                                        <div className="text-2xl font-bold text-white">{viewOrg._count?.users || 0}</div>
                                        <div className="text-sm text-slate-400">Registered Users</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-xl">
                                        <div className="text-2xl font-bold text-white">{viewOrg._count?.jobs || 0}</div>
                                        <div className="text-sm text-slate-400">Posted Jobs</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
