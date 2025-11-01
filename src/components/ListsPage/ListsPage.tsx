// components/ListsPage/ListsPage.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import CreateListModal from '../CreateListModal/CreateListModal';
import ListCard from '../ListCard/ListCard';
import FAB from '../FAB/FAB';
import styles from './ListsPage.module.scss';
import { List } from '@/types';
import { Button } from '../ui/button';
import { login } from '@/services/user/user.service';
import { createList, getLists, deleteList } from '@/services/list/list.service';

export default function ListsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const queryClient = useQueryClient();


    const userToTest = {
        email: 'testest@gmail.com',
        password: 'gdf8g7dfg7df8'
    };
    async function loginCheck() {
        await login(userToTest)
    }
    // Fetch lists with React Query
    const {
        data: lists = [],
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ['lists'],
        queryFn: getLists,
        // staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    });


    // Create list mutation
    const createListMutation = useMutation({
        mutationFn: (name: string) => createList({ name }),
        onSuccess: (newList) => {
            // Optimistically update the cache
            queryClient.setQueryData<List[]>(['lists'], (old: any = []) => [...old, newList]);
            setIsModalOpen(false);
        },
        onError: (error) => {
            console.error('Failed to create list:', error);
            // You could show a toast notification here
        },
    });

    // Delete list mutation
    const deleteListMutation = useMutation({
        mutationFn: (listId: string) => deleteList(listId),
        onMutate: async (listId) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['lists'] });

            // Snapshot previous value
            const previousLists = queryClient.getQueryData<List[]>(['lists']);

            // Optimistically update
            queryClient.setQueryData<List[]>(['lists'], (old = []) =>
                old.filter(list => list._id !== listId)
            );

            return { previousLists };
        },
        onError: (error, listId, context) => {
            // Rollback on error
            if (context?.previousLists) {
                queryClient.setQueryData(['lists'], context.previousLists);
            }
            console.error('Failed to delete list:', error);
        },
        onSettled: () => {
            // Refetch after error or success
            queryClient.invalidateQueries({ queryKey: ['lists'] });
        },
    });

    const handleCreateList = (name: string) => {
        createListMutation.mutate(name);
    };

    const handleListClick = (listId: string) => {
        router.push(`/${listId}`);
    };

    const handleDeleteList = (listId: string) => {
        deleteListMutation.mutate(listId);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Your shopping lists</h1>
                <Button onClick={() => loginCheck()}>Log in</Button>
                <FAB onClick={() => setIsModalOpen(true)} />
            </div>

            <div className={styles.listsGrid}>
                {isLoading ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>Loading lists...</p>
                    </div>
                ) : isError ? (
                    <div className={styles.emptyState}>
                        <p className={styles.emptyText}>Failed to load lists</p>
                        <p className={styles.emptySubtext}>
                            {error instanceof Error ? error.message : 'Please try again'}
                        </p>
                    </div>
                ) : lists.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>📋</div>
                        <p className={styles.emptyText}>No lists yet</p>
                        <p className={styles.emptySubtext}>Create your first list to get started</p>
                    </div>
                ) : (
                    lists.map((list) => (
                        <ListCard
                            key={list._id}
                            list={list}
                            onClick={() => handleListClick(list._id)}
                            onDelete={() => handleDeleteList(list._id)}
                        />
                    ))
                )}
            </div>

            <CreateListModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateList}
            />
        </div>
    );
}