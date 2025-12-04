'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, HelpCircle, ChevronDown } from 'lucide-react';

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
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6 relative">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6">Transparent Pricing</h1>
                        <p className="text-xl text-slate-400">No hidden fees. No retainer. Pay for utility.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
                        {/* Company Card */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-slate-900 border border-indigo-500/30 p-8 rounded-3xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                            <h3 className="text-2xl font-bold text-white mb-2">For Companies</h3>
                            <div className="text-4xl font-bold text-white mb-6">
                                ₹999 <span className="text-lg text-slate-400 font-normal">/ Job</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {["15 Day Visibility", "50 Profile Unlocks", "Escrow Protection", "Verified TAS Network", "Video Interviews"].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <Check className="w-5 h-5 text-indigo-400" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-colors">
                                Post a Job
                            </button>
                        </motion.div>

                        {/* TAS Card */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900 border border-emerald-500/30 p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-colors"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                            <h3 className="text-2xl font-bold text-white mb-2">For Recruiters (TAS)</h3>
                            <div className="text-4xl font-bold text-white mb-6">
                                ₹99 <span className="text-lg text-slate-400 font-normal">/ Submission</span>
                            </div>
                            <ul className="space-y-4 mb-8">
                                {["Inventory Lock (48h)", "1% Commission Cap", "Auto-Payout (Day 91)", "Verified Candidate Badge", "Analytics Dashboard"].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <Check className="w-5 h-5 text-emerald-400" />
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500 transition-colors">
                                Buy Credits
                            </button>
                        </motion.div>
                    </div>

                    {/* FAQ */}
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-slate-400" />
                                    Is the Infra Fee refundable?
                                </h4>
                                <p className="text-slate-400 text-sm">No. The ₹999 fee is a utility charge to prevent spam and maintain the infrastructure. It ensures only serious companies post jobs.</p>
                            </div>
                            <div className="bg-slate-900/50 border border-white/5 rounded-xl p-6">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-slate-400" />
                                    When do I get paid?
                                </h4>
                                <p className="text-gray-600">&quot;Recruitkart has transformed how we hire. The transparency and speed are unmatched.&quot;</p>
                                <p className="text-slate-400 text-sm">Funds are automatically released from the Escrow Smart Contract on Day 91 of the candidate's tenure at the company.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
