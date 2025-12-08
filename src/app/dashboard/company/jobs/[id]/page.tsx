'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, DollarSign, Clock, Users, MoreVertical, FileText, Mail, Phone, Briefcase, Loader2, Trash2, Edit2, X, Check, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const [job, setJob] = useState<any>(null);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState<any>({});
    const [isSaving, setIsSaving] = useState(false);

    // Delete State
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const res = await fetch(`/api/company/jobs/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setJob(data.job);
                    setCandidates(data.candidates);
                    setEditForm({
                        title: data.job.title || '',
                        department: data.job.department || '',
                        location: data.job.location || '',
                        type: data.job.type || 'FULL_TIME',
                        work_mode: data.job.work_mode || 'ONSITE',
                        salary_min: data.job.salary_min || '',
                        salary_max: data.job.salary_max || '',
                        experience_min: data.job.experience_min || '',
                        experience_max: data.job.experience_max || '',
                        skills: typeof data.job.skills === 'string' ? data.job.skills : (Array.isArray(data.job.skills) ? data.job.skills.join(', ') : ''),
                        benefits: typeof data.job.benefits === 'string' ? data.job.benefits : (Array.isArray(data.job.benefits) ? data.job.benefits.join(', ') : ''),
                        description: data.job.description || ''
                    });
                }
            } catch (error) {
                console.error('Failed to fetch job details:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await fetch(`/api/company/jobs/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const data = await res.json();
                // Update local state partially or refetch
                // Simple refetch for consistency
                window.location.reload();
            } else {
                alert('Failed to update job');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating job');
        } finally {
            setIsSaving(false);
        }
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/company/jobs/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                router.push('/dashboard/company/jobs');
            } else {
                alert('Failed to delete job');
            }
        } catch (error) {
            console.error(error);
            alert('Error deleting job');
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex h-full items-center justify-center text-slate-500">
                Job not found.
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 relative">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
            </button>

            {/* Job Header */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                <div className="flex flex-col md:flex-row md:items-start justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{job.title}</h1>
                        <div className="flex items-center gap-2 text-rose-400 mb-2 font-medium">
                            {job.department} • {job.work_mode}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 md:gap-6 text-slate-400">
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" /> {job.location}
                            </span>
                            <span className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" /> {job.salary}
                            </span>
                            <span className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> {job.experience}
                            </span>
                            <span className="flex items-center gap-2">
                                <Clock className="w-4 h-4" /> {job.type}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        {job.status === 'DRAFT' && (
                            <button
                                onClick={() => router.push(`/dashboard/company/jobs/new?jobId=${job.id}`)}
                                className="flex-1 md:flex-none justify-center px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <CreditCard className="w-4 h-4" /> Complete Posting
                            </button>
                        )}
                        {!['OPEN', 'DRAFT'].includes(job.status) && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex-1 md:flex-none justify-center px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Edit2 className="w-4 h-4" /> Edit
                            </button>
                        )}
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex-1 md:flex-none justify-center px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-4 h-4" /> Delete
                        </button>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 py-6 border-t border-slate-800">
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Status</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${job.status === 'OPEN' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                            }`}>
                            {job.status}
                        </span>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Posted</div>
                        <div className="text-white font-medium">{job.posted}</div>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Bounty (Success Fee)</div>
                        <div className="text-emerald-400 font-medium">{job.bounty}</div>
                    </div>
                    <div>
                        <div className="text-sm text-slate-500 mb-1">Candidates</div>
                        <div className="text-white font-medium">{job.candidatesCount} Applied</div>
                    </div>
                </div>

                {/* Description & Skills */}
                <div className="py-6 border-t border-slate-800 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-2">Description</h3>
                        <p className="text-slate-400 whitespace-pre-wrap">{job.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 mb-2">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-sm">{skill}</span>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-300 mb-2">Benefits</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.benefits.map((benefit: string) => (
                                    <span key={benefit} className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-sm">{benefit}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Candidates List */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6">Candidates ({candidates.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {candidates.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-slate-500 bg-slate-900/30 rounded-xl border border-slate-800/50">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No candidates have applied yet.</p>
                        </div>
                    ) : (
                        candidates.map((candidate, index) => (
                            <motion.div
                                key={candidate.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => router.push(`/dashboard/company/candidates/${candidate.id}`)}
                                className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/50 hover:border-rose-500/30 transition-colors group cursor-pointer relative"
                            >
                                <div className="absolute top-4 right-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${candidate.status === 'HIRED' ? 'bg-emerald-500/10 text-emerald-500' :
                                        candidate.status === 'INTERVIEWING' ? 'bg-amber-500/10 text-amber-500' :
                                            'bg-slate-500/10 text-slate-500'
                                        }`}>
                                        {candidate.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-2xl font-bold text-slate-400">
                                        {candidate.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-white group-hover:text-rose-400 transition-colors">{candidate.name}</h3>
                                        <p className="text-slate-400 text-sm">{candidate.experience}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-slate-400 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Mail className="w-4 h-4 text-slate-500" />
                                        {candidate.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-500" />
                                        {candidate.phone}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-white">Edit Job Details</h2>
                                <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Job Title</label>
                                        <input type="text" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                                        <input type="text" value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                                        <input type="text" value={editForm.location} onChange={e => setEditForm({ ...editForm, location: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                                        <select value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white">
                                            <option value="FULL_TIME">Full Time</option>
                                            <option value="PART_TIME">Part Time</option>
                                            <option value="CONTRACT">Contract</option>
                                            <option value="INTERNSHIP">Internship</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Mode</label>
                                        <select value={editForm.work_mode} onChange={e => setEditForm({ ...editForm, work_mode: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white">
                                            <option value="ONSITE">Onsite</option>
                                            <option value="REMOTE">Remote</option>
                                            <option value="HYBRID">Hybrid</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Min Salary</label>
                                        <input type="number" value={editForm.salary_min} onChange={e => setEditForm({ ...editForm, salary_min: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Max Salary</label>
                                        <input type="number" value={editForm.salary_max} onChange={e => setEditForm({ ...editForm, salary_max: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Exp Min</label>
                                        <input type="number" value={editForm.experience_min} onChange={e => setEditForm({ ...editForm, experience_min: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Exp Max</label>
                                        <input type="number" value={editForm.experience_max} onChange={e => setEditForm({ ...editForm, experience_max: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Skills (comma separated)</label>
                                    <input type="text" value={editForm.skills} onChange={e => setEditForm({ ...editForm, skills: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Benefits (comma separated)</label>
                                    <input type="text" value={editForm.benefits} onChange={e => setEditForm({ ...editForm, benefits: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
                                    <textarea rows={5} value={editForm.description} onChange={e => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white" />
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-400 hover:text-white">Cancel</button>
                                    <button type="submit" disabled={isSaving} className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg flex items-center gap-2">
                                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-slate-950 border border-slate-800 rounded-2xl p-6 w-full max-w-md text-center"
                        >
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Delete Job?</h2>
                            <p className="text-slate-400 mb-6">
                                Are you sure you want to delete <span className="text-white font-medium">{job?.title}</span>? This action cannot be undone and will remove all associated data.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    disabled={isDeleting}
                                    className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete Job'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
