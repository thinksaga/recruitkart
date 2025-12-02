'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, User, Briefcase, Star, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApprovalsPage() {
    const router = useRouter();
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                const res = await fetch('/api/decision-maker/approvals');
                if (res.ok) {
                    const data = await res.json();
                    setCandidates(data.candidates);
                }
            } catch (error) {
                console.error('Failed to fetch approvals:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Pending Approvals</h1>
                <p className="text-slate-400">Review and approve candidates recommended for hire.</p>
            </div>

            <div className="space-y-4">
                {candidates.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No candidates pending approval.</p>
                    </div>
                ) : (
                    candidates.map((candidate, index) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-emerald-500/30 transition-colors flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-400">
                                    {candidate.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">{candidate.name}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Briefcase className="w-3 h-3" /> {candidate.role}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-3 h-3 text-amber-500" />
                                            {candidate.interviewSummary.length} Rounds Passed
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => router.push(`/dashboard/decision-maker/approvals/${candidate.id}`)}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                >
                                    Review & Decide
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
