'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    DollarSign,
    FileText,
    Download,
    Search,
    Filter,
    CheckCircle,
    Clock,
    XCircle,
    CreditCard,
    Receipt
} from 'lucide-react';

interface Invoice {
    id: string;
    invoice_number: string;
    job_id: string;
    base_amount: number;
    gst_amount: number;
    total_amount: number;
    currency: string;
    status: string;
    pdf_url?: string;
    created_at: string;
    job?: {
        title: string;
    };
}

interface PaymentRecord {
    id: string;
    amount: number;
    payment_type: string;
    status: string;
    gateway_id?: string;
    created_at: string;
    job?: {
        title: string;
    };
}

interface CurrentUser {
    id: string;
    email: string;
    role: string;
}

export default function PaymentsPage() {
    const router = useRouter();
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [payments, setPayments] = useState<PaymentRecord[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'invoices' | 'payments'>('invoices');

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchPaymentData();
        }
    }, [currentUser]);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
            router.push('/login');
        }
    };

    const fetchPaymentData = async () => {
        try {
            const [invoicesRes, paymentsRes] = await Promise.all([
                fetch('/api/admin/payments/invoices'),
                fetch('/api/admin/payments/records')
            ]);

            if (invoicesRes.ok) {
                const invoicesData = await invoicesRes.json();
                setInvoices(invoicesData.invoices || []);
            }

            if (paymentsRes.ok) {
                const paymentsData = await paymentsRes.json();
                setPayments(paymentsData.payments || []);
            }
        } catch (error) {
            console.error('Error fetching payment data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'SUCCESS':
            case 'PAID':
                return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'PENDING':
                return <Clock className="w-4 h-4 text-yellow-500" />;
            case 'FAILED':
            case 'VOID':
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return <Clock className="w-4 h-4 text-slate-500" />;
        }
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            SUCCESS: 'bg-emerald-500/20 text-emerald-400',
            PAID: 'bg-emerald-500/20 text-emerald-400',
            PENDING: 'bg-yellow-500/20 text-yellow-400',
            FAILED: 'bg-red-500/20 text-red-400',
            VOID: 'bg-red-500/20 text-red-400'
        };
        return colors[status as keyof typeof colors] || 'bg-slate-500/20 text-slate-400';
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-emerald-500/20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-1">Payment History</h1>
                        <p className="text-slate-400">View invoices, payments, and transaction history</p>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Invoices</p>
                                <p className="text-2xl font-bold text-white">{invoices.length}</p>
                            </div>
                            <FileText className="w-8 h-8 text-blue-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Paid Amount</p>
                                <p className="text-2xl font-bold text-white">
                                    ₹{invoices.filter(inv => inv.status === 'PAID').reduce((sum, inv) => sum + inv.total_amount, 0).toLocaleString()}
                                </p>
                            </div>
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Pending Payments</p>
                                <p className="text-2xl font-bold text-white">
                                    {payments.filter(p => p.status === 'PENDING').length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Payments</p>
                                <p className="text-2xl font-bold text-white">{payments.length}</p>
                            </div>
                            <CreditCard className="w-8 h-8 text-purple-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-900/50 p-1 rounded-lg border border-slate-800">
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'invoices'
                                ? 'bg-emerald-500 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Invoices
                    </button>
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${activeTab === 'payments'
                                ? 'bg-emerald-500 text-white'
                                : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Payment Records
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'invoices' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Invoices</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search invoices..."
                                        className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all w-64"
                                    />
                                </div>
                                <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {invoices.map((invoice) => (
                                <div key={invoice.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <Receipt className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-white">{invoice.invoice_number}</span>
                                                {getStatusIcon(invoice.status)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-400">
                                                    {invoice.job?.title || 'Job Payment'}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="font-medium text-white">₹{invoice.total_amount.toLocaleString()}</p>
                                            <p className="text-sm text-slate-400">
                                                {new Date(invoice.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {invoice.pdf_url && (
                                            <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                                                <Download className="w-4 h-4 text-slate-400" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-white">Payment Records</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Search payments..."
                                        className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all w-64"
                                    />
                                </div>
                                <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
                                    <Filter className="w-4 h-4 text-slate-400" />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                                            <CreditCard className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-white">
                                                    {payment.payment_type.replace('_', ' ')}
                                                </span>
                                                {getStatusIcon(payment.status)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-slate-400">
                                                    {payment.job?.title || 'Payment'}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                                                    {payment.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-white">₹{payment.amount.toLocaleString()}</p>
                                        <p className="text-sm text-slate-400">
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </p>
                                        {payment.gateway_id && (
                                            <p className="text-xs text-slate-500">ID: {payment.gateway_id}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}