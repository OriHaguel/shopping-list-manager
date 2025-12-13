// components/EmailShareModal/EmailShareModal.tsx
'use client';
import { useState } from 'react';
import styles from './EmailShareModal.module.scss';
import { WhatsAppIcon } from '../svg/Whatsapp/Whatsapp';
import { LinkIcon } from '../svg/LinkIcon/LinkIcon';

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
        const link = `${window.location.origin}en/list/join/${listId}`;
        navigator.clipboard.writeText(link);
    };

    const handleWhatsAppShare = () => {
        // Add your WhatsApp share logic here
        const link = `${window.location.origin}en/list/join/${listId}`;
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
                    </button>
                </form>

                <div className={styles.divider}></div>

                <div className={styles.shareActions}>
                    <button className={styles.shareButton} onClick={handleCopyLink}>
                        <LinkIcon />
                        <span>Copy Link</span>
                    </button>
                    <button className={styles.shareButton} onClick={handleWhatsAppShare}>
                        <WhatsAppIcon />
                        <span>WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    );
}