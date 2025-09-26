import { Button } from '@/components/ui/button';

interface CreateListButtonProps {
    onClick: () => void;
}

export function CreateListButton({ onClick }: CreateListButtonProps) {
    return (
        <div className="create-list-button-container">
            <Button
                onClick={onClick}
                size="lg"
                className="create-list-button"
            >
                <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                Create New List
            </Button>
        </div>
    );
}