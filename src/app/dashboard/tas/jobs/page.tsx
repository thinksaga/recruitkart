'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, DollarSign, Users, Clock, Star, Filter, X, Building, Calendar, TrendingUp, Zap, CheckCircle, ArrowRight, ExternalLink, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TASLayout from '@/components/dashboard/TASLayout';

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    workMode: string;
    salaryRange: string;
    skills: string[];
    experienceRequired: string;
    company: {
        id: string;
        name: string;
        logo: string;
    };
    submissionCount: number;
    hasSubmitted: boolean;
    submissionStatus: string | null;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function TASJobsPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [workModeFilter, setWorkModeFilter] = useState('');
    const [minSalary, setMinSalary] = useState('');
    const [maxSalary, setMaxSalary] = useState('');
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    const fetchJobs = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '12',
            });

            if (searchTerm) params.append('search', searchTerm);
            if (locationFilter) params.append('location', locationFilter);
            if (workModeFilter) params.append('workMode', workModeFilter);
            if (minSalary) params.append('minSalary', minSalary);
            if (maxSalary) params.append('maxSalary', maxSalary);

            const response = await fetch(`/api/tas/jobs?${params}`);
            const data = await response.json();

            if (response.ok) {
                setJobs(data.jobs);
                setPagination(data.pagination);
                setCurrentPage(page);
            } else {
                alert(data.error || 'Failed to fetch jobs');
            }
        } catch (error) {
            alert('Failed to fetch jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = () => {
        fetchJobs(1);
    };

    const handlePageChange = (page: number) => {
        fetchJobs(page);
    };

    const handleSubmitToJob = async (jobId: string, candidateId: string, notes: string) => {
        setSubmitting(true);
        try {
            const response = await fetch('/api/tas/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId,
                    candidateId,
                    notes,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Submission created successfully!');
                // Refresh jobs to update submission status
                fetchJobs(currentPage);
                setSelectedJob(null);
            } else {
                alert(data.error || 'Failed to submit');
            }
        } catch (error) {
            alert('Failed to submit');
        } finally {
            setSubmitting(false);
        }
    };

    const getSubmissionStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING_CONSENT': return 'bg-yellow-100 text-yellow-800';
            case 'ACTIVE': return 'bg-blue-100 text-blue-800';
            case 'SCREENING': return 'bg-purple-100 text-purple-800';
            case 'INTERVIEWING': return 'bg-orange-100 text-orange-800';
            case 'OFFER_EXTENDED': return 'bg-green-100 text-green-800';
            case 'HIRED': return 'bg-green-100 text-green-800';
            case 'REJECTED_BY_COMPANY': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <TASLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                                    <Briefcase className="w-6 h-6 text-white" />
                                </div>
                                Job Marketplace
                            </h1>
                            <p className="text-slate-400 mt-2">Discover and submit candidates to the best opportunities</p>
                        </div>
                        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all">
                            <Bookmark className="w-4 h-4" />
                            Saved Jobs
                        </button>
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search jobs, skills, companies..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-3.5 border border-slate-700 rounded-xl font-medium transition-all lg:w-auto flex items-center justify-center gap-2 ${showFilters
                                    ? 'bg-emerald-500 text-white border-emerald-500'
                                    : 'bg-slate-800/50 text-white hover:bg-slate-800'
                                }`}
                        >
                            <Filter className="h-5 w-5" />
                            <span>Filters</span>
                        </button>
                        <button
                            onClick={handleSearch}
                            className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            <Search className="h-5 w-5" />
                            <span>Search Jobs</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="mt-6 pt-6 border-t border-slate-800"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                            <MapPin className="w-4 h-4 text-emerald-500" />
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Bangalore"
                                            value={locationFilter}
                                            onChange={(e) => setLocationFilter(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                            <Briefcase className="w-4 h-4 text-blue-500" />
                                            Work Mode
                                        </label>
                                        <select
                                            value={workModeFilter}
                                            onChange={(e) => setWorkModeFilter(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        >
                                            <option value="">All modes</option>
                                            <option value="REMOTE">Remote</option>
                                            <option value="HYBRID">Hybrid</option>
                                            <option value="ONSITE">On-site</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                            <DollarSign className="w-4 h-4 text-green-500" />
                                            Min Salary (₹)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="50,000"
                                            value={minSalary}
                                            onChange={(e) => setMinSalary(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                            <DollarSign className="w-4 h-4 text-green-500" />
                                            Max Salary (₹)
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="2,00,000"
                                            value={maxSalary}
                                            onChange={(e) => setMaxSalary(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Jobs Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow animate-pulse p-6">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                        ))}
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Try adjusting your search criteria or check back later.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {jobs.map((job) => (
                                <motion.div
                                    key={job.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow h-full">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">{job.title}</h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{job.company.name}</p>
                                                </div>
                                                {job.hasSubmitted && (
                                                    <span className={`px-2 py-1 text-xs rounded-full ${getSubmissionStatusColor(job.submissionStatus || '')}`}>
                                                        {job.submissionStatus?.replace('_', ' ').toLowerCase()}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <MapPin className="h-4 w-4 mr-2" />
                                                    {job.location}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <DollarSign className="h-4 w-4 mr-2" />
                                                    {job.salaryRange}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <Briefcase className="h-4 w-4 mr-2" />
                                                    {job.experienceRequired}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <Users className="h-4 w-4 mr-2" />
                                                    {job.submissionCount} applicants
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {job.skills.slice(0, 3).map((skill) => (
                                                    <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {job.skills.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded">
                                                        +{job.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => setSelectedJob(job)}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex justify-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Previous
                                </button>
                                {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                                    const page = i + 1;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-4 py-2 border rounded-md ${page === currentPage
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.totalPages}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Job Details Modal */}
                {selectedJob && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedJob.title}</h2>
                                    <button
                                        onClick={() => setSelectedJob(null)}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Company</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.company.name}</p>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.description}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Location</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.location}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Work Mode</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.workMode}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Salary Range</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.salaryRange}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Experience Required</h4>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{selectedJob.experienceRequired}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Required Skills</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {selectedJob.skills.map((skill) => (
                                                <span key={skill} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {selectedJob.hasSubmitted ? (
                                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                You have already submitted to this job.
                                                Status: <span className={`px-2 py-1 text-xs rounded-full ${getSubmissionStatusColor(selectedJob.submissionStatus || '')}`}>
                                                    {selectedJob.submissionStatus?.replace('_', ' ').toLowerCase()}
                                                </span>
                                            </p>
                                        </div>
                                    ) : (
                                        <JobSubmissionForm
                                            job={selectedJob}
                                            onSubmit={handleSubmitToJob}
                                            submitting={submitting}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TASLayout>
    );
}

function JobSubmissionForm({
    job,
    onSubmit,
    submitting
}: {
    job: Job;
    onSubmit: (jobId: string, candidateId: string, notes: string) => void;
    submitting: boolean;
}) {
    const [candidateId, setCandidateId] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!candidateId.trim()) {
            alert('Please enter a candidate ID');
            return;
        }
        onSubmit(job.id, candidateId.trim(), notes);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Candidate ID</label>
                <input
                    type="text"
                    placeholder="Enter candidate ID"
                    value={candidateId}
                    onChange={(e) => setCandidateId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                />
                <p className="text-xs text-gray-500 mt-1">
                    Enter the ID of the candidate you want to submit for this position
                </p>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (Optional)</label>
                <textarea
                    placeholder="Any additional notes about this candidate..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
            </div>
            <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {submitting ? 'Submitting...' : 'Submit Candidate'}
            </button>
        </form>
    );
}