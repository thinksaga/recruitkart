'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, DollarSign, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';

export default function FinancePayoutsPage() {
    const router = useRouter();
    const [payouts, setPayouts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPayouts();
    }, []);

    const fetchPayouts = async () => {
        try {
            const res = await fetch('/api/finance/payouts');
            if (res.ok) {
                const data = await res.json();
                setPayouts(data.payouts);
            }
        } catch (error) {
            console.error('Error fetching payouts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/finance/payouts', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) fetchPayouts();
        } catch (error) {
            console.error('Error updating payout:', error);
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
                    <h1 className="text-4xl font-bold mb-2">Payouts</h1>
                    <p className="text-slate-400">Manage TAS payouts</p>
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
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">TAS</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Amount</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Date</th>
                                    <th className="text-right py-4 px-6 text-slate-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payouts.map((payout) => (
                                    <tr key={payout.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                        <td className="py-4 px-6">
                                            <div className="font-medium">{payout.tas.user.email}</div>
                                            <div className="text-xs text-slate-400">PAN: {payout.tas.pan_number}</div>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-white">
                                            {formatCurrency(payout.amount)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`flex items-center gap-1 text-sm ${payout.status === 'COMPLETED' ? 'text-green-500' :
                                                    payout.status === 'PENDING' ? 'text-yellow-500' :
                                                        'text-red-500'
                                                }`}>
                                                {payout.status === 'COMPLETED' ? <CheckCircle className="w-4 h-4" /> :
                                                    payout.status === 'PENDING' ? <Clock className="w-4 h-4" /> :
                                                        <XCircle className="w-4 h-4" />}
                                                {payout.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-sm">
                                            {new Date(payout.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {payout.status === 'PENDING' && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(payout.id, 'COMPLETED')}
                                                        className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(payout.id, 'FAILED')}
                                                        className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg text-sm font-medium transition-colors"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {payouts.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No payouts found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
