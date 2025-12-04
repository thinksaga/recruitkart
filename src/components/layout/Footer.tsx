'use client';

import React from 'react';
import Image from 'next/image';

export const Footer = () => (
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
