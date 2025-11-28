'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Clock, CheckCircle, XCircle, AlertCircle, Building, MapPin, DollarSign, Calendar, User, Mail, Phone, Briefcase, TrendingUp, FileText, Download, ExternalLink, MoreVertical, ChevronRight, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TASLayout from '@/components/dashboard/TASLayout';

interface Submission {
    id: string;
    status: string;
    createdAt: string;
    lockedUntil: string | null;
    acceptedAt: string | null;
    joinedAt: string | null;
    job: {
        id: string;
        title: string;
        location: string;
        salaryRange: string;
        company: string;
    };
    candidate: {
        id: string;
        name: string;
        email: string;
        phone: string;
    };
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function TASSubmissionsPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);
    const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

    const fetchSubmissions = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });

            if (statusFilter) params.append('status', statusFilter);

            const response = await fetch(`/api/tas/submissions?${params}`);
            const data = await response.json();

            if (response.ok) {
                setSubmissions(data.submissions);
                setPagination(data.pagination);
                setCurrentPage(page);
            } else {
                alert(data.error || 'Failed to fetch submissions');
            }
        } catch (error) {
            alert('Failed to fetch submissions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, [statusFilter]);

    const handlePageChange = (page: number) => {
        fetchSubmissions(page);
    };

    const getStatusConfig = (status: string) => {
        const configs: Record<string, { icon: any; color: string; bg: string; label: string }> = {
            'PENDING_CONSENT': { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Pending Consent' },
            'ACTIVE': { icon: CheckCircle, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Active' },
            'SCREENING': { icon: Eye, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20', label: 'Screening' },
            'INTERVIEWING': { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', label: 'Interviewing' },
            'OFFER_EXTENDED': { icon: Award, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', label: 'Offer Extended' },
            'HIRED': { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Hired' },
            'REJECTED_BY_COMPANY': { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Rejected' },
            'REJECTED_BY_CANDIDATE': { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Declined' },
            'DROPPED_OUT': { icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/20', label: 'Dropped Out' },
        };
        return configs[status] || configs['PENDING_CONSENT'];
    };

    const filteredSubmissions = submissions.filter(submission =>
        searchTerm === '' ||
        submission.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.job.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <TASLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/20">
                                    <FileText className="w-6 h-6 text-white" />
                                </div>
                                My Submissions
                            </h1>
                            <p className="text-slate-400 mt-2">Track and manage all your candidate submissions</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all flex items-center gap-2">
                                <Download className="w-4 h-4" />
                                <span className="hidden md:inline">Export</span>
                            </button>
                            <button className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20">
                                <TrendingUp className="w-4 h-4" />
                                <span>Analytics</span>
                            </button>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 border border-slate-800 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                    <FileText className="w-5 h-5 text-blue-400" />
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm">Total</p>
                            <p className="text-2xl font-bold text-white">{pagination?.total || 0}</p>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="bg-gradient-to-br from-yellow-500/10 via-slate-900 to-slate-900 border border-slate-800 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                    <Clock className="w-5 h-5 text-yellow-400" />
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm">Pending</p>
                            <p className="text-2xl font-bold text-white">
                                {submissions.filter(s => s.status === 'PENDING_CONSENT').length}
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="bg-gradient-to-br from-orange-500/10 via-slate-900 to-slate-900 border border-slate-800 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-orange-400" />
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm">In Progress</p>
                            <p className="text-2xl font-bold text-white">
                                {submissions.filter(s => ['ACTIVE', 'SCREENING', 'INTERVIEWING'].includes(s.status)).length}
                            </p>
                        </motion.div>
                        <motion.div
                            whileHover={{ y: -2 }}
                            className="bg-gradient-to-br from-green-500/10 via-slate-900 to-slate-900 border border-slate-800 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm">Hired</p>
                            <p className="text-2xl font-bold text-white">
                                {submissions.filter(s => s.status === 'HIRED').length}
                            </p>
                        </motion.div>
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
                                placeholder="Search by job, candidate, or company..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-6 py-3.5 border border-slate-700 rounded-xl font-medium transition-all lg:w-auto flex items-center justify-center gap-2 ${
                                showFilters 
                                    ? 'bg-purple-500 text-white border-purple-500' 
                                    : 'bg-slate-800/50 text-white hover:bg-slate-800'
                            }`}
                        >
                            <Filter className="h-5 w-5" />
                            <span>Filters</span>
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                            <AlertCircle className="w-4 h-4 text-purple-500" />
                                            Status
                                        </label>
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        >
                                            <option value="">All statuses</option>
                                            <option value="PENDING_CONSENT">Pending Consent</option>
                                            <option value="ACTIVE">Active</option>
                                            <option value="SCREENING">Screening</option>
                                            <option value="INTERVIEWING">Interviewing</option>
                                            <option value="OFFER_EXTENDED">Offer Extended</option>
                                            <option value="HIRED">Hired</option>
                                            <option value="REJECTED_BY_COMPANY">Rejected</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            Date Range
                                        </label>
                                        <select className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all">
                                            <option>All time</option>
                                            <option>Last 7 days</option>
                                            <option>Last 30 days</option>
                                            <option>Last 90 days</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                            <TrendingUp className="w-4 h-4 text-green-500" />
                                            Sort By
                                        </label>
                                        <select className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all">
                                            <option>Most Recent</option>
                                            <option>Oldest First</option>
                                            <option>By Status</option>
                                        </select>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Submissions Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-6 bg-slate-800 rounded w-1/3"></div>
                                    <div className="h-8 bg-slate-800 rounded-full w-24"></div>
                                </div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-800 rounded w-full"></div>
                                    <div className="h-4 bg-slate-800 rounded w-2/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredSubmissions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center"
                    >
                        <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No submissions found</h3>
                        <p className="text-slate-400">Try adjusting your filters or submit candidates to jobs</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4">
                            {filteredSubmissions.map((submission, index) => {
                                const statusConfig = getStatusConfig(submission.status);
                                const StatusIcon = statusConfig.icon;

                                return (
                                    <motion.div
                                        key={submission.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -2 }}
                                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-purple-500/30 transition-all cursor-pointer group"
                                        onClick={() => setSelectedSubmission(submission)}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-slate-800/50 border border-slate-700 rounded-xl group-hover:border-purple-500/30 transition-all">
                                                        <User className="w-6 h-6 text-purple-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                                                                {submission.candidate.name}
                                                            </h3>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.color}`}>
                                                                <StatusIcon className="w-3 h-3 inline mr-1" />
                                                                {statusConfig.label}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                                                                <Briefcase className="w-4 h-4" />
                                                                <span className="font-medium text-white">{submission.job.title}</span>
                                                                <span>at</span>
                                                                <Building className="w-4 h-4" />
                                                                <span>{submission.job.company}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-slate-400 text-sm">
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-4 h-4" />
                                                                    <span>{submission.job.location}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <DollarSign className="w-4 h-4" />
                                                                    <span>{submission.job.salaryRange}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="w-4 h-4" />
                                                                    <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                                    <Eye className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                                                </button>
                                                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                                                    <MoreVertical className="w-5 h-5 text-slate-400 hover:text-white transition-colors" />
                                                </button>
                                                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-purple-500 transition-colors" />
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-xl font-medium transition-all ${
                                                page === currentPage
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/20'
                                                    : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === pagination.totalPages}
                                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </TASLayout>
    );
}
