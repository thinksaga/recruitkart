'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Wallet, Lock, ShieldCheck, Activity, DollarSign, RefreshCw } from 'lucide-react';

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
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
        </div>
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            Get Started
        </Link>
    </nav>
);

export default function Finance() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6 relative">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                            <Lock className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Smart Contract Escrow</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Financial <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Transparency</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Track every rupee. Our escrow mechanism ensures funds are safe and only released when conditions are met.
                        </p>
                    </div>

                    {/* Live Stats */}
                    <div className="grid md:grid-cols-4 gap-6 mb-20">
                        {[
                            { label: "Total Value Locked (TVL)", value: "₹4.2 Cr", icon: <Lock className="w-5 h-5 text-emerald-400" /> },
                            { label: "Active Escrows", value: "142", icon: <Activity className="w-5 h-5 text-indigo-400" /> },
                            { label: "Payouts (Last 30d)", value: "₹85 Lakhs", icon: <DollarSign className="w-5 h-5 text-emerald-400" /> },
                            { label: "Avg. Release Time", value: "91 Days", icon: <RefreshCw className="w-5 h-5 text-purple-400" /> }
                        ].map((stat, i) => (
                            <div key={i} className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl hover:bg-slate-900 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 rounded-lg bg-slate-800">{stat.icon}</div>
                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
                                </div>
                                <div className="text-3xl font-bold text-white font-mono">{stat.value}</div>
                            </div>
                        ))}
                    </div>

                    {/* Fund Flow Diagram */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold text-white mb-12 text-center">How Funds Move</h2>
                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/20 via-emerald-500/20 to-indigo-500/20 -translate-y-1/2" />

                            <div className="grid md:grid-cols-3 gap-8 relative z-10">
                                {[
                                    { step: "1", title: "Deposit", desc: "Company deposits Success Fee into Escrow Vault upon job posting.", icon: <Wallet className="w-6 h-6" /> },
                                    { step: "2", title: "Lock", desc: "Funds are cryptographically locked for 90 days of candidate tenure.", icon: <Lock className="w-6 h-6" /> },
                                    { step: "3", title: "Release", desc: "On Day 91, Smart Contract auto-releases 99% to TAS wallet.", icon: <ShieldCheck className="w-6 h-6" /> }
                                ].map((item, i) => (
                                    <div key={i} className="bg-slate-950 border border-white/10 p-8 rounded-2xl text-center relative group hover:border-emerald-500/30 transition-colors">
                                        <div className="w-16 h-16 mx-auto bg-slate-900 rounded-full flex items-center justify-center border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                                            {item.icon}
                                        </div>
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-slate-800 rounded-full border border-white/10 flex items-center justify-center text-xs font-bold text-slate-400">
                                            {item.step}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                        <p className="text-slate-400">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Security Features */}
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Bank-Grade Security</h2>
                            <p className="text-slate-400 mb-8 text-lg">
                                We partner with regulated financial institutions to ensure your funds are never at risk.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    { title: "Segregated Accounts", desc: "Client funds are held in separate accounts from company operations." },
                                    { title: "Multi-Sig Wallets", desc: "Requires multiple approvals for any manual fund movement." },
                                    { title: "Real-time Auditing", desc: "All transactions are recorded on an immutable ledger." }
                                ].map((feat, i) => (
                                    <li key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white">{feat.title}</h4>
                                            <p className="text-slate-400 text-sm">{feat.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                    <div>
                                        <div className="text-sm text-slate-500 uppercase font-bold">Escrow Vault Balance</div>
                                        <div className="text-3xl font-bold text-white font-mono">₹4,21,50,000</div>
                                    </div>
                                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-emerald-400" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                <span className="text-slate-300">Deposit from Company #{1000 + i}</span>
                                            </div>
                                            <span className="text-emerald-400 font-mono">+₹50,000</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
