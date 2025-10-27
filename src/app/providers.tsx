'use client';

import { useEffect, useState } from 'react';
import { initializeCsrf } from '@/lib/csrf';
import { refreshAccessToken, setupAxiosInterceptors } from '@/lib/setup-interceptors';

export function Providers({ children }: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        async function initialize() {
            try {
                // Setup interceptors first (synchronous)
                setupAxiosInterceptors();

                // Then fetch CSRF token (async) - WAIT for it
                await initializeCsrf();

                refreshAccessToken().catch((err) => {
                    console.error('Failed to refresh access token during initialization:', err);
                });
                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize:', error);
                // Even on error, allow render to avoid blocking the app
                setIsInitialized(true);
            }
        }

        initialize();
    }, []);

    // Don't render children until initialization is complete
    if (!isInitialized) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                Loading...
            </div>
        );
    }

    return <>{children}</>;
}