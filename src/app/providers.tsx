'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { initializeCsrf } from '@/lib/csrf';
import { setupAxiosInterceptors, refreshAccessToken } from '@/lib/setup-interceptors';
import { ProductivityLoader } from '@/components/Loader/Loader';
import { wait } from '@/lib/utils';
import { getItem, setItem } from '@/utils/localStorage';
// might not work properly on dev but its fine thsu far on prod fixc later if needed
export function Providers({ children }: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function initialize() {
            try {
                const lan = getItem<string>('lan', '');
                if (!lan) {
                    const userLang = navigator.language || 'en'
                    setItem('lan', userLang);
                }
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
                // router.push('/')
                // await wait(60);
                setIsInitialized(true);
            }

        }
        initialize();
    }, []);

    if (!isInitialized) return <ProductivityLoader />;

    return <>{children}</>;
}
