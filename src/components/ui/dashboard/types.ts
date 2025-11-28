// Shared types for dashboard components
export interface CurrentUser {
    id: string;
    email: string;
    full_name?: string;
    role: string;
    tas_profile?: {
        credits_balance: number;
        reputation_score: number;
    };
}

export interface Notification {
    id: string;
    title: string;
    message?: string;
    time: string;
    unread: boolean;
    type: 'success' | 'warning' | 'info' | 'error';
    icon?: React.ComponentType<any>;
}

export interface NavItem {
    name: string;
    icon: React.ComponentType<any>;
    path: string;
    badge?: string | number;
    color?: string;
    description?: string;
}

export interface DashboardConfig {
    logo: {
        icon: React.ComponentType<any>;
        text: string;
        subtitle: string;
    };
    navigation: NavItem[];
    userMenu: {
        profilePath: string;
        settingsPath: string;
    };
    theme: {
        primary: string;
        secondary: string;
        accent: string;
    };
}