'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Building2, Calendar, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Application {
    id: string;
    status: string;
    created_at: string;
    job: {
        title: string;
        organization: {
            name: string;
            logo_url: string | null;
        };
    };
}

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
    PENDING_CONSENT: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Clock, label: 'Pending Review' },
    ACTIVE: { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20', icon: Clock, label: 'In Progress' },
    INTERVIEWING: { color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', icon: Calendar, label: 'Interviewing' },
    HIRED: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle, label: 'Hired' },
    REJECTED: { color: 'text-red-500 bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Rejected' },
    LOCKED: { color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', icon: Clock, label: 'Processing' },
};

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await fetch('/api/candidate/applications');
            if (res.ok) {
                const data = await res.json();
                setApplications(data.applications);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Applications</h1>
                <p className="text-slate-400">Track the status of your job applications.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                </div>
            ) : applications.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>You haven't applied to any jobs yet.</p>
                    <Link href="/candidate/jobs" className="text-cyan-400 hover:underline mt-2 inline-block">
                        Browse Jobs
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app, index) => {
                        const status = statusConfig[app.status] || statusConfig.PENDING_CONSENT;
                        const StatusIcon = status.icon;

                        return (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 flex items-center justify-between backdrop-blur-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                                        {app.job.organization.logo_url ? (
                                            <img src={app.job.organization.logo_url} alt={app.job.organization.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white mb-1">{app.job.title}</h3>
                                        <p className="text-sm text-slate-400">{app.job.organization.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right hidden md:block">
                                        <p className="text-xs text-slate-500 mb-1">Applied on</p>
                                        <p className="text-sm text-slate-300">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${status.color}`}>
                                        <StatusIcon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{status.label}</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
