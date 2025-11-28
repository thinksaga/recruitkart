'use client';

import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Lock, Eye, EyeOff, Mail, AlertCircle, CheckCircle, Smartphone, Globe, Clock, CreditCard, FileText, Save, Key } from 'lucide-react';
import { motion } from 'framer-motion';
import TASLayout from '@/components/dashboard/TASLayout';

interface UserSettings {
    email: string;
    fullName: string;
    notificationPreferences: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        submissionUpdates: boolean;
        paymentAlerts: boolean;
        newJobMatches: boolean;
        weeklyReports: boolean;
    };
    securitySettings: {
        twoFactorEnabled: boolean;
        loginAlerts: boolean;
        sessionTimeout: number;
    };
}

export default function TASSettingsPage() {
    const [settings, setSettings] = useState<UserSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/tas/settings');
            const data = await response.json();

            if (response.ok) {
                setSettings(data.settings);
            } else {
                alert(data.error || 'Failed to fetch settings');
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            alert('Failed to fetch settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/tas/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Settings updated successfully!');
            } else {
                alert(data.error || 'Failed to update settings');
            }
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError('');
        setPasswordSuccess('');

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        if (passwordForm.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return;
        }

        try {
            const response = await fetch('/api/tas/settings/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setPasswordSuccess('Password changed successfully!');
                setPasswordForm({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
            } else {
                setPasswordError(data.error || 'Failed to change password');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setPasswordError('Failed to change password');
        }
    };

    const toggleNotification = (key: keyof UserSettings['notificationPreferences']) => {
        if (settings) {
            setSettings({
                ...settings,
                notificationPreferences: {
                    ...settings.notificationPreferences,
                    [key]: !settings.notificationPreferences[key],
                },
            });
        }
    };

    const toggleSecurity = (key: keyof UserSettings['securitySettings']) => {
        if (settings && typeof settings.securitySettings[key] === 'boolean') {
            setSettings({
                ...settings,
                securitySettings: {
                    ...settings.securitySettings,
                    [key]: !settings.securitySettings[key],
                },
            });
        }
    };

    const updateSessionTimeout = (timeout: number) => {
        if (settings) {
            setSettings({
                ...settings,
                securitySettings: {
                    ...settings.securitySettings,
                    sessionTimeout: timeout,
                },
            });
        }
    };

    if (loading) {
        return (
            <TASLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-indigo-500"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border border-indigo-500/20"></div>
                    </div>
                </div>
            </TASLayout>
        );
    }

    if (!settings) {
        return (
            <TASLayout>
                <div className="text-center py-12">
                    <p className="text-slate-400">Failed to load settings</p>
                </div>
            </TASLayout>
        );
    }

    return (
        <TASLayout>
            <div className="space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                                    <Settings className="w-6 h-6 text-white" />
                                </div>
                                Settings
                            </h1>
                            <p className="text-slate-400 mt-2">Manage your account preferences and security</p>
                        </div>
                        <button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center gap-2"
                        >
                            {saving ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Notification Preferences */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Bell className="w-5 h-5 text-indigo-400" />
                            Notification Preferences
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">Email Notifications</p>
                                        <p className="text-sm text-slate-400">Receive updates via email</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('emailNotifications')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationPreferences.emailNotifications ? 'bg-indigo-500' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationPreferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <Smartphone className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">SMS Notifications</p>
                                        <p className="text-sm text-slate-400">Get text alerts</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('smsNotifications')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationPreferences.smsNotifications ? 'bg-indigo-500' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationPreferences.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">Submission Updates</p>
                                        <p className="text-sm text-slate-400">Track submission status changes</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('submissionUpdates')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationPreferences.submissionUpdates ? 'bg-indigo-500' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationPreferences.submissionUpdates ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">Payment Alerts</p>
                                        <p className="text-sm text-slate-400">Notify on earnings & payouts</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('paymentAlerts')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationPreferences.paymentAlerts ? 'bg-indigo-500' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationPreferences.paymentAlerts ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <Globe className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">New Job Matches</p>
                                        <p className="text-sm text-slate-400">Alert for matching opportunities</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('newJobMatches')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationPreferences.newJobMatches ? 'bg-indigo-500' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationPreferences.newJobMatches ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">Weekly Reports</p>
                                        <p className="text-sm text-slate-400">Get weekly performance summaries</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleNotification('weeklyReports')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.notificationPreferences.weeklyReports ? 'bg-indigo-500' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.notificationPreferences.weeklyReports ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Security Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Shield className="w-5 h-5 text-indigo-400" />
                            Security Settings
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <Key className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">Two-Factor Authentication</p>
                                        <p className="text-sm text-slate-400">Add extra layer of security</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSecurity('twoFactorEnabled')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.securitySettings.twoFactorEnabled ? 'bg-indigo-500' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.securitySettings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700 hover:border-indigo-500/50 transition-all">
                                <div className="flex items-center gap-3">
                                    <Bell className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">Login Alerts</p>
                                        <p className="text-sm text-slate-400">Get notified of new logins</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleSecurity('loginAlerts')}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.securitySettings.loginAlerts ? 'bg-indigo-500' : 'bg-slate-700'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.securitySettings.loginAlerts ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>

                            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <Clock className="w-5 h-5 text-indigo-400" />
                                    <div>
                                        <p className="text-white font-medium">Session Timeout</p>
                                        <p className="text-sm text-slate-400">Auto-logout after inactivity</p>
                                    </div>
                                </div>
                                <select
                                    value={settings.securitySettings.sessionTimeout}
                                    onChange={(e) => updateSessionTimeout(Number(e.target.value))}
                                    className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                >
                                    <option value={15}>15 minutes</option>
                                    <option value={30}>30 minutes</option>
                                    <option value={60}>1 hour</option>
                                    <option value={120}>2 hours</option>
                                    <option value={240}>4 hours</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Change Password */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-indigo-400" />
                        Change Password
                    </h3>

                    {passwordError && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <p className="text-red-400">{passwordError}</p>
                        </div>
                    )}

                    {passwordSuccess && (
                        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <p className="text-green-400">{passwordSuccess}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? 'text' : 'password'}
                                    value={passwordForm.currentPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 pr-12 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? 'text' : 'password'}
                                    value={passwordForm.newPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 pr-12 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={passwordForm.confirmPassword}
                                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="w-full px-4 py-2.5 pr-12 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            onClick={handleChangePassword}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
                        >
                            <Lock className="w-5 h-5" />
                            <span>Change Password</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        </TASLayout>
    );
}
