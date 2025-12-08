'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock, Building2, Loader2, X, CheckCircle, AlertCircle, Sparkles, TrendingUp, Users } from 'lucide-react';

export default function TASJobsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Submission Modal State
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [selectedCandidateId, setSelectedCandidateId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionMessage, setSubmissionMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Job Details Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [jobDetails, setJobDetails] = useState<any>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/tas/jobs');
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

    const fetchCandidates = async () => {
        try {
            const res = await fetch('/api/tas/candidates');
            if (res.ok) {
                const data = await res.json();
                setCandidates(data.candidates);
            }
        } catch (error) {
            console.error('Failed to fetch candidates:', error);
        }
    };

    const openDetailsModal = async (jobId: string) => {
        setIsDetailsModalOpen(true);
        setIsLoadingDetails(true);
        try {
            const res = await fetch(`/api/tas/jobs/${jobId}`);
            if (res.ok) {
                const data = await res.json();
                setJobDetails(data.job);
            }
        } catch (error) {
            console.error('Failed to fetch job details:', error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const openSubmitModal = (job: any) => {
        setSelectedJob(job);
        setIsSubmitModalOpen(true);
        setSubmissionMessage(null);
        setSelectedCandidateId('');
        fetchCandidates();
    };

    const handleSubmitCandidate = async () => {
        if (!selectedCandidateId || !selectedJob) return;

        setIsSubmitting(true);
        setSubmissionMessage(null);

        try {
            const res = await fetch('/api/tas/submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    job_id: selectedJob.id,
                    candidate_id: selectedCandidateId
                })
            });

            const data = await res.json();

            if (res.ok) {
                setSubmissionMessage({ type: 'success', text: 'Candidate submitted successfully!' });
                setTimeout(() => {
                    setIsSubmitModalOpen(false);
                    setSubmissionMessage(null);
                }, 2000);
            } else {
                setSubmissionMessage({ type: 'error', text: data.error || 'Failed to submit candidate' });
            }
        } catch (error) {
            setSubmissionMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 relative overflow-hidden font-sans">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none" />

            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-2">
                        Job Marketplace
                    </h1>
                    <p className="text-slate-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Discover high-value opportunities via standard TAS bounties.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="w-full md:w-auto relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-20 group-hover:opacity-40 transition duration-300 blur-sm"></div>
                    <div className="relative flex items-center bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
                        <Search className="ml-4 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search roles, companies..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-80 px-4 py-3 bg-transparent text-white placeholder-slate-500 focus:outline-none"
                        />
                        <button className="p-3 bg-slate-800/50 border-l border-slate-700/50 hover:bg-slate-800 transition-colors">
                            <Filter className="w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {filteredJobs.length === 0 ? (
                        <div className="col-span-full py-20 text-center bg-slate-900/40 rounded-3xl border border-slate-800/50 border-dashed backdrop-blur-sm">
                            <Briefcase className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                            <h3 className="text-xl font-semibold text-slate-300">No jobs found</h3>
                            <p className="text-slate-500 mt-2">Try adjusting your search filters.</p>
                        </div>
                    ) : (
                        filteredJobs.map((job, index) => (
                            <motion.div
                                key={job.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-slate-900/40 hover:bg-slate-800/60 backdrop-blur-xl border border-slate-800/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 flex flex-col h-full"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600 shadow-inner text-lg font-bold text-white">
                                            {job.logo}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white text-lg leading-tight group-hover:text-indigo-400 transition-colors line-clamp-1" title={job.title}>
                                                {job.title}
                                            </h3>
                                            <div className="flex items-center gap-1.5 text-sm text-slate-400 mt-1">
                                                <Building2 className="w-3.5 h-3.5" /> {job.company}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="space-y-3 mb-6 flex-grow">
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300 flex items-center gap-1.5">
                                            <MapPin className="w-3 h-3 text-slate-500" /> {job.location}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300 flex items-center gap-1.5">
                                            <Clock className="w-3 h-3 text-slate-500" /> {job.type}
                                        </span>
                                        <span className="px-2.5 py-1 rounded-lg bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-slate-300 flex items-center gap-1.5">
                                            <DollarSign className="w-3 h-3 text-slate-500" /> {job.salary}
                                        </span>
                                    </div>

                                    {/* Skills Preview */}
                                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-800/50">
                                        {job.skills?.slice(0, 3).map((skill: string) => (
                                            <span key={skill} className="text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded bg-indigo-500/5 text-indigo-400 border border-indigo-500/10">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.skills?.length > 3 && (
                                            <span className="text-[10px] px-2 py-1 text-slate-500">+{job.skills.length - 3}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Footer / Actions */}
                                <div className="mt-auto pt-6 border-t border-slate-800 flex items-center justify-between gap-3">
                                    <div>
                                        <div className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-0.5">Bounty</div>
                                        <div className="text-lg font-bold text-emerald-400 drop-shadow-sm">{job.bounty}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openDetailsModal(job.id)}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700 hover:border-slate-600"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => openSubmitModal(job)}
                                            className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all flex items-center gap-2"
                                        >
                                            Submit <span className="hidden sm:inline">Candidate</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* Job Details Modal */}
            <AnimatePresence>
                {isDetailsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-start justify-between p-6 border-b border-slate-800">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-slate-700 text-xl font-bold text-white shadow-inner">
                                        {jobDetails?.logo || <Building2 />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">{jobDetails?.title}</h2>
                                        <div className="flex items-center gap-2 text-slate-400 mt-1 text-sm">
                                            <Building2 className="w-4 h-4" /> {jobDetails?.company}
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {isLoadingDetails ? (
                                    <div className="flex py-20 justify-center">
                                        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
                                    </div>
                                ) : jobDetails ? (
                                    <div className="space-y-8">
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
                                                <div className="text-sm text-slate-500 mb-1 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Salary</div>
                                                <div className="font-semibold text-white">{jobDetails.salary}</div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60">
                                                <div className="text-sm text-slate-500 mb-1 flex items-center gap-2"><MapPin className="w-4 h-4" /> Location</div>
                                                <div className="font-semibold text-white">{jobDetails.location}</div>
                                            </div>
                                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                                                <div className="text-sm text-emerald-500/80 mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Bounty</div>
                                                <div className="font-bold text-emerald-400">{jobDetails.bounty}</div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                                                <Briefcase className="w-5 h-5 text-indigo-400" /> About the Role
                                            </h3>
                                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                                {jobDetails.description}
                                            </div>
                                        </div>

                                        {/* Requirements / Skills (Dynamic) */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Skills Required</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {jobDetails.skills?.map((skill: string) => (
                                                        <span key={skill} className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700/50 rounded-lg text-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Benefits</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {jobDetails.benefits?.map((benefit: string) => (
                                                        <span key={benefit} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm">
                                                            {benefit}
                                                        </span>
                                                    ))}
                                                    {(!jobDetails.benefits || jobDetails.benefits.length === 0) && (
                                                        <span className="text-slate-500 text-sm italic">No specific benefits listed.</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-slate-500">Failed to load details.</div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsDetailsModalOpen(false)}
                                    className="px-5 py-3 text-slate-400 hover:text-white font-medium"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setIsDetailsModalOpen(false);
                                        openSubmitModal(jobDetails);
                                    }}
                                    className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 transition-all"
                                >
                                    Submit Candidate
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Submit Candidate Modal */}
            <AnimatePresence>
                {isSubmitModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-950 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Submit Candidate</h3>
                                    <p className="text-sm text-slate-400">for {selectedJob?.title}</p>
                                </div>
                                <button onClick={() => setIsSubmitModalOpen(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {submissionMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-sm ${submissionMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                        }`}>
                                    {submissionMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {submissionMessage.text}
                                </motion.div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Select Candidate</label>
                                    <select
                                        value={selectedCandidateId}
                                        onChange={(e) => setSelectedCandidateId(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all custom-select"
                                    >
                                        <option value="">-- Select a candidate --</option>
                                        {candidates.map(candidate => (
                                            <option key={candidate.id} value={candidate.id}>
                                                {candidate.name} ({candidate.role || 'General'})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Submission Cost</span>
                                        <span className="text-white font-bold flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" /> 10 Credits</span>
                                    </div>
                                    <div className="text-xs text-slate-500 border-t border-slate-700/50 pt-2 mt-2">
                                        Credits will be deducted from your balance upon successful submission.
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmitCandidate}
                                    disabled={isSubmitting || !selectedCandidateId}
                                    className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Confirm Submission'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
