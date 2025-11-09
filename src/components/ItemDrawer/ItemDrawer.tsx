// components/ItemDrawer/ItemDrawer.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './ItemDrawer.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteItem } from '@/services/item/item.service';
import { Item } from '@/types';

interface ItemDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (itemData: ItemData) => void;
    initialData?: ItemData;
    listId: string;
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

const categories = ['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Bakery', 'Beverages', 'Snacks', 'Other'];

export default function ItemDrawer({ isOpen, onClose, onSave, initialData, listId }: ItemDrawerProps) {
    const [formData, setFormData] = useState<ItemData>({
        _id: '',
        name: '',
        category: 'Other',
        quantity: 0,
        unit: 'pcs',
        price: 0,
        description: '',
    });
    const queryClient = useQueryClient();

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


    const deleteItemMutation = useMutation({
        mutationFn: (itemId: string) => deleteItem(itemId),

        onSuccess: () => {
            // Refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['items', listId] });
        },
        onError: (error) => {
            console.error('Failed to delete list:', error);
        },
    });


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
                    {/* Header */}
                    <div className={styles.header}>
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
                            Delete Item
                        </button>
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