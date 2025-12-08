'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Send, Coins, TrendingUp, Loader2 } from 'lucide-react';
import { StatsCard } from '@/components/dashboard/StatsCard';

export default function TASDashboard() {
    const [stats, setStats] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/tas/stats');
                if (res.ok) {
                    const data = await res.json();
                    // Map icon strings to components
                    const mappedStats = data.stats.map((stat: any) => ({
                        ...stat,
                        icon: getIcon(stat.icon)
                    }));
                    setStats(mappedStats);
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []);

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Users': return Users;
            case 'Send': return Send;
            case 'Coins': return Coins;
            case 'TrendingUp': return TrendingUp;
            default: return Users;
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">TAS Dashboard</h1>
                <p className="text-slate-400">Manage your candidate bank and job submissions.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatsCard
                        key={stat.name}
                        label={stat.name}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        bg={stat.bg}
                        delay={index * 0.1}
                    />
                ))}
            </div>

            {/* Recent Submissions (Placeholder - could be fetched from submissions API too) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm"
            >
                <h2 className="text-xl font-bold text-white mb-6">Recent Submissions</h2>
                <div className="text-center py-12 text-slate-500">
                    <Send className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent submissions</p>
                </div>
            </motion.div>
        </div>
    );
}
