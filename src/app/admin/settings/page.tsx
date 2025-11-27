'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Database, Shield, Bell, Info } from 'lucide-react';

export default function AdminSettingsPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">System Settings</h1>
                    <p className="text-slate-400">Platform configuration and information</p>
                </div>

                {/* Info Message */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6 mb-6">
                    <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-400 mb-1">Settings Configuration</h3>
                            <p className="text-sm text-slate-300">
                                Advanced settings are configured through environment variables and database configuration.
                                Use this page to view current platform status and basic preferences.
                            </p>
                        </div>
                    </div>
                </div>

                {/* System Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Platform Status */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-bold">Platform Status</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="py-3 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Database Status</span>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium">Connected</span>
                                </div>
                            </div>
                            <div className="py-3 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">API Status</span>
                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium">Operational</span>
                                </div>
                            </div>
                            <div className="py-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Environment</span>
                                    <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-sm font-medium">{process.env.NODE_ENV || 'Development'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Info */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold">Security Features</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="py-3 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Account Lockout</span>
                                    <span className="text-emerald-500 font-medium">Enabled</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">5 failed attempts = 30 min lock</p>
                            </div>
                            <div className="py-3 border-b border-slate-800">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Session Tracking</span>
                                    <span className="text-emerald-500 font-medium">Enabled</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">IP & User Agent logged</p>
                            </div>
                            <div className="py-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">JWT Expiry</span>
                                    <span className="text-slate-300 font-medium">24 hours</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Database Models */}
                <div className="mt-6 bg-slate-900 border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                            <Settings className="w-5 h-5 text-indigo-500" />
                        </div>
                        <h2 className="text-xl font-bold">Available Management Pages</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button
                            onClick={() => router.push('/admin/users')}
                            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                        >
                            <div className="text-sm text-slate-400 mb-1">Users</div>
                            <div className="font-semibold">CRUD Operations</div>
                        </button>
                        <button
                            onClick={() => router.push('/admin/organizations')}
                            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                        >
                            <div className="text-sm text-slate-400 mb-1">Organizations</div>
                            <div className="font-semibold">CRUD Operations</div>
                        </button>
                        <button
                            onClick={() => router.push('/admin/jobs')}
                            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                        >
                            <div className="text-sm text-slate-400 mb-1">Jobs</div>
                            <div className="font-semibold">CRUD Operations</div>
                        </button>
                        <button
                            onClick={() => router.push('/admin/submissions')}
                            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                        >
                            <div className="text-sm text-slate-400 mb-1">Submissions</div>
                            <div className="font-semibold">View & Manage</div>
                        </button>
                        <button
                            onClick={() => router.push('/admin/tickets')}
                            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                        >
                            <div className="text-sm text-slate-400 mb-1">Tickets</div>
                            <div className="font-semibold">Support System</div>
                        </button>
                        <button
                            onClick={() => router.push('/admin/audit')}
                            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                        >
                            <div className="text-sm text-slate-400 mb-1">Audit Logs</div>
                            <div className="font-semibold">View Only</div>
                        </button>
                        <button
                            onClick={() => router.push('/admin/analytics')}
                            className="p-4 bg-slate-800 hover:bg-slate-700 rounded-lg text-left transition-colors"
                        >
                            <div className="text-sm text-slate-400 mb-1">Analytics</div>
                            <div className="font-semibold">Real-time Data</div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
