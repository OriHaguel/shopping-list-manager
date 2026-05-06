'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './CategoryDropdown.module.scss';
import { CategoryIcon } from '@/components/CategoryIcon/CategoryIcon';
import { getItem } from '@/utils/localStorage';

interface CategoryDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    label: string;
}

export function CategoryDropdown({ value, onChange, options, label }: CategoryDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const lan = getItem<string>('lan', '');
    const isRTL = lan === 'he-IL';

    // Find current value index
    const selectedIndex = options.indexOf(value);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setHighlightedIndex(prev =>
                        prev < options.length - 1 ? prev + 1 : prev
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setHighlightedIndex(prev =>
                        prev > 0 ? prev - 1 : prev
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    handleSelect(options[highlightedIndex]);
                    break;
                case 'Escape':
                    e.preventDefault();
                    setIsOpen(false);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, highlightedIndex, options]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (isOpen && listRef.current) {
            const items = listRef.current.querySelectorAll('li');
            items[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
        }
    }, [highlightedIndex, isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen]);

    const handleSelect = (option: string) => {
        onChange(option);
        setIsOpen(false);
        setHighlightedIndex(0);
    };

    const handleOpen = () => {
        setIsOpen(!isOpen);
        setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    };

    return (
        <div
            className={`${styles.dropdown} ${isRTL ? styles.rtl : ''}`}
            ref={containerRef}
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <label className={styles.label}>{label}</label>

            <button
                type="button"
                onClick={handleOpen}
                className={`${styles.trigger} ${isOpen ? styles.open : ''}`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <div className={styles.selectedValue}>
                    <CategoryIcon category={value} size={20} />
                    <span className={styles.text}>{value}</span>
                </div>
                <svg
                    className={styles.chevron}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M6 8L10 12L14 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            {isOpen && (
                <ul
                    ref={listRef}
                    className={styles.menu}
                    role="listbox"
                >
                    {options.map((option, index) => (
                        <li
                            key={option}
                            onClick={() => handleSelect(option)}
                            className={`${styles.option} ${highlightedIndex === index ? styles.highlighted : ''
                                } ${selectedIndex === index ? styles.selected : ''}`}
                            role="option"
                            aria-selected={selectedIndex === index}
                        >
                            <CategoryIcon category={option} size={20} />
                            <span className={styles.text}>{option}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
