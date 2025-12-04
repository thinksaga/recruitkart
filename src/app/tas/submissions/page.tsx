'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MoreVertical, FileText, CheckCircle, XCircle, Clock, AlertCircle, Loader2, Send } from 'lucide-react';

export default function TASSubmissionsPage() {
    const [activeTab, setActiveTab] = useState('active');
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const res = await fetch('/api/tas/submissions');
                if (res.ok) {
                    const data = await res.json();
                    setSubmissions(data.submissions);
                }
            } catch (error) {
                console.error('Failed to fetch submissions:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubmissions();
    }, []);

    const filteredSubmissions = submissions.filter(sub => {
        if (activeTab === 'all') return true;
        if (activeTab === 'active') return ['PENDING_CONSENT', 'LOCKED', 'ACTIVE', 'INTERVIEWING'].includes(sub.status);
        if (activeTab === 'archived') return ['REJECTED_BY_CANDIDATE', 'EXPIRED', 'HIRED'].includes(sub.status);
        return true;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'HIRED': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
            case 'REJECTED_BY_CANDIDATE': return 'text-red-500 bg-red-500/10 border-red-500/20';
            case 'INTERVIEWING': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
            default: return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        }
    };

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
                    <h1 className="text-2xl font-bold text-white mb-2">My Submissions</h1>
                    <p className="text-slate-400">Track the status of your candidate submissions.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800">
                {['active', 'archived', 'all'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-3 text-sm font-medium capitalize transition-colors relative ${activeTab === tab ? 'text-orange-500' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {tab} Submissions
                        {activeTab === tab && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
                {filteredSubmissions.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No submissions found.</p>
                    </div>
                ) : (
                    filteredSubmissions.map((submission, index) => (
                        <motion.div
                            key={submission.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-orange-500/30 transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-lg font-bold text-slate-400">
                                        {submission.candidate.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{submission.candidate}</h3>
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <span>{submission.job}</span>
                                            <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                            <span>{submission.company}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(submission.status)}`}>
                                        {submission.status}
                                    </div>
                                    <button className="text-slate-500 hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-6 flex items-center justify-between text-sm text-slate-400 pt-4 border-t border-slate-800">
                                <div className="flex gap-6">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-500" />
                                        Submitted: {submission.submitted}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-slate-500" />
                                        Stage: {submission.stage}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    Feedback: <span className="text-white">{submission.feedback}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
