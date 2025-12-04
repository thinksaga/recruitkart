'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, User, Briefcase, Calendar, FileText, Loader2, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ApprovalDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params); // This is the submission ID
    const [candidate, setCandidate] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [decisionNotes, setDecisionNotes] = useState('');

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                // Reusing company candidate details API which takes submission ID
                const res = await fetch(`/api/company/candidates/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCandidate(data.candidate);
                }
            } catch (error) {
                console.error('Failed to fetch details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const handleDecision = async (decision: 'HIRE' | 'REJECT') => {
        if (!confirm(`Are you sure you want to ${decision} this candidate?`)) return;

        setIsSubmitting(true);
        try {
            const res = await fetch('/api/decision-maker/approvals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    submissionId: id,
                    decision,
                    notes: decisionNotes
                })
            });

            if (res.ok) {
                router.push('/dashboard/decision-maker/approvals');
            } else {
                alert('Failed to submit decision');
            }
        } catch (error) {
            console.error('Error submitting decision:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!candidate) {
        return <div className="p-8 text-slate-500">Candidate not found</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Approvals
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Candidate Profile */}
                <div className="col-span-2 space-y-8">
                    <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400">
                                {candidate.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">{candidate.name}</h1>
                                <p className="text-slate-400 text-lg">Recommended for <span className="text-emerald-400">{candidate.role}</span></p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                                <div className="text-sm text-slate-500 mb-1">Experience</div>
                                <div className="text-white font-medium flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-emerald-500" />
                                    {candidate.experience} Years
                                </div>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-800">
                                <div className="text-sm text-slate-500 mb-1">Expected Salary</div>
                                <div className="text-white font-medium flex items-center gap-2">
                                    <DollarSign className="w-4 h-4 text-emerald-500" />
                                    {candidate.salary || 'Not specified'}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-medium text-slate-400 mb-3">Interview Performance</h3>
                                <div className="space-y-3">
                                    {candidate.interviews.map((int: any, idx: number) => (
                                        <div key={idx} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                                            <div>
                                                <div className="font-medium text-white">{int.round} Round</div>
                                                <div className="text-xs text-slate-500">{int.date}</div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {int.feedback && (
                                                    <div className="text-sm text-slate-300 italic">"{int.feedback.notes}"</div>
                                                )}
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${int.outcome === 'PASSED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                                                    }`}>
                                                    {int.outcome}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Action Panel */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 sticky top-8">
                        <h2 className="text-xl font-bold text-white mb-6">Final Decision</h2>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-slate-400 mb-2">Decision Notes</label>
                            <textarea
                                value={decisionNotes}
                                onChange={(e) => setDecisionNotes(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                                placeholder="Add any notes regarding the offer or rejection..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => handleDecision('REJECT')}
                                disabled={isSubmitting}
                                className="px-4 py-3 bg-slate-800 hover:bg-red-900/20 hover:text-red-400 text-slate-300 rounded-xl font-medium transition-colors flex flex-col items-center justify-center gap-2 border border-transparent hover:border-red-500/30"
                            >
                                <XCircle className="w-6 h-6" />
                                Reject
                            </button>
                            <button
                                onClick={() => handleDecision('HIRE')}
                                disabled={isSubmitting}
                                className="px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition-colors flex flex-col items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-6 h-6" />
                                )}
                                Approve Hire
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
