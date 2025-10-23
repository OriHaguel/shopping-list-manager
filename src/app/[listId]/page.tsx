// app/[listId]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import ListDetailPage from '@/components/ListDetailPage/ListDetailPage';

export default function ListDetail() {
    const params = useParams();
    const router = useRouter();
    const listId = params.listId as string;

    return <ListDetailPage listId={listId} onBack={() => router.push('/')} />;
}