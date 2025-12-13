// app/[listId]/page.tsx
'use client';

import { ListDetailPage } from '@/components/ListDetailPage/ListDetailPage';
import { useParams } from 'next/navigation';

export default function ListDetail() {
    const params = useParams();
    const listId = params.listId as string;

    return <ListDetailPage listId={listId} />;
}