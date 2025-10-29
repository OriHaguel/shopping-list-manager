import { List } from '@/types';
import styles from './/ItemInputs.module.scss';
import { RefObject } from 'react';

interface ItemInputsProps {
    list: List | null | undefined;
    menuRef?: RefObject<HTMLDivElement | null>;
    setIsMenuOpen: (isOpen: boolean) => void;
    isMenuOpen: boolean;
    handleUncheckAll: () => void
}

export function ItemInputs({ list, menuRef, setIsMenuOpen, isMenuOpen, handleUncheckAll }: ItemInputsProps) {
    return (
        <div className={styles.itemInputs}>
            <span className={styles.itemlistName}>{list?.name}</span>
            <div className={styles.iconGroup}>
                <button className={styles.iconButton} aria-label="Search">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
                <button className={styles.iconButton} aria-label="Share">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
                <div className={styles.menuContainer} ref={menuRef}>
                    <button
                        className={styles.iconButton}
                        aria-label="Menu"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="1"></circle>
                            <circle cx="12" cy="5" r="1"></circle>
                            <circle cx="12" cy="19" r="1"></circle>
                        </svg>
                    </button>
                    {isMenuOpen && (
                        <div className={styles.dropdown}>
                            <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3"></circle>
                                    <circle cx="6" cy="12" r="3"></circle>
                                    <circle cx="18" cy="19" r="3"></circle>
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                </svg>
                                Share
                            </button>
                            <button className={styles.dropdownItem} onClick={() => setIsMenuOpen(false)}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="3" y1="6" x2="21" y2="6"></line>
                                    <line x1="3" y1="12" x2="21" y2="12"></line>
                                    <line x1="3" y1="18" x2="21" y2="18"></line>
                                </svg>
                                Sort by
                            </button>
                            <button className={styles.dropdownItem} onClick={handleUncheckAll}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                </svg>
                                Uncheck all
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}