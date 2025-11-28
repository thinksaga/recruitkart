'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { CurrentUser } from './types';

interface UserDropdownProps {
    currentUser: CurrentUser | null;
    profilePath: string;
    settingsPath: string;
    onLogout: () => void;
    className?: string;
}

export function UserDropdown({
    currentUser,
    profilePath,
    settingsPath,
    onLogout,
    className = ""
}: UserDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleNavigation = (path: string) => {
        setIsOpen(false);
        router.push(path);
    };

    const handleLogout = () => {
        setIsOpen(false);
        onLogout();
    };

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-white font-semibold text-sm">
                        {currentUser?.full_name?.charAt(0) ||
                            currentUser?.email?.charAt(0) ||
                            'U'}
                    </span>
                </div>
                <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-white">
                        {currentUser?.full_name ||
                            currentUser?.email?.split('@')[0] ||
                            'User'}
                    </p>
                    <p className="text-xs text-slate-400">
                        {currentUser?.role ? currentUser.role.replace('_', ' ') : 'User'}
                    </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-slate-800">
                            <p className="font-medium text-white">
                                {currentUser?.full_name ||
                                    currentUser?.email?.split('@')[0] ||
                                    'User'}
                            </p>
                            <p className="text-sm text-slate-400">
                                {currentUser?.email}
                            </p>
                        </div>
                        <div className="p-2">
                            <button
                                onClick={() => handleNavigation(profilePath)}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-300">Profile</span>
                            </button>
                            <button
                                onClick={() => handleNavigation(settingsPath)}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                            >
                                <Settings className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-300">Settings</span>
                            </button>
                        </div>
                        <div className="p-2 border-t border-slate-800">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="text-sm">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}