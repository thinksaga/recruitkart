'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, Clock, User, Activity, Loader2 } from 'lucide-react';

export default function AdminAuditPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await fetch('/api/admin/audit');
            if (res.ok) {
                const data = await res.json();
                setLogs(data.logs);
            }
        } catch (error) {
            console.error('Error fetching audit logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Audit Logs</h1>
                    <p className="text-slate-400">Track system activities and security events</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">Timestamp</th>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">User</th>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">Action</th>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">Entity</th>
                                        <th className="text-left py-4 px-6 text-slate-300 font-medium">Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                            <td className="py-4 px-6 text-slate-400 text-sm whitespace-nowrap">
                                                {new Date(log.created_at).toLocaleString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                                                        {log.user.email[0].toUpperCase()}
                                                    </div>
                                                    <div className="text-sm">
                                                        <div>{log.user.email}</div>
                                                        <div className="text-xs text-slate-500">{log.user.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-emerald-400">
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                <span className="text-slate-400">{log.entity_type}:</span> {log.entity_id}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-slate-400 max-w-xs truncate">
                                                {JSON.stringify(log.details)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
