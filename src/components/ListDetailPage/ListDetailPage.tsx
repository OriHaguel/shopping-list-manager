// components/ListDetailPage/ListDetailPage.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ListDetailPage.module.scss';
import { Item, ItemBase } from '@/types';
import { getItems, updateItem, createItem } from '@/services/item/item.service';
import { getList } from '@/services/list/list.service';
import { AddProducts } from '../AddProducts/AddProducts';
import { ItemInputs } from '../ItemInputs/ItemInputs';

interface ListDetailPageProps {
    listId: string;
    onBack: () => void;
}

export default function ListDetailPage({ listId, onBack }: ListDetailPageProps) {
    const queryClient = useQueryClient();
    const [itemName, setItemName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const { data: items = [], isLoading, isError, error } = useQuery({
        queryKey: ['items', listId],
        queryFn: () => getItems(listId),
        staleTime: 5 * 60 * 1000,
    });
    const { data: list } = useQuery({
        queryKey: ['list', listId],
        queryFn: () => getList(listId),
        staleTime: 5 * 60 * 1000,
    });

    const updateItemMutation = useMutation({
        mutationFn: ({ _id, updates }: { _id: string; updates: Partial<Item> }) =>
            updateItem(_id, updates),
        onMutate: async ({ _id, updates }) => {
            await queryClient.cancelQueries({ queryKey: ['items', listId] });
            const previousItems = queryClient.getQueryData<Item[]>(['items', listId]);

            queryClient.setQueryData<Item[]>(['items', listId], (old = []) =>
                old.map(item => item._id === _id ? { ...item, ...updates } : item)
            );

            return { previousItems };
        },
        onError: (err, _variables, context) => {
            if (context?.previousItems) {
                queryClient.setQueryData(['items', listId], context.previousItems);
            }
            console.error('Failed to update item:', err);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['items', listId],
                refetchType: 'none'
            });
        },
    });

    const createItemMutation = useMutation({
        mutationFn: (newItem: ItemBase) => createItem(newItem),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items', listId] });
            setItemName('');
        },
        onError: (err) => {
            console.error('Failed to create item:', err);
        },
    });

    const handleToggleItem = (_id: string, currentChecked: boolean) => {
        updateItemMutation.mutate({
            _id,
            updates: { checked: !currentChecked },
        });
    };

    const handleAddItem = () => {
        if (itemName.trim()) {
            createItemMutation.mutate({
                listId,
                name: itemName.trim(),
                price: 0,
                checked: false,
                category: 'none',
            });
        }
    };

    const handleUncheckAll = () => {
        items.forEach(item => {
            if (item.checked) {
                updateItemMutation.mutate({
                    _id: item._id,
                    updates: { checked: false },
                });
            }
        });
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);

    return (
        <div className={styles.container}>

            <div className={styles.listDetailContainer}>
                <main className={styles.content}>
                    {isLoading ? (
                        <div className={styles.loading}>Loading items...</div>
                    ) : isError ? (
                        <div className={styles.error}>
                            <p>Failed to load items. Please try again.</p>
                            {error instanceof Error && <p className={styles.errorDetail}>{error.message}</p>}
                        </div>
                    ) : items.length === 0 ? (
                        <div className={styles.empty}>
                            <p>No items yet. Start adding tasks to your list!</p>
                        </div>
                    ) : (
                        <div className='flex flex-col'>
                            <div className={styles.itemInputscontainer}>
                                <div className={styles.headerRadius}>
                                    <ItemInputs list={list} menuRef={menuRef} setIsMenuOpen={setIsMenuOpen} isMenuOpen={isMenuOpen} handleUncheckAll={handleUncheckAll} />
                                </div>
                            </div>
                            <div className={styles.itemsList}>
                                {items.map((item) => (
                                    <div key={item._id} className={styles.itemRow}>
                                        <label className={styles.checkboxWrapper}>
                                            <input
                                                type="checkbox"
                                                checked={item.checked || false}
                                                onChange={() => handleToggleItem(item._id, item.checked || false)}
                                                className={styles.checkbox}
                                            />
                                            <span className={styles.checkmark} />
                                        </label>
                                        <span className={`${styles.itemName} ${item.checked ? styles.completed : ''}`}>
                                            {item.name}
                                        </span>
                                        <span className={styles.itemPrice}>
                                            {item.price + '$'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
                <AddProducts itemName={itemName} handleAddItem={handleAddItem} setItemName={setItemName} createItemMutation={createItemMutation} />
            </div>
        </div>
    );
}