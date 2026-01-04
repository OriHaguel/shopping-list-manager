// components/ListsPage/ListsPage.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ListsPage.module.scss';
import { List } from '@/types';
import { logout } from '@/services/user/user.service';
import { createList, getLists, deleteList, updateList } from '@/services/list/list.service';
import { CreateListModal } from '../CreateListModal/CreateListModal';
import { FAB } from '../FAB/FAB';
import { ListCard } from '../ListCard/ListCard';
import { ProductivityLoader } from '../Loader/Loader';
import { getMessages } from '@/lib/getMessages';
import { getItem } from '@/utils/localStorage';
import { Header } from '../Header/Header';
export function ListsPage() {
    const t = getMessages();
    const lan = getItem<string>('lan', '');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [listToRename, setListToRename] = useState<List | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();
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
            router.push(`/list/${newList?._id}`);
            setIsModalOpen(false);
        },
        onError: (error) => {
            console.error('Failed to create list:', error);
            // You could show a toast notification here
        },
    });
    const updateListMutation = useMutation({
        mutationFn: (list: List) => updateList(list),
        onSuccess: (newList) => {
            // Optimistically update the cache
            queryClient.setQueryData<List[]>(['lists'], (old = []) =>
                old.map(list => list._id === newList?._id ? { ...list, ...newList } : list))
            setIsModalOpen(false);
            setListToRename(null);

            queryClient.invalidateQueries({ queryKey: ['list', listToRename?._id] });
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

    const handleSaveList = (name: string) => {
        if (listToRename) {
            updateListMutation.mutate({ ...listToRename, name });
        } else {
            createListMutation.mutate(name);
        }
    };

    const handleListClick = (listId: string) => {
        router.push(`/list/${listId}`);
    };

    const handleDeleteList = (listId: string) => {
        deleteListMutation.mutate(listId);
    };
    const handleRename = (list: List) => {
        setListToRename(list);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setListToRename(null);
    };

    return (
        <div className={styles.listsPage}>
            <Header />
            <div className={styles.container}>
                <div className={`${styles.header} ${lan === 'he-IL' ? styles.rtl : ''}`}>
                    <h1 className={styles.title}>{t.yourShoppingLists}</h1>
                    <FAB onClick={() => setIsModalOpen(true)} />
                </div>

                <div className={!isLoading ? styles.listsGrid : ''}>
                    {isLoading ? (
                        <ProductivityLoader />
                    ) : isError ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>{t.failedToLoadLists}</p>
                            <p className={styles.emptySubtext}>
                                {error instanceof Error ? error.message : t.pleaseTryAgain}
                            </p>
                        </div>
                    ) : lists.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>📋</div>
                            <p className={styles.emptyText}>{t.noListsYet}</p>
                            <p className={styles.emptySubtext}>{t.createYourFirstListToGetStarted}</p>
                        </div>
                    ) : (
                        lists.map((list) => (
                            <ListCard
                                key={list._id}
                                list={list}
                                onClick={() => handleListClick(list._id)}
                                onDelete={() => handleDeleteList(list._id)}
                                onRename={() => handleRename(list)}
                            />
                        ))
                    )}
                </div>

                <CreateListModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSave={handleSaveList}
                    listToRename={listToRename}
                />
            </div>
        </div>

    );
}