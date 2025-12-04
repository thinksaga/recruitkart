'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, HelpCircle, ChevronDown, Building2, Briefcase, X, Shield, Zap, DollarSign } from 'lucide-react';

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

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />

                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-5xl md:text-7xl font-bold mb-6"
                    >
                        Simple, Transparent <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Utility Pricing</span>
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-400 max-w-2xl mx-auto mb-16"
                    >
                        No retainers. No hidden margins. Pay only for the infrastructure you use.
                    </motion.p>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24">
                        {/* Company Card */}
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="bg-slate-900 border border-indigo-500/30 p-8 rounded-3xl relative overflow-hidden group hover:border-indigo-500/50 transition-all hover:shadow-[0_0_40px_rgba(99,102,241,0.1)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500" />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">For Companies</h3>
                            </div>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold text-white">₹999</span>
                                <span className="text-slate-400">/ Job Post</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-8 text-left">
                                One-time infrastructure fee to filter spam and access verified talent.
                            </p>

                            <ul className="space-y-4 mb-8 text-left">
                                {[
                                    "Access to 500+ Verified TAS",
                                    "Video Interviews Included",
                                    "Escrow Smart Contract",
                                    "Full Audit Trail",
                                    "Success Fee: You Decide (Flexible)"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="p-1 rounded-full bg-indigo-500/20 text-indigo-400">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/login" className="block w-full py-4 rounded-xl bg-indigo-600 font-bold text-white hover:bg-indigo-500 transition-colors">
                                Post a Job
                            </Link>
                        </motion.div>

                        {/* TAS Card */}
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="bg-slate-900 border border-emerald-500/30 p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/50 transition-all hover:shadow-[0_0_40px_rgba(16,185,129,0.1)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">For Recruiters</h3>
                            </div>

                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-4xl font-bold text-white">₹99</span>
                                <span className="text-slate-400">/ Submission</span>
                            </div>
                            <p className="text-sm text-slate-500 mb-8 text-left">
                                Small commitment fee to ensure quality submissions and prevent spam.
                            </p>

                            <ul className="space-y-4 mb-8 text-left">
                                {[
                                    "Keep 99% of Success Fee",
                                    "Guaranteed Payouts (Escrow)",
                                    "Verified Candidate Badge",
                                    "Build Your Reputation",
                                    "No Business Development"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400">
                                            <Check className="w-3 h-3" />
                                        </div>
                                        {feat}
                                    </li>
                                ))}
                            </ul>
                            <Link href="/login" className="block w-full py-4 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-500 transition-colors">
                                Start Earning
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="py-20 bg-slate-900/30 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Why Recruitkart?</h2>
                        <p className="text-slate-400">See how we stack up against traditional options.</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-6 px-4 text-slate-400 font-medium">Feature</th>
                                    <th className="py-6 px-4 text-white font-bold text-lg bg-indigo-500/5 rounded-t-xl border-t border-x border-indigo-500/20">Recruitkart</th>
                                    <th className="py-6 px-4 text-slate-400 font-medium">Agencies</th>
                                    <th className="py-6 px-4 text-slate-400 font-medium">Job Boards</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    { feature: "Cost", recruitkart: "₹999 + ~1%", agency: "8.33% - 20%", jobboard: "₹5,000+" },
                                    { feature: "Candidate Quality", recruitkart: "Verified + Video", agency: "Hit or Miss", jobboard: "Spam Heavy" },
                                    { feature: "Time to Hire", recruitkart: "7 Days", agency: "30-60 Days", jobboard: "Variable" },
                                    { feature: "Trust", recruitkart: "Escrow Secured", agency: "Contracts", jobboard: "None" },
                                    { feature: "Spam Protection", recruitkart: "100%", agency: "Low", jobboard: "None" }
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-white/5 transition-colors">
                                        <td className="py-6 px-4 text-slate-300 font-medium">{row.feature}</td>
                                        <td className="py-6 px-4 text-emerald-400 font-bold bg-indigo-500/5 border-x border-indigo-500/20">{row.recruitkart}</td>
                                        <td className="py-6 px-4 text-slate-500">{row.agency}</td>
                                        <td className="py-6 px-4 text-slate-500">{row.jobboard}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Fee Breakdown */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Where does the money go?</h2>
                        <p className="text-slate-400">We believe in radical transparency.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-slate-950 border border-white/10 p-6 rounded-2xl">
                            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-indigo-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">KYC & Verification</h3>
                            <p className="text-sm text-slate-400">Verifying identity (PAN/Aadhaar) and professional history of every TAS.</p>
                        </div>
                        <div className="bg-slate-950 border border-white/10 p-6 rounded-2xl">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                                <DollarSign className="w-6 h-6 text-emerald-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Escrow Fees</h3>
                            <p className="text-sm text-slate-400">Gas fees and smart contract costs to secure your funds on the blockchain.</p>
                        </div>
                        <div className="bg-slate-950 border border-white/10 p-6 rounded-2xl">
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">Platform Infra</h3>
                            <p className="text-sm text-slate-400">Video interviewing platform, hosting, and real-time notifications.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-slate-900/30 border-t border-white/5">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "Is the ₹999 fee refundable?", a: "No. This is a utility fee that covers the cost of verification, escrow setup, and platform infrastructure. It also acts as a spam filter." },
                            { q: "Can I post multiple jobs?", a: "Yes, each job post requires a separate ₹999 fee to ensure quality and intent for that specific role." },
                            { q: "How are payments handled?", a: "We use a smart contract escrow system. You deposit the success fee, and it's automatically released to the recruiter on Day 91 of the candidate's tenure." },
                            { q: "Do you accept credit cards?", a: "Yes, we accept all major credit cards, UPI, and net banking for the infrastructure fee." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-slate-950 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 text-center">
                <h2 className="text-4xl font-bold mb-8">Ready to get started?</h2>
                <div className="flex justify-center gap-4">
                    <Link href="/login" className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-xl">
                        Post a Job
                    </Link>
                    <Link href="/login" className="px-8 py-4 text-lg font-bold text-slate-900 bg-emerald-400 rounded-full hover:bg-emerald-300 transition-all shadow-xl">
                        Join as Recruiter
                    </Link>
                </div>
            </section>
        </main>
    );
}
