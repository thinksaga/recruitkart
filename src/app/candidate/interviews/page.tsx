'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, Building2, Loader2 } from 'lucide-react';

interface Interview {
    id: string;
    round_type: string;
    status: string;
    scheduled_at: string | null;
    zoom_meeting_id: string | null;
    submission: {
        job: {
            title: string;
            organization: {
                name: string;
                logo_url: string | null;
            };
        };
    };
}

export default function InterviewsPage() {
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInterviews();
    }, []);

    const fetchInterviews = async () => {
        try {
            const res = await fetch('/api/candidate/interviews');
            if (res.ok) {
                const data = await res.json();
                setInterviews(data.interviews);
            }
        } catch (error) {
            console.error('Error fetching interviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Interviews</h1>
                <p className="text-slate-400">View and join your scheduled interviews.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
            ) : interviews.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No interviews scheduled yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {interviews.map((interview, index) => (
                        <motion.div
                            key={interview.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                                        {interview.submission.job.organization.logo_url ? (
                                            <img src={interview.submission.job.organization.logo_url} alt={interview.submission.job.organization.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{interview.round_type} Round</h3>
                                        <p className="text-sm text-slate-400">
                                            {interview.submission.job.title} at {interview.submission.job.organization.name}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6">
                                    {interview.scheduled_at && (
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-4 h-4 text-cyan-500" />
                                            <span>{new Date(interview.scheduled_at).toLocaleDateString()}</span>
                                            <Clock className="w-4 h-4 text-cyan-500 ml-2" />
                                            <span>{new Date(interview.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    )}

                                    {interview.status === 'SCHEDULED' && interview.zoom_meeting_id && (
                                        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                                            <Video className="w-4 h-4" />
                                            Join Meeting
                                        </button>
                                    )}

                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${interview.status === 'SCHEDULED' ? 'bg-blue-500/10 text-blue-500' :
                                            interview.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {interview.status}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
