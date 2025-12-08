'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Filter, Briefcase, Users, MoreVertical,
    MapPin, DollarSign, Loader2, ArrowRight, TrendingUp,
    Clock, CheckCircle, XCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CompanyJobsPage() {
    const router = useRouter();
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await fetch('/api/company/jobs');
                if (res.ok) {
                    const data = await res.json();
                    const jobsList = Array.isArray(data) ? data : (data.jobs || []);
                    setJobs(jobsList);
                }
            } catch (error) {
                console.error('Failed to fetch jobs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || job.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate KPI Stats
    const stats = {
        total: jobs.length,
        active: jobs.filter(j => j.status === 'OPEN').length,
        candidates: jobs.reduce((acc, job) => acc + (job.candidates || job._count?.submissions || 0), 0),
        filled: jobs.filter(j => j.status === 'FILLED' || j.status === 'HIRED').length
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-8 min-h-screen">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Job Postings</h1>
                    <p className="text-slate-400">Manage your active job listings and track candidates.</p>
                </div>
                <button
                    onClick={() => router.push('/dashboard/company/jobs/new')}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-rose-500/20 font-medium transform hover:scale-[1.02]"
                >
                    <Plus className="w-5 h-5" />
                    Post New Job
                </button>
            </div>

            {/* KPI Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total Jobs"
                    value={stats.total}
                    icon={Briefcase}
                    color="text-blue-400"
                    bg="bg-blue-500/10"
                    border="border-blue-500/20"
                />
                <StatCard
                    label="Active Jobs"
                    value={stats.active}
                    icon={TrendingUp}
                    color="text-emerald-400"
                    bg="bg-emerald-500/10"
                    border="border-emerald-500/20"
                />
                <StatCard
                    label="Total Candidates"
                    value={stats.candidates}
                    icon={Users}
                    color="text-violet-400"
                    bg="bg-violet-500/10"
                    border="border-violet-500/20"
                />
                <StatCard
                    label="Roles Filled"
                    value={stats.filled}
                    icon={CheckCircle}
                    color="text-rose-400"
                    bg="bg-rose-500/10"
                    border="border-rose-500/20"
                />
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-slate-900/40 p-2 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by title, department, or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-transparent text-white focus:outline-none placeholder:text-slate-600"
                    />
                </div>
                <div className="flex gap-2 p-1 overflow-x-auto">
                    {['ALL', 'OPEN', 'DRAFT', 'CLOSED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${statusFilter === status
                                    ? 'bg-slate-800 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                        >
                            {status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Jobs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {filteredJobs.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-20 text-center text-slate-500 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800"
                        >
                            <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
                            <p className="text-lg">No jobs found matching your filters.</p>
                            <button
                                onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                                className="mt-4 text-emerald-400 hover:text-emerald-300 text-sm font-medium"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    ) : (
                        filteredJobs.map((job, index) => (
                            <JobCard key={job.id} job={job} index={index} router={router} />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, color, bg, border }: any) {
    return (
        <div className={`p-4 rounded-2xl bg-slate-900/40 border ${border} backdrop-blur-sm`}>
            <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg ${bg}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <span className="text-slate-400 text-sm font-medium">{label}</span>
            </div>
            <div className="text-2xl font-bold text-white pl-1">{value}</div>
        </div>
    );
}

function JobCard({ job, index, router }: any) {
    const statusColors: any = {
        OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        DRAFT: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        CLOSED: 'bg-red-500/10 text-red-400 border-red-500/20',
        FILLED: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            onClick={() => router.push(`/dashboard/company/jobs/${job.id}`)}
            className="group relative flex flex-col p-6 rounded-2xl bg-gradient-to-b from-slate-900/60 to-slate-900/40 border border-slate-800/60 hover:border-indigo-500/30 cursor-pointer backdrop-blur-md transition-all shadow-xl shadow-black/20"
        >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="p-2 bg-slate-800/50 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center text-xl font-bold text-white shadow-inner">
                    {job.title.charAt(0)}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {job.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-1">{job.department || 'General'}</p>
                </div>
            </div>

            <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {job.location || 'Remote'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <DollarSign className="w-4 h-4 text-slate-500" />
                    {job.salary || 'Not disclosed'}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    {job.type ? job.type.replace('_', ' ') : 'Full Time'}
                </div>
            </div>

            <div className="pt-4 mt-auto border-t border-slate-800/50 flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[job.status] || statusColors.DRAFT}`}>
                    {job.status}
                </span>

                <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Users className="w-4 h-4 text-indigo-400" />
                    {job.candidates || job._count?.submissions || 0}
                    <span className="text-slate-500 font-normal">Candidates</span>
                </div>
            </div>
        </motion.div>
    );
}
