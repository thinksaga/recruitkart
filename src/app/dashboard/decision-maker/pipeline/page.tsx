'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Briefcase, Loader2, ArrowRight } from 'lucide-react';

export default function PipelinePage() {
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPipeline = async () => {
            try {
                // Reusing company jobs API to get stats per job
                const res = await fetch('/api/company/jobs');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data.jobs);
                }
            } catch (error) {
                console.error('Failed to fetch pipeline:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPipeline();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Candidate Pipeline</h1>
                <p className="text-slate-400">Overview of hiring progress across all active roles.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {jobs.map((job, index) => (
                    <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400">
                                    {job.title.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                                    <p className="text-slate-400 text-sm">{job.location} • {job.type}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl font-bold text-white">{job.candidates}</div>
                                <div className="text-xs text-slate-500">Total Candidates</div>
                            </div>
                        </div>

                        {/* Pipeline Visual (Mocked percentages for now as API doesn't return full breakdown yet) */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm text-slate-400">
                                <span>Screening</span>
                                <span>Interviewing</span>
                                <span>Offer</span>
                                <span>Hired</span>
                            </div>
                            <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
                                <div className="h-full bg-blue-500/50" style={{ width: '40%' }}></div>
                                <div className="h-full bg-amber-500/50" style={{ width: '30%' }}></div>
                                <div className="h-full bg-purple-500/50" style={{ width: '20%' }}></div>
                                <div className="h-full bg-emerald-500/50" style={{ width: '10%' }}></div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Screening
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                    Interviewing
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                                    Offer
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    Hired
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
