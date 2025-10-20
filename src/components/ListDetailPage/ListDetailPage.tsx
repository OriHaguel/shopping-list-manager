// components/ListDetailPage/ListDetailPage.tsx
'use client';

import styles from './ListDetailPage.module.scss';

interface ListDetailPageProps {
    listId: string;
    onBack: () => void;
}

export default function ListDetailPage({ listId, onBack }: ListDetailPageProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={onBack} aria-label="Go back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5M12 19L5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className={styles.title}>List Detail</h1>
            </div>

            <div className={styles.content}>
                <div className={styles.card}>
                    <p className={styles.listId}>List ID: {listId}</p>
                    <p className={styles.description}>
                        This is where your list content would go. You can add items, manage tasks, and organize your information here.
                    </p>
                </div>
            </div>
        </div>
    );
}