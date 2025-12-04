'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Globe, ShieldCheck, Zap, CheckCircle, Target, ArrowRight, Code, Lock, Cpu } from 'lucide-react';

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

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[128px]" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8"
                        >
                            <Globe className="w-4 h-4 text-indigo-400" />
                            <span className="text-sm font-bold text-indigo-300 uppercase tracking-wider">Our Vision</span>
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-8"
                        >
                            Building the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">UPI of Recruitment</span>
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed"
                        >
                            Recruitkart is not an agency. It is a neutral, trustless utility protocol designed to democratize hiring infrastructure for India. We are removing the middlemen and connecting talent directly with opportunity.
                        </motion.p>
                    </div>

                    {/* Stats */}
                    <div className="grid md:grid-cols-3 gap-8 mb-24">
                        {[
                            { label: "Collusion", value: "0%", icon: <ShieldCheck className="w-6 h-6 text-indigo-400" /> },
                            { label: "Verified Users", value: "100%", icon: <CheckCircle className="w-6 h-6 text-emerald-400" /> },
                            { label: "Region", value: "India First", icon: <MapPin className="w-6 h-6 text-purple-400" /> }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ scale: 0.9, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-900/50 border border-white/10 p-8 rounded-2xl text-center hover:bg-slate-900 transition-colors"
                            >
                                <div className="flex justify-center mb-4">{stat.icon}</div>
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-slate-400 uppercase tracking-wider text-sm font-medium">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Origin Story */}
            <section className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-8">The Origin</h2>
                    <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                        <p>
                            Recruitkart was born from a shared frustration. As founders, we were tired of paying 20% commissions to agencies that added little value. As candidates, we were tired of being ghosted and treated like commodities.
                        </p>
                        <p>
                            We realized that the problem wasn&apos;t the people—it was the incentives. The traditional model creates a zero-sum game where agencies hide talent to protect their fees, and companies hoard information to protect their leverage.
                        </p>
                        <p>
                            We asked a simple question: <span className="text-white font-semibold">What if we could replace the middleman with a protocol?</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why We Exist</h2>
                            <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
                                <p>
                                    We believe that hiring should be as simple and efficient as making a payment. By leveraging blockchain technology and a decentralized network of verified recruiters, we are building a fairer, faster, and more transparent ecosystem for everyone.
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-6">
                            {[
                                { title: "Trustless", desc: "Code is law. Smart contracts ensure fair play without intermediaries.", icon: <ShieldCheck className="w-6 h-6 text-emerald-400" /> },
                                { title: "Meritocratic", desc: "Talent is recognized and rewarded based on performance, not pedigree.", icon: <Target className="w-6 h-6 text-indigo-400" /> },
                                { title: "Transparent", desc: "Every transaction and verification is recorded on an immutable ledger.", icon: <Zap className="w-6 h-6 text-purple-400" /> }
                            ].map((value, i) => (
                                <div key={i} className="bg-slate-950 border border-white/10 p-6 rounded-xl flex items-start gap-4 hover:border-white/20 transition-colors">
                                    <div className="mt-1 p-2 bg-slate-900 rounded-lg">{value.icon}</div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                                        <p className="text-slate-400">{value.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology */}
            <section className="py-24 bg-slate-900/30 border-y border-white/5">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 relative aspect-square bg-slate-900 rounded-2xl border border-white/10 p-8 flex items-center justify-center">
                            {/* Tech Visual */}
                            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                                <div className="p-6 bg-slate-950 rounded-xl border border-white/5 text-center hover:border-indigo-500/50 transition-colors">
                                    <div className="mb-4 flex justify-center"><Code className="w-8 h-8 text-indigo-400" /></div>
                                    <div className="text-sm font-bold text-white mb-1">Smart Contracts</div>
                                    <div className="text-xs text-slate-500">Automated Escrow</div>
                                </div>
                                <div className="p-6 bg-slate-950 rounded-xl border border-white/5 text-center hover:border-emerald-500/50 transition-colors">
                                    <div className="mb-4 flex justify-center"><Lock className="w-8 h-8 text-emerald-400" /></div>
                                    <div className="text-sm font-bold text-white mb-1">Zero Knowledge</div>
                                    <div className="text-xs text-slate-500">Privacy Preserved</div>
                                </div>
                                <div className="p-6 bg-slate-950 rounded-xl border border-white/5 text-center hover:border-purple-400/50 transition-colors">
                                    <div className="mb-4 flex justify-center"><Cpu className="w-8 h-8 text-purple-400" /></div>
                                    <div className="text-sm font-bold text-white mb-1">AI Matching</div>
                                    <div className="text-xs text-slate-500">High Precision</div>
                                </div>
                                <div className="p-6 bg-slate-950 rounded-xl border border-white/5 text-center hover:border-blue-400/50 transition-colors">
                                    <div className="mb-4 flex justify-center"><ShieldCheck className="w-8 h-8 text-blue-400" /></div>
                                    <div className="text-sm font-bold text-white mb-1">Audit Trail</div>
                                    <div className="text-xs text-slate-500">Immutable Logs</div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Powered by Code, Not Promises</h2>
                            <p className="text-lg text-slate-400 mb-8">
                                We use smart contracts to automate the trust layer. This ensures that every interaction is transparent, verifiable, and immutable. No more &quot;he said, she said&quot;—just code execution.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Identity Verification (Zero-Knowledge Proofs)",
                                    "Automated Escrow Settlements",
                                    "On-Chain Reputation Scoring",
                                    "Decentralized Dispute Resolution"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-300">
                                        <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-indigo-600/5" />
                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="text-4xl font-bold mb-8">Join the Revolution</h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                        Whether you are a company looking to hire or a recruiter looking to earn, there is a place for you in the Recruitkart protocol.
                    </p>
                    <Link href="/login" className="inline-flex items-center gap-2 px-10 py-5 text-xl font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-xl hover:scale-105">
                        Get Started
                        <ArrowRight className="w-6 h-6" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
