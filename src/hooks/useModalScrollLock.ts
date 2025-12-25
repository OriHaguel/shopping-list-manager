import { useEffect } from 'react';

export function useModalScrollLock(isOpen: boolean) {
    useEffect(() => {
        if (isOpen) {
            // Calculate scrollbar width to prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            // Lock scroll and add padding to body
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;

            // Cleanup function to reset styles
            return () => {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            };
        }
    }, [isOpen]);
}
