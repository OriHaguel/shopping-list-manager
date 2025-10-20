// components/ListCard/ListCard.tsx
'use client';
import styles from './ListCard.module.scss';
import { List } from '@/types';

interface ListCardProps {
    list: List;
    onClick: () => void;
    onDelete: () => void;
}

export default function ListCard({ list, onClick, onDelete }: ListCardProps) {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${list.name}"?`)) {
            onDelete();
        }
    };

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.content}>
                <h3 className={styles.name}>{list.name}</h3>
            </div>
            <button
                className={styles.deleteButton}
                onClick={handleDelete}
                aria-label="Delete list"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                    <path d="M15 5L5 15M5 5L15 15" strokeWidth="2" strokeLinecap="round" />
                </svg>
            </button>
        </div>
    );
}