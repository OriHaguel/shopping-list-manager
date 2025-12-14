// components/FAB/FAB.tsx
'use client';

import { getMessages } from '@/lib/getMessages';
import styles from './FAB.module.scss';

interface FABProps {
    onClick: () => void;
}

export function FAB({ onClick }: FABProps) {
    const t = getMessages();
    return (
        <button className={styles.fab} onClick={onClick} aria-label={t.createNewList}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5V19M5 12H19" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </button>
    );
}