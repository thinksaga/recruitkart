'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Clock, Loader2 } from 'lucide-react';

export default function FinanceInvoicesPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await fetch('/api/finance/invoices');
            if (res.ok) {
                const data = await res.json();
                setInvoices(data.invoices);
            }
        } catch (error) {
            console.error('Error fetching invoices:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const res = await fetch('/api/finance/invoices', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) fetchInvoices();
        } catch (error) {
            console.error('Error updating invoice:', error);
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
                    <h1 className="text-4xl font-bold mb-2">Invoices</h1>
                    <p className="text-slate-400">Manage company invoices</p>
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
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Organization</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Amount</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Due Date</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Status</th>
                                    <th className="text-right py-4 px-6 text-slate-300 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                        <td className="py-4 px-6">
                                            <div className="font-medium">{invoice.organization.name}</div>
                                            <div className="text-xs text-slate-400">GSTIN: {invoice.organization.gstin || 'N/A'}</div>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-white">
                                            {formatCurrency(invoice.amount)}
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-sm">
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`flex items-center gap-1 text-sm ${invoice.status === 'PAID' ? 'text-green-500' :
                                                    invoice.status === 'OVERDUE' ? 'text-red-500' :
                                                        'text-yellow-500'
                                                }`}>
                                                {invoice.status === 'PAID' ? <CheckCircle className="w-4 h-4" /> :
                                                    invoice.status === 'OVERDUE' ? <AlertCircle className="w-4 h-4" /> :
                                                        <Clock className="w-4 h-4" />}
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            {invoice.status !== 'PAID' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(invoice.id, 'PAID')}
                                                    className="px-3 py-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Mark Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {invoices.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No invoices found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
