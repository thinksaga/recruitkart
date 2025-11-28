'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, Building2, DollarSign, Calendar } from 'lucide-react';

interface Job {
    id: string;
    title: string;
    description: string;
    salary_min: number;
    salary_max: number;
    status: string;
    created_at: string;
    organization: {
        name: string;
    };
}

export default function AdminJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/admin/jobs');
            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    router.push('/login');
                    return; // Don't throw error for auth issues
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

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold">{jobs.length}</div>
                        <div className="text-sm text-slate-400">Total Jobs</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-green-500">
                            {jobs.filter(j => j.status === 'OPEN').length}
                        </div>
                        <div className="text-sm text-slate-400">Open</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-blue-500">
                            {jobs.filter(j => j.status === 'FILLED').length}
                        </div>
                        <div className="text-sm text-slate-400">Filled</div>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                        <div className="text-2xl font-bold text-slate-500">
                            {jobs.filter(j => j.status === 'CLOSED').length}
                        </div>
                        <div className="text-sm text-slate-400">Closed</div>
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
                                </tr>
                            </thead>
                            <tbody>
                                {jobs.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400">
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
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
