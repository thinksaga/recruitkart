'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Video, ArrowRight, Building2, Lock, Users } from 'lucide-react';

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

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="flex flex-col items-center text-center mb-16">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20"
                        >
                            <Shield className="w-8 h-8 text-indigo-400" />
                        </motion.div>
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-6"
                        >
                            Hire without the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">noise</span>.
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-2xl"
                        >
                            The first trustless hiring protocol. No spam, no unverified candidates, just pure signal.
                        </motion.p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-3 gap-8 mb-20">
                        {[
                            {
                                icon: <Building2 className="w-6 h-6 text-indigo-400" />,
                                title: "Infra Fee (₹999)",
                                desc: "A small barrier that eliminates 99% of spam. Your commitment ensures TAS quality."
                            },
                            {
                                icon: <Lock className="w-6 h-6 text-emerald-400" />,
                                title: "No Contact Info",
                                desc: "Zero-knowledge privacy. Recruiters never see your personal details until you approve."
                            },
                            {
                                icon: <Video className="w-6 h-6 text-purple-400" />,
                                title: "Video Evidence",
                                desc: "Every candidate comes with a mandatory Zoom-recorded interview."
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-900/50 border border-white/10 p-8 rounded-2xl hover:bg-slate-900 transition-colors"
                            >
                                <div className="w-12 h-12 bg-slate-950 rounded-xl flex items-center justify-center mb-6 border border-white/5">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Video Mockup */}
                    <motion.div
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-video max-w-4xl mx-auto"
                    >
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 mx-auto mb-4">
                                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-1" />
                                </div>
                                <p className="text-slate-400 font-medium">Preview Candidate Interview</p>
                            </div>
                        </div>
                        <Image
                            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
                            alt="Video Interface"
                            fill
                            className="object-cover opacity-30"
                        />
                    </motion.div>

                    {/* CTA */}
                    <div className="text-center mt-20">
                        <Link href="/login" className="px-8 py-4 text-lg font-bold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_50px_rgba(99,102,241,0.5)] flex items-center gap-2 mx-auto">
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
