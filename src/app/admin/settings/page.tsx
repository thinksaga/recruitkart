'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Settings, Database, Shield, Bell, Mail } from 'lucide-react';

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
                    <p className="text-slate-400">Configure platform settings and preferences</p>
                </div>

                {/* Settings Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Platform Settings */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                                <Settings className="w-5 h-5 text-indigo-500" />
                            </div>
                            <h2 className="text-xl font-bold">Platform Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-800">
                                <div>
                                    <div className="font-medium">Maintenance Mode</div>
                                    <div className="text-sm text-slate-400">Temporarily disable platform access</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-slate-800">
                                <div>
                                    <div className="font-medium">Auto-Approve Companies</div>
                                    <div className="text-sm text-slate-400">Automatically verify company accounts</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Security Settings */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-red-500" />
                            </div>
                            <h2 className="text-xl font-bold">Security Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-800">
                                <div>
                                    <div className="font-medium">Two-Factor Authentication</div>
                                    <div className="text-sm text-slate-400">Require 2FA for admin accounts</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-slate-800">
                                <div>
                                    <div className="font-medium">Session Timeout</div>
                                    <div className="text-sm text-slate-400">Auto-logout after inactivity</div>
                                </div>
                                <select className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-sm">
                                    <option>15 minutes</option>
                                    <option>30 minutes</option>
                                    <option>1 hour</option>
                                    <option>4 hours</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                                <Bell className="w-5 h-5 text-yellow-500" />
                            </div>
                            <h2 className="text-xl font-bold">Notifications</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b border-slate-800">
                                <div>
                                    <div className="font-medium">New User Registrations</div>
                                    <div className="text-sm text-slate-400">Notify on new signups</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-slate-800">
                                <div>
                                    <div className="font-medium">Job Postings</div>
                                    <div className="text-sm text-slate-400">Notify on new job posts</div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Email Settings */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                <Mail className="w-5 h-5 text-emerald-500" />
                            </div>
                            <h2 className="text-xl font-bold">Email Configuration</h2>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">SMTP Server</label>
                                <input
                                    type="text"
                                    placeholder="smtp.example.com"
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 mb-2 block">From Email</label>
                                <input
                                    type="email"
                                    placeholder="noreply@recruitkart.com"
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                    <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
