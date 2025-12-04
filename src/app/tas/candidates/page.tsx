'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, MoreVertical, FileText, Mail, Phone, MapPin, Plus, Briefcase, Loader2, Users, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function TASCandidatesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Add Candidate Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        years_of_experience: 0,
        current_location: '',
        skills_primary: '' // Comma separated for input
    });

    const fetchCandidates = async () => {
        try {
            const res = await fetch('/api/tas/candidates');
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

    useEffect(() => {
        fetchCandidates();
    }, []);

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage(null);

        try {
            const payload = {
                ...formData,
                years_of_experience: Number(formData.years_of_experience),
                skills_primary: formData.skills_primary.split(',').map(s => s.trim()).filter(s => s)
            };

            const res = await fetch('/api/tas/candidates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                setSubmitMessage({ type: 'success', text: 'Candidate added successfully!' });
                fetchCandidates(); // Refresh list
                setTimeout(() => {
                    setIsAddModalOpen(false);
                    setSubmitMessage(null);
                    setFormData({
                        full_name: '',
                        email: '',
                        phone: '',
                        years_of_experience: 0,
                        current_location: '',
                        skills_primary: ''
                    });
                }, 2000);
            } else {
                setSubmitMessage({ type: 'error', text: data.error || 'Failed to add candidate' });
            }
        } catch (error) {
            setSubmitMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredCandidates = candidates.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (candidate.role && candidate.role.toLowerCase().includes(searchQuery.toLowerCase()))
    );

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
                    <h1 className="text-2xl font-bold text-white mb-2">Candidate Bank</h1>
                    <p className="text-slate-400">Manage and track your candidate pool.</p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Candidate
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search candidates by name, role, or skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                    />
                </div>
                <button className="px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                </button>
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
                            className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-orange-500/30 transition-colors group relative"
                        >
                            <button className="absolute top-4 right-4 text-slate-500 hover:text-white">
                                <MoreVertical className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-400">
                                    {candidate.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{candidate.name}</h3>
                                    <p className="text-slate-400 text-sm">{candidate.role}</p>
                                </div>
                            </div>

                            <div className="space-y-3 text-sm text-slate-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-slate-500" />
                                    {candidate.experience}
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-500" />
                                    {candidate.location}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-slate-500" />
                                    {candidate.email}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-slate-500" />
                                    {candidate.phone}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {candidate.skills.slice(0, 3).map((skill: string) => (
                                    <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                                        {skill}
                                    </span>
                                ))}
                                {candidate.skills.length > 3 && (
                                    <span className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">
                                        +{candidate.skills.length - 3}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${candidate.status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' :
                                    candidate.status === 'Interviewing' ? 'bg-amber-500/10 text-amber-500' :
                                        'bg-slate-500/10 text-slate-500'
                                    }`}>
                                    {candidate.status}
                                </span>
                                <button className="text-orange-500 hover:text-orange-400 text-sm font-medium flex items-center gap-1">
                                    View Profile <FileText className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add Candidate Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Add New Candidate</h3>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {submitMessage && (
                                <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-sm ${submitMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}>
                                    {submitMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {submitMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleAddCandidate} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.full_name}
                                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Phone *</label>
                                        <input
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                            placeholder="+91 98765 43210"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Experience (Years)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={formData.years_of_experience}
                                            onChange={(e) => setFormData({ ...formData, years_of_experience: parseFloat(e.target.value) })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Current Location</label>
                                        <input
                                            type="text"
                                            value={formData.current_location}
                                            onChange={(e) => setFormData({ ...formData, current_location: e.target.value })}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                            placeholder="Bangalore, India"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Skills (Comma separated)</label>
                                    <input
                                        type="text"
                                        value={formData.skills_primary}
                                        onChange={(e) => setFormData({ ...formData, skills_primary: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                        placeholder="React, Node.js, TypeScript"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Adding Candidate...
                                        </>
                                    ) : (
                                        'Add Candidate'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
