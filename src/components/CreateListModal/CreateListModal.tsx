// components/CreateListModal/CreateListModal.tsx
'use client';


import { useState, useEffect, useRef } from 'react';
import styles from './CreateListModal.module.scss';
import { List } from '@/types';

interface CreateListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    listToRename?: List | null;
}

export default function CreateListModal({ isOpen, onClose, onSave, listToRename }: CreateListModalProps) {
    const [listName, setListName] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const isRenameMode = !!listToRename;

    useEffect(() => {
        if (isOpen) {
            setListName(isRenameMode ? listToRename.name : '');
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen, isRenameMode, listToRename]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (listName.trim()) {
            onSave(listName.trim());
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
                <h2 className={styles.title}>{isRenameMode ? 'Rename List' : 'Create New List'}</h2>

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
                            {isRenameMode ? 'Rename' : 'Create List'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}