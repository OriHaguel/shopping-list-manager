import { getMessages } from '@/lib/getMessages';
import styles from './DeleteConfirmationModal.module.scss';
import { getItem } from '@/utils/localStorage';
import { useModalScrollLock } from '@/hooks/useModalScrollLock';

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
    const t = getMessages()
    const lan = getItem<string>('lan', '');

    useModalScrollLock(isOpen);

    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={`${styles.modal} ${lan === 'he-IL' ? styles.rtl : ''}`} onClick={(e) => e.stopPropagation()}>
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

                <h2 className={styles.title}>{t.deleteList}</h2>

                {lan === 'he-IL' ? <p className={styles.message}>
                    ?<strong>&quot;{listName}&quot;</strong>  {t.areYouSureYouWantToDelete}
                </p> :

                    <p className={styles.message}>
                        {t.areYouSureYouWantToDelete} <strong>&quot;{listName}&quot;</strong>? {t.thisActionCannotBeUndone}
                    </p>
                }


                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        {t.cancel}
                    </button>
                    <button
                        className={styles.deleteButton}
                        onClick={handleConfirm}
                    >
                        {t.delete}
                    </button>
                </div>
            </div>
        </div>
    );
}