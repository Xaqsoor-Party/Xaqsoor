import {useRouter} from "next/router";
import React, {useEffect, useMemo, useState} from "react";
import useRecycleBinApi from "@/api/hooks/useRecycleBinApi";
import {ApiResponse} from "@/types/auth";
import {AnnouncementRecycleDto, RecycleItemsResponse, UserRecycleDto} from "@/types/recycleBin";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import filterStyles from "@/styles/UserListPage.module.css";
import styles from "@/styles/RecycleBinEntity.module.css";
import {FaTrashAlt, FaTrashRestoreAlt} from "react-icons/fa";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import UserRecycleItemCard from "@/components/RecycleBin/UserRecycleItemCard/UserRecycleItemCard";
import AnnouncementRecycleItemCard
    from "@/components/RecycleBin/AnnouncementRecycleItemCard/AnnouncementRecycleItemCard";
import Head from "next/head";

type RecycleItem = UserRecycleDto | AnnouncementRecycleDto;

interface Filters {
    keyword: string;
    page: number;
    size: number;
}

const pageSizeOptions = [
    {value: "10", label: "10"},
    {value: "20", label: "20"},
    {value: "50", label: "50"},
];

const RecycleBinEntityPage = () => {
    const router = useRouter();
    const {entity: entityTypeParam} = router.query;
    const entityType = typeof entityTypeParam === 'string' ? entityTypeParam : null;

    const {getDeletedItems, restoreItem, permanentlyDeleteItem} = useRecycleBinApi();

    const [deletedItems, setDeletedItems] = useState<RecycleItemsResponse<RecycleItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({
        keyword: "",
        page: 0,
        size: 20,
    });

    const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(new Set());
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState<'restore' | 'delete' | null>(null);
    const [actionItemId, setActionItemId] = useState<number | null>(null);

    const entityTitle = useMemo(() => {
        if (!entityType) return "Deleted Items";
        return `Deleted ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}${entityType.endsWith('s') ? '' : 's'}`;
    }, [entityType]);

    const fetchDeletedItems = async () => {
        if (!entityType) {
            setError("Invalid entity type.");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        setSelectedItemIds(new Set());

        try {
            if (entityType === 'user' || entityType === 'announcement') {
                const response: ApiResponse<{ [key: string]: RecycleItemsResponse<RecycleItem> }> = await getDeletedItems(
                    entityType,
                    filters.page,
                    filters.size,
                );
                const dataKey = `${entityType}s`;
                if (response.data && response.data[dataKey]) {
                    setDeletedItems(response.data[dataKey]);
                } else {
                    setDeletedItems(null);
                }
            }
        } catch (err) {
            setError(extractErrorMessage(err, `Failed to load deleted ${entityType}s.`));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!router.isReady) return;
        void fetchDeletedItems();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entityType, filters.page, filters.size, filters.keyword, router.isReady]);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters(prev => ({...prev, size: parseInt(e.target.value, 10), page: 0})); // Reset page to 0 on size change
    };

    const handlePrevPage = () => {
        setFilters(prev => ({...prev, page: Math.max(0, prev.page - 1)}));
    };

    const handleNextPage = () => {
        if (deletedItems && (filters.page + 1) * filters.size < deletedItems.totalItems) {
            setFilters(prev => ({...prev, page: prev.page + 1}));
        }
    };

    const handleCheckboxChange = (id: number, isChecked: boolean) => {
        setSelectedItemIds(prev => {
            const newSet = new Set(prev);
            if (isChecked) {
                newSet.add(id);
            } else {
                newSet.delete(id);
            }
            return newSet;
        });
    };

    const handleSelectAll = (isChecked: boolean) => {
        if (isChecked && deletedItems) {
            // Ensure we get the correct ID property for each item
            const allIds = new Set(deletedItems.items.map(item =>
                (item as UserRecycleDto).userId !== undefined ? (item as UserRecycleDto).userId : (item as AnnouncementRecycleDto).id!
            ));
            setSelectedItemIds(allIds);
        } else {
            setSelectedItemIds(new Set());
        }
    };

    const confirmActionHandler = (action: 'restore' | 'delete', id: number | null = null) => {
        setConfirmAction(action);
        setActionItemId(id); // Set the ID if it's a single item action
        setShowConfirmModal(true);
    };

    const executeAction = async () => {
        setShowConfirmModal(false);
        setLoading(true);
        setError(null);

        const idsToProcess = actionItemId !== null ? [actionItemId] : Array.from(selectedItemIds);

        try {
            for (const id of idsToProcess) {
                if (confirmAction === 'restore') {
                    await restoreItem(entityType!, id);
                } else if (confirmAction === 'delete') {
                    await permanentlyDeleteItem(entityType!, id);
                }
            }
            await fetchDeletedItems(); // Refetch data after actions
        } catch (err) {
            setError(extractErrorMessage(err, `Failed to ${confirmAction} item(s).`));
        } finally {
            setLoading(false);
            setActionItemId(null);
            setConfirmAction(null);
        }
    };

    const isAllSelected = deletedItems && deletedItems.items.length > 0 && selectedItemIds.size === deletedItems.items.length;
    const hasSelection = selectedItemIds.size > 0;

    const renderItemDetails = (item: RecycleItem) => {
        if (entityType === 'user') {
            const user = item as UserRecycleDto;
            return (
                <UserRecycleItemCard user={user}/>
            );
        } else if (entityType === 'announcement') {
            const announcement = item as AnnouncementRecycleDto;
            return (
                <AnnouncementRecycleItemCard announcement={announcement}/>
            );
        }
        return null;
    };

    return (
       <>
           <Head>
               <title>{entityTitle} • Xaqsoor</title>
           </Head>
           <div className={styles.pageContainer}>
               <h1 className={styles.pageTitle}>{entityTitle}</h1>
               <p className={styles.pageSubtitle}>
                   View and manage soft-deleted {entityType}s. You can restore them or permanently delete them.
               </p>

               <div className={styles.actionsBar}>
                   <div className={styles.bulkActions}>
                       <ActionButton
                           onClick={() => confirmActionHandler('restore')}
                           disabled={!hasSelection || loading}
                           className={styles.bulkActionButton}
                       >
                           <FaTrashRestoreAlt/> Restore Selected ({selectedItemIds.size})
                       </ActionButton>
                       <ActionButton
                           onClick={() => confirmActionHandler('delete')}
                           disabled={!hasSelection || loading}
                           className={`${styles.bulkActionButton} ${styles.deleteButton}`}
                       >
                           <FaTrashAlt/> Permanently Delete Selected ({selectedItemIds.size})
                       </ActionButton>
                   </div>
                   <div className={styles.pageSize}>
                       <SelectInput
                           label="Items per page"
                           value={filters.size.toString()}
                           onChange={handlePageSizeChange}
                           options={pageSizeOptions}
                       />
                   </div>
               </div>

               {loading ? (
                   <div className={filterStyles.loading}>
                       <SpinLoading size={50}/>
                       <p className={filterStyles.loadingText}>Fetching deleted {entityType}s... please hold tight.</p>
                   </div>
               ) : error ? (
                   <AlertModal
                       title="Error"
                       message={error}
                       onConfirm={() => setError(null)}
                       buttonText="Close"
                       error
                   />
               ) : deletedItems && deletedItems.items.length > 0 ? (
                   <>
                       <div className={filterStyles.resultsInfo}>
                           Showing {filters.page * filters.size + 1} -{" "}
                           {Math.min((filters.page + 1) * filters.size, deletedItems.totalItems)} of{" "}
                           {deletedItems.totalItems} {entityType}s
                       </div>

                       <div className={styles.itemsList}>
                           <div className={styles.headerRow}>
                               <input
                                   type="checkbox"
                                   onChange={(e) => handleSelectAll(e.target.checked)}
                                   checked={isAllSelected ?? false}
                                   className={styles.checkbox}
                               />
                               <span>Item Details</span>
                               <span>Actions</span>
                           </div>
                           {deletedItems.items.map((item) => {
                               // Determine the correct ID property based on entity type
                               const itemId = (item as UserRecycleDto).userId !== undefined ? (item as UserRecycleDto).userId : (item as AnnouncementRecycleDto).id;
                               return (
                                   <div key={itemId} className={styles.itemCard}>
                                       <input
                                           type="checkbox"
                                           checked={selectedItemIds.has(itemId)}
                                           onChange={(e) => handleCheckboxChange(itemId, e.target.checked)}
                                           className={styles.checkbox}
                                       />
                                       <div className={styles.itemDetails}>
                                           {renderItemDetails(item)}
                                       </div>
                                       <div className={styles.itemActions}>
                                           <ActionButton
                                               onClick={() => confirmActionHandler('restore', itemId)}
                                               className={styles.actionButton}
                                           >
                                               <FaTrashRestoreAlt/> Restore
                                           </ActionButton>
                                           <ActionButton
                                               onClick={() => confirmActionHandler('delete', itemId)}
                                               className={`${styles.actionButton} ${styles.deleteButton}`}
                                           >
                                               <FaTrashAlt/> Permanently Delete
                                           </ActionButton>
                                       </div>
                                   </div>
                               );
                           })}
                       </div>

                       <div className={filterStyles.pagination}>
                           <ActionButton onClick={handlePrevPage} disabled={filters.page === 0}
                                         className={filterStyles.paginationButton}>
                               Previous
                           </ActionButton>

                           <span className={filterStyles.pageInfo}>
                            Page {filters.page + 1} of {Math.ceil(deletedItems.totalItems / filters.size) || 1}
                        </span>

                           <ActionButton
                               onClick={handleNextPage}
                               disabled={(filters.page + 1) * filters.size >= deletedItems.totalItems}
                               className={filterStyles.paginationButton}
                           >
                               Next
                           </ActionButton>
                       </div>
                   </>
               ) : (
                   <div className={filterStyles.noUsersMessage}>
                       No deleted {entityType}s found.
                   </div>
               )}

               {showConfirmModal && (
                   <AlertModal
                       title={`Confirm ${confirmAction === 'restore' ? 'Restore' : 'Permanent Delete'}`}
                       message={`Are you sure you want to ${confirmAction} ${actionItemId !== null ? 'this item' : `${selectedItemIds.size} selected items`}?${confirmAction === 'delete' ? ' This action cannot be undone for permanent deletion.' : ''}`}
                       onConfirm={executeAction}
                       onClose={() => {
                           setShowConfirmModal(false);
                           setActionItemId(null);
                           setConfirmAction(null);
                       }}
                       buttonText="Confirm"
                       error={confirmAction === 'delete'}
                   />
               )}
           </div>
       </>
    );
};

export default RecycleBinEntityPage;