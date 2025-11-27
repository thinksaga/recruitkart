'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function AdminSubmissionsPage() {
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
                    <h1 className="text-4xl font-bold mb-2">Candidate Submissions</h1>
                    <p className="text-slate-400">Track all TAS candidate submissions</p>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                    <h3 className="text-xl font-bold mb-2">No Submissions Yet</h3>
                    <p className="text-slate-400">Candidate submissions will appear here once TAS partners start submitting candidates.</p>
                </div>
            </div>
        </div>
    );
}
