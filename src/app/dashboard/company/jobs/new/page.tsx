'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PaymentModal from '@/components/dashboard/company/PaymentModal';

export default function NewJobPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [createdJobId, setCreatedJobId] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: '',
        type: 'FULL_TIME',
        work_mode: 'ONSITE',
        experience_min: '',
        experience_max: '',
        skills: '',
        benefits: '',
        salary_min: '',
        salary_max: '',
        success_fee_amount: '',
        description: ''
    });

    const handleSaveDraft = async (e: React.FormEvent) => {
        e.preventDefault();
        await submitJob(false);
    };

    const handlePayAndPublish = async (e: React.FormEvent) => {
        e.preventDefault();
        // First save as draft, then open payment modal
        const jobId = await submitJob(true);
        if (jobId) {
            setCreatedJobId(jobId);
            setIsPaymentModalOpen(true);
        }
    };

    const submitJob = async (returnId: boolean = false) => {
        setIsSubmitting(true);
        setMessage(null);

        try {
            const payload = {
                ...formData,
                salary_min: Number(formData.salary_min),
                salary_max: Number(formData.salary_max),
                success_fee_amount: Number(formData.success_fee_amount),
                experience_min: formData.experience_min ? Number(formData.experience_min) : undefined,
                experience_max: formData.experience_max ? Number(formData.experience_max) : undefined,
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                benefits: formData.benefits.split(',').map(s => s.trim()).filter(Boolean),
                job_type: formData.type,
            };

            const res = await fetch('/api/company/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok) {
                if (returnId) {
                    return data.job.id;
                } else {
                    setMessage({ type: 'success', text: 'Job saved as draft!' });
                    setTimeout(() => {
                        router.push('/dashboard/company/jobs');
                    }, 1500);
                }
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save job' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsSubmitting(false);
        }
        return null;
    };

    const handlePaymentSuccess = async () => {
        try {
            const res = await fetch(`/api/company/jobs/${createdJobId}/pay`, {
                method: 'POST',
            });

            if (res.ok) {
                setIsPaymentModalOpen(false);
                router.push('/dashboard/company/jobs');
            } else {
                setMessage({ type: 'error', text: 'Payment confirmation failed' });
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Payment confirmation failed' });
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to Jobs
            </button>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Post a New Job</h1>
                <p className="text-slate-400">Create a new job listing to start receiving candidates.</p>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        }`}
                >
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </motion.div>
            )}

            <form className="space-y-8">
                {/* Basic Info */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                    <h2 className="text-lg font-semibold text-white mb-4">Basic Information</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Job Title *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="e.g. Senior Frontend Engineer"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Department</label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="e.g. Engineering"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="e.g. Bangalore"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                >
                                    <option value="FULL_TIME">Full-time</option>
                                    <option value="CONTRACT">Contract</option>
                                    <option value="PART_TIME">Part-time</option>
                                    <option value="FREELANCE">Freelance</option>
                                    <option value="INTERNSHIP">Internship</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Work Mode</label>
                                <select
                                    value={formData.work_mode}
                                    onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                >
                                    <option value="ONSITE">Onsite</option>
                                    <option value="REMOTE">Remote</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experience & Skills */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                    <h2 className="text-lg font-semibold text-white mb-4">Experience & Skills</h2>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Min Experience (Years)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.experience_min}
                                    onChange={(e) => setFormData({ ...formData, experience_min: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="e.g. 3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Max Experience (Years)</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.experience_max}
                                    onChange={(e) => setFormData({ ...formData, experience_max: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="e.g. 5"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Skills (Comma separated)</label>
                            <textarea
                                rows={2}
                                value={formData.skills}
                                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors resize-none"
                                placeholder="e.g. React, Node.js, TypeScript"
                            />
                        </div>
                    </div>
                </div>

                {/* Compensation */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                    <h2 className="text-lg font-semibold text-white mb-4">Compensation & Fees</h2>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Min Salary (Annual) *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.salary_min}
                                    onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                                    className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="1000000"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Max Salary (Annual) *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.salary_max}
                                    onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                                    className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="2000000"
                                />
                            </div>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Success Fee (Bounty) *</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.success_fee_amount}
                                    onChange={(e) => setFormData({ ...formData, success_fee_amount: e.target.value })}
                                    className="w-full pl-8 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors"
                                    placeholder="50000"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-1">This amount will be paid to the recruiter upon successful hiring.</p>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-slate-400 mb-1">Benefits (Comma separated)</label>
                            <textarea
                                rows={2}
                                value={formData.benefits}
                                onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors resize-none"
                                placeholder="e.g. Health Insurance, Remote Work, Stock Options"
                            />
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                    <h2 className="text-lg font-semibold text-white mb-4">Job Description</h2>
                    <textarea
                        required
                        rows={6}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-rose-500 transition-colors resize-none"
                        placeholder="Describe the role, responsibilities, and requirements..."
                    />
                </div>

                <div className="flex justify-end pt-4 gap-4">
                    <button
                        onClick={handleSaveDraft}
                        disabled={isSubmitting}
                        className="px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                        Save as Draft
                    </button>
                    <button
                        onClick={handlePayAndPublish}
                        disabled={isSubmitting}
                        className="px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'Pay & Publish'
                        )}
                    </button>
                </div>
            </form>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={handlePaymentSuccess}
                amount={999}
                title={`Posting Fee: ${formData.title}`}
            />
        </div>
    );
}
