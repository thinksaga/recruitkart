'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Video, CheckCircle, ArrowRight, Wallet, Users, Building2, Briefcase, Activity, FileCheck, Zap } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility for Tailwind classes ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

import Link from 'next/link';

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

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Operating System</span> <br />
            for Hiring.
          </h1>
          <p className="text-lg text-slate-400 max-w-lg">
            The first Trustless Recruitment Protocol. We replace agency commissions with a flat utility fee. Verified Companies post jobs for ₹999. Verified Recruiters (TAS) earn 99% of the Success Fee.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="px-8 py-4 text-lg font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-4 text-lg font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-2">
              <Video className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </motion.div>

        {/* Right: Floating UI Composite */}
        <div className="relative h-[600px] w-full perspective-1000">
          <motion.div
            className="relative w-full h-full transform-style-3d"
            initial={{ rotateY: 15, rotateX: 5 }}
            whileHover={{ rotateY: 5, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            {/* Layer 1: Map */}
            <motion.div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-white/5 overflow-hidden shadow-2xl"
              style={{ transform: "translateZ(0px)" }}
            >
              <Image
                src="/globe.svg" // Using placeholder, ideally a map image
                alt="Map Background"
                fill
                className="object-cover opacity-20"
              />
              {/* Glowing Nodes */}
              <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399] animate-ping" />
              <div className="absolute bottom-1/3 right-1/3 w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8] animate-ping delay-500" />
            </motion.div>

            {/* Layer 2: Video Player */}
            <motion.div
              className="absolute top-1/4 left-10 right-10 bottom-1/4 bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl flex flex-col"
              style={{ transform: "translateZ(50px)" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <div className="h-8 bg-slate-900/50 border-b border-white/5 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 relative">
                <Image
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop"
                  alt="Interview"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Layer 3: Notification Toast */}
            <motion.div
              className="absolute bottom-20 -right-4 bg-emerald-500/10 backdrop-blur-xl border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4 shadow-lg"
              style={{ transform: "translateZ(100px)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-emerald-300 font-medium uppercase tracking-wider">Escrow Secured</p>
                <p className="text-lg font-bold text-white">₹50,000.00</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const LiveTicker = () => {
  const updates = [
    "Escrow #9921: ₹1,20,000 Deposited (Bangalore)",
    "New TAS Verified: P. Kumar (PAN: *****1234)",
    "Payout Released: ₹45,500 to TAS ID #882",
    "Job #3312: Product Manager @ Zomato (Live)",
    "Escrow #9924: ₹80,000 Deposited (Mumbai)",
    "New TAS Verified: A. Singh (PAN: *****9876)",
    "Candidate Locked: +91-98****1234 (48h Timer)"
  ];
  return (
    <div className="w-full bg-slate-950 border-y border-white/5 py-4 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />

      <motion.div
        className="flex gap-16 items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...updates, ...updates].map((update, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-mono font-medium text-slate-400 uppercase tracking-wider">
              {update}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const LiveProtocol = () => {
  const steps = [
    {
      id: 1,
      title: "Identity Lock",
      desc: "TAS submits candidate via Phone Number Primary Key. Candidate is cryptographically locked to the recruiter for 48 hours.",
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Evidence Layer",
      desc: "No PDF Resumes. We use structured data and mandatory Zoom-recorded interviews stored in our secure vault.",
      icon: <FileCheck className="w-6 h-6 text-emerald-400" />,
      image: "https://images.unsplash.com/photo-1639322537228-f710d846310a"
    },
    {
      id: 3,
      title: "Escrow Smart Contract",
      desc: "Success Fee is deposited before the job goes live. Funds are auto-released on Day 91 of candidate tenure.",
      icon: <Lock className="w-6 h-6 text-purple-400" />,
      image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28"
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Live Protocol</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            A transparent, automated workflow that ensures trust between companies and recruiters.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0 -translate-y-1/2" />

          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="relative z-10 bg-slate-900 border border-white/10 rounded-2xl p-2 hover:border-indigo-500/50 transition-colors duration-300 h-full">
                <div className="relative h-48 w-full overflow-hidden rounded-xl mb-4">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/50 group-hover:bg-slate-950/20 transition-colors" />
                  <div className="absolute top-4 left-4 w-10 h-10 bg-slate-950/80 backdrop-blur-md rounded-lg flex items-center justify-center border border-white/10">
                    {step.icon}
                  </div>
                </div>
                <div className="px-4 pb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ComparisonMatrix = () => {
  const features = [
    { name: "Commission", recruitkart: "1% Utility Fee", agency: "8.33% - 20%" },
    { name: "Data Privacy", recruitkart: "Zero-Knowledge (No Phone/Email)", agency: "Leaky Excel Sheets" },
    { name: "Payout Speed", recruitkart: "Day 91 Auto-Trigger", agency: "Chase Invoices for Months" },
  ];

  return (
    <section className="py-24 bg-slate-950 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why We Are Different</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Comparing the Recruitkart Protocol with traditional recruitment agencies.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-slate-900/50 rounded-2xl border border-white/10 overflow-hidden">
          <div className="grid grid-cols-3 bg-white/5 p-6 border-b border-white/10">
            <div className="text-slate-400 font-semibold uppercase tracking-wider text-sm">Feature</div>
            <div className="text-indigo-400 font-bold uppercase tracking-wider text-sm">Recruitkart Protocol</div>
            <div className="text-slate-500 font-semibold uppercase tracking-wider text-sm">Traditional Agency</div>
          </div>
          <div className="divide-y divide-white/5">
            {features.map((feature, i) => (
              <div key={i} className="grid grid-cols-3 p-6 hover:bg-white/5 transition-colors">
                <div className="text-white font-medium">{feature.name}</div>
                <div className="text-emerald-400 font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  {feature.recruitkart}
                </div>
                <div className="text-slate-400">{feature.agency}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const DualSidedExperience = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'tas'>('company');

  return (
    <section className="py-24 bg-slate-900/50 relative">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Built for Both Sides</h2>

          <div className="flex p-1 bg-slate-950 rounded-full border border-white/10">
            <button
              onClick={() => setActiveTab('company')}
              className={cn(
                "px-8 py-3 rounded-full text-sm font-bold transition-all",
                activeTab === 'company' ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              Company View
            </button>
            <button
              onClick={() => setActiveTab('tas')}
              className={cn(
                "px-8 py-3 rounded-full text-sm font-bold transition-all",
                activeTab === 'tas' ? "bg-white text-slate-950 shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              Recruiter View
            </button>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto aspect-video bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <AnimatePresence mode="wait">
            {activeTab === 'company' ? (
              <motion.div
                key="company"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f"
                  alt="Company Dashboard"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm">
                    <h3 className="text-xl font-bold text-white mb-2">Candidate Pipeline</h3>
                    <p className="text-slate-300 text-sm">View verified candidates, watch video interviews, and release offers securely.</p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tas"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71"
                  alt="TAS Dashboard"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 max-w-sm">
                    <h3 className="text-xl font-bold text-white mb-2">Earnings Wallet</h3>
                    <p className="text-slate-300 text-sm">Track submissions, manage locks, and withdraw your 99% commission instantly.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-slate-950 py-12 border-t border-white/10">
    <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full grayscale opacity-50" />
        <span className="text-slate-500 font-bold">Recruitkart Protocol</span>
      </div>
      <p className="text-slate-600 text-sm">© 2025 Recruitkart. All rights reserved.</p>
    </div>
  </footer>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <Navbar />
      <HeroSection />
      <LiveTicker />
      <LiveProtocol />
      <ComparisonMatrix />
      <DualSidedExperience />
      <Footer />
    </main>
  );
}
