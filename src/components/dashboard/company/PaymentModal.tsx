'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Lock, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    amount: number;
    title: string;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, amount, title }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');

    const handlePay = async () => {
        setStep('processing');
        setIsProcessing(true);

        // Simulate API call/processing time
        setTimeout(() => {
            setStep('success');
            setIsProcessing(false);
            setTimeout(() => {
                onSuccess();
            }, 1000);
        }, 2000);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    {step === 'details' && (
                        <>
                            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <CreditCard className="w-5 h-5 text-rose-500" />
                                    Complete Payment
                                </h3>
                                <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="text-sm text-slate-400 mb-1">Payment for</p>
                                    <p className="text-white font-medium">{title}</p>
                                </div>
                                <div className="bg-slate-800/50 p-4 rounded-xl flex items-center justify-between">
                                    <span className="text-slate-300">Total Amount</span>
                                    <span className="text-2xl font-bold text-white">₹{amount.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-500 justify-center">
                                    <Lock className="w-3 h-3" />
                                    Secured by MockPay
                                </div>
                                <button
                                    onClick={handlePay}
                                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Pay Now
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'processing' && (
                        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                            <Loader2 className="w-12 h-12 text-rose-500 animate-spin" />
                            <h3 className="text-lg font-semibold text-white">Processing Payment...</h3>
                            <p className="text-sm text-slate-400">Please do not close this window.</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle className="w-8 h-8 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white">Payment Successful!</h3>
                            <p className="text-slate-400">Your job posting is now live.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
