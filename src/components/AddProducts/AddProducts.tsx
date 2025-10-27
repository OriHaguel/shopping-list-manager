import styles from './AddProducts.module.scss';

type AddProductsProps = {
    itemName: string;
    handleAddItem: () => void;
    setItemName: (name: string) => void;
    createItemMutation: { isPending: boolean };
};

export function AddProducts({ itemName, handleAddItem, setItemName, createItemMutation }: AddProductsProps) {
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddItem();
    };

    return (
        <div className={styles.addItemContainer}>
            <div className={styles.addItem}>
                <div className={styles.addItemHeader}>
                    <h2 className={styles.addItemTitle}>Add products</h2>
                </div>

                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        placeholder="e.g. milk"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className={styles.input}
                    />
                </div>

                <button
                    onClick={handleAddItem}
                    disabled={!itemName.trim() || createItemMutation.isPending}
                    className={styles.addButton}
                    type="button"
                >
                    {createItemMutation.isPending ? 'Adding...' : 'Add Item'}
                </button>
            </div>
        </div>
    );
}
