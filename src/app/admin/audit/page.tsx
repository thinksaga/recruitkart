'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Shield, User, Activity } from 'lucide-react';

export default function AdminAuditPage() {
    const router = useRouter();

    // Mock audit logs
    const auditLogs = [
        { id: 1, action: 'User Verified', user: 'support@recruitkart.com', target: 'admin@test.com', timestamp: new Date().toISOString() },
        { id: 2, action: 'Job Approved', user: 'admin@recruitkart.com', target: 'Senior Developer', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, action: 'User Rejected', user: 'support@recruitkart.com', target: 'spam@example.com', timestamp: new Date(Date.now() - 7200000).toISOString() },
    ];

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
                    <p className="text-slate-400">System activity and admin actions</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Action</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Performed By</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Target</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <Activity className="w-4 h-4 text-emerald-500" />
                                                <span className="font-medium">{log.action}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-400" />
                                                {log.user}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400">{log.target}</td>
                                        <td className="py-4 px-6 text-slate-400 text-sm">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
