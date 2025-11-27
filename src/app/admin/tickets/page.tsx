'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Clock, CheckCircle } from 'lucide-react';

export default function AdminTicketsPage() {
    const router = useRouter();

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
                    <h1 className="text-4xl font-bold mb-2">Support Tickets</h1>
                    <p className="text-slate-400">Manage user support requests</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <h3 className="text-xl font-bold mb-2">No Support Tickets</h3>
                    <p className="text-slate-400">User support tickets will appear here.</p>
                </div>
            </div>
        </div>
    );
}
