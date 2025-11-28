'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    MapPin, Globe, ShieldCheck, Zap, CheckCircle, Target, Award,
    Users, Building2, Wallet, Lock, Eye, Video, Phone, TrendingUp,
    Sparkles, ArrowRight, BadgeCheck, Shield, Clock, IndianRupee
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
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="text-white transition-colors">About</Link>
        </div>
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            Get Started
        </Link>
    </nav>
);

export default function About() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6"
                        >
                            <Target className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-semibold text-indigo-400">Our Mission</span>
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
                        >
                            Building the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">UPI of Recruitment</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            RecruitKart is not an agency. We're a <strong className="text-white">neutral, trustless utility protocol</strong> that democratizes
                            hiring infrastructure for India. Just like UPI disrupted payments, we're disrupting recruitment—removing middlemen,
                            reducing costs by 90%, and empowering both companies and recruiters.
                        </motion.p>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-4 gap-6 mb-24">
                        {[
                            { label: "Platform Escrow", value: "₹2.4Cr", icon: <Wallet className="w-6 h-6 text-emerald-400" />, color: "emerald" },
                            { label: "Verified TAS", value: "1,247", icon: <Users className="w-6 h-6 text-indigo-400" />, color: "indigo" },
                            { label: "Companies", value: "342", icon: <Building2 className="w-6 h-6 text-purple-400" />, color: "purple" },
                            { label: "Successful Placements", value: "189", icon: <Award className="w-6 h-6 text-cyan-400" />, color: "cyan" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-900/50 border border-white/10 p-8 rounded-2xl text-center hover:border-emerald-500/30 transition-all group"
                            >
                                <div className="flex justify-center mb-4">
                                    <div className={`w-14 h-14 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                        {stat.icon}
                                    </div>
                                </div>
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-slate-400 uppercase tracking-wider text-xs">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* The Problem Section */}
                    <div className="mb-24">
                        <h2 className="text-3xl font-bold text-center text-white mb-4">The Problem We're Solving</h2>
                        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                            Traditional recruitment is broken. High costs, no transparency, and misaligned incentives hurt everyone.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "Companies Pay Too Much",
                                    desc: "8.33% to 20% of CTC goes to agencies. On a ₹10L hire, that's ₹83K-₹2L wasted. Small companies can't afford quality recruitment.",
                                    icon: <IndianRupee className="w-6 h-6" />,
                                    color: "red"
                                },
                                {
                                    title: "Recruiters Earn Too Little",
                                    desc: "Agencies take 60-70% of success fees. A recruiter who closed a ₹10L hire gets only ₹30K while agency keeps ₹70K.",
                                    icon: <TrendingUp className="w-6 h-6" />,
                                    color: "red"
                                },
                                {
                                    title: "Zero Data Protection",
                                    desc: "Candidate data traded in Excel sheets. No compliance with DPDP Act. Recruiters steal candidates. Companies have no recourse.",
                                    icon: <Eye className="w-6 h-6" />,
                                    color: "red"
                                }
                            ].map((problem, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl"
                                >
                                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-400 mb-4">
                                        {problem.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{problem.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{problem.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Our Solution Section */}
                    <div className="mb-24">
                        <h2 className="text-3xl font-bold text-center text-white mb-4">How RecruitKart Fixes This</h2>
                        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                            A trustless protocol with escrow protection, zero-knowledge privacy, and 99% commission to recruiters.
                        </p>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    title: "₹999 + Your % Model",
                                    desc: "Companies pay ₹999 job post + set their own success fee %. You decide what's fair. On ₹10L hire with 5% fee, total cost is ₹50,999 vs ₹83K-₹2L agency fees.",
                                    icon: <Shield className="w-6 h-6" />,
                                    color: "emerald"
                                },
                                {
                                    title: "99% to Recruiters",
                                    desc: "TAS keeps 99% of success fee. On ₹10L hire (5% = ₹50K), recruiter gets ₹49,500. Platform takes only ₹500 (1%).",
                                    icon: <Wallet className="w-6 h-6" />,
                                    color: "emerald"
                                },
                                {
                                    title: "Zero-Knowledge Protocol",
                                    desc: "Phone number = Primary Key. 48h cryptographic lock. TAS submits, company interviews via platform Zoom, all recordings accessible. DPDP Act compliant.",
                                    icon: <Lock className="w-6 h-6" />,
                                    color: "emerald"
                                }
                            ].map((solution, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl hover:border-emerald-500/40 transition-all"
                                >
                                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4">
                                        {solution.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-3">{solution.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{solution.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Core Principles */}
                    <div className="mb-24">
                        <h2 className="text-3xl font-bold text-center text-white mb-12">Our Core Principles</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                {
                                    principle: "Zero Collusion",
                                    desc: "We don't favor companies or recruiters. The protocol is neutral. Smart contracts execute automatically.",
                                    icon: <ShieldCheck className="w-5 h-5" />
                                },
                                {
                                    principle: "100% Verified",
                                    desc: "Every user is PAN/Aadhaar/GSTIN verified. No fake companies, no fake recruiters. Only real people.",
                                    icon: <BadgeCheck className="w-5 h-5" />
                                },
                                {
                                    principle: "India First",
                                    desc: "Built for Indian companies and recruiters. DPDP Act compliant. Data stays in India. INR-first pricing.",
                                    icon: <MapPin className="w-5 h-5" />
                                },
                                {
                                    principle: "Transparent Fees",
                                    desc: "No hidden charges. Companies see exactly what they pay. Recruiters see exactly what they earn.",
                                    icon: <Eye className="w-5 h-5" />
                                },
                                {
                                    principle: "Automated Payouts",
                                    desc: "Day 91 = auto-release from escrow. No invoices, no chasing, no disputes. Math executes itself.",
                                    icon: <Clock className="w-5 h-5" />
                                },
                                {
                                    principle: "Merit-Based System",
                                    desc: "Reputation scores track performance. Top TAS get premium access. Quality wins, not connections.",
                                    icon: <Award className="w-5 h-5" />
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl hover:border-indigo-500/30 transition-all group"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center text-indigo-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-2">{item.principle}</h3>
                                            <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Vision Section */}
                    <div className="mb-24 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Our Vision for 2025</h2>
                        <p className="text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
                            We're not building a unicorn. We're building infrastructure. Like UPI didn't replace banks but made payments
                            seamless, RecruitKart won't replace recruiters—we'll make hiring seamless, fair, and affordable for everyone.
                        </p>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { target: "10,000", label: "Verified TAS", icon: <Users className="w-8 h-8" /> },
                                { target: "5,000", label: "Active Companies", icon: <Building2 className="w-8 h-8" /> },
                                { target: "₹100Cr", label: "Escrow Volume", icon: <Wallet className="w-8 h-8" /> }
                            ].map((goal, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-indigo-500/20 p-8 rounded-2xl"
                                >
                                    <div className="flex justify-center mb-4 text-indigo-400">
                                        {goal.icon}
                                    </div>
                                    <div className="text-5xl font-bold text-white mb-2">{goal.target}</div>
                                    <div className="text-slate-400">{goal.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Network Visualization - City Hubs */}
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h3 className="text-3xl font-bold text-white mb-4">
                                Connecting India's Talent Ecosystem
                            </h3>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                From Bangalore to Mumbai, Pune to Delhi—we're building a network that brings
                                verified companies and recruiters together on one transparent platform.
                            </p>
                        </div>

                        {/* City Network Grid */}
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {[
                                {
                                    city: 'Bangalore',
                                    companies: 128,
                                    tas: 456,
                                    placements: 89,
                                    color: 'emerald',
                                    gradient: 'from-emerald-500/20 to-emerald-500/5'
                                },
                                {
                                    city: 'Mumbai',
                                    companies: 94,
                                    tas: 312,
                                    placements: 52,
                                    color: 'indigo',
                                    gradient: 'from-indigo-500/20 to-indigo-500/5'
                                },
                                {
                                    city: 'Pune',
                                    companies: 67,
                                    tas: 289,
                                    placements: 31,
                                    color: 'purple',
                                    gradient: 'from-purple-500/20 to-purple-500/5'
                                },
                                {
                                    city: 'Delhi NCR',
                                    companies: 53,
                                    tas: 190,
                                    placements: 17,
                                    color: 'cyan',
                                    gradient: 'from-cyan-500/20 to-cyan-500/5'
                                }
                            ].map((hub, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`relative bg-gradient-to-br ${hub.gradient} border border-white/10 rounded-2xl p-6 hover:border-${hub.color}-500/30 transition-all group`}
                                >
                                    {/* Pulse Indicator */}
                                    <div className="absolute -top-2 -right-2 flex items-center gap-1">
                                        <div className={`w-2 h-2 bg-${hub.color}-400 rounded-full animate-pulse`} />
                                        <span className={`text-xs font-bold text-${hub.color}-400`}>LIVE</span>
                                    </div>

                                    {/* City Name */}
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-10 h-10 bg-${hub.color}-500/20 rounded-xl flex items-center justify-center`}>
                                            <Globe className={`w-5 h-5 text-${hub.color}-400`} />
                                        </div>
                                        <h4 className="text-xl font-bold text-white">{hub.city}</h4>
                                    </div>

                                    {/* Stats */}
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400">Companies</span>
                                            <span className={`text-lg font-bold text-${hub.color}-400`}>{hub.companies}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400">Active TAS</span>
                                            <span className={`text-lg font-bold text-${hub.color}-400`}>{hub.tas}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-400">Placements</span>
                                            <span className={`text-lg font-bold text-${hub.color}-400`}>{hub.placements}</span>
                                        </div>
                                    </div>

                                    {/* Growth Indicator */}
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className={`w-4 h-4 text-${hub.color}-400`} />
                                            <span className="text-xs text-slate-400">Growing ecosystem</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Aggregate Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-indigo-500/10 to-emerald-500/10 border border-white/10 rounded-2xl p-8"
                        >
                            <div className="grid md:grid-cols-3 gap-8 text-center">
                                <div>
                                    <div className="text-5xl font-bold text-white mb-2">342</div>
                                    <div className="text-slate-400 mb-2">Verified Companies</div>
                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 rounded-full">
                                        <TrendingUp className="w-3 h-3 text-emerald-400" />
                                        <span className="text-xs text-emerald-400 font-semibold">+24% this month</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold text-white mb-2">1,247</div>
                                    <div className="text-slate-400 mb-2">Active TAS Network</div>
                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-500/10 rounded-full">
                                        <TrendingUp className="w-3 h-3 text-indigo-400" />
                                        <span className="text-xs text-indigo-400 font-semibold">+18% this month</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-5xl font-bold text-white mb-2">189</div>
                                    <div className="text-slate-400 mb-2">Successful Placements</div>
                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 rounded-full">
                                        <TrendingUp className="w-3 h-3 text-purple-400" />
                                        <span className="text-xs text-purple-400 font-semibold">+31% this month</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Final CTA */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 rounded-3xl p-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Join the Movement
                        </h2>
                        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                            Whether you're a company tired of paying 20% to agencies, or a recruiter tired of keeping
                            only 30% of your earnings—RecruitKart is built for you.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/for-companies" className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 group">
                                <Building2 className="w-5 h-5" />
                                For Companies
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link href="/for-recruiters" className="px-8 py-4 text-lg font-bold text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
                                <Users className="w-5 h-5" />
                                For Recruiters
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </main>
    );
}


