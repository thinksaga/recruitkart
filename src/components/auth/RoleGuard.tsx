'use client';

import { useAuth } from '@/hooks/useAuth'; // Assuming this hook exists or we need to create it
import { ReactNode } from 'react';

interface RoleGuardProps {
    children: ReactNode;
    allowedRoles: string[];
    fallback?: ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return null; // Or a spinner
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return fallback;
    }

    return <>{children}</>;
}
