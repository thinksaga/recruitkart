'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Mail, Shield, Calendar, Edit, Save, X, Settings, Key, Bell, Globe, Database, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminProfile {
    id: string;
    email: string;
    fullName: string;
    role: string;
    permissions: string[];
    lastLogin: string;
    accountCreated: string;
    isActive: boolean;
    twoFactorEnabled: boolean;
    emailVerified: boolean;
}

export default function AdminProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState<AdminProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<AdminProfile>>({});
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/auth/me');
            const data = await response.json();

            if (response.ok && data.user) {
                // Mock additional admin profile data since the API might not provide all fields
                const adminProfile: AdminProfile = {
                    id: data.user.id || data.user.userId,
                    email: data.user.email,
                    fullName: data.user.full_name || data.user.name || data.user.email.split('@')[0],
                    role: data.user.role || 'ADMIN',
                    permissions: getPermissionsForRole(data.user.role),
                    lastLogin: data.user.lastLogin || new Date().toISOString(), // Mock data
                    accountCreated: data.user.created_at || data.user.createdAt || new Date().toISOString(),
                    isActive: data.user.isActive !== undefined ? data.user.isActive : true,
                    twoFactorEnabled: data.user.twoFactorEnabled || false, // Mock data
                    emailVerified: data.user.emailVerified !== undefined ? data.user.emailVerified : true // Mock data
                };

                setProfile(adminProfile);
                setFormData(adminProfile);
            } else {
                console.error('Failed to fetch profile:', data.error);
                setError(data.error || 'Failed to load profile data');
                // Create a fallback profile for demo purposes
                const fallbackProfile: AdminProfile = {
                    id: 'fallback-id',
                    email: 'admin@recruitkart.com',
                    fullName: 'Admin User',
                    role: 'ADMIN',
                    permissions: getPermissionsForRole('ADMIN'),
                    lastLogin: new Date().toISOString(),
                    accountCreated: new Date().toISOString(),
                    isActive: true,
                    twoFactorEnabled: false,
                    emailVerified: true
                };
                setProfile(fallbackProfile);
                setFormData(fallbackProfile);
            }
        } catch (error) {
            console.error('Network error fetching profile:', error);
            setError('Network error: Unable to connect to server');
            // Create a fallback profile for demo purposes
            const fallbackProfile: AdminProfile = {
                id: 'fallback-id',
                email: 'admin@recruitkart.com',
                fullName: 'Admin User',
                role: 'ADMIN',
                permissions: getPermissionsForRole('ADMIN'),
                lastLogin: new Date().toISOString(),
                accountCreated: new Date().toISOString(),
                isActive: true,
                twoFactorEnabled: false,
                emailVerified: true
            };
            setProfile(fallbackProfile);
            setFormData(fallbackProfile);
        } finally {
            setLoading(false);
        }
    };

    const getPermissionsForRole = (role: string): string[] => {
        switch (role) {
            case 'SUPPORT_AGENT':
                return ['view_users', 'manage_tickets', 'view_analytics', 'view_audit_logs'];
            case 'COMPANY_ADMIN':
                return ['manage_jobs', 'manage_team', 'view_submissions', 'manage_payments', 'view_analytics'];
            default: // SUPER_ADMIN
                return ['manage_users', 'manage_organizations', 'manage_jobs', 'manage_submissions', 'manage_payments', 'manage_credits', 'view_analytics', 'manage_settings', 'view_audit_logs'];
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // In a real implementation, this would call an API to update the profile
            await new Promise(resolve => setTimeout(resolve, 1000)); // Mock API call

            setProfile(prev => prev ? { ...prev, ...formData } : null);
            setEditing(false);
        } catch (error) {
            alert('Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(profile || {});
        setEditing(false);
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Shield className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-slate-300 mb-2">Profile Not Found</h2>
                    <p className="text-slate-400">Unable to load admin profile</p>
                </div>
            </div>
        );
    }

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'SUPPORT_AGENT': return 'text-blue-400 bg-blue-500/10';
            case 'COMPANY_ADMIN': return 'text-purple-400 bg-purple-500/10';
            default: return 'text-emerald-400 bg-emerald-500/10';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'SUPPORT_AGENT': return <Settings className="w-4 h-4" />;
            case 'COMPANY_ADMIN': return <Shield className="w-4 h-4" />;
            default: return <Database className="w-4 h-4" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => router.push('/admin')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-3xl font-bold">Admin Profile</h1>
                    <p className="text-slate-400">Manage your admin account settings</p>
                </div>

                {!editing && (
                    <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        <div>
                            <h3 className="font-semibold text-red-400">Connection Issue</h3>
                            <p className="text-sm text-slate-300">{error}</p>
                            <p className="text-xs text-slate-400 mt-1">Showing demo data. Some features may not work properly.</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Overview */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-white font-bold text-2xl">
                                    {profile.fullName.charAt(0).toUpperCase()}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold mb-1">{profile.fullName}</h2>
                            <p className="text-slate-400 mb-4">{profile.email}</p>

                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(profile.role)}`}>
                                {getRoleIcon(profile.role)}
                                {profile.role.replace('_', ' ')}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">Status</span>
                                <span className={`px-2 py-1 rounded text-xs ${profile.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {profile.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">Email Verified</span>
                                <span className={`px-2 py-1 rounded text-xs ${profile.emailVerified ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    {profile.emailVerified ? 'Verified' : 'Unverified'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between py-2 border-b border-slate-800">
                                <span className="text-slate-400">2FA</span>
                                <span className={`px-2 py-1 rounded text-xs ${profile.twoFactorEnabled ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'}`}>
                                    {profile.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Information */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.fullName || ''}
                                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-emerald-500"
                                    />
                                ) : (
                                    <p className="text-white">{profile.fullName}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                                <p className="text-white">{profile.email}</p>
                                <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Role</label>
                                <p className="text-white">{profile.role.replace('_', ' ')}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Member Since</label>
                                <p className="text-white">{new Date(profile.accountCreated).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Permissions */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            Permissions
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {profile.permissions.map((permission, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                    <span className="text-slate-300 capitalize">
                                        {permission.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account Activity */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Account Activity
                        </h3>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-400">Last Login</span>
                                <span className="text-white">{new Date(profile.lastLogin).toLocaleString()}</span>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <span className="text-slate-400">Account Created</span>
                                <span className="text-white">{new Date(profile.accountCreated).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit Actions */}
                    <AnimatePresence>
                        {editing && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-3 pt-4 border-t border-slate-800"
                            >
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-600 text-white rounded-lg transition-colors"
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>

                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}