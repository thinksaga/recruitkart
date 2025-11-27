// Unified styling constants for Admin Dashboard
// Ensures consistent UI/UX across all admin pages

export const adminStyles = {
    // Layout
    page: 'p-6 lg:p-8 min-h-screen bg-slate-950 text-slate-200',
    container: 'max-w-7xl mx-auto space-y-8',

    // Cards
    card: 'p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all',
    cardCompact: 'p-4 rounded-lg border border-slate-800 bg-slate-900/50 backdrop-blur-sm',
    cardHeader: 'px-6 py-4 border-b border-slate-800',

    // Stat Cards
    statCard: 'p-6 rounded-2xl border bg-slate-900/50 backdrop-blur-sm hover:bg-slate-900/80 transition-all group',
    statValue: 'text-3xl font-bold text-white mb-1',
    statLabel: 'text-sm text-slate-400',

    // Tables
    table: 'w-full rounded-xl overflow-hidden border border-slate-800',
    tableHeader: 'bg-slate-900/80 border-b border-slate-800',
    tableHeaderCell: 'px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider',
    tableRow: 'hover:bg-slate-800/50 transition-colors border-b border-slate-800/50',
    tableCell: 'px-6 py-4',

    // Buttons
    buttonPrimary: 'px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20',
    buttonSecondary: 'px-4 py-2 bg-slate-800 text-slate-200 rounded-lg hover:bg-slate-700 transition-all border border-slate-700',
    buttonDanger: 'px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/20',
    buttonGhost: 'px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition-all',
    buttonIcon: 'p-2 bg-slate-900 border border-slate-800 rounded-full hover:bg-slate-800 transition-colors',

    // Inputs
    input: 'w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all',
    inputSearch: 'bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all',
    select: 'w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all',
    textarea: 'w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none',

    // Badges & Status
    badge: 'px-3 py-1 text-xs rounded-full inline-flex items-center gap-1',
    badgePending: 'px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    badgeSuccess: 'px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    badgeDanger: 'px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 bg-red-500/10 text-red-400 border border-red-500/20',
    badgeInfo: 'px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20',
    badgeWarning: 'px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 bg-orange-500/10 text-orange-400 border border-orange-500/20',
    badgeNeutral: 'px-3 py-1 text-xs rounded-full inline-flex items-center gap-1 bg-slate-500/10 text-slate-400 border border-slate-500/20',

    // Modals
    modalOverlay: 'fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4',
    modal: 'bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 max-h-[90vh] overflow-y-auto',
    modalHeader: 'sticky top-0 bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between',
    modalBody: 'p-6 space-y-6',
    modalFooter: 'px-6 py-4 border-t border-slate-800 flex gap-3',

    // Typography
    h1: 'text-3xl font-bold text-white mb-1',
    h2: 'text-2xl font-bold text-white mb-1',
    h3: 'text-xl font-bold text-white mb-1',
    textPrimary: 'text-white',
    textSecondary: 'text-slate-400',
    textMuted: 'text-slate-500',

    // Loading
    spinner: 'animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500',
    spinnerLarge: 'animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500',

    // Misc
    divider: 'border-t border-slate-800',
    iconBox: 'p-3 rounded-xl',
    link: 'text-emerald-400 hover:text-emerald-300 transition-colors',
    tag: 'px-2 py-1 text-xs bg-slate-800 text-slate-300 rounded',
};

// Status color mappings
export const statusColors = {
    PENDING: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-400',
        border: 'border-yellow-500/20',
    },
    APPROVED: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
    },
    REJECTED: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
    },
    ACTIVE: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
    },
    INACTIVE: {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/20',
    },
    COMPLETED: {
        bg: 'bg-blue-500/10',
        text: 'text-blue-400',
        border: 'border-blue-500/20',
    },
    CANCELLED: {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/20',
    },
    EXPIRED: {
        bg: 'bg-red-500/10',
        text: 'text-red-400',
        border: 'border-red-500/20',
    },
    ACCEPTED: {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/20',
    },
};

// Icon color mappings for stat cards
export const iconColors = {
    blue: {
        text: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
    },
    emerald: {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
    },
    purple: {
        text: 'text-purple-400',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
    },
    yellow: {
        text: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
    },
    red: {
        text: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
    },
    orange: {
        text: 'text-orange-400',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/20',
    },
    cyan: {
        text: 'text-cyan-400',
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
    },
};
