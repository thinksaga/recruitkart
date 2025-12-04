'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Briefcase, MapPin, DollarSign, Clock, Building2, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';

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

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Job Marketplace</h1>
                    <p className="text-slate-400">Find and submit candidates to open roles.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search jobs by title, company, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                />
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
                {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No jobs found matching your search.</p>
                    </div>
                ) : (
                    filteredJobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-orange-500/30 transition-colors group"
                        >
                            <div className="flex items-start justify-between cursor-pointer" onClick={() => openDetailsModal(job.id)}>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400">
                                        {job.logo}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1">
                                            <Building2 className="w-4 h-4" />
                                            {job.company}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-emerald-400 font-semibold">{job.bounty} Bounty</div>
                                    <div className="text-slate-500 text-sm mt-1">Posted {job.posted}</div>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-slate-500" />
                                    {job.location}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-slate-500" />
                                    {job.salary}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    {job.type}
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
                                <div className="flex gap-2">
                                    {job.skills.map((skill: string) => (
                                        <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openDetailsModal(job.id)}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => openSubmitModal(job)}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Submit Candidate
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Job Details Modal */}
            <AnimatePresence>
                {isDetailsModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Job Details</h3>
                                <button onClick={() => setIsDetailsModalOpen(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {isLoadingDetails ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                                </div>
                            ) : jobDetails ? (
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-16 h-16 rounded-lg bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-400">
                                            {jobDetails.logo}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white">{jobDetails.title}</h2>
                                            <div className="flex items-center gap-2 text-slate-400 mt-1">
                                                <Building2 className="w-4 h-4" />
                                                {jobDetails.company}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-slate-800/50">
                                        <div>
                                            <div className="text-sm text-slate-400 mb-1">Salary</div>
                                            <div className="font-medium text-white">{jobDetails.salary}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400 mb-1">Location</div>
                                            <div className="font-medium text-white">{jobDetails.location}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-400 mb-1">Bounty</div>
                                            <div className="font-medium text-emerald-400">{jobDetails.bounty}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Description</h4>
                                        <p className="text-slate-300 leading-relaxed">{jobDetails.description}</p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-semibold text-white mb-2">Requirements</h4>
                                        <ul className="list-disc list-inside space-y-1 text-slate-300">
                                            {jobDetails.requirements.map((req: string, i: number) => (
                                                <li key={i}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="pt-6 border-t border-slate-800 flex justify-end">
                                        <button
                                            onClick={() => {
                                                setIsDetailsModalOpen(false);
                                                openSubmitModal(jobDetails);
                                            }}
                                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors"
                                        >
                                            Submit Candidate
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12 text-slate-500">
                                    Failed to load job details.
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Submit Candidate Modal */}
            <AnimatePresence>
                {isSubmitModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
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
                                <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-sm ${submissionMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}>
                                    {submissionMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {submissionMessage.text}
                                </div>
                            )}

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Select Candidate</label>
                                    <select
                                        value={selectedCandidateId}
                                        onChange={(e) => setSelectedCandidateId(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                    >
                                        <option value="">-- Select a candidate --</option>
                                        {candidates.map(candidate => (
                                            <option key={candidate.id} value={candidate.id}>
                                                {candidate.name} ({candidate.role})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-800">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Submission Cost</span>
                                        <span className="text-white">10 Credits</span>
                                    </div>
                                    <div className="text-xs text-slate-500">
                                        Credits will be deducted from your balance upon successful submission.
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmitCandidate}
                                    disabled={isSubmitting || !selectedCandidateId}
                                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
