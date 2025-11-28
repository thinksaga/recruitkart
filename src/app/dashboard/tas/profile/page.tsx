'use client';

import { useState, useEffect } from 'react';
import { User, CreditCard, Building, Mail, Phone, Calendar, Star, Shield, Edit, Save, X, Award, TrendingUp, CheckCircle, AlertCircle, Linkedin, Building2, Hash, FileText, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TASLayout from '@/components/dashboard/TASLayout';

interface Profile {
    id: string;
    fullName: string;
    panNumber: string;
    gstin: string | null;
    tdsCategory: string;
    linkedinUrl: string | null;
    bankAccountLast4: string | null;
    ifscCode: string | null;
    creditsBalance: number;
    reputationScore: number;
    totalPlacements: number;
    email: string;
    phone: string | null;
    verificationStatus: string;
    joinedAt: string;
}

export default function TASProfilePage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<Partial<Profile>>({});

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/tas/profile');
            const data = await response.json();

            if (response.ok) {
                setProfile(data.profile);
                setFormData(data.profile);
            } else {
                alert(data.error || 'Failed to fetch profile');
            }
        } catch (error) {
            alert('Failed to fetch profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const response = await fetch('/api/tas/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Profile updated successfully!');
                setEditing(false);
                fetchProfile();
            } else {
                alert(data.error || 'Failed to update profile');
            }
        } catch (error) {
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(profile || {});
        setEditing(false);
    };

    const getVerificationConfig = (status: string) => {
        const configs: Record<string, { icon: any; color: string; bg: string; label: string }> = {
            'VERIFIED': { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20', label: 'Verified' },
            'PENDING': { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20', label: 'Pending' },
            'UNDER_REVIEW': { icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20', label: 'Under Review' },
            'REJECTED': { icon: X, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', label: 'Rejected' },
        };
        return configs[status] || configs['PENDING'];
    };

    const calculateProfileCompletion = () => {
        if (!profile) return 0;
        const fields = [
            profile.fullName,
            profile.panNumber,
            profile.email,
            profile.phone,
            profile.linkedinUrl,
            profile.bankAccountLast4,
            profile.ifscCode,
            profile.gstin,
        ];
        const filledFields = fields.filter(field => field && field.length > 0).length;
        return Math.round((filledFields / fields.length) * 100);
    };

    if (loading) {
        return (
            <TASLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-purple-500"></div>
                        <div className="absolute inset-0 animate-ping rounded-full h-20 w-20 border border-purple-500/20"></div>
                    </div>
                </div>
            </TASLayout>
        );
    }

    if (!profile) {
        return (
            <TASLayout>
                <div className="text-center py-12">
                    <p className="text-slate-400">Failed to load profile</p>
                </div>
            </TASLayout>
        );
    }

    const verificationConfig = getVerificationConfig(profile.verificationStatus);
    const VerificationIcon = verificationConfig.icon;
    const profileCompletion = calculateProfileCompletion();

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
                                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg shadow-purple-500/20">
                                    <User className="w-6 h-6 text-white" />
                                </div>
                                My Profile
                            </h1>
                            <p className="text-slate-400 mt-2">Manage your personal and business information</p>
                        </div>
                        {!editing ? (
                            <button
                                onClick={() => setEditing(true)}
                                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2"
                            >
                                <Edit className="w-5 h-5" />
                                <span>Edit Profile</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCancel}
                                    disabled={saving}
                                    className="px-6 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl font-medium transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    <X className="w-5 h-5" />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 flex items-center gap-2"
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
                        )}
                    </div>

                    {/* Profile Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            whileHover={{ y: -4 }}
                            className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-purple-500/10 via-slate-900 to-slate-900 overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                                        <User className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${verificationConfig.bg} ${verificationConfig.color}`}>
                                        <VerificationIcon className="w-3 h-3 inline mr-1" />
                                        {verificationConfig.label}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm">Status</p>
                                <p className="text-xl font-bold text-white mt-1">{verificationConfig.label}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            whileHover={{ y: -4 }}
                            className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-yellow-500/10 via-slate-900 to-slate-900 overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl group-hover:bg-yellow-500/20 transition-all"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                                        <Star className="w-5 h-5 text-yellow-400" />
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm">Reputation Score</p>
                                <p className="text-xl font-bold text-white mt-1">{profile.reputationScore.toFixed(1)}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ y: -4 }}
                            className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-green-500/10 via-slate-900 to-slate-900 overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                                        <Award className="w-5 h-5 text-green-400" />
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm">Total Placements</p>
                                <p className="text-xl font-bold text-white mt-1">{profile.totalPlacements}</p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            whileHover={{ y: -4 }}
                            className="relative p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-500/10 via-slate-900 to-slate-900 overflow-hidden group cursor-pointer"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all"></div>
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                        <CreditCard className="w-5 h-5 text-blue-400" />
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm">Credits Balance</p>
                                <p className="text-xl font-bold text-white mt-1">{profile.creditsBalance}</p>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Profile Completion */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Profile Completion</h3>
                            <p className="text-sm text-slate-400 mt-1">Complete your profile to unlock all features</p>
                        </div>
                        <div className="text-right">
                            <p className="text-3xl font-bold text-white">{profileCompletion}%</p>
                        </div>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${profileCompletion}%` }}
                            transition={{ duration: 1, delay: 0.6 }}
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full"
                        />
                    </div>
                </motion.div>

                {/* Profile Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <User className="w-5 h-5 text-purple-400" />
                            Personal Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <User className="w-4 h-4 text-purple-500" />
                                    Full Name
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.fullName || ''}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile.fullName || 'Not provided'}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Mail className="w-4 h-4 text-purple-500" />
                                    Email
                                </label>
                                <p className="text-white font-medium">{profile.email}</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Phone className="w-4 h-4 text-purple-500" />
                                    Phone Number
                                </label>
                                {editing ? (
                                    <input
                                        type="tel"
                                        value={formData.phone || ''}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile.phone || 'Not provided'}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Linkedin className="w-4 h-4 text-purple-500" />
                                    LinkedIn Profile
                                </label>
                                {editing ? (
                                    <input
                                        type="url"
                                        value={formData.linkedinUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="https://linkedin.com/in/yourprofile"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile.linkedinUrl || 'Not provided'}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Calendar className="w-4 h-4 text-purple-500" />
                                    Member Since
                                </label>
                                <p className="text-white font-medium">
                                    {new Date(profile.joinedAt).toLocaleDateString('en-IN', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Business & Financial Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
                    >
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <Building className="w-5 h-5 text-purple-400" />
                            Business & Financial
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Hash className="w-4 h-4 text-purple-500" />
                                    PAN Number
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.panNumber || ''}
                                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="ABCDE1234F"
                                        maxLength={10}
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile.panNumber || 'Not provided'}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Building2 className="w-4 h-4 text-purple-500" />
                                    GSTIN (Optional)
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.gstin || ''}
                                        onChange={(e) => setFormData({ ...formData, gstin: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="22AAAAA0000A1Z5"
                                        maxLength={15}
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile.gstin || 'Not provided'}</p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <FileText className="w-4 h-4 text-purple-500" />
                                    TDS Category
                                </label>
                                <p className="text-white font-medium">{profile.tdsCategory}</p>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Wallet className="w-4 h-4 text-purple-500" />
                                    Bank Account
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.bankAccountLast4 || ''}
                                        onChange={(e) => setFormData({ ...formData, bankAccountLast4: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="Last 4 digits"
                                        maxLength={4}
                                    />
                                ) : (
                                    <p className="text-white font-medium">
                                        {profile.bankAccountLast4 ? `**** ${profile.bankAccountLast4}` : 'Not provided'}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Building className="w-4 h-4 text-purple-500" />
                                    IFSC Code
                                </label>
                                {editing ? (
                                    <input
                                        type="text"
                                        value={formData.ifscCode || ''}
                                        onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                                        className="w-full px-4 py-2.5 border border-slate-700 rounded-xl bg-slate-800/50 text-white focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
                                        placeholder="SBIN0001234"
                                        maxLength={11}
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile.ifscCode || 'Not provided'}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </TASLayout>
    );
}
