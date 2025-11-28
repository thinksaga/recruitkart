'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Users,
    UserPlus,
    Mail,
    Shield,
    MoreVertical,
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Clock,
    Crown,
    Building2
} from 'lucide-react';

interface TeamMember {
    id: string;
    email: string;
    role: string;
    verification_status: string;
    created_at: string;
    last_login_at?: string;
}

interface Invitation {
    id: string;
    email: string;
    role: string;
    status: string;
    expires_at: string;
    created_at: string;
}

interface CurrentUser {
    id: string;
    email: string;
    role: string;
    organization_id?: string;
}

export default function TeamManagement() {
    const router = useRouter();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteForm, setInviteForm] = useState({
        email: '',
        role: 'COMPANY_MEMBER'
    });

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchTeamData();
        }
    }, [currentUser]);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
            } else {
                router.push('/login');
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
            router.push('/login');
        }
    };

    const fetchTeamData = async () => {
        try {
            const [membersRes, invitesRes] = await Promise.all([
                fetch('/api/admin/team/members'),
                fetch('/api/admin/team/invitations')
            ]);

            if (membersRes.ok) {
                const membersData = await membersRes.json();
                setTeamMembers(membersData.members || []);
            }

            if (invitesRes.ok) {
                const invitesData = await invitesRes.json();
                setInvitations(invitesData.invitations || []);
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/admin/team/invite', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inviteForm)
            });

            if (res.ok) {
                setShowInviteModal(false);
                setInviteForm({ email: '', role: 'COMPANY_MEMBER' });
                fetchTeamData(); // Refresh data
            } else {
                console.error('Failed to send invitation');
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'COMPANY_ADMIN':
                return <Crown className="w-4 h-4 text-yellow-500" />;
            case 'INTERVIEWER':
                return <Shield className="w-4 h-4 text-blue-500" />;
            case 'DECISION_MAKER':
                return <Building2 className="w-4 h-4 text-purple-500" />;
            default:
                return <Users className="w-4 h-4 text-emerald-500" />;
        }
    };

    const getRoleBadge = (role: string) => {
        const colors = {
            COMPANY_ADMIN: 'bg-yellow-500/20 text-yellow-400',
            INTERVIEWER: 'bg-blue-500/20 text-blue-400',
            DECISION_MAKER: 'bg-purple-500/20 text-purple-400',
            COMPANY_MEMBER: 'bg-emerald-500/20 text-emerald-400'
        };
        return colors[role as keyof typeof colors] || colors.COMPANY_MEMBER;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
                    <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border border-emerald-500/20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-200">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-3xl font-bold text-white mb-1">Team Management</h1>
                        <p className="text-slate-400">Manage your organization's team members and invitations</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <button
                            onClick={() => setShowInviteModal(true)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <UserPlus className="w-4 h-4" />
                            Invite Member
                        </button>
                    </motion.div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Active Members</p>
                                <p className="text-2xl font-bold text-white">{teamMembers.length}</p>
                            </div>
                            <Users className="w-8 h-8 text-emerald-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Pending Invites</p>
                                <p className="text-2xl font-bold text-white">
                                    {invitations.filter(inv => inv.status === 'PENDING').length}
                                </p>
                            </div>
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Total Invitations</p>
                                <p className="text-2xl font-bold text-white">{invitations.length}</p>
                            </div>
                            <Mail className="w-8 h-8 text-blue-500" />
                        </div>
                    </motion.div>
                </div>

                {/* Team Members */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Team Members</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    className="bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all w-64"
                                />
                            </div>
                            <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors">
                                <Filter className="w-4 h-4 text-slate-400" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {teamMembers.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-sm">
                                            {member.email.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">{member.email}</span>
                                            {getRoleIcon(member.role)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                                                {member.role.replace('_', ' ')}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.verification_status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    member.verification_status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                }`}>
                                                {member.verification_status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-right text-sm text-slate-400">
                                        <p>Joined {new Date(member.created_at).toLocaleDateString()}</p>
                                        {member.last_login_at && (
                                            <p>Last login {new Date(member.last_login_at).toLocaleDateString()}</p>
                                        )}
                                    </div>
                                    <button className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors">
                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Pending Invitations */}
                {invitations.filter(inv => inv.status === 'PENDING').length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
                    >
                        <h2 className="text-xl font-bold text-white mb-6">Pending Invitations</h2>
                        <div className="space-y-4">
                            {invitations.filter(inv => inv.status === 'PENDING').map((invitation) => (
                                <div key={invitation.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                                            <Mail className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-white">{invitation.email}</span>
                                                {getRoleIcon(invitation.role)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadge(invitation.role)}`}>
                                                    {invitation.role.replace('_', ' ')}
                                                </span>
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                                                    PENDING
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right text-sm text-slate-400">
                                        <p>Sent {new Date(invitation.created_at).toLocaleDateString()}</p>
                                        <p>Expires {new Date(invitation.expires_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md mx-4"
                    >
                        <h3 className="text-xl font-bold text-white mb-4">Invite Team Member</h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                                <input
                                    type="email"
                                    value={inviteForm.email}
                                    onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                                <select
                                    value={inviteForm.role}
                                    onChange={(e) => setInviteForm(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                                >
                                    <option value="COMPANY_MEMBER">Company Member</option>
                                    <option value="INTERVIEWER">Interviewer</option>
                                    <option value="DECISION_MAKER">Decision Maker</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Send Invitation
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}