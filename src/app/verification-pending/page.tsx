'use client';

import { useState } from 'react';
import { ShieldAlert, LogOut, LifeBuoy, X, Loader2, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerificationPendingPage() {
    const router = useRouter();
    const [isSupportOpen, setIsSupportOpen] = useState(false);
    const [subject, setSubject] = useState('Verification Issue');
    const [reason, setReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogout = async () => {
        // Clear cookie (client-side hack, ideally call an API)
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    const handleSubmitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const res = await fetch('/api/support/tickets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subject, reason, priority: 'MEDIUM' }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to submit ticket');
            }

            setSubmitSuccess(true);
            setTimeout(() => {
                setIsSupportOpen(false);
                setSubmitSuccess(false);
                setReason('');
            }, 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-md w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 text-center shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-yellow-500/20 shadow-[0_0_20px_-5px_rgba(234,179,8,0.3)]">
                    <ShieldAlert className="w-10 h-10 text-yellow-500" />
                </div>

                <h1 className="text-3xl font-bold text-white mb-3">Verification Pending</h1>
                <p className="text-slate-400 mb-8 leading-relaxed">
                    Your account is currently under review. Our compliance team verifies GST/PAN details within 24 hours to ensure the integrity of the trustless protocol.
                </p>

                <div className="bg-slate-950/50 rounded-xl p-4 mb-8 text-sm text-slate-400 border border-slate-800/50 flex items-center justify-center gap-2">
                    Status: <span className="text-yellow-400 font-semibold bg-yellow-400/10 px-2 py-0.5 rounded">PENDING_VERIFICATION</span>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => setIsSupportOpen(true)}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-all hover:shadow-lg border border-slate-700"
                    >
                        <LifeBuoy className="w-4 h-4" />
                        Contact Support
                    </button>

                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl font-medium transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Support Modal */}
            {isSupportOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsSupportOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h2 className="text-xl font-bold text-white mb-1">Contact Support</h2>
                        <p className="text-sm text-slate-400 mb-6">Need help with verification? Let us know.</p>

                        {submitSuccess ? (
                            <div className="flex flex-col items-center justify-center py-8 text-emerald-400 animate-in fade-in zoom-in">
                                <CheckCircle className="w-12 h-12 mb-3" />
                                <p className="font-medium">Ticket raised successfully!</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitTicket} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Subject</label>
                                    <input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        placeholder="Brief summary of the issue"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1">Message</label>
                                    <textarea
                                        value={reason}
                                        onChange={(e) => setReason(e.target.value)}
                                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-h-[100px]"
                                        placeholder="Describe your issue in detail..."
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsSupportOpen(false)}
                                        className="flex-1 py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Ticket'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
