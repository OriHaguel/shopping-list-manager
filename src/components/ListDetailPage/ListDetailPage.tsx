// components/ListDetailPage/ListDetailPage.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ListDetailPage.module.scss';
import { Item } from '@/types';
import { getItems, updateItem } from '@/services/item/item.service';
import { Button } from '../ui/button';

interface ListDetailPageProps {
    listId: string;
    onBack: () => void;
}

export default function ListDetailPage({ listId, onBack }: ListDetailPageProps) {
    const queryClient = useQueryClient();

    // Fetch items with React Query
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['items', listId],
        queryFn: () => getItems(listId),
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    });

    // Generic mutation for updating any item property
    const updateItemMutation = useMutation({
        mutationFn: ({ _id, updates }: { _id: string; updates: Partial<Item> }) =>
            updateItem(_id, updates),
        onMutate: async ({ _id, updates }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['items', listId] });

            // Snapshot the previous value
            const previousItems = queryClient.getQueryData<Item[]>(['items', listId]);

            // Optimistically update
            queryClient.setQueryData<Item[]>(['items', listId], (old = []) =>
                old.map(item =>
                    item._id === _id ? { ...item, ...updates } : item
                )
            );

            return { previousItems };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousItems) {
                queryClient.setQueryData(['items', listId], context.previousItems);
            }
        },
        onSettled: () => {
            // Refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['items', listId] });
        },
    });

    const handleToggleItem = (_id: string, currentChecked: boolean) => {
        updateItemMutation.mutate({
            _id,
            updates: { checked: !currentChecked },
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button className={styles.backButton} onClick={onBack} aria-label="Go back">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5M12 19L5 12L12 5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className={styles.title}>List Detail</h1>
            </div>

            <div className={styles.content}>
                {isLoading ? (
                    <div className={styles.loading}>Loading items...</div>
                ) : items.length === 0 ? (
                    <div className={styles.empty}>
                        <p>No items yet. Start adding tasks to your list!</p>
                    </div>
                ) : (
                    <div className={styles.itemsList}>
                        {items.map((item) => (
                            <div key={item._id} className={styles.itemRow}>
                                <label className={styles.checkboxWrapper}>
                                    <input
                                        type="checkbox"
                                        checked={item.checked || false}
                                        onChange={() => handleToggleItem(item._id, item.checked || false)}
                                        className={styles.checkbox}
                                        disabled={updateItemMutation.isPending}
                                    />
                                    <span className={styles.checkmark}></span>
                                </label>
                                <span className={`${styles.itemName} ${item.checked ? styles.completed : ''}`}>
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}