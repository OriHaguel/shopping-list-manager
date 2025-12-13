'use client';

import { ProductivityLoader } from '@/components/Loader/Loader';
import { linkList } from '@/services/list/list.service';
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
                await linkList(listId);
                router.push(`en/list`);
            } catch (err) {
                console.error(err);
            }
        };

        run();
    }, [listId]);


    return <ProductivityLoader />;
}