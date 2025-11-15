// hooks/useListItems.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Item, ItemBase } from '@/types';
import { getItems, updateItem, createItem, createEmptyItem, deleteItem } from '@/services/item/item.service';
import { getList } from '@/services/list/list.service';

const CATEGORIES: Record<string, string[]> = {
    Vegetables: [
        'carrots', 'broccoli', 'spinach', 'potatoes', 'onions',
        'lettuce', 'cucumber', 'peppers', 'zucchini', 'celery'
    ],
    Fruits: [
        'apples', 'bananas', 'oranges', 'grapes', 'berries',
        'mango', 'pineapple', 'kiwi', 'peaches', 'plums'
    ],
    Dairy: [
        'milk', 'cheese', 'yogurt', 'butter', 'eggs',
        'cream', 'sour cream', 'cottage cheese', 'cream cheese', 'margarine'
    ],
    Meat: [
        'chicken', 'beef', 'pork', 'turkey', 'ham',
        'sausage', 'bacon', 'lamb', 'ground beef', 'steak'
    ],
    Frozen: [
        'ice cream', 'frozen vegetables', 'frozen pizza', 'frozen fruit', 'waffles',
        'french fries', 'chicken nuggets', 'fish sticks', 'frozen meals', 'sorbet'
    ],
    Fish: [
        'salmon', 'tuna', 'cod', 'shrimp', 'tilapia',
        'sardines', 'mackerel', 'crab', 'lobster', 'oysters'
    ],
    Bakery: [
        'bread', 'bagels', 'croissants', 'muffins', 'cookies',
        'cake', 'donuts', 'rolls', 'tortillas', 'buns'
    ],
    Beverages: [
        'water', 'juice', 'soda', 'coffee', 'tea',
        'milkshake', 'smoothie', 'energy drink', 'sports drink', 'hot chocolate'
    ],
    Alcohol: [
        'beer', 'wine', 'liquor', 'vodka', 'whiskey',
        'rum', 'gin', 'tequila', 'champagne', 'cider'
    ],
    Snacks: [
        'chips', 'crackers', 'nuts', 'popcorn', 'chocolate',
        'candy', 'pretzels', 'granola bar', 'fruit snacks', 'gummy bears'
    ],
    Cleaning: [
        'detergent', 'soap', 'cleaner', 'dish soap', 'bleach',
        'fabric softener', 'glass cleaner', 'toilet cleaner', 'sponges', 'gloves'
    ],
    Pets: [
        'pet food', 'dog food', 'cat food', 'bird seed', 'fish food',
        'cat litter', 'dog treats', 'pet toys', 'flea treatment', 'pet shampoo'
    ],
    Electronics: [
        'batteries', 'light bulbs', 'headphones', 'charger', 'usb cable',
        'power bank', 'smartwatch', 'speaker', 'webcam', 'router'
    ],
    Health: [
        'medicine', 'vitamins', 'pain reliever', 'band-aids', 'antiseptic',
        'cough syrup', 'cold medicine', 'thermometer', 'supplements', 'first aid kit'
    ],
    Clothing: [
        'socks', 'underwear', 't-shirt', 'pants', 'shorts',
        'dress', 'skirt', 'jacket', 'sweater', 'hat'
    ],
    Baby: [
        'diapers', 'baby food', 'formula', 'wipes', 'baby lotion',
        'baby shampoo', 'pacifier', 'baby bottle', 'baby clothes', 'baby powder'
    ],
    Other: [
        'sugar', 'flour', 'salt', 'pepper', 'olive oil',
        'canned tomatoes', 'beans', 'spices', 'condiments', 'paper towels'
    ]
};

function getCategoryForItem(itemName: string): string {
    const lowerCaseItemName = itemName.toLowerCase();
    for (const category in CATEGORIES) {
        if (CATEGORIES[category].includes(lowerCaseItemName)) {
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

        // Mutation Status Flags (if needed for disabling buttons, etc.)
        isUpdating: updateItemMutation.isPending,
        isCreating: createItemMutation.isPending,
        isDeleting: deleteItemMutation.isPending,
    };
}