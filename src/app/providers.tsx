'use client';

import { useEffect, useState } from 'react';
import { initializeCsrf } from '@/lib/csrf';
import { refreshAccessToken, setupAxiosInterceptors } from '@/lib/setup-interceptors';
import { ProductivityLoader } from '@/components/Loader/Loader';

export function Providers({ children }: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        async function initialize() {
            try {
                setupAxiosInterceptors();
                await initializeCsrf();

                // Remove this line - let interceptors handle refresh when needed
                await refreshAccessToken(0)

                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize:', error);
                setIsInitialized(true);
            }
        }

        initialize();
    }, []);

    // Don't render children until initialization is complete
    if (!isInitialized) {
        return (
            <ProductivityLoader />
        );
    }

    return <>{children}</>;
}