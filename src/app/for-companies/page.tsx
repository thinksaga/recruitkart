'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield, CheckCircle, Video, ArrowRight, Building2, Lock, Users,
    Wallet, Eye, Database, Award, Target, Sparkles, TrendingUp,
    Clock, IndianRupee, Phone, FileText, BadgeCheck, Zap, Play,
    Calculator, DollarSign, ShieldCheck, AlertCircle, Briefcase
} from 'lucide-react';

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
    const [ctc, setCtc] = useState(1000000);
    const agencyFee = ctc * 0.1667; // 16.67% (2 months CTC)
    const recruitkartFee = 999 + (ctc * 0.01);
    const savings = agencyFee - recruitkartFee;

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
                        >
                            <Building2 className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400">For Hiring Teams</span>
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                        >
                            Hire Talent for <span className="text-emerald-400">₹999</span>.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Save 90% on Fees.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-300 max-w-3xl leading-relaxed"
                        >
                            No more 8-20% agency commissions. Pay <strong className="text-white">₹999 per job</strong> + <strong className="text-white">set your own success fee %</strong>.
                            Access 1,247 verified recruiters. Escrow-protected hiring. DPDP compliant.
                        </motion.p>

                        {/* Live Stats Banner */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center gap-8 mt-8 px-8 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl"
                        >
                            {[
                                { label: 'Avg. Savings', value: '₹1.2L', icon: TrendingUp, color: 'emerald' },
                                { label: 'Active Jobs', value: '342', icon: Briefcase, color: 'indigo' },
                                { label: 'Time to Hire', value: '18 days', icon: Clock, color: 'purple' }
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-10 h-10 bg-${stat.color}-500/10 rounded-lg flex items-center justify-center`}>
                                        <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-lg font-bold text-white">{stat.value}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* ROI Calculator */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 rounded-3xl p-8 md:p-12 mb-20 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Calculator className="w-6 h-6 text-emerald-400" />
                            <h2 className="text-2xl font-bold text-white">Calculate Your Savings</h2>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-4">
                                        Annual CTC for this role
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
                                    <div className="flex justify-between mt-2 text-sm text-slate-400">
                                        <span>₹3L</span>
                                        <span className="text-white font-bold text-lg">₹{(ctc / 100000).toFixed(1)}L</span>
                                        <span>₹50L</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">Traditional Agency (16.67%)</span>
                                        <span className="text-red-400 font-mono">- ₹{Math.round(agencyFee / 1000)}K</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-400">RecruitKart (₹999 + Your %)</span>
                                        <span className="text-emerald-400 font-mono">- ₹{Math.round(recruitkartFee / 1000)}K</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-950 rounded-2xl p-8 border border-emerald-500/30 relative overflow-hidden">
                                <div className="absolute inset-0 bg-emerald-500/5" />
                                <div className="relative z-10">
                                    <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">You Save Per Hire</p>
                                    <h3 className="text-5xl font-bold text-white mb-4">
                                        ₹{Math.round(savings / 1000)}K
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>That's {Math.round((savings / agencyFee) * 100)}% cost reduction</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <Calculator className="w-4 h-4" />
                                            <span>3 hires = ₹{Math.round((savings * 3) / 100000)}L+ saved annually</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature Grid */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center text-white mb-4">Why Companies Choose RecruitKart</h2>
                        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                            Everything you need to hire quality talent, minus the agency overhead.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <IndianRupee className="w-6 h-6 text-emerald-400" />,
                                    title: "₹999 Job Post",
                                    desc: "One-time infrastructure fee. No retainers, no hidden costs. Post unlimited job openings.",
                                    badge: "90% Cheaper"
                                },
                                {
                                    icon: <Wallet className="w-6 h-6 text-indigo-400" />,
                                    title: "Escrow Protection",
                                    desc: "Success fee locked in smart contract. Auto-release on Day 91 of candidate tenure. Zero payment disputes.",
                                    badge: "100% Secured"
                                },
                                {
                                    icon: <Eye className="w-6 h-6 text-purple-400" />,
                                    title: "Zero-Knowledge Protocol",
                                    desc: "TAS submits profiles. You conduct interviews via integrated Zoom. Structured data, no PDFs. DPDP Act compliant.",
                                    badge: "Privacy First"
                                },
                                {
                                    icon: <Phone className="w-6 h-6 text-cyan-400" />,
                                    title: "48h Candidate Lock",
                                    desc: "Recruiter submits via phone number. Candidate locked to them for 48 hours. No poaching.",
                                    badge: "Fair Play"
                                },
                                {
                                    icon: <BadgeCheck className="w-6 h-6 text-emerald-400" />,
                                    title: "Verified Recruiters Only",
                                    desc: "Every TAS is PAN/Aadhaar verified. Reputation score tracked. No spam submissions.",
                                    badge: "Quality Guaranteed"
                                },
                                {
                                    icon: <Video className="w-6 h-6 text-purple-400" />,
                                    title: "Platform Zoom Integration",
                                    desc: "Conduct all interviews via RecruitKart's integrated Zoom. Access all interview recordings anytime.",
                                    badge: "Recorded & Accessible"
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ y: 20, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl hover:border-emerald-500/30 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                                            {feature.icon}
                                        </div>
                                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                                            {feature.badge}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-2 text-white">{feature.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* How It Works */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">Hire in 4 Simple Steps</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { step: '1', title: 'Verify & Post', desc: 'Complete PAN/GSTIN KYC. Pay ₹999. Job goes live to 1,247 verified TAS.', icon: <BadgeCheck className="w-5 h-5" />, time: '5 min' },
                                { step: '2', title: 'Deposit Escrow', desc: 'Lock success fee in smart contract. Funds held securely until Day 91.', icon: <Wallet className="w-5 h-5" />, time: '2 min' },
                                { step: '3', title: 'Interview on Platform', desc: 'TAS submits profiles. Conduct interviews via integrated Zoom. Access all recordings.', icon: <Video className="w-5 h-5" />, time: 'Ongoing' },
                                { step: '4', title: 'Hire & Auto-Release', desc: 'Offer accepted? Recruiter gets paid automatically on Day 91.', icon: <TrendingUp className="w-5 h-5" />, time: 'Auto' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl hover:border-indigo-500/30 transition-all relative"
                                >
                                    <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-xl font-bold text-indigo-400">{item.step}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-400 mb-4 leading-relaxed">{item.desc}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                        <Clock className="w-3 h-3" />
                                        <span>{item.time}</span>
                                    </div>
                                    {i < 3 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-3 z-20">
                                            <ArrowRight className="w-6 h-6 text-white/20" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Video Mockup */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video max-w-5xl mx-auto mb-20"
                    >
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-emerald-500/20 backdrop-blur-md rounded-full flex items-center justify-center border border-emerald-500/30 mx-auto mb-4 group hover:bg-emerald-500/30 transition-all cursor-pointer">
                                    <Play className="w-10 h-10 text-emerald-400" />
                                </div>
                                <p className="text-white font-semibold text-lg mb-2">See How It Works</p>
                                <p className="text-slate-400 text-sm">Watch a 2-minute demo of the hiring process</p>
                            </div>
                        </div>
                        <Image
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
                            alt="Video Interface"
                            fill
                            className="object-cover opacity-20"
                        />
                    </motion.div>

                    {/* Social Proof */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">Trusted by 342 Companies</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { quote: "Saved ₹2.4L on 3 hires in Q4. The escrow system gives complete peace of mind.", author: "Rahul Sharma", role: "CTO, FinTech Startup", location: "Bangalore" },
                                { quote: "Finally a recruitment platform that respects DPDP compliance. Our legal team approved it.", author: "Priya Desai", role: "HR Director", location: "Mumbai" },
                                { quote: "No more invoice chasing. Payments happen automatically. This is how hiring should work.", author: "Amit Patel", role: "VP Engineering", location: "Pune" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl hover:border-emerald-500/30 transition-all"
                                >
                                    <p className="text-slate-300 leading-relaxed mb-4 italic">"{item.quote}"</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {item.author.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{item.author}</p>
                                            <p className="text-xs text-slate-400">{item.role} • {item.location}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 rounded-3xl p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Save ₹{Math.round(savings / 1000)}K on Your Next Hire?
                        </h2>
                        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                            Join 342 companies already hiring on RecruitKart. Post your first job in 5 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/signup?role=company" className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 group">
                                <Building2 className="w-5 h-5" />
                                Post a Job (₹999)
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/pricing" className="px-8 py-4 text-lg font-bold text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                                <Calculator className="w-5 h-5" />
                                View Pricing Details
                            </Link>
                        </div>
                        <p className="text-sm text-slate-500 mt-6">
                            No credit card required. Complete KYC in 5 minutes.
                        </p>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
