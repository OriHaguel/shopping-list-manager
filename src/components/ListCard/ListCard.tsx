// components/ListCard/ListCard.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './ListCard.module.scss';
import { List } from '@/types';

interface ListCardProps {
    list: List;
    onClick: () => void;
    onDelete: () => void;
    onRename: () => void;
    onShare?: () => void;
    onCopy?: () => void;
}

export default function ListCard({ list, onClick, onDelete, onRename, onShare, onCopy }: ListCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    const toggleMenu = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleMenuAction = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        setIsMenuOpen(false);
        action();
    };

    const handleDelete = () => {
        if (window.confirm(`Delete "${list.name}"?`)) {
            onDelete();
        }
    };

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.content}>
                <h3 className={styles.name}>{list.name}</h3>
            </div>
            <div className={styles.menuContainer} ref={menuRef}>
                <button
                    className={styles.menuButton}
                    onClick={toggleMenu}
                    aria-label="Open menu"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <circle cx="10" cy="4" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="10" cy="16" r="1.5" />
                    </svg>
                </button>
                {isMenuOpen && (
                    <div className={styles.menu}>
                        <button
                            className={styles.menuList}
                            onClick={(e) => handleMenuAction(e, onRename)}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                                <path d="M11 2L14 5L6 13L2 14L3 10L11 2Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Rename</span>
                        </button>
                        {onShare && (
                            <button
                                className={styles.menuList}
                                onClick={(e) => handleMenuAction(e, onShare)}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="4" r="2" strokeWidth="1.5" />
                                    <circle cx="4" cy="8" r="2" strokeWidth="1.5" />
                                    <circle cx="12" cy="12" r="2" strokeWidth="1.5" />
                                    <path d="M5.5 9L10.5 11.5M10.5 4.5L5.5 7" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span>Share</span>
                            </button>
                        )}
                        {onCopy && (
                            <button
                                className={styles.menuList}
                                onClick={(e) => handleMenuAction(e, onCopy)}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                                    <rect x="5" y="5" width="9" height="9" rx="1.5" strokeWidth="1.5" />
                                    <path d="M3 11V3C3 2.4 3.4 2 4 2H10" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span>Copy</span>
                            </button>
                        )}
                        <button
                            className={`${styles.menuList} ${styles.deleteItem}`}
                            onClick={(e) => handleMenuAction(e, handleDelete)}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                                <path d="M3 4H13M5 4V3C5 2.4 5.4 2 6 2H10C10.6 2 11 2.4 11 3V4M6 7V12M10 7V12M4 4L5 13C5 13.6 5.4 14 6 14H10C10.6 14 11 13.6 11 13L12 4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Delete</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}