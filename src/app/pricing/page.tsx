'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check, HelpCircle, ChevronDown, Building2, Users, Wallet, Shield,
    Clock, Award, Target, TrendingUp, IndianRupee, Zap, BadgeCheck,
    ArrowRight, Calculator, Phone, Video, Lock, Eye, Sparkles, X
} from 'lucide-react';

const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-slate-950/50 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Recruitkart Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-white tracking-tight">Recruitkart</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="/for-companies" className="hover:text-white transition-colors">For Companies</Link>
            <Link href="/for-recruiters" className="hover:text-white transition-colors">For TAS</Link>
            <Link href="/pricing" className="text-white transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            Get Started
        </Link>
    </nav>
);

export default function Pricing() {
    const [ctc, setCtc] = useState(1000000);
    const [placements, setPlacements] = useState(3);

    const agencyFee = ctc * 0.1667;
    const recruitkartFee = 999 + (ctc * 0.01);
    const companySavings = agencyFee - recruitkartFee;

    const avgSuccessFee = 75000;
    const agencyEarnings = placements * avgSuccessFee * 0.30;
    const tasEarnings = placements * avgSuccessFee * 0.99;
    const tasExtraEarnings = tasEarnings - agencyEarnings;

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />

                <div className="container mx-auto max-w-7xl relative z-10">
                    <div className="text-center mb-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
                        >
                            <Calculator className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400">Transparent Pricing</span>
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-6xl font-bold mb-6"
                        >
                            No Hidden Fees. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Just Pure Value.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-3xl mx-auto"
                        >
                            No retainers. No lock-ins. No surprise charges. Pay only for what you use.
                        </motion.p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-20">
                        {/* Company Card */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-slate-900/50 border border-emerald-500/30 p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-all backdrop-blur-sm"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">For Companies</h3>
                                    <p className="text-sm text-slate-400">Hire quality talent, save 90%</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-bold text-white">₹999</span>
                                    <span className="text-slate-400">per job post</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-emerald-400">+ Your %</span>
                                    <span className="text-slate-400">success fee (you decide)</span>
                                </div>
                            </div>

                            <div className="bg-slate-950/50 rounded-xl p-4 mb-6">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">What You Get</p>
                                <ul className="space-y-3">
                                    {[
                                        { text: "15-day job visibility", icon: Clock },
                                        { text: "Access to 1,247 verified TAS", icon: Users },
                                        { text: "Escrow smart contract protection", icon: Shield },
                                        { text: "Platform Zoom integration + recordings", icon: Video },
                                        { text: "Zero-knowledge data privacy", icon: Lock },
                                        { text: "48h candidate lock protection", icon: Phone }
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <div className="w-5 h-5 bg-emerald-500/20 rounded flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-emerald-400" />
                                            </div>
                                            <span className="text-sm">{feat.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link href="/signup?role=company" className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 font-bold text-white hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center justify-center gap-2 group">
                                Post a Job
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* TAS Card */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900/50 border border-purple-500/30 p-8 rounded-3xl relative overflow-hidden group hover:border-purple-500/50 transition-all backdrop-blur-sm"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />

                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">For Recruiters (TAS)</h3>
                                    <p className="text-sm text-slate-400">Earn 99% commission</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <div className="flex items-baseline gap-2 mb-2">
                                    <span className="text-5xl font-bold text-white">₹99</span>
                                    <span className="text-slate-400">per submission</span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-purple-400">99%</span>
                                    <span className="text-slate-400">of success fee (You keep)</span>
                                </div>
                            </div>

                            <div className="bg-slate-950/50 rounded-xl p-4 mb-6">
                                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">What You Get</p>
                                <ul className="space-y-3">
                                    {[
                                        { text: "48h candidate lock guarantee", icon: Lock },
                                        { text: "Day 91 automatic payout", icon: Clock },
                                        { text: "Reputation score system", icon: Award },
                                        { text: "Access to 342 verified companies", icon: Building2 },
                                        { text: "Analytics dashboard", icon: TrendingUp },
                                        { text: "Priority support", icon: BadgeCheck }
                                    ].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <div className="w-5 h-5 bg-purple-500/20 rounded flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-purple-400" />
                                            </div>
                                            <span className="text-sm">{feat.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Link href="/signup?role=tas" className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 font-bold text-white hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 group">
                                Join as Recruiter
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Dual Calculator Section */}
                    <div className="grid lg:grid-cols-2 gap-8 mb-20">
                        {/* Company Calculator */}
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-3xl p-8 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Calculator className="w-6 h-6 text-emerald-400" />
                                <h3 className="text-2xl font-bold text-white">Company Savings Calculator</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-4">
                                        Annual CTC: ₹{(ctc / 100000).toFixed(1)}L
                                    </label>
                                    <input
                                        type="range"
                                        min="300000"
                                        max="5000000"
                                        step="100000"
                                        value={ctc}
                                        onChange={(e) => setCtc(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                                        <span>₹3L</span>
                                        <span>₹50L</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Traditional Agency (16.67%)</span>
                                        <span className="text-red-400 font-mono">₹{Math.round(agencyFee / 1000)}K</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">RecruitKart (₹999 + Your %)</span>
                                        <span className="text-emerald-400 font-mono">₹{Math.round(recruitkartFee / 1000)}K</span>
                                    </div>
                                </div>

                                <div className="bg-slate-950 rounded-xl p-6 border border-emerald-500/30">
                                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">You Save</p>
                                    <h4 className="text-4xl font-bold text-white mb-2">
                                        ₹{Math.round(companySavings / 1000)}K
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>That's {Math.round((companySavings / agencyFee) * 100)}% cost reduction</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* TAS Calculator */}
                        <motion.div
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-3xl p-8 backdrop-blur-sm"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <Wallet className="w-6 h-6 text-purple-400" />
                                <h3 className="text-2xl font-bold text-white">TAS Earnings Calculator</h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-4">
                                        Placements per month: {placements}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={placements}
                                        onChange={(e) => setPlacements(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                                    />
                                    <div className="flex justify-between mt-2 text-xs text-slate-400">
                                        <span>1</span>
                                        <span>10</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Traditional Agency (30%)</span>
                                        <span className="text-red-400 font-mono line-through">₹{Math.round(agencyEarnings / 1000)}K</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">RecruitKart (99%)</span>
                                        <span className="text-purple-400 font-mono">₹{Math.round(tasEarnings / 1000)}K</span>
                                    </div>
                                </div>

                                <div className="bg-slate-950 rounded-xl p-6 border border-purple-500/30">
                                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">You Earn Extra</p>
                                    <h4 className="text-4xl font-bold text-white mb-2">
                                        ₹{Math.round(tasExtraEarnings / 1000)}K
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-purple-400">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>Annual potential: ₹{Math.round((tasEarnings * 12) / 100000)}L+</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Comparison Table */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-white mb-4">How We Compare</h2>
                        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                            See why 342 companies and 1,247 recruiters choose RecruitKart over traditional agencies.
                        </p>

                        <div className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left p-6 text-slate-400 font-medium">Feature</th>
                                            <th className="text-center p-6">
                                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                                    <Sparkles className="w-4 h-4 text-emerald-400" />
                                                    <span className="font-bold text-emerald-400">RecruitKart</span>
                                                </div>
                                            </th>
                                            <th className="text-center p-6 text-slate-400 font-medium">Traditional Agency</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {[
                                            { feature: 'Company Fee', ours: '₹999 + Your %', theirs: '8.33% - 20%', winner: 'ours' },
                                            { feature: 'Recruiter Earnings', ours: '99% of fee', theirs: '30-40% of fee', winner: 'ours' },
                                            { feature: 'Payout Timeline', ours: 'Day 91 (Auto)', theirs: '6-12 months', winner: 'ours' },
                                            { feature: 'Data Privacy', ours: 'DPDP Compliant', theirs: 'Leaky databases', winner: 'ours' },
                                            { feature: 'Candidate Lock', ours: '48h cryptographic', theirs: 'None', winner: 'ours' },
                                            { feature: 'Evidence Layer', ours: 'Platform Zoom + Recordings', theirs: 'PDF Resume', winner: 'ours' }
                                        ].map((row, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="p-6 text-white font-medium">{row.feature}</td>
                                                <td className="p-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                                        <span className="text-emerald-400 font-semibold">{row.ours}</span>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                                                        <span className="text-slate-400 line-through">{row.theirs}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    q: "Is the ₹999 fee refundable?",
                                    a: "No. The ₹999 is a utility charge to prevent spam and maintain infrastructure. It ensures only serious companies post jobs, protecting recruiters from fake postings."
                                },
                                {
                                    q: "When do TAS get paid?",
                                    a: "Funds are automatically released from the Escrow Smart Contract on Day 91 of the candidate's tenure. No invoicing, no chasing—completely automated."
                                },
                                {
                                    q: "What happens if candidate quits before Day 91?",
                                    a: "If the candidate leaves within 90 days, the escrow is released back to the company. No payment is made to the TAS. This protects both parties."
                                },
                                {
                                    q: "How is the success fee calculated?",
                                    a: "You decide the success fee percentage when posting a job. The fee is calculated on the candidate's annual CTC at the time of joining. For example, if you set 5% on ₹10L CTC = ₹50,000 success fee."
                                },
                                {
                                    q: "Can I post multiple jobs with ₹999?",
                                    a: "No. Each job posting requires a separate ₹999 infrastructure fee. However, you get 15 days of visibility and 50 profile unlocks per job."
                                },
                                {
                                    q: "What is the 48h candidate lock?",
                                    a: "When a TAS submits a candidate via phone number, that candidate is cryptographically locked to them for 48 hours. No other TAS can submit the same person."
                                },
                                {
                                    q: "Is KYC mandatory for TAS?",
                                    a: "Yes. All TAS must complete PAN/Aadhaar verification to join the platform. This ensures company trust and maintains quality standards."
                                },
                                {
                                    q: "What if the company doesn't deposit escrow?",
                                    a: "The job will not go live to TAS until the success fee is deposited in escrow. This protects recruiters from companies who don't intend to pay."
                                }
                            ].map((faq, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-slate-900/50 border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 transition-all"
                                >
                                    <h4 className="font-bold text-white mb-3 flex items-start gap-3">
                                        <HelpCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span>{faq.q}</span>
                                    </h4>
                                    <p className="text-slate-400 text-sm leading-relaxed pl-8">{faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
