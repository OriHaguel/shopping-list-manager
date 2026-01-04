'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './Header.module.scss';

type Language = {
    code: string;
    name: string;

};

const languages: Language[] = [
    { code: 'EN', name: 'English' },
    { code: 'HE', name: 'עברית' },
    { code: 'ES', name: 'Español' },
    { code: 'FR', name: 'Français' },
    { code: 'DE', name: 'Deutsch' },
];

export const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLanguageSubmenuOpen, setIsLanguageSubmenuOpen] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const avatarRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                avatarRef.current &&
                !avatarRef.current.contains(event.target as Node)
            ) {
                setIsDropdownOpen(false);
                setIsLanguageSubmenuOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsDropdownOpen(false);
                setIsLanguageSubmenuOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isDropdownOpen]);

    const handleAvatarClick = () => {
        setIsDropdownOpen(!isDropdownOpen);
        setIsLanguageSubmenuOpen(false);
    };

    const handleLanguageClick = () => {
        setIsLanguageSubmenuOpen(!isLanguageSubmenuOpen);
    };

    const handleLanguageSelect = (language: Language) => {
        setCurrentLanguage(language);
        setIsLanguageSubmenuOpen(false);
        setIsDropdownOpen(false);
    };

    const handleLogout = () => {
        console.log('Logging out...');
        setIsDropdownOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <h1 className={styles.title}>ProductivePro</h1>
                </div>

                <div className={styles.user}>
                    <button
                        ref={avatarRef}
                        className={styles.avatar}
                        onClick={handleAvatarClick}
                        aria-label="User menu"
                        aria-expanded={isDropdownOpen}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 10C12.7614 10 15 7.76142 15 5C15 2.23858 12.7614 0 10 0C7.23858 0 5 2.23858 5 5C5 7.76142 7.23858 10 10 10Z"
                                fill="currentColor"
                            />
                            <path
                                d="M10 12C4.47715 12 0 14.6863 0 18C0 19.1046 0.89543 20 2 20H18C19.1046 20 20 19.1046 20 18C20 14.6863 15.5228 12 10 12Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div ref={dropdownRef} className={styles.dropdown}>
                            <div className={styles.item} onClick={handleLanguageClick}>
                                <span className={styles.text}>
                                    Language
                                    <span className={styles.current}>{currentLanguage.code}</span>
                                </span>
                                <span className={`${styles.chevron} ${isLanguageSubmenuOpen ? styles.chevronDown : ''}`}>›</span>
                            </div>

                            {isLanguageSubmenuOpen && (
                                <div className={styles.submenu}>
                                    {languages.map((lang) => (
                                        <div
                                            key={lang.code}
                                            className={`${styles.submenuItem} ${currentLanguage.code === lang.code ? styles.active : ''
                                                }`}
                                            onClick={() => handleLanguageSelect(lang)}
                                        >
                                            <span className={styles.langName}>{lang.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={styles.item} onClick={handleLogout}>
                                <span className={styles.text}>Log out</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

