// components/ListDetailPage/ListDetailPage.tsx
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ListDetailPage.module.scss';
import { Item, ItemBase } from '@/types';
import { getItems, updateItem, createItem, createEmptyItem, deleteItem } from '@/services/item/item.service';
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
    const [quickAddDisabled, setQuickAddDisabled] = useState(false);
    const [isAddProductOpen, setIsAddProductOpen] = useState(window.innerWidth <= 768 ? false : true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState<'a-z' | 'category' | null>(null);

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

    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        let result = [...items];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(query)
            );
        }

        // Sort items
        if (sortType === 'a-z') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === 'category') {
            result.sort((a, b) => {
                const categoryA = a.category || 'Other';
                const categoryB = b.category || 'Other';
                return categoryA.localeCompare(categoryB);
            });
        }

        return result;
    }, [items, searchQuery, sortType]);

    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + ((item.price || 0) * (item.quantity || 0));
        }, 0);
    }, [items]);

    const totalCheckedPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + (item.checked ? (item.price || 0) * (item.quantity || 0) : 0);
        }, 0);
    }, [items]);

    const totalUncheckedPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + (!item.checked ? (item.price || 0) * (item.quantity || 0) : 0);
        }, 0);
    }, [items]);

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

    const deleteItemMutation = useMutation({
        mutationFn: (itemId: string) => deleteItem(itemId),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['items', listId] });
        },
        onError: (error) => {
            console.error('Failed to delete list:', error);
        },
    });

    const handleToggleItem = (_id: string, currentChecked: boolean) => {
        updateItemMutation.mutate({
            _id,
            updates: { checked: !currentChecked },
        });
    };

    function getItemQuantity(queryItem: string): number {
        const foundItem = items.find(item => item.name.toLowerCase() === queryItem.toLowerCase());
        return foundItem ? (foundItem.quantity || 1) : 0;
    }

    const handleAddItem = (name?: string) => {
        const trimmedName = (name ?? itemName).trim();
        const itemNameExists = items.find(
            item => item.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (!trimmedName) return;
        if (itemNameExists) {
            updateItemMutation.mutate({
                _id: itemNameExists._id,
                updates: { quantity: itemNameExists.quantity + 1 }
            })
        } else {
            setQuickAddDisabled(true);

            setTimeout(() => {
                setQuickAddDisabled(false);
            }, 400);

            const emptyItem = createEmptyItem();
            createItemMutation.mutate({
                ...emptyItem,
                listId,
                name: trimmedName,
            });
        }
    };
    const handleRemoveItem = (name: string) => {
        const trimmedName = name.trim();
        const itemNameExists = items.find(
            item => item.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (!trimmedName) return;
        if (!itemNameExists) return;
        if (itemNameExists.quantity > 1) {

            updateItemMutation.mutate({
                _id: itemNameExists._id,
                updates: { quantity: itemNameExists.quantity - 1 }
            })
        } else if (itemNameExists.quantity <= 1) {
            deleteItemMutation.mutate(itemNameExists._id);
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

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleSort = (type: 'a-z' | 'category') => {
        setSortType(type);
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
                        <div>
                            <div className={styles.itemInputscontainer}>
                                <div className={styles.headerRadius}>
                                    <ItemInputs
                                        list={list}
                                        menuRef={menuRef}
                                        setIsMenuOpen={setIsMenuOpen}
                                        isMenuOpen={isMenuOpen}
                                        handleUncheckAll={handleUncheckAll}
                                        onSearch={handleSearch}
                                        onSort={handleSort}
                                    />
                                </div>
                            </div>
                            <div className={styles.empty}>
                                <p>No items yet. Start adding tasks to your list!</p>
                            </div>
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
                                        onSearch={handleSearch}
                                        onSort={handleSort}
                                    />
                                </div>
                            </div>
                            {filteredAndSortedItems.length === 0 ? (
                                <div className={styles.empty}>
                                    <p>No items match your search.</p>
                                </div>
                            ) : (
                                <div className={styles.itemsList}>
                                    {filteredAndSortedItems.filter((item) => item.checked === false).map((item) => (
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
                                            <div className='flex gap-6'>
                                                <span className={`${styles.itemName} ${item.checked ? styles.completed : ''}`}>
                                                    {item.name}
                                                </span>
                                                <span className={styles.itemQuantity}>
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <span className={styles.itemPrice}>
                                                {item.price + '$'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className={styles.totalsContainer}>
                                <div className={styles.totalRow}>
                                    <span>Unchecked</span>
                                    <span>{totalUncheckedPrice.toFixed(2)}$</span>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>Checked</span>
                                    <span>{totalCheckedPrice.toFixed(2)}$</span>
                                </div>
                                <div className={styles.totalRow}>
                                    <span>Total</span>
                                    <span>{totalPrice.toFixed(2)}$</span>
                                </div>
                            </div>
                            {filteredAndSortedItems.filter((item) => item.checked === true).length > 0 && (
                                <div className={styles.checkedSection}>
                                    <div className={styles.checkedItemsList}>
                                        {filteredAndSortedItems.filter((item) => item.checked === true).map((item) => (
                                            <div
                                                key={item._id}
                                                className={styles.checkedItemRow}
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
                                                <div className='flex gap-6'>
                                                    <span className={`${styles.itemName} ${styles.completed}`}>
                                                        {item.name}
                                                    </span>
                                                    <span className={styles.itemQuantity}>
                                                        {item.quantity}
                                                    </span>
                                                </div>
                                                <span className={styles.itemPrice}>
                                                    {item.price + '$'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
                {isAddProductOpen &&
                    <AddProducts
                        itemName={itemName}
                        handleAddItem={handleAddItem}
                        setItemName={setItemName}
                        createItemMutation={createItemMutation}
                        quickAddDisabled={quickAddDisabled}
                        onClose={() => setIsAddProductOpen(false)}
                        getItemQuantity={getItemQuantity}
                        handleRemoveItem={handleRemoveItem}
                    />

                }
            </div>

            <ItemDrawer
                isOpen={isDrawerOpen}
                onClose={handleDrawerClose}
                onSave={handleDrawerSave}
                initialData={selectedItem ? {
                    _id: selectedItem._id,
                    name: selectedItem.name,
                    category: selectedItem.category || 'Other',
                    quantity: selectedItem.quantity || 0,
                    unit: selectedItem.unit || '',
                    price: selectedItem.price || 0,
                    description: selectedItem.description || '',
                } : undefined}
                deleteItemMutation={deleteItemMutation}
            />
            {!isAddProductOpen &&
                <div className={styles.addProductButtonContainer}>
                    <button onClick={() => setIsAddProductOpen(true)} className={styles.addProductButton}>
                        Add Products
                    </button>
                </div>
            }
        </div>
    );
}