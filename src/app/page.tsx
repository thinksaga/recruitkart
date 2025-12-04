'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Video, CheckCircle, ArrowRight, Wallet, Users, Building2, Briefcase, Activity, FileCheck, Zap } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { getHomepageStats } from './actions/get-homepage-stats';
import { getRecentJobs } from './actions/get-recent-jobs';

// --- Utility for Tailwind classes ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 py-4 backdrop-blur-md bg-slate-950/50 border-b border-white/10">
    <Link href="/" className="flex items-center gap-2">
      <Image src="/logo.png" alt="Recruitkart Logo" width={32} height={32} className="rounded-full sm:w-10 sm:h-10" />
      <span className="text-lg sm:text-xl font-bold text-white tracking-tight">Recruitkart</span>
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

      <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 lg:space-y-8 text-center lg:text-left"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Operating System</span> <br />
            for Hiring.
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-lg mx-auto lg:mx-0">
            The first Trustless Recruitment Protocol. We replace agency commissions with a flat utility fee. Verified Companies post jobs for ₹999. Verified Recruiters (TAS) earn 99% of the Success Fee.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link href="/login" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2 group">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/pricing" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2">
              View Pricing
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Right: Floating UI Composite */}
        <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] w-full perspective-1000 hidden lg:block">
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

const StatsSection = () => {
  const [stats, setStats] = useState({
    tvl: "Loading...",
    recruiters: "...",
    companies: "...",
    jobs: "..."
  });

  useEffect(() => {
    getHomepageStats().then(setStats);
  }, []);

  const statItems = [
    { value: stats.tvl, label: "Total Value Locked", icon: <Wallet className="w-6 h-6 text-indigo-400" /> },
    { value: stats.recruiters, label: "Active Recruiters", icon: <Users className="w-6 h-6 text-emerald-400" /> },
    { value: stats.companies, label: "Companies Hiring", icon: <Building2 className="w-6 h-6 text-purple-400" /> },
    { value: stats.jobs, label: "Jobs Posted", icon: <Briefcase className="w-6 h-6 text-blue-400" /> }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-900/30 border-y border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {statItems.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-3">{stat.icon}</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs sm:text-sm text-slate-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LiveTicker = () => {
  const [updates, setUpdates] = useState<string[]>([
    "Protocol Live: Monitoring Transactions...",
    "Waiting for new blocks...",
    "Syncing with Escrow Smart Contract..."
  ]);

  useEffect(() => {
    getRecentJobs().then(jobs => {
      if (jobs.length > 0) {
        const jobUpdates = jobs.map(job => `New Job: ${job.title} @ ${job.company} (${job.location})`);
        // Mix with some generic protocol messages if not enough jobs
        const mixedUpdates = [
          ...jobUpdates,
          "Escrow Protocol Active",
          "TAS Verification Node Online",
          "Zero-Knowledge Proofs Enabled"
        ];
        setUpdates(mixedUpdates);
      }
    });
  }, []);

  return (
    <div className="w-full bg-slate-950 border-y border-white/5 py-4 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />

      <motion.div
        className="flex gap-16 items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        {[...updates, ...updates, ...updates].map((update, i) => (
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
      title: "Search & Consent",
      desc: "TAS searches by phone number. If found, instant submission triggers consent. If new, TAS builds profile and invites candidate.",
      icon: <Users className="w-6 h-6 text-indigo-400" />,
      image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop"
    },
    {
      id: 2,
      title: "Evidence Layer",
      desc: "We replace PDF resumes with structured Candidate Profiles. Virtual interviews are conducted and recorded directly on the Recruitkart platform.",
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

const FeaturesGrid = () => {
  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Escrow Protection",
      desc: "Success fees locked in smart contracts. Auto-release on Day 91 of candidate tenure."
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Consent-Based Access",
      desc: "No phone numbers or emails shared without approval. Candidates explicitly consent to every submission."
    },
    {
      icon: <Video className="w-8 h-8" />,
      title: "Verified Evidence",
      desc: "Structured Candidate Profiles and recorded virtual interviews provide a transparent, verifiable history."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Verification",
      desc: "PAN-based KYC for all users. Verified badge for companies and recruiters."
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Real-Time Tracking",
      desc: "Live dashboard showing escrow status, candidate pipeline, and payout timeline."
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Compliance Ready",
      desc: "Full audit trail for every transaction. Built with enterprise-grade security best practices."
    }
  ];

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-950">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Trust</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Every feature designed to eliminate fraud, protect funds, and ensure fair compensation.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 sm:p-8 hover:border-indigo-500/30 transition-all group"
            >
              <div className="w-14 h-14 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4 group-hover:bg-indigo-500/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{feature.desc}</p>
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

const TrustIndicators = () => {
  return (
    <section className="py-12 sm:py-16 bg-slate-950 border-y border-white/5">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-16 flex-wrap">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="text-sm sm:text-base text-slate-300 font-medium">Full Audit Trail</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="text-sm sm:text-base text-slate-300 font-medium">Data Privacy</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span className="text-sm sm:text-base text-slate-300 font-medium">Secure Transactions</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-indigo-400" />
            <span className="text-sm sm:text-base text-slate-300 font-medium">Bank-Grade Security</span>
          </div>
        </div>
      </div>
    </section>
  );
};



const Footer = () => (
  <footer className="bg-slate-950 py-12 border-t border-white/10">
    <div className="container mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-6">
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
      <StatsSection />
      <LiveTicker />
      <LiveProtocol />
      <FeaturesGrid />
      <ComparisonMatrix />
      <DualSidedExperience />
      <TrustIndicators />
      <Footer />
    </main>
  );
}
