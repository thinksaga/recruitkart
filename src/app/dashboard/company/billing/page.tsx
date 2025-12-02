'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Download, FileText, Loader2, Plus } from 'lucide-react';

export default function CompanyBillingPage() {
    const [billingData, setBillingData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const res = await fetch('/api/company/billing');
                if (res.ok) {
                    const data = await res.json();
                    setBillingData(data.billing);
                }
            } catch (error) {
                console.error('Failed to fetch billing data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBilling();
    }, []);

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Billing & Invoices</h1>
                <p className="text-slate-400">Manage your payment methods and view invoice history.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Payment Methods */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-white">Payment Methods</h2>
                            <button className="text-sm text-rose-500 hover:text-rose-400 font-medium flex items-center gap-1">
                                <Plus className="w-4 h-4" /> Add New
                            </button>
                        </div>

                        <div className="space-y-4">
                            {billingData?.paymentMethods.map((pm: any) => (
                                <div key={pm.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-8 bg-slate-700 rounded flex items-center justify-center text-xs font-bold text-slate-300">
                                            {pm.brand}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">•••• •••• •••• {pm.last4}</div>
                                            <div className="text-sm text-slate-400">Expires {pm.expiry}</div>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                        Default
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Invoice History */}
                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <h2 className="text-lg font-semibold text-white mb-6">Invoice History</h2>
                        <div className="space-y-4">
                            {billingData?.invoices.map((inv: any) => (
                                <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 rounded-lg bg-slate-800 text-slate-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="text-white font-medium">{inv.description}</div>
                                            <div className="text-sm text-slate-400">{inv.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className="text-white font-medium">₹{inv.amount.toLocaleString()}</div>
                                            <span className="text-xs text-emerald-500 font-medium">{inv.status}</span>
                                        </div>
                                        <button className="p-2 text-slate-400 hover:text-white transition-colors">
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Current Balance / Summary */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/20 to-pink-500/20 border border-rose-500/20">
                        <h2 className="text-sm font-medium text-rose-200 mb-2">Outstanding Balance</h2>
                        <div className="text-3xl font-bold text-white">₹{billingData?.balance.toLocaleString()}</div>
                        <p className="text-sm text-rose-200/70 mt-2">No payment due</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
                        <h2 className="text-lg font-semibold text-white mb-4">Billing Details</h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <div className="text-slate-400 mb-1">Company Name</div>
                                <div className="text-white font-medium">Acme Corp</div>
                            </div>
                            <div>
                                <div className="text-slate-400 mb-1">Billing Address</div>
                                <div className="text-white">
                                    123 Tech Park, Sector 4<br />
                                    Bangalore, KA 560103<br />
                                    India
                                </div>
                            </div>
                            <div>
                                <div className="text-slate-400 mb-1">GSTIN</div>
                                <div className="text-white font-medium">29ABCDE1234F1Z5</div>
                            </div>
                            <button className="w-full py-2 mt-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                                Edit Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
