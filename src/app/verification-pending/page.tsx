'use client';

import { ShieldAlert, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function VerificationPendingPage() {
    const router = useRouter();

    const handleLogout = async () => {
        // Clear cookie (client-side hack, ideally call an API)
        document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-lg p-8 text-center shadow-2xl">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert className="w-8 h-8 text-yellow-500" />
                </div>

                <h1 className="text-2xl font-bold text-white mb-2">Verification Pending</h1>
                <p className="text-slate-400 mb-8">
                    Your account is currently under review. Our compliance team verifies GST/PAN details within 24 hours to ensure the integrity of the trustless protocol.
                </p>

                <div className="bg-slate-950 rounded-md p-4 mb-8 text-sm text-slate-500 border border-slate-800">
                    Status: <span className="text-yellow-500 font-medium">PENDING_VERIFICATION</span>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-md font-medium transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </div>
    );
}
