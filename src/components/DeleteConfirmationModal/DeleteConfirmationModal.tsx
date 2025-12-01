import styles from './DeleteConfirmationModal.module.scss';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    listName: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    listName
}: DeleteConfirmationModalProps) {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M15 5L5 15M5 5L15 15"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>

                <div className={styles.iconContainer}>
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <circle cx="24" cy="24" r="24" fill="#FFE8E3" />
                        <path
                            d="M24 16V26M24 30V32"
                            stroke="#FF8B6B"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        />
                    </svg>
                </div>

                <h2 className={styles.title}>Delete List?</h2>

                <p className={styles.message}>
                    Are you sure you want to delete <strong>&quot;{listName}&quot;</strong>?
                    This action cannot be undone.
                </p>


                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={handleConfirm}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}