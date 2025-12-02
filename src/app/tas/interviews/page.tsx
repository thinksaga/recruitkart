'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Video, User, MoreVertical, Filter, Loader2 } from 'lucide-react';

export default function TASInterviewsPage() {
    const [filter, setFilter] = useState('upcoming');
    const [interviews, setInterviews] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInterviews = async () => {
            try {
                const res = await fetch('/api/tas/interviews');
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

    const filteredInterviews = interviews.filter(interview => {
        if (filter === 'all') return true;
        // Simple date comparison for demo purposes
        const interviewDate = new Date(interview.date);
        const today = new Date();
        if (filter === 'upcoming') return interviewDate >= today;
        if (filter === 'past') return interviewDate < today;
        return true;
    });

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
                    <h1 className="text-2xl font-bold text-white mb-2">Interviews</h1>
                    <p className="text-slate-400">Manage scheduled interviews for your candidates.</p>
                </div>
                <div className="flex gap-2">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-800 text-white rounded-lg border border-slate-700 focus:outline-none focus:border-orange-500"
                    >
                        <option value="upcoming">Upcoming</option>
                        <option value="past">Past</option>
                        <option value="all">All Interviews</option>
                    </select>
                </div>
            </div>

            {/* Interviews List */}
            <div className="space-y-4">
                {filteredInterviews.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No interviews found.</p>
                    </div>
                ) : (
                    filteredInterviews.map((interview, index) => (
                        <motion.div
                            key={interview.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-orange-500/30 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-slate-800 flex flex-col items-center justify-center border border-slate-700">
                                        <span className="text-xs text-slate-400 uppercase font-medium">
                                            {new Date(interview.date).toLocaleString('default', { month: 'short' })}
                                        </span>
                                        <span className="text-2xl font-bold text-white">
                                            {new Date(interview.date).getDate()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white">{interview.candidate}</h3>
                                        <p className="text-slate-400 text-sm mb-2">for {interview.job} at {interview.company}</p>
                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1.5">
                                                <Clock className="w-4 h-4" />
                                                {interview.time}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Video className="w-4 h-4" />
                                                {interview.platform}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-white font-medium">{interview.type} Round</div>
                                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1 justify-end">
                                            <User className="w-3 h-3" />
                                            {interview.interviewer}
                                        </div>
                                    </div>
                                    <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-colors">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
