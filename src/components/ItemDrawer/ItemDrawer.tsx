// components/ItemDrawer/ItemDrawer.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './ItemDrawer.module.scss';

interface ItemDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (itemData: ItemData) => void;
    initialData?: ItemData;
}

export interface ItemData {
    name: string;
    category: string;
    price: number;
    unit: string;
    quantity: number;
    description: string;
}

const categories = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Bakery', 'Beverages', 'Snacks', 'Other'];

export default function ItemDrawer({ isOpen, onClose, onSave, initialData }: ItemDrawerProps) {
    const [formData, setFormData] = useState<ItemData>({
        name: '',
        category: 'Other',
        quantity: 0,
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
            name: '',
            category: 'Other',
            quantity: 0,
            unit: 'pcs',
            price: 0,
            description: '',
        });
        onClose();
    };

    const handleChange = (field: keyof ItemData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                    {/* Header */}
                    <div className={styles.header}>
                        <h2 className={styles.title}>Add Item Details</h2>
                        <button
                            type="button"
                            onClick={handleClose}
                            className={styles.closeButton}
                            aria-label="Close drawer"
                        >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path
                                    d="M15 5L5 15M5 5L15 15"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Form Fields */}
                    <div className={styles.formContent}>
                        {/* Name */}
                        <div className={styles.formGroup}>
                            <label htmlFor="itemName" className={styles.label}>
                                Name
                            </label>
                            <input
                                id="itemName"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                placeholder="Enter item name"
                                className={styles.input}
                                required
                            />
                        </div>

                        {/* Category */}
                        <div className={styles.formGroup}>
                            <label htmlFor="itemCategory" className={styles.label}>
                                Category
                            </label>
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
                                <label htmlFor="itemQuantity" className={styles.label}>
                                    Quantity
                                </label>
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
                                <label htmlFor="itemUnit" className={styles.label}>
                                    Unit
                                </label>
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
                            <label htmlFor="itemPrice" className={styles.label}>
                                Price
                            </label>
                            <div className={styles.priceInput}>
                                <span className={styles.currency}>$</span>
                                <input
                                    id="itemPrice"
                                    type="number"
                                    value={formData.price}
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
                            <label htmlFor="itemDescription" className={styles.label}>
                                Description
                            </label>
                            <textarea
                                id="itemDescription"
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                placeholder="Add notes or details..."
                                className={styles.textarea}
                                rows={4}
                            />
                        </div>
                    </div>

                    {/* Done Button */}
                    <div className={styles.footer}>
                        <button type="submit" className={styles.doneButton}>
                            Done
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}