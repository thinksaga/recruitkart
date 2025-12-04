'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, Building2, MapPin, DollarSign, Calendar, Loader2 } from 'lucide-react';

export default function OperatorJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await fetch('/api/admin/jobs');
            if (res.ok) {
                const data = await res.json();
                setJobs(data.jobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
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
                    <h1 className="text-4xl font-bold mb-2">Job Listings</h1>
                    <p className="text-slate-400">View all active job postings</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {jobs.map((job) => (
                            <div key={job.id} className="p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">{job.title}</h3>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Building2 className="w-4 h-4" />
                                            <span>{job.organization.name}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'OPEN' ? 'bg-green-500/10 text-green-500' :
                                            job.status === 'FILLED' ? 'bg-blue-500/10 text-blue-500' :
                                                'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {job.status}
                                    </span>
                                </div>

                                <p className="text-slate-400 mb-6 line-clamp-2">{job.description}</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-300">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-slate-500" />
                                        {job.location || 'Remote'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-slate-500" />
                                        {job.type || 'Full-time'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-slate-500" />
                                        {job.salary_min ? `₹${(job.salary_min / 100000).toFixed(1)}L - ₹${(job.salary_max / 100000).toFixed(1)}L` : 'Not specified'}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-500" />
                                        {new Date(job.created_at).toLocaleDateString()}
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
