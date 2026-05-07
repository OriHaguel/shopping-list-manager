'use client';

import { useState } from 'react';
import styles from './AddCategoryModal.module.scss';
import { getItem } from '@/utils/localStorage';

interface AddCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (categoryName: string) => void;
    existingCategories: string[];
}

export function AddCategoryModal({ isOpen, onClose, onAdd, existingCategories }: AddCategoryModalProps) {
    const [categoryName, setCategoryName] = useState('');
    const [error, setError] = useState('');
    const lan = getItem<string>('lan', '');
    const isRTL = lan === 'he-IL';

    const handleSubmit = (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        const trimmedName = categoryName.trim();

        // Validation
        if (!trimmedName) {
            setError('Category name cannot be empty');
            return;
        }

        if (existingCategories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
            setError('This category already exists');
            return;
        }

        if (trimmedName.length > 30) {
            setError('Category name is too long (max 30 characters)');
            return;
        }

        // Success
        onAdd(trimmedName);
        setCategoryName('');
        setError('');
    };

    const handleClose = () => {
        setCategoryName('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={styles.overlay}
                onClick={handleClose}
            />

            {/* Modal */}
            <div className={`${styles.modal} ${isRTL ? styles.rtl : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Create Custom Category</h2>
                    <button
                        type="button"
                        onClick={handleClose}
                        className={styles.closeButton}
                        aria-label="Close"
                    >
                        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                            <path
                                d="M15 5L5 15M5 5L15 15"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className={styles.form}>
                    <div className={styles.content}>
                        <label htmlFor="categoryNameInput" className={styles.label}>
                            Category Name
                        </label>
                        <input
                            id="categoryNameInput"
                            type="text"
                            value={categoryName}
                            onChange={(e) => {
                                setCategoryName(e.target.value);
                                setError('');
                            }}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && categoryName.trim()) {
                                    handleSubmit();
                                }
                            }}
                            placeholder="e.g., Pantry, Snacks, Organic..."
                            className={`${styles.input} ${error ? styles.inputError : ''}`}
                            autoFocus
                            maxLength={30}
                        />
                        {error && <p className={styles.errorMessage}>{error}</p>}
                        <p className={styles.helperText}>
                            {categoryName.length}/30 characters
                        </p>
                    </div>

                    <div className={styles.footer}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles.cancelButton}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSubmit()}
                            className={styles.addButton}
                            disabled={!categoryName.trim()}
                        >
                            Add Category
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
