'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, MessageSquare, Clock, CheckCircle, AlertCircle, Filter, Search, Plus, MoreVertical, User, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

interface Ticket {
    id: number;
    ticket_number: number;
    subject: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    created_at: string;
    updated_at: string;
    raised_by: {
        id: string;
        email: string;
        role: string;
    };
    assigned_to?: {
        id: string;
        email: string;
        role: string;
    } | null;
    job?: {
        id: string;
        title: string;
        organization: {
            display_name: string;
        };
    } | null;
}

interface CurrentUser {
    id: string;
    email: string;
    role: string;
}

export default function AdminTicketsPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
    const [filters, setFilters] = useState({
        status: '',
        category: '',
        search: ''
    });

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    useEffect(() => {
        if (currentUser) {
            fetchTickets();
        }
    }, [currentUser, filters]);

    const fetchCurrentUser = async () => {
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setCurrentUser(data.user);
            }
        } catch (error) {
            console.error('Error fetching current user:', error);
        }
    };

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams();
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.category) queryParams.append('category', filters.category);

            const res = await fetch(`/api/admin/tickets?${queryParams}`);
            if (res.ok) {
                const data = await res.json();
                setTickets(data.tickets || []);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateTicketStatus = async (ticketId: number, status: string) => {
        try {
            const res = await fetch('/api/admin/tickets', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: ticketId, status })
            });

            if (res.ok) {
                fetchTickets(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating ticket:', error);
        }
    };

    const assignTicket = async (ticketId: number) => {
        if (!currentUser) return;

        try {
            const res = await fetch('/api/admin/tickets', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: ticketId, assigned_to_id: currentUser.id })
            });

            if (res.ok) {
                fetchTickets(); // Refresh the list
            }
        } catch (error) {
            console.error('Error assigning ticket:', error);
        }
    };

    const filteredTickets = tickets.filter(ticket =>
        ticket.subject.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        ticket.raised_by.email.toLowerCase().includes(filters.search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'bg-red-500/20 text-red-400';
            case 'IN_PROGRESS': return 'bg-blue-500/20 text-blue-400';
            case 'RESOLVED': return 'bg-green-500/20 text-green-400';
            case 'CLOSED': return 'bg-gray-500/20 text-gray-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'HIGH': return 'bg-red-500/20 text-red-400';
            case 'MEDIUM': return 'bg-yellow-500/20 text-yellow-400';
            case 'LOW': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Support Tickets</h1>
                            <p className="text-slate-400">Manage user support requests and issues</p>
                        </div>
                        <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg transition-colors">
                            <Plus className="w-4 h-4" />
                            New Ticket
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-6 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tickets..."
                                value={filters.search}
                                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                            />
                        </div>
                        <select
                            value={filters.status}
                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        >
                            <option value="">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                            <option value="CLOSED">Closed</option>
                        </select>
                        <select
                            value={filters.category}
                            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50"
                        >
                            <option value="">All Categories</option>
                            <option value="PAYMENT_FAILURE">Payment Failure</option>
                            <option value="ESCROW_DISPUTE">Escrow Dispute</option>
                            <option value="CANDIDATE_NO_SHOW">Candidate No Show</option>
                            <option value="EARLY_ATTRITION">Early Attrition</option>
                            <option value="DATA_PRIVACY">Data Privacy</option>
                            <option value="HARASSMENT">Harassment</option>
                            <option value="PLATFORM_BUG">Platform Bug</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>
                </div>

                {/* Tickets List */}
                <div className="space-y-4">
                    {filteredTickets.length === 0 ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                            <h3 className="text-xl font-bold mb-2">No Support Tickets</h3>
                            <p className="text-slate-400">User support tickets will appear here.</p>
                        </div>
                    ) : (
                        filteredTickets.map((ticket) => (
                            <motion.div
                                key={ticket.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm hover:bg-slate-900/80 transition-all"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm font-medium text-slate-300">#{ticket.ticket_number}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace('_', ' ')}
                                            </span>
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300">
                                                {ticket.category.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{ticket.subject}</h3>
                                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{ticket.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-slate-400">
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {ticket.raised_by.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(ticket.created_at).toLocaleDateString()}
                                            </div>
                                            {ticket.job && (
                                                <div className="flex items-center gap-1">
                                                    <Tag className="w-4 h-4" />
                                                    {ticket.job.title} • {ticket.job.organization.display_name}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 ml-4">
                                        {ticket.status === 'OPEN' && !ticket.assigned_to && (
                                            <button
                                                onClick={() => assignTicket(ticket.id)}
                                                className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm hover:bg-emerald-500/30 transition-colors"
                                            >
                                                Assign to Me
                                            </button>
                                        )}
                                        {ticket.status === 'OPEN' && (
                                            <button
                                                onClick={() => updateTicketStatus(ticket.id, 'IN_PROGRESS')}
                                                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                                            >
                                                Start
                                            </button>
                                        )}
                                        {ticket.status === 'IN_PROGRESS' && (
                                            <button
                                                onClick={() => updateTicketStatus(ticket.id, 'RESOLVED')}
                                                className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                                            >
                                                Resolve
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                </div>

                                {ticket.assigned_to && (
                                    <div className="pt-3 border-t border-slate-800/50">
                                        <p className="text-sm text-slate-400">
                                            Assigned to: <span className="text-slate-300">{ticket.assigned_to.email}</span>
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
