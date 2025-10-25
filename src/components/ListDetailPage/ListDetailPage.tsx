// components/ListDetailPage/ListDetailPage.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ListDetailPage.module.scss';
import { Item } from '@/types';
import { getItems, updateItem } from '@/services/item/item.service';

interface ListDetailPageProps {
    listId: string;
    onBack: () => void;
}

export default function ListDetailPage({ listId, onBack }: ListDetailPageProps) {
    const queryClient = useQueryClient();

    const { data: items = [], isLoading, isError, error } = useQuery({
        queryKey: ['items', listId],
        queryFn: () => getItems(listId),
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

    const handleToggleItem = (_id: string, currentChecked: boolean) => {
        updateItemMutation.mutate({
            _id,
            updates: { checked: !currentChecked },
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button
                    className={styles.backButton}
                    onClick={onBack}
                    aria-label="Go back to lists"
                    type="button"
                >
                    <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            d="M19 12H5M12 19L5 12L12 5"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <h1 className={styles.title}>List Detail</h1>
            </header>

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
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}