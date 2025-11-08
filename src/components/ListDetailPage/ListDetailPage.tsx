// components/ListDetailPage/ListDetailPage.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ListDetailPage.module.scss';
import { Item, ItemBase } from '@/types';
import { getItems, updateItem, createItem, createEmptyItem } from '@/services/item/item.service';
import { getList } from '@/services/list/list.service';
import { AddProducts } from '../AddProducts/AddProducts';
import { ItemInputs } from '../ItemInputs/ItemInputs';
import ItemDrawer, { ItemData } from '../ItemDrawer/ItemDrawer';
interface ListDetailPageProps {
    listId: string;
}

export default function ListDetailPage({ listId }: ListDetailPageProps) {
    const queryClient = useQueryClient();
    const [itemName, setItemName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
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
        const emptyItem = createEmptyItem()
        if (itemName.trim()) {
            createItemMutation.mutate({
                ...emptyItem,
                listId,
                name: itemName.trim(),
            });
        }
    };
    const handleAddItemList = (ItemListName: string) => {
        const emptyItem = createEmptyItem()
        if (ItemListName.trim()) {
            createItemMutation.mutate({
                ...emptyItem,
                listId,
                name: ItemListName.trim(),
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

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        setIsDrawerOpen(true);
    };

    const handleDrawerSave = (itemData: ItemData) => {
        if (selectedItem) {
            updateItemMutation.mutate({
                _id: selectedItem._id,
                updates: {
                    name: itemData.name,
                    category: itemData.category,
                    price: itemData.price || 0,
                    unit: itemData.unit,
                    quantity: itemData.quantity || 0,
                    description: itemData.description,
                    // Add quantity, unit, description to your Item type if needed
                },
            });
        }
        setIsDrawerOpen(false);
        setSelectedItem(null);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedItem(null);
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
                                    <ItemInputs
                                        list={list}
                                        menuRef={menuRef}
                                        setIsMenuOpen={setIsMenuOpen}
                                        isMenuOpen={isMenuOpen}
                                        handleUncheckAll={handleUncheckAll}
                                    />
                                </div>
                            </div>
                            <div className={styles.itemsList}>
                                {items.map((item) => (
                                    <div
                                        key={item._id}
                                        className={styles.itemRow}
                                        onClick={() => handleItemClick(item)}
                                    >
                                        <label
                                            className={styles.checkboxWrapper}
                                            onClick={(e) => e.stopPropagation()}
                                        >
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
                <AddProducts
                    itemName={itemName}
                    handleAddItem={handleAddItem}
                    setItemName={setItemName}
                    createItemMutation={createItemMutation}
                    handleAddItemList={handleAddItemList}
                />
            </div>

            {/* Item Drawer */}
            <ItemDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                onSave={handleDrawerSave}
                initialData={selectedItem ? {
                    name: selectedItem.name,
                    category: selectedItem.category || 'Other',
                    quantity: selectedItem.quantity || 0,
                    unit: selectedItem.unit || '',
                    price: selectedItem.price || 0,
                    description: selectedItem.description || '',
                } : undefined}
            />
        </div>
    );
}