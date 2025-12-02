'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, History, TrendingUp, ArrowUpRight, ArrowDownLeft, Loader2, Plus, X } from 'lucide-react';

export default function TASCreditsPage() {
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [buyAmount, setBuyAmount] = useState(100);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchCredits = async () => {
        try {
            const res = await fetch('/api/tas/credits');
            if (res.ok) {
                const data = await res.json();
                setBalance(data.balance);
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error('Failed to fetch credits:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCredits();
    }, []);

    const handleBuyCredits = async () => {
        setIsProcessing(true);
        try {
            const res = await fetch('/api/tas/credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: buyAmount })
            });

            if (res.ok) {
                await fetchCredits(); // Refresh balance and history
                setIsBuyModalOpen(false);
            }
        } catch (error) {
            console.error('Failed to buy credits:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Credits & Billing</h1>
                    <p className="text-slate-400">Manage your credits and view transaction history.</p>
                </div>
                <button
                    onClick={() => setIsBuyModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Buy Credits
                </button>
            </div>

            {/* Balance Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-white/10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-orange-500/20 text-orange-400">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="text-sm text-slate-400">Current Balance</div>
                            <div className="text-2xl font-bold text-white">{balance} Credits</div>
                        </div>
                    </div>
                    <div className="text-sm text-slate-400">
                        Use credits to submit candidates to premium jobs.
                    </div>
                </div>
            </div>

            {/* Transaction History */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <History className="w-5 h-5 text-slate-400" />
                    Transaction History
                </h2>
                <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                            <tr>
                                <th className="p-4 font-medium">Type</th>
                                <th className="p-4 font-medium">Description</th>
                                <th className="p-4 font-medium">Date</th>
                                <th className="p-4 font-medium text-right">Amount</th>
                                <th className="p-4 font-medium text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500">
                                        No transactions found.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {tx.type === 'Purchase' ? (
                                                    <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-500">
                                                        <ArrowDownLeft className="w-4 h-4" />
                                                    </div>
                                                ) : (
                                                    <div className="p-1.5 rounded bg-red-500/10 text-red-500">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <span className="text-white font-medium">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">{tx.description}</td>
                                        <td className="p-4 text-slate-400">{tx.date}</td>
                                        <td className={`p-4 text-right font-medium ${tx.type === 'Purchase' ? 'text-emerald-400' : 'text-white'
                                            }`}>
                                            {tx.type === 'Purchase' ? '+' : '-'}{Math.abs(tx.amount)}
                                        </td>
                                        <td className="p-4 text-right">
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Buy Credits Modal */}
            <AnimatePresence>
                {isBuyModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Buy Credits</h3>
                                <button onClick={() => setIsBuyModalOpen(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Select Amount</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[100, 500, 1000].map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() => setBuyAmount(amount)}
                                                className={`p-3 rounded-lg border text-center transition-all ${buyAmount === amount
                                                        ? 'bg-orange-500/10 border-orange-500 text-orange-500'
                                                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                                                    }`}
                                            >
                                                <div className="text-lg font-bold">{amount}</div>
                                                <div className="text-xs opacity-70">Credits</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-800">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-slate-400">Price per credit</span>
                                        <span className="text-white">₹1.00</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-700">
                                        <span className="text-white">Total</span>
                                        <span className="text-white">₹{buyAmount}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBuyCredits}
                                    disabled={isProcessing}
                                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Purchase'
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
