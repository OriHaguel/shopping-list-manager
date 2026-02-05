// hooks/useListItems.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Item, ItemBase } from '@/types';
import { getItems, updateItem, createItem, createEmptyItem, deleteItem } from '@/services/item/item.service';
import { getList } from '@/services/list/list.service';
import { CATEGORIES } from '@/lib/category-names';


function getCategoryForItem(itemName: string): string {
    const lowerCaseItemName = itemName.toLowerCase();
    for (const category in CATEGORIES) {
        if (CATEGORIES[category].some(item => item.includes(lowerCaseItemName))) {
            return category;
        }
    }
    return 'Other';
}

/**
 * Custom hook to manage all list item data fetching and mutations for a specific list.
 */
export function useListItems(listId: string) {
    const queryClient = useQueryClient();

    // --- 1. Data Fetching ---

    const itemsQuery = useQuery({
        queryKey: ['items', listId],
        queryFn: () => getItems(listId),
        staleTime: 5 * 60 * 1000,
    });

    const listQuery = useQuery({
        queryKey: ['list', listId],
        queryFn: () => getList(listId),
        staleTime: 5 * 60 * 1000,
    });

    const items = itemsQuery.data || [];
    const list = listQuery.data;

    // --- 2. Mutations ---

    const updateItemMutation = useMutation({
        mutationFn: ({ _id, updates }: { _id: string; updates: Partial<Item> }) =>
            updateItem(_id, updates),
        // Optimistic Update Logic (copied from your component)
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

    // --- 3. Action Handlers (calling mutations) ---

    const handleToggleItem = (_id: string, currentChecked: boolean) => {
        updateItemMutation.mutate({
            _id,
            updates: { checked: !currentChecked },
        });
    };

    const handleAddItem = (name: string) => {
        const trimmedName = name.trim();
        const existingItem = items.find(
            item => item.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (!trimmedName) return;

        if (existingItem) {
            updateItemMutation.mutate({
                _id: existingItem._id,
                updates: { quantity: existingItem.quantity + 1 }
            })
        } else {
            const emptyItem = createEmptyItem();
            const category = getCategoryForItem(trimmedName); // Get category here
            createItemMutation.mutate({
                ...emptyItem,
                listId,
                name: trimmedName,
                category, // Assign the category
            });
        }
    };

    async function handleAddItemsWithVoice(itemName: string) {
        const emptyItem = createEmptyItem();
        const category = getCategoryForItem(itemName); // Get category here
        const existingItem = items.find(
            item => item.name.toLowerCase() === itemName.toLowerCase()
        );
        if (existingItem) { return }
        await createItemMutation.mutateAsync({
            ...emptyItem,
            listId,
            name: itemName,
            category, // Assign the category
        });

    }

    const handleRemoveItem = (name: string) => {
        const trimmedName = name.trim();
        const existingItem = items.find(
            item => item.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (!existingItem) return;

        if (existingItem.quantity > 1) {
            updateItemMutation.mutate({
                _id: existingItem._id,
                updates: { quantity: existingItem.quantity - 1 }
            })
        } else if (existingItem.quantity <= 1) {
            deleteItemMutation.mutate(existingItem._id);
        }
    };

    const handleUpdateItem = (_id: string, updates: Partial<Item>) => {
        updateItemMutation.mutate({ _id, updates });
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
    };

    const getItemQuantity = (queryItem: string): number => {
        const foundItem = items.find(item => item.name.toLowerCase() === queryItem.toLowerCase());
        return foundItem ? (foundItem.quantity || 1) : 0;
    }


    // --- 4. Return Values ---

    return {
        // Data
        items,
        list,
        // Status
        isLoading: itemsQuery.isLoading || listQuery.isLoading,
        isError: itemsQuery.isError || listQuery.isError,
        error: itemsQuery.error || listQuery.error,
        // Mutators and Handlers
        handleToggleItem,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem,
        handleUncheckAll,
        getItemQuantity,
        deleteItemMutation,
        handleAddItemsWithVoice,
        // Mutation Status Flags (if needed for disabling buttons, etc.)
        isUpdating: updateItemMutation.isPending,
        isCreating: createItemMutation.isPending,
        isDeleting: deleteItemMutation.isPending,
    };
}