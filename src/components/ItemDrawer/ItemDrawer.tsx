// components/ItemDrawer/ItemDrawer.tsx
'use client';

import { getMessages } from '@/lib/getMessages';
import { useState, useEffect } from 'react';
import styles from './ItemDrawer.module.scss';
import { UseMutationResult } from '@tanstack/react-query';


interface ItemDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (itemData: ItemData) => void;
    initialData?: ItemData;
    deleteItemMutation: UseMutationResult<void, Error, string, unknown>
}

export interface ItemData {
    _id: string;
    name: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    description: string;
}


export function ItemDrawer({ isOpen, onClose, onSave, initialData, deleteItemMutation }: ItemDrawerProps) {
    const t = getMessages();
    const categories = [t.vegetables, t.fruits, t.dairy, t.meat, t.frozen, t.fish, t.bakery, t.beverages, t.alcohol, t.snacks, t.cleaning, t.pets, t.electronics, t.health, t.clothing, t.baby, t.other];
    const [formData, setFormData] = useState<ItemData>({
        _id: '',
        name: '',
        category: 'Other',
        quantity: 1,
        unit: 'pcs',
        price: 0,
        description: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData({
            _id: '',
            name: '',
            category: 'Other',
            quantity: 1,
            unit: 'pcs',
            price: 0,
            description: '',
        });
        onClose();
    };

    const handleChange = (field: keyof ItemData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleDelete = async () => {
        try {
            await deleteItemMutation.mutateAsync(formData._id);
            handleClose(); // runs only after delete is done successfully
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };



    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}>
                <form onSubmit={handleSubmit} className={styles.form}>


                    {/* Form Fields */}
                    <div className={styles.formContent}>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles.closeButton}
                            aria-label={t.closeDrawer}
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
                        {/* Name */}
                        <div className={styles.formGroup}>
                            <label htmlFor="itemName" className={styles.label}>{t.name}</label>
                            <input
                                id="itemName"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder={t.enterItemName}
                                className={styles.input}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className={styles.formGroup}>
                            <label htmlFor="itemCategory" className={styles.label}>{t.category}</label>
                            <select
                                id="itemCategory"
                                value={formData.category}
                                onChange={(e) => handleChange('category', e.target.value)}
                                className={styles.select}
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity and Unit */}
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label htmlFor="itemQuantity" className={styles.label}>{t.quantity}</label>
                                <input
                                    id="itemQuantity"
                                    type="number"
                                    value={formData.quantity}
                                    onChange={(e) => handleChange('quantity', e.target.value)}
                                    placeholder="0"
                                    className={styles.input}
                                    min="0"
                                    step="any"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="itemUnit" className={styles.label}>{t.unit}</label>
                                <select
                                    id="itemUnit"
                                    value={formData.unit}
                                    onChange={(e) => handleChange('unit', e.target.value)}
                                    className={styles.select}
                                >
                                    <option value="pcs">pcs</option>
                                    <option value="kg">kg</option>
                                    <option value="g">g</option>
                                    <option value="L">L</option>
                                    <option value="ml">ml</option>
                                    <option value="lb">lb</option>
                                    <option value="oz">oz</option>
                                </select>
                            </div>
                        </div>

                        {/* Price */}
                        <div className={styles.formGroup}>
                            <label htmlFor="itemPrice" className={styles.label}>{t.price}</label>
                            <div className={styles.priceInput}>
                                <span className={styles.currency}>$</span>
                                <input
                                    id="itemPrice"
                                    type="number"
                                    value={formData.price === 0 ? '' : formData.price}
                                    onChange={(e) => handleChange('price', e.target.value)}
                                    placeholder="0.00"
                                    className={styles.input}
                                    min="0"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className={styles.formGroup}>
                            <label htmlFor="itemDescription" className={styles.label}>{t.description}</label>
                            <textarea
                                id="itemDescription"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder={t.addNotesOrDetails}
                                className={styles.textarea}
                                rows={4}
                            />
                        </div>
                        <button
                            onClick={() => handleDelete()}
                            type="button"
                            className={styles.deleteButton}
                        >
                            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M3 5h14M8 5V3h4v2m-5 0v10m4-10v10m-7-8v10a1 1 0 001 1h8a1 1 0 001-1V7"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {t.deleteItem}
                        </button>
                    </div>



                    {/* Done Button */}
                    <div className={styles.footer}>
                        <button type="submit" className={styles.doneButton}>
                            {t.done}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}