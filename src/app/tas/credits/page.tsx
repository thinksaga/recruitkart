'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, History, TrendingUp, ArrowUpRight, ArrowDownLeft, Loader2, Plus, X, AlertCircle, CheckCircle, Wallet, Download, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TASCreditsPage() {
    const router = useRouter();
    const [balance, setBalance] = useState(0);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
    const [buyAmount, setBuyAmount] = useState(100);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const CREDIT_PRICE = 99;

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

        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handleBuyCredits = async () => {
        if (buyAmount < 100) return;
        setIsProcessing(true);
        setMessage(null);

        const totalAmount = buyAmount * CREDIT_PRICE;

        try {
            // 1. Create Order
            const orderRes = await fetch('/api/payment/order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: totalAmount })
            });

            if (!orderRes.ok) throw new Error('Failed to create order');

            const order = await orderRes.json();

            const handleVerification = async (payload: any) => {
                const verifyRes = await fetch('/api/payment/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...payload,
                        purchaseType: 'CREDIT_PURCHASE',
                        credits: buyAmount
                    })
                });

                if (verifyRes.ok) {
                    setMessage({ type: 'success', text: `Successfully purchased ${buyAmount} credits!` });
                    await fetchCredits();
                    setTimeout(() => {
                        setIsBuyModalOpen(false);
                        setMessage(null);
                    }, 2000);
                } else {
                    setMessage({ type: 'error', text: 'Payment verification failed' });
                }
            };

            // 2. Handle Mock or Real Payment
            if (order.id.startsWith('order_mock_')) {
                const mockPayload = {
                    razorpay_order_id: order.id,
                    razorpay_payment_id: `pay_${order.id.split('_')[2]}`,
                    razorpay_signature: 'mock_signature'
                };
                await handleVerification(mockPayload);
                return;
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Recruitkart",
                description: `Purchase ${buyAmount} Credits`,
                order_id: order.id,
                handler: async function (response: any) {
                    await handleVerification({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });
                },
                prefill: {
                    email: "agency@tas.com", // In a real app, prefill from user profile
                    contact: "9999999999"
                },
                theme: {
                    color: "#f97316" // Orange
                }
            };

            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();

        } catch (error) {
            console.error('Failed to buy credits:', error);
            setMessage({ type: 'error', text: 'Failed to initiate payment' });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDownloadInvoice = (transaction: any) => {
        const invoiceContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Invoice #${transaction.id.slice(0, 8)}</title>
                <style>
                    body { font-family: 'Helvetica', 'Arial', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
                    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
                    .logo { font-size: 24px; font-weight: bold; color: #4F46E5; }
                    .invoice-title { font-size: 32px; font-weight: bold; color: #111; text-align: right; }
                    .meta { margin-bottom: 40px; }
                    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
                    .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
                    .table th { text-align: left; padding: 12px; border-bottom: 2px solid #eee; color: #666; font-size: 14px; text-transform: uppercase; }
                    .table td { padding: 12px; border-bottom: 1px solid #eee; }
                    .total-section { display: flex; justify-content: flex-end; }
                    .total-box { width: 300px; }
                    .row { display: flex; justify-content: space-between; padding: 8px 0; }
                    .row.total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; margin-top: 10px; padding-top: 15px; }
                    .footer { margin-top: 60px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
                    .status { display: inline-block; padding: 6px 12px; background: #DEF7EC; color: #03543F; border-radius: 4px; font-weight: bold; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div>
                        <div class="logo">Recruitkart</div>
                        <div style="color: #666; font-size: 14px; margin-top: 8px;">
                            The Operating System for Hiring<br>
                            Bangalore, India
                        </div>
                    </div>
                    <div>
                        <div class="invoice-title">INVOICE</div>
                        <div style="text-align: right; margin-top: 8px; color: #666;">
                            #${transaction.id.slice(0, 8).toUpperCase()}
                        </div>
                        <div style="text-align: right; margin-top: 8px;">
                            <span class="status">PAID</span>
                        </div>
                    </div>
                </div>

                <div class="grid">
                    <div>
                        <h3 style="font-size: 14px; color: #999; text-transform: uppercase;">Billed To</h3>
                        <div style="font-weight: bold; margin-bottom: 4px;">TAS Agency</div>
                        <div style="color: #666;">agency@tas.com</div>
                    </div>
                    <div style="text-align: right;">
                        <h3 style="font-size: 14px; color: #999; text-transform: uppercase;">Date of Issue</h3>
                        <div style="font-weight: bold;">${transaction.date}</div>
                    </div>
                </div>

                <table class="table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: right;">Quantity</th>
                            <th style="text-align: right;">Unit Price</th>
                            <th style="text-align: right;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Recruitkart Credits Purchase</td>
                            <td style="text-align: right;">${Math.abs(transaction.amount) / CREDIT_PRICE}</td>
                            <td style="text-align: right;">₹${CREDIT_PRICE}.00</td>
                            <td style="text-align: right;">₹${Math.abs(transaction.amount).toLocaleString()}.00</td>
                        </tr>
                    </tbody>
                </table>

                <div class="total-section">
                    <div class="total-box">
                        <div class="row">
                            <span style="color: #666;">Subtotal</span>
                            <span>₹${(Math.abs(transaction.amount) / 1.18).toFixed(2)}</span>
                        </div>
                        <div class="row">
                            <span style="color: #666;">GST (18%)</span>
                            <span>₹${(Math.abs(transaction.amount) - (Math.abs(transaction.amount) / 1.18)).toFixed(2)}</span>
                        </div>
                        <div class="row total">
                            <span>Total</span>
                            <span>₹${Math.abs(transaction.amount).toLocaleString()}.00</span>
                        </div>
                    </div>
                </div>

                <div class="footer">
                    <p>This is a computer generated invoice and does not require a physical signature.</p>
                    <p>Recruitkart Technologies Pvt Ltd. | GSTIN: 29AAAAA0000A1Z5</p>
                </div>
                <script>window.print();</script>
            </body>
            </html>
        `;

        const newWindow = window.open('', '_blank');
        if (newWindow) {
            newWindow.document.write(invoiceContent);
            newWindow.document.close();
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 space-y-8 min-h-screen bg-slate-950 font-sans relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Credits & Billing</h1>
                    <p className="text-slate-400 flex items-center gap-2">
                        <Wallet className="w-4 h-4 text-indigo-400" /> Manage your wallet and transaction history.
                    </p>
                </div>
                <button
                    onClick={() => setIsBuyModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-500/20 font-bold tracking-wide hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Buy Credits
                </button>
            </div>

            {/* Balance Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-2xl relative overflow-hidden group"
                >
                    {/* Gloss effect */}
                    <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl group-hover:bg-indigo-500/30 transition-all duration-700"></div>

                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                <Wallet className="w-8 h-8" />
                            </div>
                            <TrendIndicator />
                        </div>

                        <div>
                            <div className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-2">Available Balance</div>
                            <div className="text-5xl font-bold text-white tracking-tighter tabular-nums text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
                                {balance.toLocaleString()}
                                <span className="text-xl text-slate-500 font-light ml-2">Cr</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Quick Stats or Promo could go here in other grid slots */}
            </div>

            {/* Transaction History */}
            <div className="space-y-6 relative z-10">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <History className="w-5 h-5 text-indigo-400" />
                    Transaction History
                </h2>
                <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800/80">
                            <tr>
                                <th className="p-5 font-bold uppercase text-xs tracking-wider">Type</th>
                                <th className="p-5 font-bold uppercase text-xs tracking-wider">Description</th>
                                <th className="p-5 font-bold uppercase text-xs tracking-wider">Date</th>
                                <th className="p-5 font-bold text-right uppercase text-xs tracking-wider">Amount</th>
                                <th className="p-5 font-bold text-center uppercase text-xs tracking-wider">Status</th>
                                <th className="p-5 font-bold text-right uppercase text-xs tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <History className="w-8 h-8 opacity-20" />
                                            <span>No transactions yet.</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((tx, index) => (
                                    <motion.tr
                                        key={tx.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-800/30 transition-colors group"
                                    >
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                {tx.type === 'Purchase' ? (
                                                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                                        <ArrowDownLeft className="w-4 h-4" />
                                                    </div>
                                                ) : (
                                                    <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </div>
                                                )}
                                                <span className="text-white font-semibold">{tx.type}</span>
                                            </div>
                                        </td>
                                        <td className="p-5 text-slate-300 font-medium">{tx.description}</td>
                                        <td className="p-5 text-slate-500 font-mono text-xs">{tx.date}</td>
                                        <td className={`p-5 text-right font-bold text-base ${tx.type === 'Purchase' ? 'text-emerald-400' : 'text-slate-300'
                                            }`}>
                                            {tx.type === 'Purchase' ? '+' : '-'}{Math.abs(tx.amount).toLocaleString()}
                                        </td>
                                        <td className="p-5 text-center">
                                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm shadow-emerald-500/10">
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className="p-5 text-right">
                                            {tx.type === 'Purchase' && (
                                                <button
                                                    onClick={() => handleDownloadInvoice(tx)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                                                    title="Download Invoice"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Buy Credits Modal */}
            <AnimatePresence>
                {isBuyModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-950 border border-slate-800 rounded-3xl p-8 w-full max-w-lg shadow-2xl relative overflow-hidden"
                        >
                            {/* Gloss effect */}
                            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-[80px] pointer-events-none"></div>

                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Add Credits</h3>
                                    <p className="text-slate-400 text-sm mt-1">Instant top-up for candidate submissions</p>
                                </div>
                                <button onClick={() => setIsBuyModalOpen(false)} className="p-2 -mr-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`p-4 rounded-xl mb-6 flex items-center gap-3 text-sm relative z-10 ${message.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                        }`}>
                                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                    <span className="font-medium">{message.text}</span>
                                </motion.div>
                            )}

                            <div className="space-y-8 relative z-10">
                                <div>
                                    <label className="block text-sm font-bold text-slate-300 mb-3 uppercase tracking-wider">Amount (Min. 100)</label>
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-60 transition duration-300 blur-sm"></div>
                                        <div className="relative flex items-center">
                                            <input
                                                type="number"
                                                min="100"
                                                value={buyAmount}
                                                onChange={(e) => setBuyAmount(Math.max(0, parseInt(e.target.value) || 0))}
                                                className="w-full bg-slate-900 border border-slate-700/50 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all pl-5 pr-16 font-mono text-2xl font-bold"
                                                placeholder="0"
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-base font-medium">
                                                Credits
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        {[100, 500, 1000, 5000].map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() => setBuyAmount(amount)}
                                                className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${buyAmount === amount
                                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/20'
                                                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800'
                                                    }`}
                                            >
                                                +{amount}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/80">
                                    <div className="flex justify-between text-sm mb-4">
                                        <span className="text-slate-400">Price per credit</span>
                                        <span className="text-white font-mono">₹{CREDIT_PRICE}.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-4">
                                        <span className="text-slate-400">GST (18%)</span>
                                        <span className="text-slate-300 font-mono">included</span>
                                    </div>
                                    <div className="flex justify-between items-end text-lg font-bold pt-4 border-t border-slate-800">
                                        <span className="text-white">Total Payable</span>
                                        <div className="text-right">
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-3xl">
                                                ₹{(buyAmount * CREDIT_PRICE).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBuyCredits}
                                    disabled={isProcessing || buyAmount < 100}
                                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl shadow-indigo-500/20 transform active:scale-[0.98]"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing Payment...
                                        </>
                                    ) : (
                                        <>
                                            Confirm Purchase <ArrowUpRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>

                                <div className="text-center">
                                    <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-emerald-500" /> Secure payment via Razorpay
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TrendIndicator() {
    return (
        <div className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs font-bold border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" />
            <span>Active</span>
        </div>
    )
}
