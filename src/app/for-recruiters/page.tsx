'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wallet, CheckCircle, ArrowRight, TrendingUp, Users, DollarSign, Search, Shield, Briefcase, Zap } from 'lucide-react';

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
    const [placements, setPlacements] = useState(3);
    const avgSuccessFee = 50000;
    const earnings = placements * avgSuccessFee * 0.99;

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8"
                        >
                            <Briefcase className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">For Independent Recruiters</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                        >
                            Monetize Your Network. <br />
                            Keep <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">99% of the Fee</span>.
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-2xl mb-10"
                        >
                            Stop chasing clients and invoices. We bring the jobs and guarantee the payments. You just focus on finding the best talent.
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/login" className="px-8 py-4 text-lg font-bold text-slate-900 bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all shadow-[0_0_30px_rgba(52,211,153,0.3)] hover:shadow-[0_0_50px_rgba(52,211,153,0.5)] flex items-center gap-2">
                                Start Earning
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="#calculator" className="px-8 py-4 text-lg font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
                                Calculate Income
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Value Props */}
            <section className="py-20 bg-slate-900/30 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Search className="w-8 h-8 text-emerald-400" />,
                                title: "No Business Development",
                                desc: "Forget cold calling companies. Verified jobs with locked success fees are live on the platform waiting for you."
                            },
                            {
                                icon: <Wallet className="w-8 h-8 text-indigo-400" />,
                                title: "Guaranteed Payouts",
                                desc: "Success fees are deposited in escrow BEFORE you start working. No more chasing invoices or bad debts."
                            },
                            {
                                icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
                                title: "Build Your Brand",
                                desc: "Your track record is verified on-chain. Build a reputation as a top-tier recruiter and attract premium fees."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-950 border border-white/10 p-8 rounded-2xl hover:border-emerald-500/30 transition-all group"
                            >
                                <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-slate-800 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Calculator */}
            <section id="calculator" className="py-24 relative">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Estimate Your Earnings</h2>
                        <p className="text-xl text-slate-400">See how much you can make as a TAS.</p>
                    </div>

                    <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-sm shadow-2xl">
                        <div className="flex flex-col md:flex-row gap-12 items-center">
                            <div className="flex-1 w-full space-y-8">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-4">Placements per Month</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        step="1"
                                        value={placements}
                                        onChange={(e) => setPlacements(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between mt-4">
                                        {[1, 3, 5, 7, 10].map(val => (
                                            <button
                                                key={val}
                                                onClick={() => setPlacements(val)}
                                                className={`w-8 h-8 rounded-full text-sm font-bold transition-all ${placements === val ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4 pt-4 border-t border-white/5">
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
                                <p className="text-slate-400 text-sm uppercase tracking-wider mb-2 relative z-10">Your Monthly Income</p>
                                <h3 className="text-5xl md:text-6xl font-bold text-white mb-4 relative z-10">
                                    ₹{earnings.toLocaleString()}
                                </h3>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 relative z-10">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span className="text-xs font-bold text-emerald-400 uppercase">Guaranteed Payout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            A streamlined workflow designed for speed and transparency.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "01", title: "Get Verified", desc: "Complete your profile and pass the KYC check (PAN/Aadhaar) to become a TAS." },
                            { step: "02", title: "Browse Jobs", desc: "Access live jobs with pre-funded escrow accounts. Filter by role, fee, and location." },
                            { step: "03", title: "Submit Talent", desc: "Upload candidate profiles and conduct video interviews on the platform." },
                            { step: "04", title: "Get Paid", desc: "Once your candidate is hired and completes 90 days, funds are auto-released." }
                        ].map((item, i) => (
                            <div key={i} className="relative group">
                                <div className="text-6xl font-bold text-slate-800 mb-4 group-hover:text-emerald-500/20 transition-colors">{item.step}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Is there a joining fee?", a: "No. Joining Recruitkart as a TAS is completely free. You only pay a small fee (₹99) per candidate submission to prevent spam." },
                            { q: "When do I get paid?", a: "Payments are released automatically by the smart contract on Day 91 of the candidate's tenure at the company." },
                            { q: "What if the company rejects my candidate?", a: "You will be notified instantly. You can then submit the same candidate to other relevant jobs on the platform." },
                            { q: "Can agencies join as TAS?", a: "Yes, individual recruiters from agencies can join, but they must complete KYC as individuals." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-slate-950 border border-white/10 rounded-xl p-6 hover:border-emerald-500/20 transition-colors">
                                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-600/10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to monetize your network?</h2>
                    <Link href="/login" className="inline-flex items-center gap-2 px-10 py-5 text-xl font-bold text-slate-900 bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all shadow-xl hover:scale-105">
                        Join as a Recruiter
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
