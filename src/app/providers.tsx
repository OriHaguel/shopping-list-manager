'use client';

import { useEffect, useState } from 'react';
import { initializeCsrf } from '@/lib/csrf';
import { setupAxiosInterceptors, refreshAccessToken } from '@/lib/setup-interceptors';

export function Providers({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeApp = async () => {
            try {
                // Setup interceptors first (only runs once)
                setupAxiosInterceptors();

                // Initialize CSRF and Auth in parallel
                await Promise.all([
                    initializeCsrf(),
                    refreshAccessToken().catch(err => console.error('Auth refresh failed', err)) // Don't let a failed auth refresh block CSRF
                ]);

            } catch (error) {
                console.error('App initialization failed', error);
            } finally {
                setIsLoading(false);
            }
        };

        initializeApp();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Or a proper loading spinner component
    }

    return <>{children}</>;
}