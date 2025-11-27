'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle, ArrowRight, TrendingUp, Users, DollarSign } from 'lucide-react';

const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-slate-950/50 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Recruitkart Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-white tracking-tight">Recruitkart</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="/for-companies" className="hover:text-white transition-colors">For Companies</Link>
            <Link href="/for-recruiters" className="text-white transition-colors">For TAS</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            Get Started
        </Link>
    </nav>
);

export default function ForRecruiters() {
    const [placements, setPlacements] = useState(5);
    const avgSuccessFee = 50000;
    const earnings = placements * avgSuccessFee * 0.99;

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20"
                        >
                            <Wallet className="w-8 h-8 text-emerald-400" />
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-6"
                        >
                            Monetize your network. <br />
                            Keep <span className="text-emerald-400">99%</span>.
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-2xl"
                        >
                            Stop giving 20-50% to agencies. Join the protocol as a Trusted Acquisition Specialist (TAS) and own your earnings.
                        </motion.p>
                    </div>

                    {/* Calculator */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12 mb-20 max-w-4xl mx-auto backdrop-blur-sm"
                    >
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 w-full space-y-8">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-4">Number of Placements / Month</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="20"
                                        value={placements}
                                        onChange={(e) => setPlacements(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between mt-2 text-sm text-slate-500 font-mono">
                                        <span>1</span>
                                        <span className="text-white font-bold">{placements}</span>
                                        <span>20</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Avg. Success Fee</span>
                                        <span className="text-white font-mono">₹{avgSuccessFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Platform Fee (1%)</span>
                                        <span className="text-red-400 font-mono">- ₹{(placements * avgSuccessFee * 0.01).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 w-full bg-slate-950 rounded-2xl p-8 border border-emerald-500/20 text-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
                                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2 relative z-10">Your Monthly Earnings</p>
                                <h3 className="text-4xl md:text-5xl font-bold text-white mb-2 relative z-10">
                                    ₹{earnings.toLocaleString()}
                                </h3>
                                <p className="text-emerald-400 text-sm font-medium relative z-10">Paid instantly on Day 91</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-4 gap-4 mb-20">
                        {[
                            { title: "Verify PAN", icon: <CheckCircle className="w-5 h-5" /> },
                            { title: "Buy Credits", icon: <DollarSign className="w-5 h-5" /> },
                            { title: "Submit", icon: <Users className="w-5 h-5" /> },
                            { title: "Earn", icon: <TrendingUp className="w-5 h-5" /> }
                        ].map((step, i) => (
                            <div key={i} className="bg-slate-900 border border-white/5 p-6 rounded-xl flex flex-col items-center text-center gap-3">
                                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-emerald-400">
                                    {step.icon}
                                </div>
                                <span className="font-bold text-slate-200">{step.title}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <Link href="/login" className="px-8 py-4 text-lg font-bold text-slate-900 bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:shadow-[0_0_50px_rgba(52,211,153,0.5)] flex items-center gap-2 mx-auto">
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
