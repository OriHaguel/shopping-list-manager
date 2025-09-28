'use client';

import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { List } from '@/types';

export function ListCard({ list }: { list: List }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/${list._id}`);
    };

    return (
        <Card className="list-card" onClick={handleClick}>
            <CardHeader className="list-card-header">
            </CardHeader>
            <CardContent className="list-card-content">
                <h3 className="list-card-title">{list.name}</h3>
                <div className="list-card-arrow">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </CardContent>
        </Card>
    );
}