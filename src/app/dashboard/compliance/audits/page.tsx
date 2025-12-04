'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileSearch, Loader2, Search } from 'lucide-react';

export default function ComplianceAuditsPage() {
    const router = useRouter();
    const [logs, setLogs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredLogs = logs.filter(log =>
        log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.entity_type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard/compliance')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Audit Logs</h1>
                    <p className="text-slate-400">System-wide activity tracking</p>
                </div>

                <div className="mb-6 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    </div>
                ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">User</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Action</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Entity</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Details</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                        <td className="py-4 px-6">
                                            <div className="font-medium">{log.user.email}</div>
                                            <div className="text-xs text-slate-400">{log.user.role}</div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="px-2 py-1 rounded bg-slate-800 text-xs font-medium text-blue-400">
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-300">
                                            {log.entity_type} <span className="text-slate-500 text-xs">#{log.entity_id?.slice(0, 8)}</span>
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-sm max-w-xs truncate">
                                            {JSON.stringify(log.details)}
                                        </td>
                                        <td className="py-4 px-6 text-slate-400 text-sm">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLogs.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No logs found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
