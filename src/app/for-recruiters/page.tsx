'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Wallet, CheckCircle, ArrowRight, TrendingUp, Users, DollarSign,
    Award, Phone, Lock, Clock, BadgeCheck, Target, Zap, IndianRupee,
    Video, FileText, Briefcase, Shield, Eye, Calculator, Play, Globe
} from 'lucide-react';

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
    const avgSuccessFee = 75000;
    const agencyEarnings = placements * avgSuccessFee * 0.30; // 30% agency split
    const recruitkartEarnings = placements * avgSuccessFee * 0.99; // 99% TAS earnings
    const difference = recruitkartEarnings - agencyEarnings;

    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6"
                        >
                            <Award className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-semibold text-emerald-400">For Talent Acquisition Specialists</span>
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                        >
                            Earn <span className="text-emerald-400">99%</span> Commission.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Own Your Career.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-300 max-w-3xl leading-relaxed"
                        >
                            Stop splitting 70% with recruitment agencies. Join RecruitKart as a verified TAS (Trusted Acquisition Specialist).
                            Keep <strong className="text-white">99% of success fees</strong>. Auto-payout on <strong className="text-white">Day 91</strong>.
                            No invoicing. No agency drama.
                        </motion.p>

                        {/* Live Stats Banner */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center justify-center gap-8 mt-8 px-8 py-4 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl"
                        >
                            {[
                                { label: 'Active TAS', value: '1,247', icon: Users, color: 'emerald' },
                                { label: 'Avg. Earnings', value: '₹2.2L/mo', icon: TrendingUp, color: 'purple' },
                                { label: 'Payouts Released', value: '₹2.4Cr', icon: Wallet, color: 'indigo' }
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

                    {/* Earnings Calculator */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-3xl p-8 md:p-12 mb-20 backdrop-blur-sm"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Calculator className="w-6 h-6 text-emerald-400" />
                            <h2 className="text-2xl font-bold text-white">Calculate Your Earnings</h2>
                        </div>
                        <div className="grid lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-4">
                                        Placements per month
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={placements}
                                        onChange={(e) => setPlacements(parseInt(e.target.value))}
                                        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                                    />
                                    <div className="flex justify-between mt-2 text-sm text-slate-400">
                                        <span>1</span>
                                        <span className="text-white font-bold text-lg">{placements} placement{placements > 1 ? 's' : ''}</span>
                                        <span>10</span>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-white/10">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Avg. Success Fee per placement</span>
                                        <span className="text-white font-mono">₹{avgSuccessFee.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-400">Total Success Fees</span>
                                        <span className="text-white font-mono">₹{(placements * avgSuccessFee).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-red-400">Traditional Agency (30% split)</span>
                                        <span className="text-red-400 font-mono line-through">₹{agencyEarnings.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-emerald-400">RecruitKart (99% yours)</span>
                                        <span className="text-emerald-400 font-mono font-bold">₹{recruitkartEarnings.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-950 rounded-2xl p-8 border border-emerald-500/30 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-emerald-500/5" />
                                    <div className="relative z-10">
                                        <p className="text-sm text-slate-400 uppercase tracking-wider mb-2">Your Monthly Earnings</p>
                                        <h3 className="text-5xl font-bold text-white mb-4">
                                            ₹{Math.round(recruitkartEarnings / 1000)}K
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-emerald-400">
                                                <TrendingUp className="w-4 h-4" />
                                                <span>You earn ₹{Math.round(difference / 1000)}K more than agencies</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Clock className="w-4 h-4" />
                                                <span>Auto-payout on Day 91 of tenure</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Award className="w-5 h-5 text-purple-400" />
                                        <h4 className="font-bold text-white">Annual Potential</h4>
                                    </div>
                                    <p className="text-3xl font-bold text-purple-400 mb-2">
                                        ₹{Math.round((recruitkartEarnings * 12) / 100000)}L+
                                    </p>
                                    <p className="text-xs text-slate-400">Based on {placements} placements/month at ₹{avgSuccessFee.toLocaleString()} avg fee</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Why TAS Choose Us */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold text-center text-white mb-4">Why Recruiters Love RecruitKart</h2>
                        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                            Everything you need to build a sustainable recruitment career, without agency overhead.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    icon: <Wallet className="w-6 h-6 text-emerald-400" />,
                                    title: "99% Commission",
                                    desc: "Keep 99% of the success fee set by the company. Platform takes only 1%. No hidden deductions.",
                                    badge: "3x More"
                                },
                                {
                                    icon: <Phone className="w-6 h-6 text-indigo-400" />,
                                    title: "48h Candidate Lock",
                                    desc: "Submit via phone number. Candidate locked to you for 48 hours. Zero poaching risk.",
                                    badge: "Protected"
                                },
                                {
                                    icon: <Clock className="w-6 h-6 text-purple-400" />,
                                    title: "Day 91 Auto-Payout",
                                    desc: "Smart contract releases funds automatically. No invoices, no chasing, no delays.",
                                    badge: "Guaranteed"
                                },
                                {
                                    icon: <Award className="w-6 h-6 text-cyan-400" />,
                                    title: "Reputation Score",
                                    desc: "Build your TAS reputation. Top performers get premium job access and higher fees.",
                                    badge: "Merit Based"
                                },
                                {
                                    icon: <BadgeCheck className="w-6 h-6 text-emerald-400" />,
                                    title: "Verified Jobs Only",
                                    desc: "Every company is PAN/GSTIN verified. Escrow deposited before job goes live. No fake posts.",
                                    badge: "100% Real"
                                },
                                {
                                    icon: <Zap className="w-6 h-6 text-purple-400" />,
                                    title: "Simple Process",
                                    desc: "Submit candidate profile. Company conducts interview via platform Zoom. All recordings accessible to company.",
                                    badge: "Streamlined"
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

                    {/* Steps */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">Start Earning in 4 Steps</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { step: '1', title: 'Get Verified', desc: 'Complete PAN/Aadhaar KYC. Build your reputation score.', icon: <BadgeCheck className="w-5 h-5" />, time: '10 min' },
                                { step: '2', title: 'Browse Jobs', desc: 'Access 342 verified company jobs. No spam, no fake posts.', icon: <Briefcase className="w-5 h-5" />, time: 'Instant' },
                                { step: '3', title: 'Submit & Lock', desc: 'Submit profile, lock candidate for 48h. Company interviews via platform Zoom.', icon: <Phone className="w-5 h-5" />, time: '30 min' },
                                { step: '4', title: 'Earn 99%', desc: 'Get paid automatically on Day 91. No invoicing needed.', icon: <TrendingUp className="w-5 h-5" />, time: 'Auto' }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl hover:border-emerald-500/30 transition-all relative"
                                >
                                    <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-xl font-bold text-emerald-400">{item.step}</span>
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

                    {/* Social Proof */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">Success Stories from TAS</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { quote: "Made ₹2.8L in 3 months. Finally earning what I deserve. No more 70% agency cuts.", author: "Priya Malhotra", role: "Senior TAS", location: "Mumbai", placements: "12 placements" },
                                { quote: "The 48h lock feature is a game-changer. No more candidate sniping. My work is protected.", author: "Rajesh Kumar", role: "Independent Recruiter", location: "Bangalore", placements: "8 placements" },
                                { quote: "Auto-payout on Day 91 means I don't chase invoices. More time for actual recruiting.", author: "Sneha Desai", role: "Freelance TAS", location: "Pune", placements: "15 placements" }
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
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                            {item.author.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{item.author}</p>
                                            <p className="text-xs text-slate-400">{item.role} • {item.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full inline-flex">
                                        <Award className="w-3 h-3" />
                                        <span>{item.placements}</span>
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
                        className="text-center bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-3xl p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Ready to Earn ₹{Math.round(recruitkartEarnings / 1000)}K This Month?
                        </h2>
                        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                            Join 1,247 verified recruiters earning 99% commission. Get verified in 10 minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/signup?role=tas" className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 group">
                                <Users className="w-5 h-5" />
                                Join as Recruiter
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/pricing" className="px-8 py-4 text-lg font-bold text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                                <Calculator className="w-5 h-5" />
                                View Fee Structure
                            </Link>
                        </div>
                        <p className="text-sm text-slate-500 mt-6">
                            No credit card required. Start browsing jobs immediately after KYC.
                        </p>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}
