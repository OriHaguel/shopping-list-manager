// components/EmailShareModal/EmailShareModal.tsx
'use client';
import { useState } from 'react';
import styles from './EmailShareModal.module.scss';

interface EmailShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
    listName: string;
    listId: string
}

export function EmailShareModal({ isOpen, onClose, onSubmit, listName, listId }: EmailShareModalProps) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError('Please enter an email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        onSubmit(email);
        setEmail('');
        setError('');
    };

    const handleClose = () => {
        setEmail('');
        setError('');
        onClose();
    };

    const handleCopyLink = () => {
        // Add your copy link logic here
        const link = `${window.location.origin}/list/join/${listId}`;
        navigator.clipboard.writeText(link);
    };

    const handleWhatsAppShare = () => {
        // Add your WhatsApp share logic here
        const link = window.location.href;
        const text = `Check out this list: ${listName}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`, '_blank');
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Share List</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label="Close modal"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                            <path d="M5 5L15 15M15 5L5 15" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                <p className={styles.description}>
                    Share {listName} with others by entering their email address
                </p>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="email"
                            className={`${styles.input} ${error ? styles.inputError : ''}`}
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                        />
                        {error && <span className={styles.errorText}>{error}</span>}
                    </div>

                    <button type="submit" className={styles.inviteButton}>
                        <span>Invite</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                            <path d="M8 2L14 8L8 14M14 8H2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </form>

                <div className={styles.divider}></div>

                <div className={styles.shareActions}>
                    <button className={styles.shareButton} onClick={handleCopyLink}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M11 4H5C4.46957 4 3.96086 4.21071 3.58579 4.58579C3.21071 4.96086 3 5.46957 3 6V15C3 15.5304 3.21071 16.0391 3.58579 16.4142C3.96086 16.7893 4.46957 17 5 17H14C14.5304 17 15.0391 16.7893 15.4142 16.4142C15.7893 16.0391 16 15.5304 16 15V9M8 12L17 3M17 3H13M17 3V7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Copy Link</span>
                    </button>
                    <button className={styles.shareButton} onClick={handleWhatsAppShare}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.05 0C4.52 0 0.05 4.47 0.05 10C0.05 11.89 0.57 13.66 1.48 15.17L0.05 20L5.03 18.59C6.5 19.41 8.2 19.88 10.05 19.88C15.58 19.88 20.05 15.41 20.05 9.88C20.05 4.35 15.58 0 10.05 0ZM10.05 18.25C8.39 18.25 6.8 17.79 5.43 16.96L5.11 16.76L2.23 17.52L3 14.7L2.78 14.36C1.87 12.95 1.38 11.31 1.38 9.56C1.38 5.27 4.89 1.76 9.18 1.76C11.25 1.76 13.19 2.56 14.68 4.05C16.17 5.54 16.97 7.48 16.97 9.55C16.97 13.84 13.34 18.25 10.05 18.25ZM14.88 11.85C14.66 11.74 13.62 11.23 13.42 11.15C13.22 11.08 13.07 11.04 12.92 11.26C12.77 11.48 12.37 11.96 12.24 12.11C12.11 12.26 11.98 12.28 11.76 12.17C11.54 12.06 10.83 11.83 9.98 11.07C9.32 10.48 8.87 9.75 8.74 9.53C8.61 9.31 8.72 9.19 8.83 9.08C8.93 8.98 9.05 8.82 9.16 8.69C9.27 8.56 9.31 8.47 9.38 8.32C9.45 8.17 9.42 8.04 9.36 7.93C9.31 7.82 8.87 6.78 8.69 6.34C8.51 5.91 8.33 5.97 8.19 5.96H7.77C7.62 5.96 7.38 6.02 7.18 6.24C6.98 6.46 6.44 6.97 6.44 8.01C6.44 9.05 7.2 10.06 7.31 10.21C7.42 10.36 8.87 12.64 11.1 13.54C11.64 13.78 12.06 13.92 12.39 14.03C12.93 14.2 13.42 14.17 13.81 14.11C14.24 14.04 15.08 13.56 15.26 13.04C15.44 12.52 15.44 12.07 15.38 11.97C15.32 11.87 15.1 11.96 14.88 11.85Z" />
                        </svg>
                        <span>WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    );
}