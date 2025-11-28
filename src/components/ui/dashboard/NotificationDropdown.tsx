'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import { Notification } from './types';

interface NotificationDropdownProps {
    notifications: Notification[];
    className?: string;
}

export function NotificationDropdown({ notifications, className = "" }: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 hover:bg-slate-800/50 rounded-lg transition-colors"
            >
                <Bell className="w-5 h-5 text-slate-400" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-slate-800">
                            <h3 className="font-semibold text-white">Notifications</h3>
                            <p className="text-sm text-slate-400 mt-1">
                                {unreadCount} unread
                            </p>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                                    <p className="text-slate-500">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 border-b border-slate-700 hover:bg-slate-800/50 transition-colors cursor-pointer ${notif.unread ? 'bg-blue-500/5' : ''
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'success' ? 'bg-green-500' :
                                                    notif.type === 'warning' ? 'bg-yellow-500' :
                                                        notif.type === 'error' ? 'bg-red-500' :
                                                            'bg-blue-500'
                                                }`} />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-white">{notif.title}</p>
                                                {notif.message && (
                                                    <p className="text-sm text-slate-400 mt-1">{notif.message}</p>
                                                )}
                                                <p className="text-xs text-slate-500 mt-2">{notif.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}