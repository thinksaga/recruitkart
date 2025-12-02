'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, DollarSign, Clock, Users, Mail, Phone, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MemberJobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [job, setJob] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                // Reusing the company job details API
                const res = await fetch(`/api/company/jobs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setJob(data.job);
                    setCandidates(data.candidates);
                }
            } catch (error) {
                console.error('Failed to fetch job details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex h-full items-center justify-center text-slate-500">
                Job not found.
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
            </button>

            {/* Job Header */}
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{job.title}</h1>
                        <div className="flex items-center gap-6 text-slate-400">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {job.location}
                            </span>
                            <span className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> {job.salary}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> {job.type}
                            </span>
                        </div>
                    </div>
                    {/* No Edit/Close buttons for Members */}
                </div>

                <div className="grid grid-cols-4 gap-6 pt-6 border-t border-slate-800">
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Status</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                            }`}>
                            {job.status}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Posted</div>
                        <div className="text-white font-medium">{job.posted}</div>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Bounty</div>
                        <div className="text-emerald-400 font-medium">{job.bounty}</div>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Candidates</div>
                        <div className="text-white font-medium">{job.candidatesCount} Applied</div>
                    </div>
                </div>
            </div>

            {/* Candidates List */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6">Candidates ({candidates.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No candidates have applied yet.</p>
                        </div>
                    ) : (
                        candidates.map((candidate, index) => (
                            <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => router.push(`/dashboard/member/candidates/${candidate.id}`)}
                                className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-rose-500/30 transition-colors group cursor-pointer relative"
                            >
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${candidate.status === 'HIRED' ? 'bg-emerald-500/10 text-emerald-500' :
                                            candidate.status === 'INTERVIEWING' ? 'bg-amber-500/10 text-amber-500' :
                                                'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {candidate.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-400">
                                        {candidate.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-rose-400 transition-colors">{candidate.name}</h3>
                                        <p className="text-slate-400 text-sm">{candidate.experience}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-slate-400 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        {candidate.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-500" />
                                        {candidate.phone}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                                    {candidate.skills.slice(0, 3).map((skill: string) => (
                                        <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
