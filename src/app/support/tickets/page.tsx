'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, CheckCircle, Clock, MessageSquare, Loader2, Filter } from 'lucide-react';

export default function SupportTicketsPage() {
    const router = useRouter();
    const [tickets, setTickets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [resolutionNote, setResolutionNote] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchTickets();
    }, [statusFilter]);

    const fetchTickets = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/tickets?status=${statusFilter}`);
            if (res.ok) {
                const data = await res.json();
                setTickets(data.tickets);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResolve = async (ticketId: string) => {
        try {
            const res = await fetch('/api/admin/tickets', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: ticketId,
                    status: 'RESOLVED',
                    resolution_note: resolutionNote
                })
            });

            if (res.ok) {
                fetchTickets();
                setSelectedTicket(null);
                setResolutionNote('');
            }
        } catch (error) {
            console.error('Error resolving ticket:', error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/support')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Support Tickets</h1>
                    <p className="text-slate-400">Manage user support requests</p>
                </div>

                {/* Filters */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="ALL">All Status</option>
                            <option value="OPEN">Open</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="RESOLVED">Resolved</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Ticket List */}
                    <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            </div>
                        ) : tickets.length === 0 ? (
                            <div className="text-center py-8 text-slate-500">
                                <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>No tickets found</p>
                            </div>
                        ) : (
                            tickets.map((ticket) => (
                                <div
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedTicket?.id === ticket.id
                                            ? 'bg-blue-500/10 border-blue-500/50'
                                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${ticket.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-500' :
                                                'bg-green-500/10 text-green-500'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {new Date(ticket.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-medium text-white mb-1 line-clamp-1">{ticket.reason}</h3>
                                    <p className="text-sm text-slate-400">{ticket.raised_by.email}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Ticket Details */}
                    <div className="lg:col-span-2">
                        {selectedTicket ? (
                            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Ticket Details</h2>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedTicket.status === 'OPEN' ? 'bg-yellow-500/10 text-yellow-500' :
                                            'bg-green-500/10 text-green-500'
                                        }`}>
                                        {selectedTicket.status}
                                    </span>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-500 mb-1">Reason</label>
                                        <p className="text-lg text-white">{selectedTicket.reason}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-500 mb-1">Raised By</label>
                                            <div className="flex items-center gap-2 text-white">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                                                    {selectedTicket.raised_by.email[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <div>{selectedTicket.raised_by.email}</div>
                                                    <div className="text-xs text-slate-400">{selectedTicket.raised_by.role}</div>
                                                </div>
                                            </div>
                                        </div>
                                        {selectedTicket.related_job && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-500 mb-1">Related Job</label>
                                                <div className="text-white">{selectedTicket.related_job.title}</div>
                                            </div>
                                        )}
                                    </div>

                                    {selectedTicket.status === 'OPEN' ? (
                                        <div className="pt-6 border-t border-slate-800">
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Resolution Note</label>
                                            <textarea
                                                value={resolutionNote}
                                                onChange={(e) => setResolutionNote(e.target.value)}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 mb-4"
                                                placeholder="Enter details about how this issue was resolved..."
                                            />
                                            <button
                                                onClick={() => handleResolve(selectedTicket.id)}
                                                disabled={!resolutionNote.trim()}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Resolve Ticket
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="pt-6 border-t border-slate-800">
                                            <label className="block text-sm font-medium text-slate-500 mb-1">Resolution</label>
                                            <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-emerald-200">
                                                {selectedTicket.resolution_note}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 bg-slate-900/50 border border-slate-800/50 rounded-xl border-dashed min-h-[400px]">
                                <div className="text-center">
                                    <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>Select a ticket to view details</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
