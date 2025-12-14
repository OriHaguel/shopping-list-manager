import { getMessages } from '@/lib/getMessages';
import { useState } from 'react';
import styles from './Sidebar.module.scss';

export const Sidebar: React.FC = () => {
    const t = getMessages();
    const [currentLanguage, setCurrentLanguage] = useState('EN');
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

    const languages = [
        { code: 'EN', name: t.english },
        { code: 'ES', name: t.spanish },
        { code: 'FR', name: t.french },
        { code: 'DE', name: t.german },
    ];

    const handleLanguageChange = (langCode: string) => {
        setCurrentLanguage(langCode);
        setIsLanguageDropdownOpen(false);
    };

    const handleLogout = () => {
        console.log('Logout clicked');
        // Add your logout logic here
    };

    return (
        <aside className={styles.sidebar}>
            {/* Logo Section */}
            <div className={styles.sidebar__logo}>
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect width="40" height="40" rx="12" fill="white" fillOpacity="0.15" />
                    <path
                        d="M20 10L28 15V25L20 30L12 25V15L20 10Z"
                        fill="white"
                        fillOpacity="0.9"
                    />
                    <circle cx="20" cy="20" r="4" fill="#FF8B6B" />
                </svg>
                <span className={styles.sidebar__brandName}>Productivity</span>
            </div>

            {/* Navigation Menu */}
            <nav className={styles.sidebar__nav}>
                {/* Language Selector */}
                <div className={styles.sidebar__language}>
                    <button
                        className={styles.sidebar__languageButton}
                        onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                        aria-label={t.language}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                        <span>{t.language}</span>
                        <span className={styles.sidebar__languageCode}>{currentLanguage}</span>
                    </button>

                    {isLanguageDropdownOpen && (
                        <div className={styles.sidebar__dropdown}>
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    className={`${styles.sidebar__dropdownItem} ${currentLanguage === lang.code ? styles.active : ''
                                        }`}
                                    onClick={() => handleLanguageChange(lang.code)}
                                >
                                    <span>{lang.name}</span>
                                    <span className={styles.sidebar__dropdownCode}>{lang.code}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Privacy Policy Link */}
                <a href="/privacy" className={styles.sidebar__link}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    <span>{t.privacyPolicy}</span>
                </a>

                {/* Terms of Service Link */}
                <a href="/terms" className={styles.sidebar__link}>
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>{t.termsOfService}</span>
                </a>
            </nav>

            {/* Logout Button at Bottom */}
            <button
                className={styles.sidebar__logoutButton}
                onClick={handleLogout}
                aria-label={t.logout}
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>{t.logout}</span>
            </button>
        </aside>
    );
};

