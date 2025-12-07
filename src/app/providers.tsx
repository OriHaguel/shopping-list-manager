'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeCsrf } from '@/lib/csrf';
import { setupAxiosInterceptors, refreshAccessToken } from '@/lib/setup-interceptors';
import { ProductivityLoader } from '@/components/Loader/Loader';
import { wait } from '@/lib/utils';

export function Providers({ children }: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function initialize() {
            try {
                setupAxiosInterceptors();
                await initializeCsrf();

                await refreshAccessToken(); // refresh token only
                const currentPath = window.location.pathname;
                if (currentPath === '/' || currentPath === '/auth') {
                    router.push('/list'); // ✅ SPA navigation — no refresh
                    await wait(60);
                }

                setIsInitialized(true);
            } catch (error) {
                console.error('Failed to initialize:', error);
                setIsInitialized(true);
            }

        }
        initialize();
    }, []);

    if (!isInitialized) return <ProductivityLoader />;

    return <>{children}</>;
}
