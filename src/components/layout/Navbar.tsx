'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs));
}

export const Navbar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-slate-950/50 border-b border-white/10">
            <Link href="/" className="flex items-center gap-2">
                <Image src="/logo.png" alt="Recruitkart Logo" width={40} height={40} className="rounded-full" />
                <span className="text-xl font-bold text-white tracking-tight">Recruitkart</span>
            </Link>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
                <Link
                    href="/for-companies"
                    className={cn("transition-colors", isActive('/for-companies') ? "text-white" : "hover:text-white")}
                >
                    For Companies
                </Link>
                <Link
                    href="/for-recruiters"
                    className={cn("transition-colors", isActive('/for-recruiters') ? "text-white" : "hover:text-white")}
                >
                    For TAS
                </Link>
                <Link
                    href="/pricing"
                    className={cn("transition-colors", isActive('/pricing') ? "text-white" : "hover:text-white")}
                >
                    Pricing
                </Link>
                <Link
                    href="/about"
                    className={cn("transition-colors", isActive('/about') ? "text-white" : "hover:text-white")}
                >
                    About
                </Link>
            </div>
            <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-full hover:bg-indigo-500 transition-colors shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                Get Started
            </Link>
        </nav>
    );
};
