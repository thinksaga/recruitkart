'use client';

import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { NavItem } from './types';

interface DashboardSidebarProps {
    isOpen: boolean;
    logo: {
        icon: React.ComponentType<any>;
        text: string;
        subtitle: string;
    };
    navigation: NavItem[];
    onNavigate?: () => void;
    className?: string;
}

export function DashboardSidebar({
    isOpen,
    logo,
    navigation,
    onNavigate,
    className = ""
}: DashboardSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
        onNavigate?.();
    };

    return (
        <>
            {/* Desktop Sidebar - Always visible */}
            <aside className="hidden lg:flex fixed left-0 top-0 h-full z-20 w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex-col shadow-2xl">
                {/* Logo */}
                <div className="p-6 border-b border-slate-800/50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <logo.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                {logo.text}
                            </h1>
                            <p className="text-xs text-slate-400">{logo.subtitle}</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-700 text-slate-300'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </aside>

            {/* Mobile Sidebar - Animated overlay */}
            <motion.aside
                initial={{ x: -300 }}
                animate={{ x: isOpen ? 0 : -300 }}
                className="lg:hidden fixed left-0 top-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col shadow-2xl z-30"
            >
                {/* Logo */}
                <div className="p-6 border-b border-slate-800/50">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <logo.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                {logo.text}
                            </h1>
                            <p className="text-xs text-slate-400">{logo.subtitle}</p>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <button
                                    key={item.name}
                                    onClick={() => handleNavigation(item.path)}
                                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${isActive
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="w-5 h-5" />
                                        <span className="font-medium">{item.name}</span>
                                    </div>
                                    {item.badge && (
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${isActive
                                                ? 'bg-emerald-500 text-white'
                                                : 'bg-slate-700 text-slate-300'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    {isActive && (
                                        <div className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>
            </motion.aside>
        </>
    );
}