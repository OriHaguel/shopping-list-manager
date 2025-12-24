import { getMessages } from '@/lib/getMessages';
import { useState, useEffect, useRef } from 'react';
import styles from './AddProducts.module.scss';
import { AddCircle } from '../svg/AddCircle/AddCircle'
import { CircleClose } from '../svg/CircleClose/CircleClose'
import { CloseIcon } from '../svg/CloseIcon/CloseIcon';
import { RemoveIcon } from '../svg/RemoveIcon/RemoveIcon';
import { Microphone } from '../svg/Microphone/Microphone';
import { useSpeechToText } from '@/hooks/useSpeechToText';
import { getItem } from '@/utils/localStorage';
import { popularItems } from '@/lib/popularItems';

type AddProductsProps = {
    itemName: string;
    handleAddItem: (name: string) => void;
    setItemName: (name: string) => void;
    isCreating: boolean;
    onClose: () => void;
    getItemQuantity?: (itemName: string) => number;
    handleRemoveItem: (itemName: string) => void;
    handleAddItemsWithVoice: (itemName: string) => Promise<void>;
};

const POPULAR_ITEMS = popularItems()

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function splitByAnd(input: string): string[] {
    const lan = getItem<string>('lan', '');

    if (lan === 'he-IL') {
        return input
            .split(/\s+ו(?=[\u0590-\u05FF])/)     // split on the word "and"
            .map(s => s.trim())     // remove spaces
            .filter(s => s.length); // remove empty parts
    }
    return input
        .split(/\band\b/i)      // split on the word "and"
        .map(s => s.trim())     // remove spaces
        .filter(s => s.length); // remove empty parts
}

