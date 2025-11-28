'use client';

import { Search } from 'lucide-react';

interface SearchBarProps {
    placeholder?: string;
    className?: string;
}

export function SearchBar({ placeholder = "Search...", className = "" }: SearchBarProps) {
    return (
        <div className={`hidden md:block relative ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
                type="text"
                placeholder={placeholder}
                className="bg-slate-800/50 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all w-64 lg:w-80"
            />
        </div>
    );
}