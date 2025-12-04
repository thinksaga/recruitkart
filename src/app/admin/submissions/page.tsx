'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    FileText,
    User,
    Briefcase,
    Calendar,
    Search,
    Filter,
    Eye,
    X,
    Building2,
    Mail,
    Phone,
    Loader2
} from 'lucide-react';

interface Submission {
    id: string;
    status: string;
    created_at: string;
    candidate: {
        full_name: string;
        email: string;
        phone?: string;
    };
    job: {
        title: string;
        organization: {
            name: string;
        };
    };
    tas: {
        user: {
            email: string;
            phone?: string;
        };
    };
    interviews?: any[];
}

export default function AdminSubmissionsPage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal State
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalSubmissions, setTotalSubmissions] = useState(0);
    const [sortBy, setSortBy] = useState('created_at');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

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
        setPage(1);
    }, [statusFilter]);

    useEffect(() => {
        fetchSubmissions();
    }, [page, limit, debouncedSearch, statusFilter, sortBy, sortOrder]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                search: debouncedSearch,
                status: statusFilter,
                sortBy,
                sortOrder
            });
            const res = await fetch(`/api/admin/submissions?${params}`);
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
                throw new Error('Failed to fetch submissions');
            }
            const data = await res.json();
            setSubmissions(data.submissions || []);
            setTotalPages(data.pagination.pages);
            setTotalSubmissions(data.pagination.total);
        } catch (error) {
            console.error('Error fetching submissions:', error);
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

    const handleViewDetails = async (submissionId: string) => {
        try {
            const res = await fetch(`/api/admin/submissions/${submissionId}`);
            if (!res.ok) throw new Error('Failed to fetch submission details');
            const data = await res.json();
            setSelectedSubmission(data.submission);
        } catch (error) {
            console.error('Error fetching submission details:', error);
            alert('Failed to fetch submission details');
        }
    };

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
                    <h1 className="text-4xl font-bold mb-2">Submissions</h1>
                    <p className="text-slate-400">Track and manage candidate submissions</p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold">{totalSubmissions}</div>
                        <div className="text-sm text-slate-400">Total Submissions</div>
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

                {/* Filters */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by candidate, job, or TAS..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                            >
                                <option value="ALL">All Status</option>
                                <option value="PENDING">Pending</option>
                                <option value="REVIEWING">Reviewing</option>
                                <option value="ACCEPTED">Accepted</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Submissions Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Candidate</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Job</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Submitted By</th>
                                    <th
                                        className="text-left py-4 px-6 text-slate-300 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('status')}
                                    >
                                        Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                                    </th>
                                    <th
                                        className="text-left py-4 px-6 text-slate-300 font-medium cursor-pointer hover:text-white"
                                        onClick={() => handleSort('created_at')}
                                    >
                                        Date {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
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
                                ) : submissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No submissions found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    submissions.map((sub) => (
                                        <tr
                                            key={sub.id}
                                            className="border-b border-slate-800/50 hover:bg-slate-800/50 cursor-pointer transition-colors"
                                            onClick={() => handleViewDetails(sub.id)}
                                        >
                                            <td className="py-4 px-6">
                                                <div className="font-medium">{sub.candidate.full_name}</div>
                                                <div className="text-sm text-slate-400">{sub.candidate.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium">{sub.job.title}</div>
                                                <div className="text-sm text-slate-400 flex items-center gap-1">
                                                    <Building2 className="w-3 h-3" />
                                                    {sub.job.organization.name}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-400">
                                                {sub.tas?.user?.email || 'N/A'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
                                                    sub.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                        'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-400 text-sm">
                                                {new Date(sub.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleViewDetails(sub.id)}
                                                    className="p-1 text-slate-400 hover:text-emerald-500 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
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
                            Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalSubmissions)} of {totalSubmissions} submissions
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

            {/* Submission Details Modal */}
            {selectedSubmission && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                            <h3 className="text-xl font-bold text-white">Submission Details</h3>
                            <button onClick={() => setSelectedSubmission(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-2">Candidate</h4>
                                    <div className="p-4 bg-slate-800/50 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-emerald-500" />
                                            <span className="font-medium">{selectedSubmission.candidate.full_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <Mail className="w-4 h-4" />
                                            {selectedSubmission.candidate.email}
                                        </div>
                                        {selectedSubmission.candidate.phone && (
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Phone className="w-4 h-4" />
                                                {selectedSubmission.candidate.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-2">Job</h4>
                                    <div className="p-4 bg-slate-800/50 rounded-lg space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-purple-500" />
                                            <span className="font-medium">{selectedSubmission.job.title}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <Building2 className="w-4 h-4" />
                                            {selectedSubmission.job.organization.name}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-2">Submitted By (TAS)</h4>
                                    <div className="p-4 bg-slate-800/50 rounded-lg">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-slate-400" />
                                            {selectedSubmission.tas?.user?.email || 'N/A'}
                                        </div>
                                        {selectedSubmission.tas?.user?.phone && (
                                            <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                                <Phone className="w-4 h-4" />
                                                {selectedSubmission.tas.user.phone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-slate-400 mb-2">Status</h4>
                                    <div className="p-4 bg-slate-800/50 rounded-lg">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${selectedSubmission.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-500' :
                                            selectedSubmission.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                            {selectedSubmission.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-sm font-medium text-slate-400 mb-2">Timeline</h4>
                                <div className="p-4 bg-slate-800/50 rounded-lg flex items-center gap-2 text-sm text-slate-300">
                                    <Calendar className="w-4 h-4 text-slate-400" />
                                    Submitted on {new Date(selectedSubmission.created_at).toLocaleString()}
                                </div>
                            </div>

                            {/* Interviews Section */}
                            {selectedSubmission.interviews && selectedSubmission.interviews.length > 0 && (
                                <div>
                                    <h4 className="text-lg font-bold text-white mb-4">Interview History</h4>
                                    <div className="space-y-4">
                                        {selectedSubmission.interviews.map((interview: any) => (
                                            <div key={interview.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="font-medium text-white">Round {interview.round_number}: {interview.round_type}</div>
                                                        <div className="text-sm text-slate-400">{new Date(interview.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${interview.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                                                        interview.status === 'SCHEDULED' ? 'bg-blue-500/10 text-blue-500' :
                                                            'bg-slate-500/10 text-slate-500'
                                                        }`}>
                                                        {interview.status}
                                                    </span>
                                                </div>
                                                {interview.outcome && (
                                                    <div className="mt-2 text-sm">
                                                        <span className="text-slate-400">Outcome: </span>
                                                        <span className={interview.outcome === 'PASSED' ? 'text-green-500' : interview.outcome === 'FAILED' ? 'text-red-500' : 'text-yellow-500'}>
                                                            {interview.outcome}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
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
