import { getMessages } from '@/lib/getMessages';
import { getItem } from '@/utils/localStorage';
import { List } from '@/types';
import styles from './ItemInputs.module.scss';
import { RefObject, useState, useEffect, useRef } from 'react';

interface ItemInputsProps {
    list: List | null | undefined;
    menuRef?: RefObject<HTMLDivElement | null>;
    setIsMenuOpen: (isOpen: boolean) => void;
    isMenuOpen: boolean;
    handleUncheckAll: () => void;
    onSearch: (query: string) => void;
    onSort: (sortType: 'a-z' | 'category') => void;
}

export function ItemInputs({
    list,
    menuRef,
    setIsMenuOpen,
    isMenuOpen,
    handleUncheckAll,
    onSearch,
    onSort
}: ItemInputsProps) {
    const t = getMessages();
    const lan = getItem<string>('lan', '');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const sortMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (sortMenuRef.current && !sortMenuRef.current.contains(event.target as Node)) {
                setIsSortMenuOpen(false);
            }
        };

        if (isSortMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSortMenuOpen]);

    const handleSearchToggle = () => {
        if (isSearchOpen) {
            setSearchQuery('');
            onSearch('');
        }
        setIsSearchOpen(!isSearchOpen);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearch(value);
    };

    const handleSortSelect = (sortType: 'a-z' | 'category') => {
        onSort(sortType);
        setIsSortMenuOpen(false);
        setIsMenuOpen(false);
    };

    return (
        <div className={`${styles.itemInputs} ${lan === 'he-IL' ? styles.rtl : ''}`}>
            {isSearchOpen ? (
                <div className={styles.searchContainer}>
                    <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder={t.searchItems}
                        className={styles.searchInput}
                    />
                    <button
                        onClick={handleSearchToggle}
                        className={styles.closeSearchButton}
                        aria-label={t.closeSearch}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            ) : (
                <>
                    <span className={styles.itemlistName}>{list?.name}</span>
                    <div className={`${styles.iconGroup} ${lan === 'he-IL' ? styles.rtl : ''}`}>
                        <button
                            className={styles.iconButton}
                            aria-label={t.search}
                            onClick={handleSearchToggle}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                        </button>
                        <button className={styles.iconButton} aria-label={t.share}>
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
                                aria-label={t.menu}
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
                                        {t.share}
                                    </button>
                                    <div className={styles.sortContainer} ref={sortMenuRef}>
                                        <button
                                            className={styles.dropdownItem}
                                            onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                                <line x1="3" y1="18" x2="21" y2="18"></line>
                                            </svg>
                                            {t.sortBy}
                                            <svg
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                style={{ marginLeft: 'auto' }}
                                            >
                                                <polyline points="9 18 15 12 9 6"></polyline>
                                            </svg>
                                        </button>
                                        {isSortMenuOpen && (
                                            <div className={styles.sortMenu}>
                                                <button
                                                    className={styles.sortMenuItem}
                                                    onClick={() => handleSortSelect('a-z')}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M11 17h2"></path>
                                                        <path d="M11 5h8"></path>
                                                        <path d="M11 11h5"></path>
                                                        <path d="M3 3v18"></path>
                                                        <path d="m7 17-4 4-4-4"></path>
                                                    </svg>
                                                    {t.aZ}
                                                </button>
                                                <button
                                                    className={styles.sortMenuItem}
                                                    onClick={() => handleSortSelect('category')}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="3" y="3" width="7" height="7"></rect>
                                                        <rect x="14" y="3" width="7" height="7"></rect>
                                                        <rect x="14" y="14" width="7" height="7"></rect>
                                                        <rect x="3" y="14" width="7" height="7"></rect>
                                                    </svg>
                                                    {t.category}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <button className={styles.dropdownItem} onClick={handleUncheckAll}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                        </svg>
                                        {t.uncheckAll}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}