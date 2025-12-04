'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Lock, FileText, CheckCircle, Scale, AlertCircle } from 'lucide-react';

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

export default function Compliance() {
    return (
        <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
            <Navbar />

            <section className="pt-32 pb-20 px-6 relative">
                <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
                            <Shield className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-bold text-emerald-300 uppercase tracking-wider">Enterprise Grade Security</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6">
                            Compliance & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Trust Center</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            We adhere to the strictest global standards for data privacy, security, and employment law.
                        </p>
                    </div>

                    {/* Certifications */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {[
                            { title: "Security Architecture", desc: "Built following industry-standard security principles for availability and confidentiality.", icon: <Shield className="w-8 h-8 text-indigo-400" /> },
                            { title: "Data Protection", desc: "Comprehensive data privacy measures aligned with global standards.", icon: <Lock className="w-8 h-8 text-indigo-400" /> },
                            { title: "Information Security", desc: "Enterprise-grade information security management practices.", icon: <CheckCircle className="w-8 h-8 text-indigo-400" /> }
                        ].map((cert, i) => (
                            <div key={i} className="bg-slate-900/50 border border-white/10 p-8 rounded-2xl hover:bg-slate-900 transition-colors">
                                <div className="mb-6">{cert.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{cert.title}</h3>
                                <p className="text-slate-400">{cert.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Policies */}
                    <div className="grid md:grid-cols-2 gap-12 mb-20">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8">Legal & Privacy</h2>
                            <div className="space-y-4">
                                {[
                                    { name: "Terms of Service", date: "Last updated: Nov 2024" },
                                    { name: "Privacy Policy", date: "Last updated: Nov 2024" },
                                    { name: "Data Processing Agreement (DPA)", date: "Last updated: Oct 2024" },
                                    { name: "Cookie Policy", date: "Last updated: Oct 2024" }
                                ].map((policy, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-900/30 border border-white/5 rounded-xl hover:bg-slate-900 hover:border-indigo-500/30 transition-all">
                                        <div className="flex items-center gap-4">
                                            <FileText className="w-5 h-5 text-slate-500" />
                                            <span className="font-bold text-slate-300">{policy.name}</span>
                                        </div>
                                        <span className="text-xs text-slate-600 font-mono">{policy.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-8">Employment Compliance</h2>
                            <div className="bg-slate-900 border border-white/10 rounded-2xl p-8">
                                <p className="text-slate-400 mb-8 leading-relaxed">
                                    Recruitkart ensures that all placements comply with Indian labor laws. Our protocol automatically handles:
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Identity Verification (KYC)",
                                        "Right to Work Checks",
                                        "Anti-Money Laundering (AML) Screening",
                                        "Tax Compliance (TDS/GST)"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-300">
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-8 pt-8 border-t border-white/5">
                                    <div className="flex items-start gap-4">
                                        <AlertCircle className="w-6 h-6 text-yellow-400 shrink-0" />
                                        <p className="text-sm text-slate-400">
                                            For specific legal questions regarding international hiring, please consult with our legal team or your own counsel.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="text-center bg-indigo-900/20 border border-indigo-500/20 rounded-2xl p-12">
                        <Scale className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-4">Have a Compliance Question?</h2>
                        <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                            Our dedicated legal and compliance team is here to help you navigate complex hiring regulations.
                        </p>
                        <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-colors">
                            Contact Legal Team
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}
