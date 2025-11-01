// app/[listId]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import ListDetailPage from '@/components/ListDetailPage/ListDetailPage';

export default function ListDetail() {
    const params = useParams();
    const listId = params.listId as string;

    return <ListDetailPage listId={listId} />;
}