'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, FileText, User, Loader2 } from 'lucide-react';

export default function MemberInterviewsPage() {
    const [interviews, setInterviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await fetch('/api/member/interviews');
                if (res.ok) {
                    const data = await res.json();
                    setInterviews(data.interviews);
                }
            } catch (error) {
                console.error('Failed to fetch interviews:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInterviews();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">My Interviews</h1>
                <p className="text-slate-400">Manage your upcoming interviews and submit feedback.</p>
            </div>

            <div className="space-y-4">
                {interviews.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No interviews scheduled.</p>
                    </div>
                ) : (
                    interviews.map((interview, index) => (
                        <motion.div
                            key={interview.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-rose-500/30 transition-colors flex items-center justify-between"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-xl bg-slate-800 flex flex-col items-center justify-center text-slate-400">
                                    <span className="text-xs uppercase font-bold">{new Date(interview.scheduledAt).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-bold text-white">{new Date(interview.scheduledAt).getDate()}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-1">{interview.candidateName}</h3>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <User className="w-3 h-3" /> {interview.role}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-fuchsia-500/10 text-fuchsia-500 text-xs font-medium">
                                            {interview.round} Round
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {interview.meetingLink && (
                                    <a
                                        href={interview.meetingLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
                                    >
                                        <Video className="w-4 h-4" />
                                        Join Meeting
                                    </a>
                                )}
                                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium">
                                    <FileText className="w-4 h-4" />
                                    Submit Feedback
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
