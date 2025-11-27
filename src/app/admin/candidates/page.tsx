'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Filter,
    Ban,
    CheckCircle,
    MapPin,
    Briefcase,
    Calendar,
    FileText,
    Video,
    Download,
    AlertTriangle,
    X,
} from 'lucide-react';

interface Candidate {
    id: string;
    email: string;
    phone: string;
    full_name: string;
    personal_details: any;
    work_history: any[];
    education_history: any[];
    skills_primary: string[];
    skills_secondary: string[];
    video_resume_url: string | null;
    is_blacklisted: boolean;
    created_at: string;
    submissions: Array<{
        id: string;
        status: string;
        created_at: string;
        job: {
            id: string;
            title: string;
            organization: {
                display_name: string;
            };
        };
    }>;
    _count: {
        submissions: number;
    };
}

export default function CandidatesPage() {
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [skillFilter, setSkillFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [blacklistFilter, setBlacklistFilter] = useState<string>('all');
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0,
    });

    useEffect(() => {
        fetchCandidates();
    }, [search, skillFilter, locationFilter, blacklistFilter, pagination.page]);

    const fetchCandidates = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: pagination.page.toString(),
                limit: pagination.limit.toString(),
            });

            if (search) params.append('search', search);
            if (skillFilter) params.append('skill', skillFilter);
            if (locationFilter) params.append('location', locationFilter);
            if (blacklistFilter !== 'all') params.append('blacklist', blacklistFilter);

            const response = await fetch(`/api/admin/candidates?${params}`);
            const data = await response.json();

            if (response.ok) {
                setCandidates(data.candidates);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching candidates:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBlacklist = async (candidateId: string, blacklisted: boolean, reason?: string) => {
        try {
            const response = await fetch('/api/admin/candidates', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    candidateId,
                    blacklisted,
                    blacklist_reason: reason,
                }),
            });

            if (response.ok) {
                fetchCandidates();
                setShowDetailsModal(false);
            }
        } catch (error) {
            console.error('Error updating candidate:', error);
        }
    };

    const exportCandidateData = (candidate: Candidate) => {
        const data = {
            id: candidate.id,
            email: candidate.email,
            phone: candidate.phone,
            full_name: candidate.full_name,
            personal_details: candidate.personal_details,
            work_history: candidate.work_history,
            education_history: candidate.education_history,
            skills_primary: candidate.skills_primary,
            skills_secondary: candidate.skills_secondary,
            submissions_count: candidate._count.submissions,
            created_at: candidate.created_at,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `candidate_${candidate.id}_data.json`;
        a.click();
    };

    const viewDetails = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setShowDetailsModal(true);
    };

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <h1 className="text-3xl font-bold text-white mb-2">Candidates Management</h1>
                    <p className="text-slate-400">
                        View and manage all candidates, their profiles, and submissions
                    </p>
                </motion.div>

                {/* Filters */}
                <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-400">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Email or phone..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-400">Skill</label>
                            <input
                                type="text"
                                value={skillFilter}
                                onChange={(e) => setSkillFilter(e.target.value)}
                                placeholder="e.g., React, Python..."
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-400">Location</label>
                            <input
                                type="text"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                placeholder="City..."
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-400">Blacklist Status</label>
                            <select
                                value={blacklistFilter}
                                onChange={(e) => setBlacklistFilter(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                            >
                                <option value="all">All Candidates</option>
                                <option value="false">Active Only</option>
                                <option value="true">Blacklisted Only</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="p-6 rounded-2xl border border-blue-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total Candidates</p>
                                <p className="text-2xl font-bold">{pagination.total}</p>
                            </div>
                            <Users className="w-8 h-8 text-blue-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-emerald-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Active</p>
                                <p className="text-2xl font-bold text-emerald-400">
                                    {candidates.filter((c) => !c.is_blacklisted).length}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl border border-red-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Blacklisted</p>
                                <p className="text-2xl font-bold text-red-400">
                                    {candidates.filter((c) => c.is_blacklisted).length}
                                </p>
                            </div>
                            <Ban className="w-8 h-8 text-red-500" />
                        </div>
                    </div>
                    <div className="p-6 rounded-2xl border border-purple-500/20 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400 mb-1">Current Page</p>
                                <p className="text-2xl font-bold text-purple-400">
                                    {pagination.page} / {pagination.totalPages}
                                </p>
                            </div>
                            <Filter className="w-8 h-8 text-purple-500" />
                        </div>
                    </div>
                </div>

                {/* Candidates Table */}
                <div className="bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-900/80 border-b border-slate-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Candidate
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Location
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Skills
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Submissions
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center">
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : candidates.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                            No candidates found
                                        </td>
                                    </tr>
                                ) : (
                                    candidates.map((candidate) => (
                                        <tr key={candidate.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-medium text-white">{candidate.email}</p>
                                                    <p className="text-sm text-slate-400">{candidate.phone}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center text-sm text-slate-200">
                                                    <MapPin className="w-4 h-4 mr-1 text-slate-400" />
                                                    {candidate.personal_details?.current_location || 'N/A'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1">
                                                    {candidate.skills_primary?.slice(0, 3).map((skill: string, idx: number) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {candidate.skills_primary?.length > 3 && (
                                                        <span className="px-2 py-1 bg-slate-500/20 text-slate-400 text-xs rounded border border-slate-500/30">
                                                            +{candidate.skills_primary.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-200">{candidate._count.submissions}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {candidate.is_blacklisted ? (
                                                    <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full flex items-center gap-1 w-fit border border-red-500/30">
                                                        <Ban className="w-3 h-3" />
                                                        Blacklisted
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full flex items-center gap-1 w-fit border border-emerald-500/30">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => viewDetails(candidate)}
                                                    className="text-emerald-400 hover:text-emerald-300 transition-colors text-sm font-medium"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between">
                        <p className="text-sm text-slate-400">
                            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}{' '}
                            candidates
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                disabled={pagination.page === 1}
                                className="px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                disabled={pagination.page >= pagination.totalPages}
                                className="px-4 py-2 border border-slate-800 rounded-lg bg-slate-900 text-slate-200 hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details Modal */}
                {showDetailsModal && selectedCandidate && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-white">Candidate Details</h2>
                                <button
                                    onClick={() => setShowDetailsModal(false)}
                                    className="text-slate-400 hover:text-slate-200"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Basic Info */}
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Basic Information</h3>
                                    <div className="grid grid-cols-2 gap-4 bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                        <div>
                                            <p className="text-sm text-slate-400">Email</p>
                                            <p className="font-medium text-white">{selectedCandidate.email}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">Phone</p>
                                            <p className="font-medium text-white">{selectedCandidate.phone || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">Current Location</p>
                                            <p className="font-medium text-white">{selectedCandidate.personal_details?.current_location || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">Joined</p>
                                            <p className="font-medium text-white">
                                                {new Date(selectedCandidate.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Primary Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedCandidate.skills_primary?.map((skill: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full border border-blue-500/30"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                    {selectedCandidate.skills_secondary?.length > 0 && (
                                        <>
                                            <h3 className="font-semibold text-white mb-3 mt-4">Secondary Skills</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedCandidate.skills_secondary?.map((skill: string, idx: number) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-slate-500/20 text-slate-400 text-sm rounded-full border border-slate-500/30"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Preferred Locations */}
                                {selectedCandidate.personal_details?.preferred_locations?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-white mb-3">Preferred Locations</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedCandidate.personal_details.preferred_locations.map((loc: string, idx: number) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-full flex items-center gap-1 border border-emerald-500/30"
                                                >
                                                    <MapPin className="w-3 h-3" />
                                                    {loc}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Work Experience */}
                                {selectedCandidate.work_history?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-white mb-3">Work Experience</h3>
                                        <div className="space-y-3">
                                            {selectedCandidate.work_history.map((exp: any, idx: number) => (
                                                <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                    <p className="font-medium text-white">{exp.role || exp.position}</p>
                                                    <p className="text-sm text-slate-400">{exp.company}</p>
                                                    <p className="text-sm text-slate-500">
                                                        {exp.start} - {exp.end || 'Present'}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Education */}
                                {selectedCandidate.education_history?.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-white mb-3">Education</h3>
                                        <div className="space-y-3">
                                            {selectedCandidate.education_history.map((edu: any, idx: number) => (
                                                <div key={idx} className="bg-slate-900/50 p-4 rounded-lg border border-slate-800">
                                                    <p className="font-medium text-white">{edu.degree}</p>
                                                    <p className="text-sm text-slate-400">{edu.institution}</p>
                                                    <p className="text-sm text-slate-500">{edu.year}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Recent Submissions */}
                                <div>
                                    <h3 className="font-semibold text-white mb-3">Recent Submissions</h3>
                                    <div className="space-y-2">
                                        {selectedCandidate.submissions.map((sub) => (
                                            <div key={sub.id} className="bg-slate-900/50 p-3 rounded-lg flex items-center justify-between border border-slate-800">
                                                <div>
                                                    <p className="font-medium text-white">{sub.job.title}</p>
                                                    <p className="text-sm text-slate-400">{sub.job.organization.display_name}</p>
                                                </div>
                                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">
                                                    {sub.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Resume Links */}
                                <div className="flex gap-4">
                                    {selectedCandidate.video_resume_url && (
                                        <a
                                            href={selectedCandidate.video_resume_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                        >
                                            <Video className="w-4 h-4" />
                                            Watch Video Resume
                                        </a>
                                    )}
                                    <button
                                        onClick={() => exportCandidateData(selectedCandidate)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-all"
                                    >
                                        <Download className="w-4 h-4" />
                                        Export Data (DPDP)
                                    </button>
                                </div>

                                {/* Blacklist Section */}
                                <div className="border-t border-slate-800 pt-6">
                                    {selectedCandidate.is_blacklisted ? (
                                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                                            <div className="flex items-start gap-3 mb-4">
                                                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-red-200">This candidate is blacklisted</p>
                                                    <p className="text-sm text-red-300 mt-1">
                                                        Candidate has been marked as blacklisted
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => toggleBlacklist(selectedCandidate.id, false)}
                                                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                                            >
                                                Remove from Blacklist
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                const reason = prompt('Enter reason for blacklisting:');
                                                if (reason) {
                                                    toggleBlacklist(selectedCandidate.id, true, reason);
                                                }
                                            }}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2"
                                        >
                                            <Ban className="w-4 h-4" />
                                            Blacklist Candidate
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    );
}
