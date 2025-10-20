// components/CreateListModal/CreateListModal.tsx
'use client';


import { useState, useEffect, useRef } from 'react';
import styles from './CreateListModal.module.scss';

interface CreateListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (name: string) => void;
}

export default function CreateListModal({ isOpen, onClose, onCreate }: CreateListModalProps) {
    const [listName, setListName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setListName('');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (listName.trim()) {
            onCreate(listName.trim());
            setListName('');
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div className={styles.modal}>
                <h2 className={styles.title}>Create New List</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        ref={inputRef}
                        type="text"
                        className={styles.input}
                        placeholder="Enter list name"
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        maxLength={50}
                    />

                    <div className={styles.actions}>
                        <button
                            type="button"
                            className={`${styles.button} ${styles.cancelButton}`}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`${styles.button} ${styles.createButton}`}
                            disabled={!listName.trim()}
                        >
                            Create List
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}