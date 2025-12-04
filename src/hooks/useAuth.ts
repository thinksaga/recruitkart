import { useState, useEffect } from 'react';

interface User {
    id: string;
    email: string;
    role: string;
    verification_status: string;
    // Add other user properties as needed
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        async function fetchUser() {
            try {
                const response = await fetch('/api/auth/me');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch user'));
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        fetchUser();
    }, []);

    return { user, isLoading, error };
}
