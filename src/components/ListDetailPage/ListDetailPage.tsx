// components/ListDetailPage/ListDetailPage.tsx
'use client';
import { getMessages } from '@/lib/getMessages';
import { getItem } from '@/utils/localStorage';
import { useState, useRef, useEffect, useMemo } from 'react';
import styles from './ListDetailPage.module.scss';
import { Item } from '@/types';
import { AddProducts } from '../AddProducts/AddProducts';
import { ItemInputs } from '../ItemInputs/ItemInputs';
import { ItemData, ItemDrawer } from '../ItemDrawer/ItemDrawer';
import { useListItems } from '@/hooks/useListItems';
import { CategoryIcon } from '../CategoryIcon/CategoryIcon';
import { ProductivityLoader } from '../Loader/Loader';
import { EmailShareModal } from '../EmailShareModal/EmailShareModal';
import { shareList } from '@/services/list/list.service';
import { Header } from '../Header/Header';
import { EditOutline } from '../svg/EditOutline/EditOutline';

interface ListDetailPageProps {
    listId: string;
}

export function ListDetailPage({ listId }: ListDetailPageProps) {
    const t = getMessages();
    const lan = getItem<string>('lan', '');
    const [itemName, setItemName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isAddProductOpen, setIsAddProductOpen] = useState(window.innerWidth <= 768 ? false : true);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortType, setSortType] = useState<'a-z' | 'category' | null>(null);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const {
        items,
        list,
        isLoading,
        isError,
        error,
        handleToggleItem,
        handleAddItem,
        handleRemoveItem,
        handleUpdateItem,
        handleUncheckAll,
        getItemQuantity,
        deleteItemMutation,
        isCreating,
        handleAddItemsWithVoice
    } = useListItems(listId);

    const checkedCount = items.filter(item => item.checked).length;
    const totalCount = items.length;

    const progressPercentage = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;
    // Filter and sort items
    const filteredAndSortedItems = useMemo(() => {
        let result = [...items];

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(query)
            );
        }

        // Sort items
        if (sortType === 'a-z') {
            result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortType === 'category') {
            result.sort((a, b) => {
                const categoryA = a.category || t.other;
                const categoryB = b.category || t.other;
                return categoryA.localeCompare(categoryB);
            });
        }

        return result;
    }, [items, searchQuery, sortType]);

    const totalPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + ((item.price || 0) * (item.quantity || 0));
        }, 0);
    }, [items]);

    const totalCheckedPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + (item.checked ? (item.price || 0) * (item.quantity || 0) : 0);
        }, 0);
    }, [items]);

    const totalUncheckedPrice = useMemo(() => {
        return items.reduce((sum, item) => {
            return sum + (!item.checked ? (item.price || 0) * (item.quantity || 0) : 0);
        }, 0);
    }, [items]);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        setIsDrawerOpen(true);
    };

    const handleDrawerSave = (itemData: ItemData) => {
        if (selectedItem) {
            handleUpdateItem(selectedItem._id, {

                name: itemData.name,
                category: itemData.category,
                price: itemData.price || 0,
                unit: itemData.unit,
                quantity: itemData.quantity || 0,
                description: itemData.description,

            });
        }
        setIsDrawerOpen(false);
        setSelectedItem(null);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
        setSelectedItem(null);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const handleSort = (type: 'a-z' | 'category') => {
        setSortType(type);
    };

    useEffect(() => {
        if (isShareModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

    }, [isShareModalOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);


    const handleShareSubmit = (email: string) => {
        shareList(listId, email);
        setIsShareModalOpen(false);
    };
    return (
        <div className={styles.listDetailPage}>
            <Header />
            <div className={styles.container}>


                <div className={styles.listDetailContainer}>
                    <main className={styles.content}>
                        {isLoading ? (
                            <ProductivityLoader />
                        ) : isError ? (
                            <div className={styles.error}>
                                <p>{t.failedToLoadItemsPleaseTryAgain}</p>
                                {error instanceof Error && <p className={styles.errorDetail}>{error.message}</p>}
                            </div>
                        ) : items.length === 0 ? (
                            <div>
                                <div className={styles.itemInputscontainer}>
                                    <div className={styles.headerRadius}>
                                        <ItemInputs
                                            list={list}
                                            menuRef={menuRef}
                                            setIsMenuOpen={setIsMenuOpen}
                                            isMenuOpen={isMenuOpen}
                                            handleUncheckAll={handleUncheckAll}
                                            onSearch={handleSearch}
                                            onSort={handleSort}
                                            onShare={() => setIsShareModalOpen(true)}
                                        />
                                        <div className={styles.progressBarContainer}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.empty}>
                                    <div className={styles.emptyIllustration}>
                                        <div className={styles.emptyCheckboxes}>
                                            <div className={styles.emptyCheckboxRow}>
                                                <div className={styles.emptyCheckbox}></div>
                                                <div className={`${styles.emptyLine} ${styles.long}`}></div>
                                            </div>
                                            <div className={styles.emptyCheckboxRow}>
                                                <div className={styles.emptyCheckbox}></div>
                                                <div className={`${styles.emptyLine} ${styles.medium}`}></div>
                                            </div>
                                            <div className={styles.emptyCheckboxRow}>
                                                <div className={styles.emptyCheckbox}></div>
                                                <div className={`${styles.emptyLine} ${styles.short}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className={styles.emptyTitle}>{t.noItemsYet}</h3>
                                    <p className={styles.emptyMessage}>{t.yourListIsReadyAndWaitingAddYourFirstItemToGetStarted}</p>
                                    {!isAddProductOpen &&
                                        <div className={styles.addProductButtonContainer}>
                                            <button onClick={() => setIsAddProductOpen(true)} className={styles.addProductButton}>
                                                {t.addProducts}
                                            </button>
                                        </div>
                                    }
                                </div>

                            </div>
                        ) : (
                            <div className='flex flex-col min-h-[90vh]'>
                                <div className={styles.itemInputscontainer}>
                                    <div className={styles.headerRadius}>
                                        <ItemInputs
                                            list={list}
                                            menuRef={menuRef}
                                            setIsMenuOpen={setIsMenuOpen}
                                            isMenuOpen={isMenuOpen}
                                            handleUncheckAll={handleUncheckAll}
                                            onSearch={handleSearch}
                                            onSort={handleSort}
                                            onShare={() => setIsShareModalOpen(true)}
                                        />
                                        <div className={styles.progressBarContainer}>
                                            <div
                                                className={styles.progressBarFill}
                                                style={{ width: `${progressPercentage}%` }}
                                            />
                                        </div>
                                    </div>

                                </div>
                                {filteredAndSortedItems.length === 0 ? (
                                    <div className={styles.empty}>
                                        <p>{t.noItemsMatchYourSearch}</p>
                                    </div>
                                ) : (
                                    <div className={styles.itemsList}>
                                        {filteredAndSortedItems.filter((item) => item.checked === false).map((item) => (
                                            <div
                                                key={item._id}
                                                className={`${styles.itemRow} ${lan === 'he-IL' ? styles.rtl : ''}`}
                                                onClick={() => handleToggleItem(item._id, item.checked || false)}
                                            >
                                                <label
                                                    className={styles.checkboxWrapper}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={item.checked || false}
                                                        onChange={() => handleToggleItem(item._id, item.checked || false)}
                                                        className={styles.checkbox}
                                                    />
                                                    <span className={styles.checkmark} />
                                                </label>
                                                <div className='flex gap-6'>
                                                    <span className={`${styles.itemName} ${item.checked ? styles.completed : ''}`}>
                                                        {item.name}
                                                    </span>
                                                    <span className={styles.itemQuantity}>
                                                        {item.quantity > 1 ? item.quantity : ''}
                                                    </span>
                                                    <span className={`${styles.itemQuantity} ${styles.itemUnit}`}>
                                                        {item.unit}
                                                    </span>
                                                </div>

                                                <span className={styles.itemPrice}>
                                                    {item.price + '$'}
                                                </span>
                                                {/* <CategoryIcon
                                                    category={item.category || t.other}
                                                    size={20}
                                                /> */}
                                                <div className={styles.editcon} onClick={(e) => { e.stopPropagation(), handleItemClick(item) }}>
                                                    <EditOutline />
                                                </div>

                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* item's price */}
                                <div className={styles.totalsContainer}>
                                    <div className={styles.totalRow}>
                                        <span>{t.unchecked}</span>
                                        <span>{totalUncheckedPrice.toFixed(2)}$</span>
                                    </div>
                                    <div className={styles.totalRow}>
                                        <span>{t.checked}</span>
                                        <span>{totalCheckedPrice.toFixed(2)}$</span>
                                    </div>
                                    <div className={styles.totalRow}>
                                        <span>{t.total}</span>
                                        <span>{totalPrice.toFixed(2)}$</span>
                                    </div>
                                </div>
                                {filteredAndSortedItems.filter((item) => item.checked === true).length > 0 && (
                                    <div className={styles.checkedSection}>
                                        <div className={styles.checkedItemsList}>
                                            {filteredAndSortedItems.filter((item) => item.checked === true).map((item) => (
                                                <div
                                                    key={item._id}
                                                    className={`${styles.checkedItemRow} ${lan === 'he-IL' ? styles.rtl : ''}`}
                                                    onClick={() => handleToggleItem(item._id, item.checked || false)}
                                                >
                                                    <label
                                                        className={styles.checkboxWrapper}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={item.checked || false}
                                                            onChange={() => handleToggleItem(item._id, item.checked || false)}
                                                            className={styles.checkbox}
                                                        />
                                                        <span className={styles.checkmark} />
                                                    </label>
                                                    <div className='flex gap-6'>
                                                        <span className={`${styles.itemName} ${styles.completed}`}>
                                                            {item.name}
                                                        </span>
                                                        <span className={styles.itemQuantity}>
                                                            {item.quantity > 1 ? item.quantity : ''}
                                                        </span>
                                                    </div>

                                                    <span className={styles.itemPrice}>
                                                        {item.price + '$'}
                                                    </span>

                                                    {/* <CategoryIcon
                                                        category={item.category || t.other}
                                                        size={20}
                                                    /> */}
                                                    <div className={styles.editcon} onClick={(e) => { e.stopPropagation(), handleItemClick(item) }}>
                                                        <EditOutline />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </main>
                    {isAddProductOpen &&
                        <AddProducts
                            itemName={itemName}
                            handleAddItem={handleAddItem}
                            setItemName={setItemName}
                            isCreating={isCreating}
                            onClose={() => setIsAddProductOpen(false)}
                            getItemQuantity={getItemQuantity}
                            handleRemoveItem={handleRemoveItem}
                            handleAddItemsWithVoice={handleAddItemsWithVoice}
                        />
                    }
                </div>

                <ItemDrawer
                    isOpen={isDrawerOpen}
                    onClose={handleDrawerClose}
                    onSave={handleDrawerSave}
                    initialData={selectedItem ? {
                        _id: selectedItem._id,
                        name: selectedItem.name,
                        category: selectedItem.category || t.other,
                        quantity: selectedItem.quantity || 0,
                        unit: selectedItem.unit || '',
                        price: selectedItem.price || 0,
                        description: selectedItem.description || '',
                    } : undefined}
                    deleteItemMutation={deleteItemMutation}
                />
                <EmailShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    onSubmit={handleShareSubmit}
                    listName={list?.name || ''}
                    listId={listId}
                />
                {!isAddProductOpen && items.length > 0 &&
                    <div className={styles.addProductButtonContainer}>
                        <button onClick={() => setIsAddProductOpen(true)} className={styles.addProductButton}>
                            {t.addProducts}
                        </button>
                    </div>
                }
            </div>
        </div>

    );
}