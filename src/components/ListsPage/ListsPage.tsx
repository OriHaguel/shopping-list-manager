// components/ListsPage/ListsPage.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CreateListModal from '../CreateListModal/CreateListModal';
import ListCard from '../ListCard/ListCard';
import FAB from '../FAB/FAB';
import styles from './ListsPage.module.scss';
import { List } from '@/types';
import { Button } from '../ui/button';
import { login, getLoggedinUser } from '@/services/user/user.service';

export default function ListsPage() {
    const [lists, setLists] = useState<List[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const userToTest = {
        email: 'testest@gmail.com',
        password: 'gdf8g7dfg7df8'
    }
    const handleCreateList = (name: string) => {
        const user = getLoggedinUser();
        if (!user) throw new Error('User not logged in');
        const newList: List = {
            _id: `list-${Date.now()}`,
            name,
            userId: user._id
        };
        setLists([...lists, newList]);
        setIsModalOpen(false);
    };

    const handleListClick = (listId: string) => {
        router.push(`/${listId}`);
    };

    const handleDeleteList = (listId: string) => {
        setLists(lists.filter(list => list._id !== listId));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Your shopping lists</h1>
                <Button onClick={() => login(userToTest)}>Log in</Button>
                {/* <Button onClick={() => console.log(getLoggedinUser())}>Log in</Button> */}
                <FAB onClick={() => setIsModalOpen(true)} />
            </div>

            <div className={styles.listsGrid}>
                {lists.length === 0 ? (
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