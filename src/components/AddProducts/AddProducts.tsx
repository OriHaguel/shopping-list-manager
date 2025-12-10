import { useState, useEffect, useRef } from 'react';
import styles from './AddProducts.module.scss';
import { AddCircle } from '../svg/AddCircle/AddCircle'
import { CircleClose } from '../svg/CircleClose/CircleClose'
import { CloseIcon } from '../svg/CloseIcon/CloseIcon';
import { RemoveIcon } from '../svg/RemoveIcon/RemoveIcon';
import { Microphone } from '../svg/Microphone/Microphone';
import { useSpeechToText } from '@/hooks/useSpeechToText';

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

const POPULAR_ITEMS = [
    'Milk', 'Bread', 'Eggs', 'Butter', 'Cheese',
    'Chicken', 'Rice', 'Pasta', 'Tomatoes', 'Onions',
    'Apples', 'Bananas', 'Yogurt', 'Coffee', 'Sugar'
];

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
}

function splitByAnd(input: string): string[] {
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
    const [activeTab, setActiveTab] = useState<'popular' | 'recent'>('popular');
    const [recentItems, setRecentItems] = useState<string[]>([]);
    const {
        transcript,
        isListening,
        startListening,
        stopListening
    } = useSpeechToText();

    const wasListening = usePrevious(isListening);

    useEffect(() => {
        if (wasListening && !isListening && transcript) {
            const processTranscript = async () => {
                const splitItems = splitByAnd(transcript);

                await Promise.all(
                    splitItems.map(item => handleAddItemsWithVoice(item))
                );
            };

            processTranscript();
        }
    }, [wasListening, isListening, transcript, handleAddItemsWithVoice]);

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

    function onStopListening() {
        stopListening();
    }


    return (
        <div className={styles.addItemContainer}>
            <div className={styles.addItem}>
                <div className={styles.addItemHeader}>
                    <h2 className={styles.addItemTitle}>Add products</h2>
                    <button onClick={onClose} className={styles.closeButton} type="button">
                        &times;
                    </button>
                </div>

                <div className={styles.inputWithButton}>
                    <input
                        type="text"
                        placeholder="e.g. milk"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className={styles.input}
                    />
                    {itemName.trim() ? (
                        <button
                            onClick={() => setItemName('')}
                            className={styles.clearInputButton}
                            type="button"
                            aria-label="Clear input"
                        >
                            <CircleClose />
                        </button>
                    ) : (
                        <button
                            onClick={isListening ? onStopListening : startListening}
                            // onClick={startListening} // Placeholder for speech-to-text
                            className={styles.clearInputButton} // Re-use the same styling for now
                            type="button"
                            aria-label="Speech to text"
                        >
                            <Microphone />
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
                        Popular
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'recent' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('recent')}
                        type="button"
                    >
                        Recent
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
                                    className={styles.quickAddItem}
                                    onClick={() => handleQuickAdd(item)}
                                    disabled={isCreating}
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
                                            aria-label={showMinus ? 'Decrease quantity' : 'Remove item'}
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
                                        className={styles.quickAddItem}
                                        onClick={() => handleQuickAdd(item)}
                                        disabled={isCreating}
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
                                                aria-label={showMinus ? 'Decrease quantity' : 'Remove item'}
                                            >
                                                {showMinus ? <RemoveIcon /> : <CloseIcon />}
                                            </button>
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className={styles.emptyState}>
                                No recent items yet
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}