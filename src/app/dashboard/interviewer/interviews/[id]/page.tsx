'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Briefcase, Calendar, Video, Save, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InterviewDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [interview, setInterview] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Feedback Form State
    const [outcome, setOutcome] = useState('PASSED');
    const [rating, setRating] = useState(3);
    const [notes, setNotes] = useState('');
    const [strengths, setStrengths] = useState('');
    const [weaknesses, setWeaknesses] = useState('');

    useEffect(() => {
        const fetchInterview = async () => {
            try {
                const res = await fetch(`/api/interviewer/interviews/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setInterview(data.interview);
                    // Pre-fill if feedback exists
                    if (data.interview.feedback) {
                        setRating(data.interview.feedback.rating || 3);
                        setNotes(data.interview.feedback.notes || '');
                        setStrengths(data.interview.feedback.strengths || '');
                        setWeaknesses(data.interview.feedback.weaknesses || '');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch interview:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterview();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch('/api/interviewer/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    interviewId: id,
                    outcome,
                    rating,
                    notes,
                    strengths,
                    weaknesses
                })
            });

            if (res.ok) {
                router.push('/dashboard/interviewer/interviews');
            } else {
                alert('Failed to submit feedback');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }

    if (!interview) {
        return <div className="p-8 text-slate-500">Interview not found</div>;
    }

    return (
        <div className="p-8 space-y-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Interviews
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Candidate & Interview Info */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-400">
                                {interview.candidate.name.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">{interview.candidate.name}</h2>
                                <p className="text-slate-400 text-sm">{interview.candidate.role}</p>
                            </div>
                        </div>

                        <div className="space-y-4 text-sm text-slate-300">
                            <div className="flex items-center gap-3">
                                <Briefcase className="w-4 h-4 text-slate-500" />
                                {interview.candidate.experience} years experience
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-slate-500" />
                                {new Date(interview.scheduledAt).toLocaleString()}
                            </div>
                            {interview.meetingLink && (
                                <a
                                    href={interview.meetingLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sky-400 hover:text-sky-300"
                                >
                                    <Video className="w-4 h-4" />
                                    Join Meeting
                                </a>
                            )}
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-800">
                            <h3 className="text-sm font-medium text-white mb-3">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {interview.candidate.skills.map((skill: string) => (
                                    <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Feedback Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 space-y-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Interview Feedback</h2>
                            <span className="px-3 py-1 rounded-full bg-sky-500/10 text-sky-500 text-sm font-medium">
                                {interview.round} Round
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Outcome</label>
                                <select
                                    value={outcome}
                                    onChange={(e) => setOutcome(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                                >
                                    <option value="PASSED">Passed</option>
                                    <option value="REJECTED">Rejected</option>
                                    <option value="ON_HOLD">On Hold</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Rating (1-5)</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${rating >= star ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                                                }`}
                                        >
                                            {star}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Key Strengths</label>
                            <textarea
                                value={strengths}
                                onChange={(e) => setStrengths(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                                placeholder="What did the candidate do well?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Areas for Improvement</label>
                            <textarea
                                value={weaknesses}
                                onChange={(e) => setWeaknesses(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                                placeholder="Where did the candidate struggle?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Overall Notes</label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                                placeholder="General summary of the interview..."
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Submit Feedback
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
