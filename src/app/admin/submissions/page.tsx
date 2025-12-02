'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, Search, Filter, Loader2 } from 'lucide-react';

export default function AdminSubmissionsPage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchSubmissions();
    }, [statusFilter]);

    const fetchSubmissions = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/submissions?status=${statusFilter}`);
            if (res.ok) {
                const data = await res.json();
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                    <h1 className="text-4xl font-bold mb-2">Candidate Submissions</h1>
                    <p className="text-slate-400">Track all TAS candidate submissions</p>
                </div>

                {/* Filters */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                            <option value="ALL">All Status</option>
                            <option value="PENDING_REVIEW">Pending Review</option>
                            <option value="INTERVIEWING">Interviewing</option>
                            <option value="HIRED">Hired</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                        <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                        <h3 className="text-xl font-bold mb-2">No Submissions Found</h3>
                        <p className="text-slate-400">Try adjusting your filters.</p>
                    </div>
                ) : (
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {submissions.map((sub) => (
                                        <tr key={sub.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                            <td className="py-4 px-6">
                                                <div className="font-medium">{sub.candidate.full_name}</div>
                                                <div className="text-sm text-slate-400">{sub.candidate.email}</div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="font-medium">{sub.job.title}</div>
                                                <div className="text-sm text-slate-400">{sub.job.organization.name}</div>
                                            </td>
                                            <td className="py-4 px-6 text-slate-400">
                                                {sub.tas?.user?.email || 'N/A'}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'HIRED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                    sub.status === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                        sub.status === 'INTERVIEWING' ? 'bg-purple-500/10 text-purple-500' :
                                                            'bg-slate-500/10 text-slate-500'
                                                    }`}>
                                                    {sub.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-400 text-sm">
                                                {new Date(sub.created_at).toLocaleDateString()}
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
