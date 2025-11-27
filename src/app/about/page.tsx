'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Globe, ShieldCheck, Zap, CheckCircle } from 'lucide-react';

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

                <div className="container mx-auto max-w-6xl relative z-10">
                    <div className="text-center mb-20">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-5xl md:text-7xl font-bold mb-8"
                        >
                            We are building the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">UPI of Recruitment</span>.
                        </motion.h1>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 max-w-3xl mx-auto"
                        >
                            Recruitkart is not an agency. It is a neutral, trustless utility protocol designed to democratize hiring infrastructure for India.
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
                                className="bg-slate-900/50 border border-white/10 p-8 rounded-2xl text-center"
                            >
                                <div className="flex justify-center mb-4">{stat.icon}</div>
                                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-slate-400 uppercase tracking-wider text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Map Visual */}
                    <div className="relative aspect-[2/1] bg-slate-900 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                        <Image
                            src="/globe.svg"
                            alt="India Map"
                            fill
                            className="object-cover opacity-20"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />

                        {/* Nodes */}
                        <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-indigo-500 rounded-full animate-ping" />
                        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-emerald-500 rounded-full animate-ping delay-300" />
                        <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-purple-500 rounded-full animate-ping delay-700" />

                        <div className="absolute bottom-8 left-0 right-0 text-center">
                            <p className="text-white font-mono text-sm">Connecting 10,000+ Nodes across the nation</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}


