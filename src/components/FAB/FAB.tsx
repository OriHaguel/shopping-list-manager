// components/FAB/FAB.tsx
'use client';

import styles from './FAB.module.scss';

interface FABProps {
    onClick: () => void;
}

export default function FAB({ onClick }: FABProps) {
    return (
        <button className={styles.fab} onClick={onClick} aria-label="Create new list">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 5V19M5 12H19" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
        </button>
    );
}