'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Lock, Unlock, RefreshCw, Loader2 } from 'lucide-react';

export default function FinanceEscrowPage() {
    const router = useRouter();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const res = await fetch('/api/finance/escrow');
            if (res.ok) {
                const data = await res.json();
                setTransactions(data.escrowTransactions);
            }
        } catch (error) {
            console.error('Error fetching escrow transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard/finance')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Escrow Ledger</h1>
                    <p className="text-slate-400">Monitor escrow transactions</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Job / Organization</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Amount</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Description</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                        <td className="py-4 px-6">
                                            <div className="font-medium">{tx.job.title}</div>
                                            <div className="text-xs text-slate-400">{tx.job.organization.name}</div>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-white">
                                            {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`flex items-center gap-1 text-sm ${tx.status === 'HELD' ? 'text-blue-500' :
                                                    tx.status === 'RELEASED_TO_TAS' ? 'text-green-500' :
                                                        'text-red-500'
                                                }`}>
                                                {tx.status === 'HELD' ? <Lock className="w-4 h-4" /> :
                                                    tx.status === 'RELEASED_TO_TAS' ? <Unlock className="w-4 h-4" /> :
                                                        <RefreshCw className="w-4 h-4" />}
                                                {tx.status.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-sm">
                                            {tx.description || '-'}
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-sm">
                                            {new Date(tx.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {transactions.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No escrow transactions found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
