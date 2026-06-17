'use client';

import { ProductivityLoader } from '@/components/Loader/Loader';
import { linkList } from '@/services/list/list.service';
import { createGuest, getUserEmail } from '@/services/user/user.service';
import { getItem } from '@/utils/localStorage';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ListJoin() {
    const params = useParams();
    const router = useRouter();

    const listId = params.listId as string;

    useEffect(() => {
        if (!listId) return;

        const run = async () => {
            try {
                const userId = getItem('userId', null);

                let isLoggedIn = false;

                try {
                    await getUserEmail();
                    isLoggedIn = true;
                } catch {
                    isLoggedIn = false;
                }

                if (!userId && !isLoggedIn) {
                    console.log('No guest user and not logged in');
                    await createGuest();
                }

                await linkList(listId);
                router.push('/list');
            } catch (err) {
                console.error(err);
            }
        };

        run();
    }, [listId]);


    return <ProductivityLoader />;
}