export function AddProducts({
    itemName,
    handleAddItem,
    setItemName,
    onClose,
    getItemQuantity,
    handleRemoveItem,
    isCreating,
    handleAddItemsWithVoice

}: AddProductsProps) {
    const t = getMessages();
    const lan = getItem<string>('lan', '');
    const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
    const [recentItems, setRecentItems] = useState<string[]>([]);
    const [isRecordingModalOpen, setIsRecordingModalOpen] = useState(false);
    const [isConfirmingModalOpen, setIsConfirmingModalOpen] = useState(false);
    const [itemsToConfirm, setItemsToConfirm] = useState<string[]>([]);
    const [removedItems, setRemovedItems] = useState<Set<string>>(new Set());
    const [minTimeDisabledActive, setMinTimeDisabledActive] = useState(false);
    const minTimeDisableTimeoutRef = useRef<any>(null);
    const {
        transcript,
        isListening,
        startListening,
        stopListening
    } = useSpeechToText();

    const wasListening = usePrevious(isListening);

    // Unmount cleanup
    useEffect(() => {
        return () => {
            clearTimeout(minTimeDisableTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (isCreating) {
            setMinTimeDisabledActive(true);
            clearTimeout(minTimeDisableTimeoutRef.current); // Clear previous timer
            minTimeDisableTimeoutRef.current = setTimeout(() => {
                setMinTimeDisabledActive(false);
            }, 500);
        }
    }, [isCreating]);

    useEffect(() => {
        if (wasListening && !isListening && transcript) {
            const items = splitByAnd(transcript);
            if (items.length > 0) {
                setItemsToConfirm(items);
                setRemovedItems(new Set());
                setIsConfirmingModalOpen(true);
            }
        }
    }, [wasListening, isListening, transcript]);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddItemWithRecent();
    };

    const handleAddItemWithRecent = () => {
        if (itemName.trim()) {
            // Add to recent items if not already there
            if (!recentItems.includes(itemName.trim())) {
                setRecentItems(prev => [itemName.trim(), ...prev].slice(0, 15));
            }
            handleAddItem(itemName);
        }
    };

    const handleQuickAdd = (item: string) => {

        // Add to recent items
        if (!recentItems.includes(item)) {
            setRecentItems(prev => [item, ...prev].slice(0, 15));
        }
        // Set the item name and trigger add
        handleAddItem(item);
    };

    const handleRemove = (item: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (handleRemoveItem) {
            handleRemoveItem(item);
        }
    };

    const handleMicrophoneClick = () => {
        startListening();
        setIsRecordingModalOpen(true);
    };

    const handleStopRecording = () => {
        stopListening();
        setIsRecordingModalOpen(false);
    };

    const handleRemoveFromConfirm = (item: string) => {
        setRemovedItems(prev => new Set(prev).add(item));
    };

    const handleAddBackToConfirm = (item: string) => {
        setRemovedItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(item);
            return newSet;
        });
    };

    const handleConfirmItems = async () => {
        const itemsToAdd = itemsToConfirm.filter(item => !removedItems.has(item));
        await Promise.all(
            itemsToAdd.map(item => handleAddItemsWithVoice(item))
        );
        setIsConfirmingModalOpen(false);
        setItemsToConfirm([]);
        setRemovedItems(new Set());
    };

    const handleCancelConfirm = () => {
        setIsConfirmingModalOpen(false);
        setItemsToConfirm([]);
        setRemovedItems(new Set());
    };


    return (
        <div className={styles.addItemContainer}>
            <div className={styles.addItem}>
                <div className={`${styles.addItemHeader} ${lan === 'he-IL' ? styles.rtl : ''}`}>
                    <h2 className={styles.addItemTitle}>{t.addProducts}</h2>
                    <button onClick={onClose} className={styles.closeButton} type="button">
                        &times;
                    </button>
                </div>

                <div className={`${styles.inputWithButton} ${lan === 'he-IL' ? styles.rtl : ''}`}>
                    <input
                        type="text"
                        placeholder={t.egMilk}
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className={`${styles.input} ${lan === 'he-IL' ? styles.rtl : ''}`}
                    />
                    {itemName.trim() ? (
                        <button
                            onClick={() => setItemName('')}
                            className={`${styles.clearInputButton} ${lan === 'he-IL' ? styles.rtl : ''}`}

                            type="button"
                            aria-label={t.clearInput}
                        >
                            <CircleClose />
                        </button>
                    ) : (
                        <button
                            onClick={handleMicrophoneClick}
                            className={`${styles.clearInputButton} ${lan === 'he-IL' ? styles.rtl : ''}`}
                            type="button"
                            aria-label={t.speechToText}
                        >
                            <Microphone color='#6b7280' />
                        </button>
                    )}
                    <button
                        onClick={handleAddItemWithRecent}
                        disabled={!itemName.trim() || isCreating}
                        className={styles.addButton}
                        type="button"
                    >
                        {isCreating ? '...' : <AddCircle />}
                    </button>
                </div>

                <div className={styles.tabBar}>
                    <button
                        className={`${styles.tab} ${activeTab === 'popular' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('popular')}
                        type="button"
                    >
                        {t.popular}
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'recent' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('recent')}
                        type="button"
                    >
                        {t.recent}
                    </button>
                </div>

                <div className={styles.itemsList}>
                    {activeTab === 'popular' ? (
                        POPULAR_ITEMS.map((item, index) => {
                            const quantity = getItemQuantity ? getItemQuantity(item) : 0;
                            const showRemove = quantity >= 1;
                            const showMinus = quantity > 1;

                            return (
                                <button
                                    key={index}
                                    className={`${styles.quickAddItem} ${lan === 'he-IL' ? styles.rtl : ''}`}
                                    onClick={() => handleQuickAdd(item)}
                                    disabled={isCreating || minTimeDisabledActive}
                                    type="button"
                                >
                                    <AddCircle className='w-[24px] h-[24px]' />
                                    <span className={styles.itemName}>{item}</span>

                                    <span>{quantity === 0 ? '' : quantity}</span>

                                    {showRemove && (
                                        <span
                                            className={styles.removeButton}
                                            onClick={(e) => {
                                                e.stopPropagation(); // prevent parent button click
                                                handleRemove(item, e);
                                            }}
                                            role="button"
                                            aria-label={showMinus ? t.decreaseQuantity : t.removeItem}
                                        >
                                            {showMinus ? <RemoveIcon /> : <CloseIcon />}
                                        </span>
                                    )}
                                </button>
                            );

                        })
                    ) : (
                        recentItems.length > 0 ? (
                            recentItems.map((item, index) => {
                                const quantity = getItemQuantity ? getItemQuantity(item) : 0;
                                const showRemove = quantity >= 1;
                                const showMinus = quantity > 1;

                                return (
                                    <button
                                        key={index}
                                        className={`${styles.quickAddItem} ${lan === 'he-IL' ? styles.rtl : ''}`}
                                        onClick={() => handleQuickAdd(item)}
                                        disabled={isCreating || minTimeDisabledActive}
                                        type="button"
                                    >
                                        <AddCircle className='w-[24px] h-[24px]' />
                                        <span className={styles.itemName}>{item}</span>
                                        <span >{quantity === 0 ? '' : quantity}</span>

                                        {showRemove && (
                                            <button
                                                className={styles.removeButton}
                                                onClick={(e) => handleRemove(item, e)}
                                                type="button"
                                                aria-label={showMinus ? t.decreaseQuantity : t.removeItem}
                                            >
                                                {showMinus ? <RemoveIcon /> : <CloseIcon />}
                                            </button>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className={styles.emptyState}>
                                {t.noRecentItemsYet}
                            </div>
                        )
                    )}
                </div>
            </div>
            {isRecordingModalOpen && (
                <div className={styles.modalBackdrop} onClick={() => setIsRecordingModalOpen(false)}>
                    <div className={styles.recordingModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.microphoneContainer}>
                            <div className={styles.microphoneCircle}>
                                <Microphone color='#393939ff' />
                            </div>
                            <div className={styles.pulseRing}></div>
                            <div className={styles.pulseRing} style={{ animationDelay: '0.5s' }}></div>
                        </div>
                        <h2 className={styles.recordingTitle}>Listening...</h2>
                        <p className={styles.recordingSubtitle}>List your items, separated by the word ‘and’</p>
                        <button onClick={handleStopRecording} className={styles.stopRecordingButton}>
                            Stop Recording
                        </button>
                    </div>
                </div>
            )}

            {isConfirmingModalOpen && (
                <div className={styles.modalBackdrop} onClick={() => setIsConfirmingModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2>Add these items?</h2>
                        <ul className={styles.confirmList}>
                            {itemsToConfirm.map((item, index) => {
                                const isRemoved = removedItems.has(item);
                                return (
                                    <li key={index} className={`${styles.confirmItem} ${isRemoved ? styles.removed : ''}`}>
                                        <span className={styles.confirmItemName}>{item}</span>
                                        {isRemoved ? (
                                            <button
                                                onClick={() => handleAddBackToConfirm(item)}
                                                className={styles.addBackButton}
                                                type="button"
                                            >
                                                <AddCircle className='w-[20px] h-[20px]' />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleRemoveFromConfirm(item)}
                                                className={styles.removeConfirmButton}
                                                type="button"
                                            >
                                                <RemoveIcon />
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                        <div>
                            <button onClick={handleCancelConfirm}>
                                Cancel
                            </button>
                            <button onClick={handleConfirmItems}>
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}