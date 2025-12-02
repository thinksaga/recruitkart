import {
    LayoutDashboard,
    Users,
    Briefcase,
    Send,
    Coins,
    Calendar
} from 'lucide-react';

export const tasNavigation = [
    { name: 'Dashboard', href: '/tas', icon: LayoutDashboard },
    { name: 'Job Marketplace', href: '/tas/jobs', icon: Briefcase },
    { name: 'Candidate Bank', href: '/tas/candidates', icon: Users },
    { name: 'My Submissions', href: '/tas/submissions', icon: Send },
    { name: 'Interviews', href: '/tas/interviews', icon: Calendar },
    { name: 'Credits', href: '/tas/credits', icon: Coins },
];
