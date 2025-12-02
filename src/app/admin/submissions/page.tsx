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
        };
    };
}

export default function AdminSubmissionsPage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal State
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchSubmissions();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/submissions?search=${searchTerm}&status=${statusFilter}`);
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
                throw new Error('Failed to fetch submissions');
            }
            const data = await res.json();
            setSubmissions(data.submissions || []);
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
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
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Date</th>
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
                                        <tr key={sub.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
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
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => setSelectedSubmission(sub)}
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
