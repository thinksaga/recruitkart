interface SkeletonLoaderProps {
    variant?: 'card' | 'table' | 'stats' | 'chart';
    count?: number;
}

export default function SkeletonLoader({ variant = 'card', count = 1 }: SkeletonLoaderProps) {
    const renderSkeletons = () => {
        const items = Array(count).fill(null);

        switch (variant) {
            case 'stats':
                return items.map((_, i) => (
                    <div key={i} className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden animate-pulse">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
                                <div className="w-16 h-4 bg-slate-800 rounded"></div>
                            </div>
                            <div className="w-24 h-4 bg-slate-800 rounded"></div>
                            <div className="w-20 h-8 bg-slate-700 rounded"></div>
                            <div className="w-32 h-3 bg-slate-800 rounded"></div>
                        </div>
                    </div>
                ));

            case 'chart':
                return items.map((_, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm animate-pulse">
                        <div className="mb-6 space-y-2">
                            <div className="w-32 h-6 bg-slate-800 rounded"></div>
                            <div className="w-48 h-4 bg-slate-800 rounded"></div>
                        </div>
                        <div className="h-64 bg-slate-800 rounded-xl"></div>
                    </div>
                ));

            case 'table':
                return items.map((_, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm animate-pulse">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="w-48 h-6 bg-slate-800 rounded"></div>
                                <div className="w-24 h-10 bg-slate-800 rounded-lg"></div>
                            </div>
                            <div className="space-y-3">
                                {Array(5).fill(null).map((_, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                                        <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="w-full h-4 bg-slate-700 rounded"></div>
                                            <div className="w-2/3 h-3 bg-slate-700 rounded"></div>
                                        </div>
                                        <div className="w-20 h-8 bg-slate-700 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ));

            case 'card':
            default:
                return items.map((_, i) => (
                    <div key={i} className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm animate-pulse">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="w-12 h-12 bg-slate-800 rounded-xl"></div>
                                <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
                            </div>
                            <div className="space-y-3">
                                <div className="w-full h-5 bg-slate-800 rounded"></div>
                                <div className="w-3/4 h-4 bg-slate-800 rounded"></div>
                            </div>
                            <div className="flex gap-2">
                                <div className="w-16 h-6 bg-slate-800 rounded-full"></div>
                                <div className="w-20 h-6 bg-slate-800 rounded-full"></div>
                                <div className="w-16 h-6 bg-slate-800 rounded-full"></div>
                            </div>
                            <div className="w-full h-10 bg-slate-800 rounded-lg"></div>
                        </div>
                    </div>
                ));
        }
    };

    return <>{renderSkeletons()}</>;
}
