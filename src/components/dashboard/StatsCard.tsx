import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    color?: string;
    bg?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    delay?: number;
}

export function StatsCard({
    label,
    value,
    icon: Icon,
    color = 'text-blue-500',
    bg = 'bg-blue-500/10',
    trend,
    delay = 0
}: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 backdrop-blur-sm hover:border-slate-700 transition-all group"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${bg} group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${color}`} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs font-medium ${trend.isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{Math.abs(trend.value)}%</span>
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
                <p className="text-sm font-medium text-slate-400">{label}</p>
            </div>
        </motion.div>
    );
}
