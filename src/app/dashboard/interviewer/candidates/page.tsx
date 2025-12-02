'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, FileText, Mail, Phone, Briefcase, Loader2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InterviewerCandidatesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                // Reusing the company candidates API
                const res = await fetch('/api/company/candidates');
                if (res.ok) {
                    const data = await res.json();
                    setCandidates(data.candidates);
                }
            } catch (error) {
                console.error('Failed to fetch candidates:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCandidates();
    }, []);

    const filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Candidates</h1>
                    <p className="text-slate-400">View candidate profiles.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                />
            </div>

            {/* Candidates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCandidates.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No candidates found.</p>
                    </div>
                ) : (
                    filteredCandidates.map((candidate, index) => (
                        <motion.div
                            key={candidate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => router.push(`/dashboard/interviewer/candidates/${candidate.id}`)}
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-sky-500/30 transition-colors group relative cursor-pointer"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-400">
                                    {candidate.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white group-hover:text-sky-400 transition-colors">{candidate.name}</h3>
                                    <p className="text-slate-400 text-sm">{candidate.role}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-slate-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-slate-500" />
                                    {candidate.experience}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    {candidate.email}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {candidate.skills.slice(0, 3).map((skill: string) => (
                                    <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}
