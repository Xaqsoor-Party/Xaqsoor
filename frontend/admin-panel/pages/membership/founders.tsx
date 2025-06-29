import React, {useEffect, useState} from "react";
import {OrderBy, UserCardListDto} from "@/types/user";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import {genderOptions, orderByOptions, statusOptions} from "@/pages/membership/list";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import styles from "@/styles/UserListPage.module.css";
import useFounderApi from "@/api/hooks/useFounderApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import UserCard from "@/components/UserCard/UserCard";

interface Filters {
    searchTerm: string;
    genderFilter: string;
    statusFilter: string;
    orderBy: OrderBy;
}

interface Pagination {
    pageNumber: number;
    pageSize: number;
}

export interface Status {
    loading: boolean;
    error: string | null;
}

const FoundersList = () => {
    const [filters, setFilters] = useState<Filters>({
        searchTerm: "",
        genderFilter: "",
        statusFilter: "",
        orderBy: "createdDateDesc",
    });

    const [pagination, setPagination] = useState<Pagination>({
        pageNumber: 0,
        pageSize: 20,
    });

    const [status, setStatus] = useState<Status>({
        loading: false,
        error: null,
    });

    const [founders, setFounders] = useState<UserCardListDto | null>(null);

    const {getAllFounders} = useFounderApi();

    const handleResetFilters = () => {
        setFilters({
            searchTerm: "",
            genderFilter: "",
            statusFilter: "",
            orderBy: "createdDateDesc",
        });
        setPagination({
            pageNumber: 0,
            pageSize: 20,
        });
    };

    const setSearchTerm = (value: string) =>
        setFilters(prev => ({...prev, searchTerm: value}));

    const setGenderFilter = (value: string) =>
        setFilters(prev => ({...prev, genderFilter: value}));

    const setStatusFilter = (value: string) =>
        setFilters(prev => ({...prev, statusFilter: value}));

    const setOrderBy = (value: OrderBy) =>
        setFilters(prev => ({...prev, orderBy: value}));

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        setPagination(prev => ({
            ...prev,
            pageSize: value,
            pageNumber: 0,
        }));
    };

    const fetchFounders = async () => {
        setStatus({loading: true, error: null});
        try {
            const response = await getAllFounders({
                ...filters,
                pageNumber: pagination.pageNumber + 1,
                pageSize: pagination.pageSize,
            });
            if (response.data?.founders) {
                setFounders(response.data.founders);
            }
        } catch (err) {
            setStatus({loading: false, error: extractErrorMessage(err, "Failed to fetch founders.")});
        } finally {
            setStatus((prev) => ({...prev, loading: false}));
        }
    };

    useEffect(() => {
        void fetchFounders();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, pagination]);

    const pageSizeOptions = [
        {value: "20", label: "20"},
        {value: "40", label: "40"},
        {value: "80", label: "80"},
        {value: "120", label: "120"},
        {value: `${founders?.totalItems || "0"}`, label: `All (${founders?.totalItems || "0"})`},
    ];

    const onPrevPage = () => {
        if (pagination.pageNumber > 0) {
            setPagination(prev => ({
                ...prev,
                pageNumber: Math.max(prev.pageNumber - 1, 0),
            }));
        }
    };

    const onNextPage = () => {
        if (!founders) return;

        const totalPages = Math.ceil(founders.totalItems / pagination.pageSize);
        setPagination(prev => ({
            ...prev,
            pageNumber: Math.min(prev.pageNumber + 1, totalPages - 1),
        }));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Founder Profiles</h1>
            <p className={styles.subtitle}>
                Browse, filter, and manage founder submissions.
            </p>
            <div className={styles.filters}>
                <div className={styles.searchBar}>
                    <SearchInput
                        value={filters.searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by name, email, or phone..."
                    />
                </div>
                <div className={styles.filterRow}>
                    <SelectInput
                        label="Status"
                        value={filters.statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={statusOptions}
                    />
                    <SelectInput
                        label="Gender"
                        value={filters.genderFilter}
                        onChange={(e) => setGenderFilter(e.target.value)}
                        options={genderOptions}
                    />
                </div>

                <div className={styles.filterRow}>
                    <SelectInput
                        label="Order By"
                        value={filters.orderBy}
                        onChange={(e) => setOrderBy(e.target.value as OrderBy)}
                        options={orderByOptions}
                    />

                    <ActionButton onClick={handleResetFilters} className={styles.resetButton}>
                        Reset Filters
                    </ActionButton>
                </div>

                <div className={styles.pageSizeRow}>
                    <SelectInput
                        label="Users per page"
                        value={pagination.pageSize.toString()}
                        onChange={handlePageSizeChange}
                        options={pageSizeOptions}
                    />
                </div>

            </div>

            {status.loading ? (
                <div className={styles.loading}>
                    <SpinLoading size={50}/>
                    <p className={styles.loadingText}>Fetching founder profiles... please hold tight.</p>
                </div>
            ) : founders ? (
                <>
                    <div className={styles.resultsInfo}>
                        Showing {(pagination.pageNumber * pagination.pageSize) + 1} -{" "}
                        {Math.min((pagination.pageNumber + 1) * pagination.pageSize, founders.totalItems)} of {founders.totalItems} founders
                    </div>

                    <ul className={styles.userList}>
                        {founders.users.map((user) => (
                            <UserCard user={user} key={user.userId}/>
                        ))}
                    </ul>

                    <div className={styles.pagination}>
                        <ActionButton onClick={onPrevPage} disabled={pagination.pageNumber === 0}
                                      className={styles.paginationButton}>
                            Previous
                        </ActionButton>

                        <span className={styles.pageInfo}>
                           Page {pagination.pageNumber + 1} of {Math.ceil(founders.totalItems / pagination.pageSize)}
                        </span>

                        <ActionButton
                            onClick={onNextPage}
                            disabled={founders.totalItems <= (pagination.pageNumber + 1) * pagination.pageSize}
                            className={styles.paginationButton}
                        >
                            Next
                        </ActionButton>
                    </div>
                </>
            ) : (
                <div className={styles.noUsersMessage}>
                    No founder profiles match the current filters. Try adjusting your search or filter criteria.
                </div>
            )}

            {status.error && (
                <AlertModal
                    title="Error"
                    message={status.error}
                    onConfirm={() => setStatus((prev) => ({...prev, error: null}))}
                    buttonText="Close"
                    error
                />
            )}
        </div>
    )
}
export default FoundersList;