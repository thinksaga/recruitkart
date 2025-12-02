'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Briefcase,
    Building2,
    DollarSign,
    Calendar,
    Search,
    Filter,
    Eye,
    X,
    MapPin,
    Clock,
    Loader2
} from 'lucide-react';

interface Job {
    id: string;
    title: string;
    description: string;
    salary_min: number;
    salary_max: number;
    status: string;
    location?: string;
    type?: string;
    created_at: string;
    organization: {
        name: string;
    };
}

export default function AdminJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    // Modal State
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchJobs();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, statusFilter]);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/jobs?search=${searchTerm}&status=${statusFilter}`);
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                }
                throw new Error('Failed to fetch jobs');
            }
            const data = await res.json();
            setJobs(data.jobs || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
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
                    <h1 className="text-4xl font-bold mb-2">Job Management</h1>
                    <p className="text-slate-400">View and manage all job postings</p>
                </div>

                {/* Filters */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by title or company..."
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
                                <option value="OPEN">Open</option>
                                <option value="FILLED">Filled</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Job Title</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Company</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Salary Range</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Posted</th>
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
                                ) : jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p>No jobs found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    jobs.map((job) => (
                                        <tr key={job.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                            <td className="py-4 px-6">
                                                <div className="font-medium">{job.title}</div>
                                                <div className="text-sm text-slate-400 line-clamp-1">
                                                    {job.description}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <Building2 className="w-4 h-4 text-slate-400" />
                                                    {job.organization.name}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-slate-400" />
                                                    ₹{job.salary_min.toLocaleString()} - ₹{job.salary_max.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'OPEN' ? 'bg-green-500/10 text-green-500' :
                                                    job.status === 'FILLED' ? 'bg-blue-500/10 text-blue-500' :
                                                        'bg-slate-500/10 text-slate-500'
                                                    }`}>
                                                    {job.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-slate-400 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    {new Date(job.created_at).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <button
                                                    onClick={() => setSelectedJob(job)}
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

            {/* Job Details Modal */}
            {selectedJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
                            <h3 className="text-xl font-bold text-white">Job Details</h3>
                            <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">{selectedJob.title}</h2>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Building2 className="w-4 h-4" />
                                        {selectedJob.organization.name}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {selectedJob.location || 'Remote'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {selectedJob.type || 'Full-time'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="w-4 h-4" />
                                        ₹{selectedJob.salary_min.toLocaleString()} - ₹{selectedJob.salary_max.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-800/50 rounded-lg">
                                    <div className="text-sm text-slate-400 mb-1">Status</div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${selectedJob.status === 'OPEN' ? 'bg-green-500/10 text-green-500' :
                                            selectedJob.status === 'FILLED' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {selectedJob.status}
                                    </span>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-lg">
                                    <div className="text-sm text-slate-400 mb-1">Posted On</div>
                                    <div className="font-medium">{new Date(selectedJob.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-medium text-white mb-2">Description</h4>
                                <div className="text-slate-300 whitespace-pre-wrap bg-slate-800/30 p-4 rounded-lg">
                                    {selectedJob.description}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
