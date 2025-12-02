'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Filter, Briefcase, Users, MoreVertical, MapPin, DollarSign, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompanyJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/company/jobs');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data.jobs);
                }
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Job Postings</h1>
                    <p className="text-slate-400">Manage your active job listings and track candidates.</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/company/jobs/new')}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors shadow-lg shadow-rose-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Post New Job
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search jobs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                    />
                </div>
                <button className="px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No jobs found.</p>
                    </div>
                ) : (
                    filteredJobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-rose-500/30 transition-colors group relative"
                        >
                            <button className="absolute top-6 right-6 text-slate-500 hover:text-white">
                                <MoreVertical className="w-5 h-5" />
                            </button>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400">
                                    {job.title.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white group-hover:text-rose-400 transition-colors">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign className="w-3 h-3" />
                                            {job.salary}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Users className="w-4 h-4 text-slate-500" />
                                        <span className="font-medium text-white">{job.candidates}</span> Candidates
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {job.status}
                                    </span>
                                </div>
                                <div className="text-sm text-slate-500">
                                    Posted {job.posted}
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
