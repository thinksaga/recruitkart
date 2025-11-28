'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { DashboardSidebar } from './DashboardSidebar';
import { SearchBar } from './SearchBar';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';
import { CurrentUser, Notification, NavItem } from './types';

interface BaseDashboardLayoutProps {
    children: React.ReactNode;
    currentUser: CurrentUser | null;
    notifications: Notification[];
    navigation: NavItem[];
    logo: {
        icon: React.ComponentType<any>;
        text: string;
        subtitle: string;
    };
    profilePath: string;
    settingsPath: string;
    onLogout: () => void;
    onSearch?: (query: string) => void;
    className?: string;
}

export function BaseDashboardLayout({
    children,
    currentUser,
    notifications,
    navigation,
    logo,
    profilePath,
    settingsPath,
    onLogout,
    onSearch,
    className = ""
}: BaseDashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    return (
        <div className={`min-h-screen bg-slate-950 text-white ${className}`}>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <DashboardSidebar
                isOpen={sidebarOpen}
                logo={logo}
                navigation={navigation}
                onNavigate={closeSidebar}
            />

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Header */}
                <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50">
                    <div className="flex items-center justify-between px-4 py-4 lg:px-6">
                        {/* Mobile Menu Button */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
                        >
                            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>

                        {/* Search Bar */}
                        <div className="flex-1 max-w-md mx-4">
                            <SearchBar placeholder="Search..." />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-3">
                            <NotificationDropdown notifications={notifications} />
                            <UserDropdown
                                currentUser={currentUser}
                                profilePath={profilePath}
                                settingsPath={settingsPath}
                                onLogout={onLogout}
                            />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-4 lg:p-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}