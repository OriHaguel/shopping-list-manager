// components/EmailShareModal/EmailShareModal.tsx
'use client';
import { getMessages } from '@/lib/getMessages';
import { getItem } from '@/utils/localStorage';
import { useState } from 'react';
import styles from './EmailShareModal.module.scss';
import { WhatsAppIcon } from '../svg/Whatsapp/Whatsapp';
import { LinkIcon } from '../svg/LinkIcon/LinkIcon';
import { useModalScrollLock } from '@/hooks/useModalScrollLock';

interface EmailShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => void;
    listName: string;
    listId: string
}

export function EmailShareModal({ isOpen, onClose, onSubmit, listName, listId }: EmailShareModalProps) {
    const t = getMessages();
    const lan = getItem<string>('lan', '');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    useModalScrollLock(isOpen);

    if (!isOpen) return null;

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            setError(t.pleaseEnterAnEmailAddress);
            return;
        }

        if (!validateEmail(email)) {
            setError(t.pleaseEnterAValidEmailAddress);
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
        const link = `${window.location.origin}/list/join/${listId}`;
        const text = `${t.checkOutThisList}${listName}`;
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`, '_blank');
    };

    return (
        <div className={styles.overlay} onClick={handleClose}>
            <div className={`${styles.modal} ${lan === 'he-IL' ? styles.rtl : ''}`} onClick={(e) => e.stopPropagation()}>
                <div className={styles.header}>
                    <h2 className={styles.title}>{t.shareList}</h2>
                    <button
                        className={styles.closeButton}
                        onClick={handleClose}
                        aria-label={t.closeModal}
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
                            placeholder={t.enterEmailAddress}
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError('');
                            }}
                        />
                        {error && <span className={styles.errorText}>{error}</span>}
                    </div>

                    <button type="submit" className={styles.inviteButton}>
                        <span>{t.invite}</span>
                    </button>
                </form>

                <div className={styles.divider}></div>

                <div className={styles.shareActions}>
                    <button className={styles.shareButton} onClick={handleCopyLink}>
                        <LinkIcon />
                        <span>{t.copyLink}</span>
                    </button>
                    <button className={styles.shareButton} onClick={handleWhatsAppShare}>
                        <WhatsAppIcon />
                        <span>{t.whatsApp}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}