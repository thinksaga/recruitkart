'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, History, TrendingUp, TrendingDown, AlertCircle, Zap, ShoppingCart, Check, Sparkles, Wallet, ArrowUpRight, ArrowDownRight, Package, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TASLayout from '@/components/dashboard/TASLayout';

interface Transaction {
    id: string;
    type: string;
    amount: number;
    balanceAfter: number;
    description: string;
    createdAt: string;
}

interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

const CREDIT_PACKAGES = [
    {
        credits: 10,
        price: 1000,
        popular: false,
        savings: 0,
        color: 'blue'
    },
    {
        credits: 25,
        price: 2250,
        popular: true,
        savings: 10,
        color: 'purple'
    },
    {
        credits: 50,
        price: 4000,
        popular: false,
        savings: 20,
        color: 'emerald'
    },
    {
        credits: 100,
        price: 7000,
        popular: false,
        savings: 30,
        color: 'orange'
    },
];

export default function TASCreditPage() {
    const [currentBalance, setCurrentBalance] = useState(0);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(CREDIT_PACKAGES[1]);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [purchasing, setPurchasing] = useState(false);

    const fetchCredits = async (page = 1) => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
            });

            const response = await fetch(`/api/tas/credits?${params}`);
            const data = await response.json();

            if (response.ok) {
                setCurrentBalance(data.currentBalance);
                setTransactions(data.transactions);
                setPagination(data.pagination);
                setCurrentPage(page);
            } else {
                alert(data.error || 'Failed to fetch credits');
            }
        } catch (error) {
            alert('Failed to fetch credits');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCredits();
    }, []);

    const handlePageChange = (page: number) => {
        fetchCredits(page);
    };

    const handlePurchase = async () => {
        setPurchasing(true);
        try {
            const response = await fetch('/api/tas/credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: selectedPackage.credits,
                    paymentMethod,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Credits purchased successfully!');
                setCurrentBalance(data.newBalance);
                setShowPurchaseModal(false);
                fetchCredits(currentPage);
            } else {
                alert(data.error || 'Failed to purchase credits');
            }
        } catch (error) {
            alert('Failed to purchase credits');
        } finally {
            setPurchasing(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getTransactionIcon = (type: string) => {
        switch (type) {
            case 'PURCHASE':
                return { icon: Plus, color: 'text-green-400', bg: 'bg-green-500/10' };
            case 'SUBMISSION':
                return { icon: TrendingDown, color: 'text-orange-400', bg: 'bg-orange-500/10' };
            case 'REFUND':
                return { icon: ArrowUpRight, color: 'text-blue-400', bg: 'bg-blue-500/10' };
            default:
                return { icon: History, color: 'text-slate-400', bg: 'bg-slate-500/10' };
        }
    };

    return (
        <TASLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/20">
                                    <CreditCard className="w-6 h-6 text-white" />
                                </div>
                                Credit Management
                            </h1>
                            <p className="text-slate-400 mt-2">Manage your credits and purchase history</p>
                        </div>
                    </div>

                    {/* Current Balance Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-slate-900 p-8"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Wallet className="w-5 h-5 text-blue-400" />
                                        <p className="text-slate-400 text-sm font-medium">Current Balance</p>
                                    </div>
                                    <div className="flex items-baseline gap-3">
                                        <p className="text-5xl font-bold text-white">{currentBalance}</p>
                                        <span className="text-xl text-slate-400">credits</span>
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">Use credits to submit candidates to jobs</p>

                                    {currentBalance < 10 && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-2 mt-4 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl w-fit"
                                        >
                                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                                            <span className="text-sm text-yellow-400 font-medium">Low balance - Consider purchasing more credits</span>
                                        </motion.div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowPurchaseModal(true)}
                                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all flex items-center gap-3 shadow-lg shadow-blue-500/30 group"
                                >
                                    <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span>Buy Credits</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Purchase Modal */}
                <AnimatePresence>
                    {showPurchaseModal && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                                onClick={() => !purchasing && setShowPurchaseModal(false)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                            >
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                                    <div className="p-6 border-b border-slate-800">
                                        <h2 className="text-2xl font-bold text-white">Choose Your Package</h2>
                                        <p className="text-slate-400 mt-1">Select the best credit package for your needs</p>
                                    </div>

                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                            {CREDIT_PACKAGES.map((pkg) => (
                                                <motion.div
                                                    key={pkg.credits}
                                                    whileHover={{ scale: 1.02 }}
                                                    onClick={() => setSelectedPackage(pkg)}
                                                    className={`relative p-6 rounded-xl border-2 cursor-pointer transition-all ${selectedPackage.credits === pkg.credits
                                                            ? 'border-blue-500 bg-blue-500/10'
                                                            : 'border-slate-800 bg-slate-800/30 hover:border-slate-700'
                                                        }`}
                                                >
                                                    {pkg.popular && (
                                                        <div className="absolute -top-3 right-4">
                                                            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-xs font-bold rounded-full shadow-lg">
                                                                MOST POPULAR
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className={`p-3 bg-${pkg.color}-500/10 border border-${pkg.color}-500/20 rounded-xl`}>
                                                            <Package className={`w-6 h-6 text-${pkg.color}-400`} />
                                                        </div>
                                                        {selectedPackage.credits === pkg.credits && (
                                                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                                                <Check className="w-4 h-4 text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-baseline gap-2 mb-2">
                                                        <span className="text-3xl font-bold text-white">{pkg.credits}</span>
                                                        <span className="text-slate-400">credits</span>
                                                    </div>

                                                    <div className="flex items-baseline gap-2 mb-3">
                                                        <span className="text-2xl font-bold text-white">{formatCurrency(pkg.price)}</span>
                                                        <span className="text-sm text-slate-500">one-time</span>
                                                    </div>

                                                    {pkg.savings > 0 && (
                                                        <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
                                                            <TrendingUp className="w-4 h-4" />
                                                            <span>Save {pkg.savings}%</span>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
                                            <h3 className="text-lg font-semibold text-white mb-4">Payment Method</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {['card', 'upi', 'netbanking'].map((method) => (
                                                    <button
                                                        key={method}
                                                        onClick={() => setPaymentMethod(method)}
                                                        className={`p-4 rounded-xl border-2 text-left transition-all ${paymentMethod === method
                                                                ? 'border-blue-500 bg-blue-500/10'
                                                                : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                                                            }`}
                                                    >
                                                        <p className="font-medium text-white capitalize">{method}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 mb-6">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-slate-400">Credits</span>
                                                <span className="text-white font-semibold">{selectedPackage.credits}</span>
                                            </div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-slate-400">Price</span>
                                                <span className="text-white font-semibold">{formatCurrency(selectedPackage.price)}</span>
                                            </div>
                                            <div className="border-t border-slate-700 my-3"></div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-white font-semibold">Total</span>
                                                <span className="text-2xl font-bold text-white">{formatCurrency(selectedPackage.price)}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setShowPurchaseModal(false)}
                                                disabled={purchasing}
                                                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={handlePurchase}
                                                disabled={purchasing}
                                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {purchasing ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                                        <span>Processing...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Zap className="w-5 h-5" />
                                                        <span>Complete Purchase</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Transaction History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <History className="w-6 h-6 text-blue-400" />
                            Transaction History
                        </h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 gap-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 animate-pulse">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
                                            <div className="space-y-2 flex-1">
                                                <div className="h-4 bg-slate-800 rounded w-1/3"></div>
                                                <div className="h-3 bg-slate-800 rounded w-1/4"></div>
                                            </div>
                                        </div>
                                        <div className="h-6 bg-slate-800 rounded w-16"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
                            <History className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No transactions yet</h3>
                            <p className="text-slate-400 mb-6">Your credit transaction history will appear here</p>
                            <button
                                onClick={() => setShowPurchaseModal(true)}
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20 inline-flex items-center gap-2"
                            >
                                <Plus className="w-5 h-5" />
                                Purchase Credits
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((transaction, index) => {
                                const { icon: Icon, color, bg } = getTransactionIcon(transaction.type);
                                const isPositive = transaction.type === 'PURCHASE' || transaction.type === 'REFUND';

                                return (
                                    <motion.div
                                        key={transaction.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-5 hover:border-blue-500/30 transition-all group"
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className={`p-3 ${bg} border border-slate-700 rounded-xl`}>
                                                    <Icon className={`w-5 h-5 ${color}`} />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-white font-medium mb-1">{transaction.description}</h3>
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-orange-400'}`}>
                                                    {isPositive ? '+' : '-'}{Math.abs(transaction.amount)}
                                                </p>
                                                <p className="text-xs text-slate-500">Balance: {transaction.balanceAfter}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`w-10 h-10 rounded-xl font-medium transition-all ${page === currentPage
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/20'
                                                : 'bg-slate-800 border border-slate-700 text-slate-400 hover:bg-slate-700'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === pagination.totalPages}
                                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </TASLayout>
    );
}
