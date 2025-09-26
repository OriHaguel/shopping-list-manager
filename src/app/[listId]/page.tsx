'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { use } from 'react';

interface ListDetailPageProps {
    params: Promise<{ listId: string }>;
}
export default function ListDetailPage({ params }: ListDetailPageProps) {
    const router = useRouter();
    const { listId } = use(params);

    const handleBack = () => {
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="list-detail-header">
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            className="list-detail-back-button"
                        >
                            Back to Lists
                        </Button>
                    </div>

                    <div className="list-detail-content">
                        <div className="list-detail-title-section">
                            <h1 className="list-detail-title">List Details</h1>
                            <p className="list-detail-subtitle">List ID: {listId}</p>
                        </div>

                        <div className="list-detail-placeholder">
                            <div className="list-detail-placeholder-icon">
                            </div>
                            <h2 className="list-detail-placeholder-title">List Content Coming Soon</h2>
                            <p className="list-detail-placeholder-text">
                                This is where you can manage your list items, add new entries, and organize your content.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}