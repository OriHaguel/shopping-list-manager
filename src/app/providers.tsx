'use client';

import { useEffect } from 'react';
import { initializeCsrf } from '@/lib/csrf';
import { setupAxiosInterceptors } from '@/lib/setup-interceptors';

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Setup interceptors first (only runs once)
        setupAxiosInterceptors();

        // Then fetch CSRF token
        initializeCsrf();
    }, []);

    return <>{children}</>;
}