'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Video, ArrowRight, Building2, Lock, Users, Zap, DollarSign, Clock, FileCheck } from 'lucide-react';

const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-slate-950/50 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Recruitkart Logo" width={40} height={40} className="rounded-full" />
            <span className="text-xl font-bold text-white tracking-tight">Recruitkart</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <Link href="/for-companies" className="text-white transition-colors">For Companies</Link>
            <Link href="/for-recruiters" className="hover:text-white transition-colors">For TAS</Link>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            Get Started
        </Link>
    </nav>
);

export default function ForCompanies() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
                        >
                            <Building2 className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-bold text-indigo-300 uppercase tracking-wider">For Forward-Thinking Companies</span>
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                        >
                            Hire Top Talent for <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">₹999 + Success Fee</span>
                        </motion.h1>

                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-2xl mb-10"
                        >
                            Stop paying 20% commissions to agencies. Access a network of verified recruiters (TAS) who work on a flat utility fee model.
                        </motion.p>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link href="/login" className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] flex items-center gap-2">
                                Post a Job
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/pricing" className="px-8 py-4 text-lg font-bold text-white bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all flex items-center gap-2">
                                View Pricing
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Problem / Solution */}
            <section className="py-20 bg-slate-900/30 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">The Old Way is Broken</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                                        <DollarSign className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Exorbitant Fees</h3>
                                        <p className="text-slate-400">Agencies charge 8.33% to 20% of annual CTC. For a ₹20L hire, you pay ₹4L+.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                                        <Clock className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Slow Turnaround</h3>
                                        <p className="text-slate-400">Weeks of back-and-forth emails, scheduling conflicts, and manual follow-ups.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                                        <FileCheck className="w-6 h-6 text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-1">Unverified Candidates</h3>
                                        <p className="text-slate-400">Flooded with irrelevant resumes. No way to verify skills before the interview.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-emerald-500/20 blur-3xl" />
                            <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-8">
                                <h3 className="text-2xl font-bold text-white mb-6">The Recruitkart Way</h3>
                                <div className="space-y-4">
                                    {[
                                        "Flexible Success Fee (Decided by You)",
                                        "Instant Access to Verified TAS Network",
                                        "Video Interviews with Every Profile",
                                        "Escrow Protection for Your Funds",
                                        "Full Audit Trail & Compliance"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            <span className="text-slate-300 font-medium">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-slate-400">Average Savings</p>
                                            <p className="text-3xl font-bold text-white">90%</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-400">Time to Hire</p>
                                            <p className="text-3xl font-bold text-white">7 Days</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            A simple, transparent process designed for speed and trust.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-5 gap-4">
                        {[
                            { step: "01", title: "Post a Job", desc: "Create a job listing for ₹999. This filters out spam and signals intent." },
                            { step: "02", title: "Lock Success Fee", desc: "You decide the success fee. Deposit it into escrow to start." },
                            { step: "03", title: "Review Candidates", desc: "TAS submit verified profiles. You review and shortlist." },
                            { step: "04", title: "Interview", desc: "End-to-end interviews on platform. Recordings kept for reference." },
                            { step: "05", title: "Hire & Release", desc: "Select your candidate. Funds auto-released on Day 91." }
                        ].map((item, i) => (
                            <div key={i} className="relative group p-4 border border-white/5 rounded-2xl bg-slate-900/20 hover:bg-slate-900/40 transition-colors">
                                <div className="text-4xl font-bold text-slate-800 mb-3 group-hover:text-indigo-500/20 transition-colors">{item.step}</div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Comparison */}
            <section className="py-24 bg-slate-900/50 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-4xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Unbeatable Economics</h2>
                        <p className="text-slate-400">See how much you save with Recruitkart.</p>
                    </div>

                    <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="grid grid-cols-3 bg-white/5 p-6 border-b border-white/10 text-sm font-bold uppercase tracking-wider">
                            <div className="text-slate-400">Role / CTC</div>
                            <div className="text-slate-500">Agency Fee (8.33%)</div>
                            <div className="text-indigo-400">Your Offer (e.g. 1%)</div>
                        </div>
                        <div className="divide-y divide-white/5">
                            {[
                                { role: "Junior Dev (₹10L)", agency: "₹83,300", recruitkart: "₹10,000" },
                                { role: "Senior Dev (₹30L)", agency: "₹2,49,900", recruitkart: "₹30,000" },
                                { role: "Product Mgr (₹50L)", agency: "₹4,16,500", recruitkart: "₹50,000" },
                                { role: "VP Engg (₹1Cr)", agency: "₹8,33,000", recruitkart: "₹1,00,000" }
                            ].map((row, i) => (
                                <div key={i} className="grid grid-cols-3 p-6 hover:bg-white/5 transition-colors">
                                    <div className="text-white font-medium">{row.role}</div>
                                    <div className="text-slate-400">{row.agency}</div>
                                    <div className="text-emerald-400 font-bold">{row.recruitkart}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p className="text-center text-slate-500 text-sm mt-6">
                        * You decide the Success Fee. It can be anything you choose.
                    </p>
                </div>
            </section>

            {/* Trust & Compliance */}
            <section className="py-24 relative">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                                <Shield className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Enterprise Grade Security</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Compliance Built-In</h2>
                            <p className="text-slate-400 text-lg mb-8">
                                We take security and compliance seriously. Our platform ensures every interaction is logged, verified, and secure.
                            </p>
                            <div className="grid grid-cols-2 gap-6">
                                {[
                                    { icon: <FileCheck className="w-5 h-5" />, text: "Full Audit Trail" },
                                    { icon: <Lock className="w-5 h-5" />, text: "Data Privacy" },
                                    { icon: <Users className="w-5 h-5" />, text: "KYC Verified TAS" },
                                    { icon: <Shield className="w-5 h-5" />, text: "Escrow Protection" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 text-white font-medium">
                                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
                                            {item.icon}
                                        </div>
                                        {item.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 blur-3xl" />
                            <div className="relative bg-slate-950 border border-white/10 rounded-2xl p-8 shadow-2xl">
                                <h3 className="text-xl font-bold text-white mb-6">Escrow Status</h3>
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-slate-300">Funds Locked</span>
                                        </div>
                                        <span className="text-white font-mono">₹50,000.00</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            <span className="text-slate-300">Release Date</span>
                                        </div>
                                        <span className="text-white font-mono">Day 91</span>
                                    </div>
                                    <div className="p-4 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
                                        <p className="text-sm text-indigo-300">
                                            Funds are automatically released to the recruiter only after the candidate completes 90 days of employment.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-slate-900/30 border-t border-white/5">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
                    <div className="space-y-6">
                        {[
                            { q: "What if I don't find a candidate?", a: "Your Success Fee is fully refundable if you don't hire anyone. The ₹999 posting fee is non-refundable." },
                            { q: "How do you verify recruiters (TAS)?", a: "Every TAS undergoes strict KYC verification (PAN/Aadhaar) before they can join the platform." },
                            { q: "Can I interview candidates before hiring?", a: "Absolutely. You get video interview recordings with every profile, and you can schedule your own rounds." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-slate-950 border border-white/10 rounded-xl p-6">
                                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-slate-400">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Footer */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-indigo-600/10" />
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to start hiring?</h2>
                    <Link href="/login" className="inline-flex items-center gap-2 px-10 py-5 text-xl font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-xl hover:scale-105">
                        Post a Job Now
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
