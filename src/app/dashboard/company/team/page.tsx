'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, MoreVertical, Mail, Shield, User, Loader2, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function CompanyTeamPage() {
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Invite Modal State
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const [inviteMessage, setInviteMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [inviteData, setInviteData] = useState({
        email: '',
        role: 'COMPANY_MEMBER'
    });

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/company/team');
            if (res.ok) {
                const data = await res.json();
                setMembers(data.members);
            }
        } catch (error) {
            console.error('Failed to fetch team members:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsInviting(true);
        setInviteMessage(null);

        try {
            const res = await fetch('/api/company/team', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inviteData)
            });

            const data = await res.json();

            if (res.ok) {
                setInviteMessage({ type: 'success', text: 'Invitation sent successfully!' });
                setTimeout(() => {
                    setIsInviteModalOpen(false);
                    setInviteMessage(null);
                    setInviteData({ email: '', role: 'COMPANY_MEMBER' });
                }, 2000);
            } else {
                setInviteMessage({ type: 'error', text: data.error || 'Failed to send invitation' });
            }
        } catch (error) {
            setInviteMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setIsInviting(false);
        }
    };

    const filteredMembers = members.filter(member =>
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Team Management</h1>
                    <p className="text-slate-400">Manage your team members and their access levels.</p>
                </div>
                <button
                    onClick={() => setIsInviteModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search members by email or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500/50"
                />
            </div>

            {/* Members List */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                        <tr>
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Joined</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {filteredMembers.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold">
                                            {member.email.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-white font-medium">{member.email}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        {member.role === 'ADMIN' ? <Shield className="w-4 h-4 text-rose-500" /> : <User className="w-4 h-4 text-slate-500" />}
                                        {member.role}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'VERIFIED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        {member.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">{member.joined}</td>
                                <td className="p-4 text-right">
                                    <button className="text-slate-500 hover:text-white">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            <AnimatePresence>
                {isInviteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-slate-900 border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">Invite Team Member</h3>
                                <button onClick={() => setIsInviteModalOpen(false)} className="text-slate-400 hover:text-white">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {inviteMessage && (
                                <div className={`p-3 rounded-lg mb-4 flex items-center gap-2 text-sm ${inviteMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    }`}>
                                    {inviteMessage.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    {inviteMessage.text}
                                </div>
                            )}

                            <form onSubmit={handleInvite} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={inviteData.email}
                                        onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                        placeholder="colleague@company.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Role *</label>
                                    <select
                                        value={inviteData.role}
                                        onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-rose-500"
                                    >
                                        <option value="COMPANY_MEMBER">Member</option>
                                        <option value="COMPANY_ADMIN">Admin</option>
                                        <option value="INTERVIEWER">Interviewer</option>
                                        <option value="DECISION_MAKER">Decision Maker</option>
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isInviting}
                                    className="w-full py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                                >
                                    {isInviting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending Invite...
                                        </>
                                    ) : (
                                        'Send Invitation'
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
