'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Video, CheckCircle, ArrowRight, Wallet, Users, Building2,
  Briefcase, Activity, FileCheck, Zap, TrendingUp, Clock, DollarSign,
  Phone, Eye, Database, Award, Target, Sparkles, GitBranch, BadgeCheck,
  Handshake, Timer, IndianRupee, Globe, UserCheck, FileText, PlayCircle
} from 'lucide-react';
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
  const [liveStats, setLiveStats] = useState({
    escrow: '₹2.4Cr',
    tas: '1,247',
    companies: '342',
    placements: '189'
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-slate-950 bg-noise pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px] animate-pulse delay-1000" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left: Copy */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full"
          >
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">India's First Trustless Recruitment Protocol</span>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Hire Talent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">Without the Middleman.</span>
          </h1>

          <p className="text-xl text-slate-300 max-w-lg leading-relaxed">
            Post jobs for <span className="text-emerald-400 font-bold">₹999</span>. Set your own success fee. Verified recruiters earn <span className="text-emerald-400 font-bold">99%</span>.
            <span className="block mt-2 text-slate-400">No agency drama. Pure Performance. You decide the terms.</span>
          </p>

          {/* Live Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Escrow', value: liveStats.escrow, icon: Wallet, color: 'emerald' },
              { label: 'Active TAS', value: liveStats.tas, icon: Users, color: 'indigo' },
              { label: 'Companies', value: liveStats.companies, icon: Building2, color: 'purple' },
              { label: 'Placements', value: liveStats.placements, icon: Award, color: 'cyan' }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <stat.icon className={`w-5 h-5 text-${stat.color}-400 mb-2`} />
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/signup" className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all flex items-center gap-2 group">
              Start Hiring Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/for-recruiters" className="px-8 py-4 text-lg font-bold text-slate-300 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
              Join as Recruiter
            </Link>
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
      desc: "TAS submits candidate via Phone Number Primary Key. Candidate is cryptographically locked to the recruiter for 48 hours. Zero data leakage.",
      icon: <Phone className="w-6 h-6 text-indigo-400" />,
      badge: "48h Protection",
      stats: "2,341 Locks Active",
      color: "indigo"
    },
    {
      id: 2,
      title: "Zero-Knowledge Evidence",
      desc: "TAS submits profile. Company conducts interviews via integrated Zoom on platform. All recordings stored securely and available to company.",
      icon: <Eye className="w-6 h-6 text-emerald-400" />,
      badge: "DPDP Compliant",
      stats: "1,847 Videos Secure",
      color: "emerald"
    },
    {
      id: 3,
      title: "Escrow Smart Contract",
      desc: "Success Fee (you decide %) deposited before job goes live. Auto-release on Day 91 of tenure. TAS earns 99%, Platform takes 1%.",
      icon: <Wallet className="w-6 h-6 text-purple-400" />,
      badge: "₹2.4Cr Secured",
      stats: "Auto-Release in 91 Days",
      color: "purple"
    },
    {
      id: 4,
      title: "Reputation Score",
      desc: "Every placement, rejection, and tenure milestone builds your TAS reputation. Top performers get premium job access.",
      icon: <Award className="w-6 h-6 text-cyan-400" />,
      badge: "Merit-Based",
      stats: "1,247 TAS Verified",
      color: "cyan"
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-400">The Live Protocol</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Trust Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Middlemen</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            A transparent, automated workflow that eliminates agency commissions and ensures instant payouts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              {/* Card */}
              <div className={`relative z-10 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-${step.color}-500/50 transition-all duration-300 h-full flex flex-col group-hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]`}>
                {/* Badge */}
                <div className={`absolute -top-3 -right-3 px-3 py-1 bg-${step.color}-500/20 border border-${step.color}-500/30 rounded-full`}>
                  <span className={`text-xs font-bold text-${step.color}-400`}>{step.badge}</span>
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 bg-${step.color}-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  {step.icon}
                </div>

                {/* Step Number */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl font-bold text-white/10">0{step.id}</span>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-400 leading-relaxed mb-4 flex-1">{step.desc}</p>

                {/* Stats */}
                <div className={`flex items-center gap-2 text-xs text-${step.color}-400 font-mono`}>
                  <TrendingUp className="w-3 h-3" />
                  <span>{step.stats}</span>
                </div>
              </div>

              {/* Connecting Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 z-20">
                  <ArrowRight className="w-6 h-6 text-white/20" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ComparisonMatrix = () => {
  const features = [
    {
      name: "Commission Fee",
      recruitkart: "₹999 Job Post + Your Success Fee %",
      agency: "8.33% - 20% of CTC",
      icon: <IndianRupee className="w-5 h-5" />,
      savings: "You decide your success fee"
    },
    {
      name: "Data Privacy",
      recruitkart: "Zero-Knowledge Protocol",
      agency: "Leaky Excel Sheets",
      icon: <Eye className="w-5 h-5" />,
      savings: "DPDP Act Compliant"
    },
    {
      name: "Payout Speed",
      recruitkart: "Day 91 Auto-Release",
      agency: "6-12 Months Invoice Chase",
      icon: <Timer className="w-5 h-5" />,
      savings: "9x Faster Payments"
    },
    {
      name: "Recruiter Earnings",
      recruitkart: "99% of Success Fee",
      agency: "30-40% Split (Leaked)",
      icon: <Wallet className="w-5 h-5" />,
      savings: "3x Higher Earnings"
    },
    {
      name: "Candidate Lock",
      recruitkart: "48h Cryptographic Lock",
      agency: "No Protection",
      icon: <Lock className="w-5 h-5" />,
      savings: "Zero Poaching"
    },
    {
      name: "Evidence Layer",
      recruitkart: "Platform Zoom Interviews + Recordings",
      agency: "PDF Resume",
      icon: <Video className="w-5 h-5" />,
      savings: "All interviews recorded & accessible"
    },
  ];

  return (
    <section className="py-24 bg-slate-900/30 border-y border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[128px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4"
          >
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Why Companies Choose Us</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Math is Simple</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Traditional agencies take 8-20% commission. We charge ₹999 job posting fee. You set your own success fee percentage.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-1">{feature.name}</h3>
                  <div className="inline-flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-full">
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-xs text-emerald-400 font-semibold">{feature.savings}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">RecruitKart</p>
                    <p className="text-sm text-white font-medium">{feature.recruitkart}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-500">✕</div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Traditional</p>
                    <p className="text-sm text-slate-400 font-medium line-through">{feature.agency}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ROI Calculator CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-3">You Control the Cost</h3>
          <p className="text-slate-300 mb-6">
            Set your own success fee percentage. Traditional agencies charge 8.33-20%. With RecruitKart, <span className="text-emerald-400 font-bold">you decide</span> what's fair.
          </p>
          <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-colors">
            Calculate Your ROI
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const companySteps = [
    { step: '1', title: 'Verify & Post', desc: 'Complete PAN/GSTIN verification. Post job for ₹999.', time: '5 min' },
    { step: '2', title: 'Deposit Escrow', desc: 'Lock success fee in escrow. Job goes live to verified TAS.', time: '2 min' },
    { step: '3', title: 'Interview on Platform', desc: 'TAS submits profiles. Conduct Zoom interviews via platform. Access all recordings.', time: 'Ongoing' },
    { step: '4', title: 'Hire & Release', desc: 'Offer accepted? Funds auto-release on Day 91.', time: 'Auto' },
  ];

  const tasSteps = [
    { step: '1', title: 'Get Verified', desc: 'Complete PAN/Aadhaar KYC. Build reputation score.', time: '10 min' },
    { step: '2', title: 'Browse Jobs', desc: 'Access verified company jobs. No spam, no fake posts.', time: 'Instant' },
    { step: '3', title: 'Submit & Lock', desc: 'Submit candidate profile, lock for 48h. Company interviews via platform Zoom.', time: '30 min' },
    { step: '4', title: 'Earn 99%', desc: 'Get paid automatically on Day 91. No invoices.', time: 'Auto' },
  ];

  const [activeRole, setActiveRole] = useState<'company' | 'tas'>('company');

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-4"
          >
            <GitBranch className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-indigo-400">Simple 4-Step Process</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            Whether you're hiring or recruiting, the process is transparent and automated.
          </p>

          {/* Role Switcher */}
          <div className="flex p-1 bg-slate-900 rounded-full border border-white/10 inline-flex">
            <button
              onClick={() => setActiveRole('company')}
              className={cn(
                "px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                activeRole === 'company' ? "bg-emerald-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              <Building2 className="w-4 h-4" />
              For Companies
            </button>
            <button
              onClick={() => setActiveRole('tas')}
              className={cn(
                "px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                activeRole === 'tas' ? "bg-indigo-500 text-white shadow-lg" : "text-slate-400 hover:text-white"
              )}
            >
              <Users className="w-4 h-4" />
              For Recruiters
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {(activeRole === 'company' ? companySteps : tasSteps).map((item, i) => (
              <div key={i} className="relative">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-emerald-500/30 transition-all group">
                  {/* Step Number */}
                  <div className={`w-12 h-12 rounded-full ${activeRole === 'company' ? 'bg-emerald-500/20' : 'bg-indigo-500/20'} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className={`text-xl font-bold ${activeRole === 'company' ? 'text-emerald-400' : 'text-indigo-400'}`}>{item.step}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{item.desc}</p>

                  {/* Time Badge */}
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span className="text-xs text-slate-500 font-mono">{item.time}</span>
                  </div>
                </div>

                {/* Connecting Arrow */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-20">
                    <ArrowRight className="w-6 h-6 text-white/20" />
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

const DualSidedExperience = () => {
  const [activeTab, setActiveTab] = useState<'company' | 'tas'>('company');

  const companyFeatures = [
    { icon: <Shield className="w-5 h-5" />, title: "Zero Risk", desc: "Escrow protection + 91-day guarantee" },
    { icon: <Database className="w-5 h-5" />, title: "Structured Data", desc: "No PDF chaos, all candidate info standardized" },
    { icon: <Video className="w-5 h-5" />, title: "Platform Interviews", desc: "Conduct Zoom interviews on platform, access all recordings anytime" },
    { icon: <Lock className="w-5 h-5" />, title: "DPDP Compliant", desc: "Zero-knowledge protocol, audit-ready" }
  ];

  const tasFeatures = [
    { icon: <Wallet className="w-5 h-5" />, title: "99% Commission", desc: "Keep almost all you earn, no agency cuts" },
    { icon: <Phone className="w-5 h-5" />, title: "48h Protection", desc: "Your candidates locked to you, no sniping" },
    { icon: <Award className="w-5 h-5" />, title: "Reputation Score", desc: "Merit-based ranking, top TAS get premium jobs" },
    { icon: <Target className="w-5 h-5" />, title: "Auto Payout", desc: "Day 91 release, no invoicing hassle" }
  ];

  return (
    <section className="py-24 bg-slate-900/50 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full mb-4"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-cyan-400">Dual Platform Experience</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built for Both Sides</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Whether you're hiring or recruiting, the experience is tailored to your needs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="flex p-1 bg-slate-950 rounded-full border border-white/10">
            <button
              onClick={() => setActiveTab('company')}
              className={cn(
                "px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'company' ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/25" : "text-slate-400 hover:text-white"
              )}
            >
              <Building2 className="w-4 h-4" />
              Company Dashboard
            </button>
            <button
              onClick={() => setActiveTab('tas')}
              className={cn(
                "px-8 py-3 rounded-full text-sm font-bold transition-all flex items-center gap-2",
                activeTab === 'tas' ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg shadow-purple-500/25" : "text-slate-400 hover:text-white"
              )}
            >
              <Users className="w-4 h-4" />
              Recruiter Dashboard
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'company' ? (
            <motion.div
              key="company"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
            >
              {/* Left: Dashboard Preview */}
              <div className="relative aspect-[4/3] bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                  alt="Company Dashboard"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-emerald-500/20 backdrop-blur-sm border border-emerald-500/30 rounded-xl px-4 py-2 inline-flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-emerald-400">3 Active Jobs</span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold">Senior Frontend Dev</h4>
                      <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded-full">12 Submissions</span>
                    </div>
                    <p className="text-slate-300 text-xs">Escrowed: ₹1,20,000 • 2 Interviews Pending</p>
                  </div>
                </div>
              </div>

              {/* Right: Features */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Company Experience</h3>
                  <p className="text-slate-400 mb-6">Post jobs, review candidates, and hire with complete protection.</p>
                </div>
                <div className="grid gap-4">
                  {companyFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-slate-950/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-emerald-500/30 transition-all group"
                    >
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-slate-400">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="tas"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
            >
              {/* Left: Dashboard Preview */}
              <div className="relative aspect-[4/3] bg-slate-950 rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="TAS Dashboard"
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
                <div className="absolute top-6 left-6 right-6">
                  <div className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-xl px-4 py-2 inline-flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-purple-400">Reputation: 4.8/5.0</span>
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 space-y-3">
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-bold">This Month</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-purple-400">8</p>
                        <p className="text-xs text-slate-400">Submissions</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-emerald-400">3</p>
                        <p className="text-xs text-slate-400">Placements</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-cyan-400">₹2.8L</p>
                        <p className="text-xs text-slate-400">Pending</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Features */}
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Recruiter Experience</h3>
                  <p className="text-slate-400 mb-6">Browse verified jobs, submit candidates, and earn your full commission.</p>
                </div>
                <div className="grid gap-4">
                  {tasFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-slate-950/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-purple-500/30 transition-all group"
                    >
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold mb-1">{feature.title}</h4>
                        <p className="text-sm text-slate-400">{feature.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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

// Social Proof Section
const SocialProofSection = () => {
  const testimonials = [
    {
      quote: "We saved ₹2.4 lakhs on 3 hires in Q4. The escrow system gives us peace of mind.",
      author: "Rahul Sharma",
      role: "CTO, FinTech Startup",
      avatar: "RS",
      company: "Bangalore"
    },
    {
      quote: "Finally earning what I deserve. 99% commission means I can quit my agency job.",
      author: "Priya Malhotra",
      role: "Senior TAS",
      avatar: "PM",
      company: "Mumbai"
    },
    {
      quote: "The zero-knowledge protocol means we're DPDP compliant by default. Game changer.",
      author: "Amit Patel",
      role: "HR Director",
      avatar: "AP",
      company: "Pune"
    }
  ];

  return (
    <section className="py-24 bg-slate-950 border-y border-white/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
          >
            <Handshake className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-semibold text-purple-400">Trusted by Leaders</span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Users Say</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Real stories from companies and recruiters using RecruitKart.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                  {item.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold">{item.author}</p>
                  <p className="text-sm text-slate-400">{item.role}</p>
                </div>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">"{item.quote}"</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Globe className="w-3 h-3" />
                <span>{item.company}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const FinalCTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-emerald-500/10 rounded-full blur-[128px]" />

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-emerald-400">Join 1,247+ Verified Users</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Disrupt Hiring?</span>
          </h2>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
            Post your first job for ₹999. Or join as a recruiter and earn 99% commission. The choice is yours.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup?role=company" className="px-8 py-4 text-lg font-bold text-white bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl hover:shadow-[0_0_40px_rgba(16,185,129,0.6)] transition-all flex items-center gap-2 group">
              <Building2 className="w-5 h-5" />
              Post a Job (₹999)
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/signup?role=tas" className="px-8 py-4 text-lg font-bold text-white bg-white/5 backdrop-blur-md border border-white/10 rounded-xl hover:bg-white/10 transition-all flex items-center gap-2">
              <Users className="w-5 h-5" />
              Join as Recruiter
            </Link>
          </div>

          <p className="text-sm text-slate-500 mt-8">
            No credit card required. Complete KYC in 10 minutes.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <Navbar />
      <HeroSection />
      <LiveTicker />
      <LiveProtocol />
      <ComparisonMatrix />
      <HowItWorksSection />
      <SocialProofSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
