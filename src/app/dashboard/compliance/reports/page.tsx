'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Download } from 'lucide-react';

export default function ComplianceReportsPage() {
    const router = useRouter();

    const reports = [
        { name: 'Monthly Verification Report', date: 'Dec 2025', size: '2.4 MB' },
        { name: 'Audit Log Summary', date: 'Nov 2025', size: '1.8 MB' },
        { name: 'User Activity Report', date: 'Nov 2025', size: '5.2 MB' },
        { name: 'Financial Compliance Report', date: 'Q3 2025', size: '3.1 MB' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 text-white p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => router.push('/dashboard/compliance')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-4xl font-bold mb-2">Compliance Reports</h1>
                    <p className="text-slate-400">Download system reports and summaries</p>
                </div>

                <div className="grid gap-4">
                    {reports.map((report, index) => (
                        <div key={index} className="flex items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-xl hover:border-blue-500/50 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-800 rounded-lg group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-colors">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{report.name}</h3>
                                    <p className="text-sm text-slate-400">{report.date} • {report.size}</p>
                                </div>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors">
                                <Download className="w-4 h-4" />
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
