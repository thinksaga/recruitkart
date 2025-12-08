'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle, Briefcase, CreditCard, ShoppingCart, Send, ChevronRight, MapPin, Building2, Wallet, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function NewJobContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');

    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [createdJobId, setCreatedJobId] = useState<string | null>(null);

    // Form Data
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
        description: ''
    });

    // Fee Data
    const [successFee, setSuccessFee] = useState('');
    const infraFee = 999;

    // Load Draft Data
    useEffect(() => {
        if (jobId) {
            const fetchJob = async () => {
                try {
                    const res = await fetch(`/api/company/jobs/${jobId}`);
                    if (res.ok) {
                        const data = await res.json();
                        const job = data.job;
                        // Populate form with existing data
                        setFormData({
                            title: job.title || '',
                            department: job.department || '',
                            location: job.location || '',
                            type: job.type || 'FULL_TIME',
                            work_mode: job.work_mode || 'ONSITE',
                            experience_min: job.experience_min || '',
                            experience_max: job.experience_max || '',
                            skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills || '',
                            benefits: Array.isArray(job.benefits) ? job.benefits.join(', ') : job.benefits || '',
                            salary_min: job.salary_min || '',
                            salary_max: job.salary_max || '',
                            description: job.description || ''
                        });
                        if (job.success_fee_amount) {
                            setSuccessFee(String(job.success_fee_amount));
                        }
                        setCreatedJobId(jobId);
                    }
                } catch (error) {
                    console.error("Failed to load draft job", error);
                    setMessage({ type: 'error', text: 'Failed to load draft details' });
                }
            };
            fetchJob();
        }
    }, [jobId]);

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    // Validation Helpers
    const isStep1Valid = () => {
        return (
            formData.title.trim() !== '' &&
            formData.department.trim() !== '' &&
            formData.location.trim() !== '' &&
            formData.experience_min !== '' &&
            formData.experience_max !== '' &&
            formData.skills.trim() !== '' &&
            formData.benefits.trim() !== '' &&
            formData.salary_min !== '' &&
            formData.salary_max !== '' &&
            formData.description.trim().length >= 10
        );
    };

    const isStep2Valid = () => {
        return successFee !== '' && Number(successFee) >= 0;
    };

    const handleSaveDraft = async (e: React.FormEvent, nextStep?: number) => {
        e.preventDefault();

        // Initial Validation Check
        if (nextStep === 2 && !isStep1Valid()) {
            setMessage({ type: 'error', text: 'Please fill all mandatory fields correctly.' });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const payload = {
                ...formData,
                salary_min: Number(formData.salary_min),
                salary_max: Number(formData.salary_max),
                success_fee_amount: Number(successFee) || 0,
                experience_min: Number(formData.experience_min),
                experience_max: Number(formData.experience_max),
                skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
                benefits: formData.benefits.split(',').map(s => s.trim()).filter(Boolean),
                job_type: formData.type,
            };

            // If we have an ID, update it instead of creating new
            // But API for POST /api/company/jobs creates new. 
            // We should use PATCH if updating, OR logic in POST to handle update?
            // Usually Draft -> Resume -> POST again might duplicate if not careful.
            // The user wants to "complete it". 
            // If createdJobId exists, we should probably update it. 
            // But we don't have update logic here called yet. 
            // Let's use PATCH if createdJobId exists.

            let res;
            if (createdJobId) {
                res = await fetch(`/api/company/jobs/${createdJobId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch('/api/company/jobs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            }

            const data = await res.json();

            if (res.ok) {
                if (!createdJobId) setCreatedJobId(data.job.id);

                if (nextStep) {
                    setStep(nextStep);
                    setMessage(null);
                } else {
                    setMessage({ type: 'success', text: 'Job saved as draft!' });
                    setTimeout(() => router.push('/dashboard/company/jobs'), 1500);
                }
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save job' });
            }

        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayment = async () => {
        if (!createdJobId) return;
        setIsSubmitting(true);

        const totalAmount = Number(successFee) + infraFee;

        try {
            // 1. Create Order
            const orderRes = await fetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount })
            });
            const order = await orderRes.json();

            if (!orderRes.ok) throw new Error('Failed to create order');

            // 2. Open Razorpay or Handle Mock
            if (order.id.startsWith('order_mock_')) {
                // Determine mock inputs for verification
                const mockResponse = {
                    razorpay_order_id: order.id,
                    razorpay_payment_id: `pay_${order.id.split('_')[2]}`,
                    razorpay_signature: 'mock_signature'
                };

                // Call handler directly
                const verifyRes = await fetch('/api/payment/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...mockResponse,
                        jobId: createdJobId
                    })
                });

                if (verifyRes.ok) {
                    setMessage({ type: 'success', text: 'Mock Payment Successful! Job is Live.' });
                    setTimeout(() => router.push('/dashboard/company/jobs'), 1500);
                } else {
                    setMessage({ type: 'error', text: 'Mock Verification Failed' });
                }
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Recruitkart",
                description: "Job Posting Fee",
                order_id: order.id,
                handler: async function (response: any) {
                    // 3. Verify Payment
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            jobId: createdJobId
                        })
                    });

                    if (verifyRes.ok) {
                        setMessage({ type: 'success', text: 'Payment Successful! Job is Live.' });
                        setTimeout(() => router.push('/dashboard/company/jobs'), 1500);
                    } else {
                        setMessage({ type: 'error', text: 'Payment verification failed.' });
                    }
                },
                prefill: {
                    name: "Company Admin",
                    email: "admin@company.com",
                    contact: "9999999999"
                },
                theme: {
                    color: "#f43f5e"
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: 'Payment initialization failed' });
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <div className="min-h-screen bg-transparent p-4 md:p-8">
            <div className="max-w-4xl mx-auto backdrop-blur-3xl">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all backdrop-blur-sm border border-slate-700/50"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            {jobId ? 'Complete Job Posting' : 'Post a New Job'}
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base">
                            {jobId ? 'Finalize details and publish' : 'Find your next star employee'}
                        </p>
                    </div>
                </div>

                {/* Steps Indicator */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { id: 1, label: 'Details', icon: Briefcase },
                        { id: 2, label: 'Fees', icon: ShoppingCart },
                        { id: 3, label: 'Payment', icon: CreditCard }
                    ].map((s) => (
                        <div key={s.id} className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${step >= s.id
                                ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400'
                                : 'bg-slate-900/40 border-slate-800 text-slate-500'
                            }`}>
                            <s.icon className={`w-6 h-6 ${step >= s.id ? 'text-indigo-400' : 'text-slate-600'}`} />
                            <span className="text-xs md:text-sm font-medium">{s.label}</span>
                            {step === s.id && (
                                <motion.div
                                    layoutId="active-step"
                                    className="absolute inset-0 border-2 border-indigo-500 rounded-xl"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </div>
                    ))}
                </div>

                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-6 flex items-center gap-3 backdrop-blur-md border ${message.type === 'success'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}
                    >
                        {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        <span className="font-medium">{message.text}</span>
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {/* Step 1: Job Details */}
                    {step === 1 && (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={(e) => handleSaveDraft(e, 2)}
                            className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 md:p-8 space-y-6 md:space-y-8 shadow-xl"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-indigo-400" /> Job Title <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                        placeholder="e.g. Senior Product Designer"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-indigo-400" /> Department <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                        placeholder="e.g. Engineering"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-indigo-400" /> Location <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all"
                                        placeholder="e.g. Remote, Bangalore"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Type <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer"
                                            >
                                                <option value="FULL_TIME">Full Time</option>
                                                <option value="PART_TIME">Part Time</option>
                                                <option value="CONTRACT">Contract</option>
                                                <option value="INTERNSHIP">Internship</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-300">Mode <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <select
                                                value={formData.work_mode}
                                                onChange={(e) => setFormData({ ...formData, work_mode: e.target.value })}
                                                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white appearance-none focus:outline-none focus:border-indigo-500 cursor-pointer"
                                            >
                                                <option value="ONSITE">Onsite</option>
                                                <option value="REMOTE">Remote</option>
                                                <option value="HYBRID">Hybrid</option>
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                                                <ChevronRight className="w-4 h-4 rotate-90" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <Wallet className="w-4 h-4 text-indigo-400" /> Salary Range (Annual) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            required
                                            placeholder="Min"
                                            value={formData.salary_min}
                                            onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                        <input
                                            type="number"
                                            required
                                            placeholder="Max"
                                            value={formData.salary_max}
                                            onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        <Briefcase className="w-4 h-4 text-indigo-400" /> Experience (Years) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            required
                                            placeholder="Min"
                                            value={formData.experience_min}
                                            onChange={(e) => setFormData({ ...formData, experience_min: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                        <input
                                            type="number"
                                            required
                                            placeholder="Max"
                                            value={formData.experience_max}
                                            onChange={(e) => setFormData({ ...formData, experience_max: e.target.value })}
                                            className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Skills (Comma separated) <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. React, Node.js, TypeScript"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Benefits (Comma separated) <span className="text-rose-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.benefits}
                                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    placeholder="e.g. Health Insurance, Remote Work"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-300">Description <span className="text-rose-500">*</span></label>
                                <textarea
                                    rows={5}
                                    required
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter full job description... (Min 10 characters)"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    disabled={!isStep1Valid() || isSubmitting}
                                    className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Next Step <ChevronRight className="w-5 h-5" /></>}
                                </button>
                            </div>
                        </motion.form>
                    )}

                    {/* Step 2: Fees */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
                                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5 text-indigo-400" /> Fee Breakdown
                                </h2>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-300 flex items-center gap-2">
                                        Success Fee (Bounty) <span className="text-rose-500">*</span>
                                    </label>
                                    <p className="text-xs text-slate-500">Amount paid to Recruiter upon successful hire.</p>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
                                        <input
                                            type="number"
                                            required
                                            value={successFee}
                                            onChange={(e) => setSuccessFee(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-slate-950/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                                            placeholder="50000"
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-800/50 pt-4 space-y-3 bg-slate-950/30 p-4 rounded-xl">
                                    <div className="flex justify-between text-slate-400">
                                        <span>Platform Infrastructure Fee (Fixed)</span>
                                        <span>₹{infraFee}</span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                        <span>Success Fee</span>
                                        <span>₹{Number(successFee) || 0}</span>
                                    </div>
                                    <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-slate-800/50">
                                        <span>Total Payable Now</span>
                                        <span className="text-emerald-400">₹{Number(successFee) + infraFee}</span>
                                    </div>
                                    <p className="text-xs text-slate-500 text-right">Includes applicable taxes</p>
                                </div>
                            </div>

                            <div className="flex justify-between gap-4">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={(e) => handleSaveDraft(e, 3)}
                                    disabled={!isStep2Valid()}
                                    className="flex-1 md:flex-none px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20"
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Payment */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800/50 rounded-2xl p-8 md:p-12 text-center space-y-8 shadow-xl">
                                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto ring-4 ring-emerald-500/5">
                                    <CreditCard className="w-10 h-10 text-emerald-500" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-2">Complete Payment</h2>
                                    <p className="text-slate-400">Securely pay the total amount to make your job post live.</p>
                                </div>
                                <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                                    ₹{(Number(successFee) + infraFee).toLocaleString()}
                                </div>
                            </div>

                            <div className="flex justify-between gap-4">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handlePayment}
                                    disabled={isSubmitting}
                                    className="flex-1 md:flex-none px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold w-full max-w-md mx-auto shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Pay & Publish'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function NewJobPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-950"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>}>
            <NewJobContent />
        </Suspense>
    );
}
