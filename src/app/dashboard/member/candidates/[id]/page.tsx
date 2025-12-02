'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, GraduationCap, Calendar, Download, Clock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MemberCandidateDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [candidate, setCandidate] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                // Reusing the company candidate details API
                const res = await fetch(`/api/company/candidates/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCandidate(data.candidate);
                }
            } catch (error) {
                console.error('Failed to fetch candidate details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidate();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="flex h-full items-center justify-center text-slate-500">
                Candidate not found.
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            {/* Header Section */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-4xl font-bold text-slate-400">
                        {candidate.name.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{candidate.name}</h1>
                        <p className="text-slate-400 text-lg mb-4">Applied for <span className="text-rose-400">{candidate.role}</span></p>
                        <div className="flex items-center gap-6 text-sm text-slate-400">
                            <span className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> {candidate.experience} years
                            </span>
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {candidate.location || 'Not specified'}
                            </span>
                            <span className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Applied {candidate.appliedAt}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-medium ${candidate.status === 'HIRED' ? 'bg-emerald-500/10 text-emerald-500' :
                            candidate.status === 'INTERVIEWING' ? 'bg-amber-500/10 text-amber-500' :
                                'bg-slate-500/10 text-slate-500'
                        }`}>
                        {candidate.status}
                    </span>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2">
                            <Download className="w-4 h-4" /> Resume
                        </button>
                        {/* No Schedule Interview button for Members (unless they are also Interviewers, but keeping it simple for now) */}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
                {/* Left Column: Profile Info */}
                <div className="col-span-2 space-y-8">
                    {/* Contact Info */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <h2 className="text-lg font-semibold text-white mb-4">Contact Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                {candidate.email}
                            </div>
                            <div className="flex items-center gap-3 text-slate-300">
                                <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                    <Phone className="w-5 h-5" />
                                </div>
                                {candidate.phone}
                            </div>
                        </div>
                    </div>

                    {/* Summary */}
                    {candidate.summary && (
                        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                            <h2 className="text-lg font-semibold text-white mb-4">Summary</h2>
                            <p className="text-slate-300 leading-relaxed">{candidate.summary}</p>
                        </div>
                    )}

                    {/* Skills */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <h2 className="text-lg font-semibold text-white mb-4">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                            {candidate.skills.map((skill: string) => (
                                <span key={skill} className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Experience */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <h2 className="text-lg font-semibold text-white mb-6">Work Experience</h2>
                        <div className="space-y-6">
                            {candidate.workHistory.map((exp: any) => (
                                <div key={exp.id} className="relative pl-8 border-l-2 border-slate-800 last:border-0">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700"></div>
                                    <h3 className="text-white font-medium">{exp.title}</h3>
                                    <div className="text-rose-400 text-sm mb-1">{exp.company}</div>
                                    <div className="text-slate-500 text-xs mb-2">{exp.duration}</div>
                                    <p className="text-slate-400 text-sm">{exp.description}</p>
                                </div>
                            ))}
                            {candidate.workHistory.length === 0 && (
                                <p className="text-slate-500 italic">No work history added.</p>
                            )}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <h2 className="text-lg font-semibold text-white mb-6">Education</h2>
                        <div className="space-y-6">
                            {candidate.education.map((edu: any) => (
                                <div key={edu.id} className="flex items-start gap-4">
                                    <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-medium">{edu.degree}</h3>
                                        <div className="text-slate-400 text-sm">{edu.school}</div>
                                        <div className="text-slate-500 text-xs">{edu.year}</div>
                                    </div>
                                </div>
                            ))}
                            {candidate.education.length === 0 && (
                                <p className="text-slate-500 italic">No education details added.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Interview History */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <h2 className="text-lg font-semibold text-white mb-6">Interview History</h2>
                        <div className="space-y-4">
                            {candidate.interviews.map((int: any) => (
                                <div key={int.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-medium text-white">{int.round} Round</span>
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${int.outcome === 'PASSED' ? 'bg-emerald-500/10 text-emerald-500' :
                                                int.outcome === 'REJECTED' ? 'bg-red-500/10 text-red-500' :
                                                    'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {int.outcome.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="text-xs text-slate-500 mb-2">{int.date}</div>
                                    {int.feedback && (
                                        <div className="text-sm text-slate-400 bg-slate-900/50 p-2 rounded">
                                            "{int.feedback.notes || 'No feedback provided'}"
                                        </div>
                                    )}
                                </div>
                            ))}
                            {candidate.interviews.length === 0 && (
                                <div className="text-center py-8 text-slate-500">
                                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                    <p>No interviews scheduled yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
