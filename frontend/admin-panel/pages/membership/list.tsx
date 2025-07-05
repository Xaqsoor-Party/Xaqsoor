import React, {useEffect, useState} from "react";
import useUserSearchApi from "@/api/hooks/useUserSearchApi";

import {MembershipLevel, OrderBy, Status, UserCardListDto} from "@/types/user";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import SearchInput from "@/components/common/SearchInput/SearchInput";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import UserCard from "@/components/UserCard/UserCard";
import styles from "@/styles/UserListPage.module.css";
import Head from "next/head";

export const orderByOptions = [
    {value: "createdDateDesc", label: "Created Date ↓"},
    {value: "createdDateAsc", label: "Created Date ↑"},
    {value: "firstNameAsc", label: "First Name A-Z"},
    {value: "firstNameDesc", label: "First Name Z-A"},
    {value: "emailAsc", label: "Email A-Z"},
    {value: "emailDesc", label: "Email Z-A"},
    {value: "lastLoginDesc", label: "Last Login ↓"},
    {value: "lastLoginAsc", label: "Last Login ↑"},
];

export const statusOptions = [
    {value: "", label: "All Statuses"},
    {value: "ACTIVE", label: "Active"},
    {value: "INACTIVE", label: "Inactive"},
    {value: "SUSPENDED", label: "Suspended"},
    {value: "LAPSED", label: "Lapsed"},
    {value: "PENDING", label: "pending"},
];

export const roleOptions = [
    {value: "", label: "All Roles"},
    {value: "ADMIN", label: "Admin"},
    {value: "MEMBER", label: "Member"},
];

export const genderOptions = [
    {value: "", label: "All Genders"},
    {value: "Male", label: "Male"},
    {value: "Female", label: "Female"},
];

export const membershipLevelOptions = [
    {value: "", label: "All Memberships"},
    {value: "NEW_MEMBER", label: "New Member"},
    {value: "STUDENT", label: "Student"},
    {value: "REGULAR", label: "Regular"},
    {value: "FOUNDER", label: "Founder"},
    {value: "LIFETIME", label: "Lifetime"},
];

const UserListPage: React.FC = () => {
    const {searchUserCards} = useUserSearchApi();

    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [genderFilter, setGenderFilter] = useState("");
    const [membershipLevelFilter, setMembershipLevelFilter] = useState("");
    const [orderBy, setOrderBy] = useState<OrderBy>("createdDateDesc");

    const [pageNumber, setPageNumber] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userList, setUserList] = useState<UserCardListDto | null>(null);

    // Fetch users
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await searchUserCards({
                searchTerm,
                statusFilter: statusFilter ? (statusFilter as Status) : undefined,
                roleFilter,
                genderFilter,
                membershipLevelFilter: membershipLevelFilter ? (membershipLevelFilter as MembershipLevel) : undefined,
                orderBy,
                pageNumber,
                pageSize,
            });
            if (response.data?.users) {
                setUserList(response.data.users);
            }
        } catch (err) {
            setError(extractErrorMessage(err, "Failed to fetch users. Please try again."));
            setUserList(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void fetchUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm, statusFilter, roleFilter, genderFilter, membershipLevelFilter, orderBy, pageNumber, pageSize]);

    const onNextPage = () => {
        if (userList && (pageNumber + 1) * pageSize < userList.totalItems) {
            setPageNumber(pageNumber + 1);
        }
    };

    const onPrevPage = () => {
        if (pageNumber > 0) {
            setPageNumber(pageNumber - 1);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearchTerm(e.target.value);
        setPageNumber(0);
    };
    const handleResetFilters = () => {
        setSearchTerm("");
        setStatusFilter("");
        setRoleFilter("");
        setGenderFilter("");
        setMembershipLevelFilter("");
        setOrderBy("createdDateDesc");
        setPageNumber(0);
    };

    const pageSizeOptions = [
        { value: "20", label: "20" },
        { value: "40", label: "40" },
        { value: "80", label: "80" },
        { value: "120", label: "120" },
        { value: `${userList?.totalItems || "0"}`, label: `All (${userList?.totalItems || "0"})` },
    ];

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setPageSize(parseInt(value));
        setPageNumber(0);
    };


    return (
        <>
            <Head>
                <title>Manage Members & Accounts • Xaqsoor</title>
            </Head>
            <div className={styles.container}>
                <h1 className={styles.title}>Manage Members & Accounts</h1>
                <p className={styles.subtitle}>Search and filter users by name, email, phone, role, status, and more.</p>
                <div className={styles.filters}>
                    <div className={styles.searchBar}>
                        <SearchInput
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="Search by name, email, or phone..."
                        />
                    </div>

                    <div className={styles.filterRow}>
                        <SelectInput
                            label="Status"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            options={statusOptions}
                        />

                        <SelectInput
                            label="Role"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            options={roleOptions}
                        />

                        <SelectInput
                            label="Gender"
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            options={genderOptions}
                        />

                    </div>

                    <div className={styles.filterRow}>
                        <SelectInput
                            label="Membership"
                            value={membershipLevelFilter}
                            onChange={(e) => setMembershipLevelFilter(e.target.value)}
                            options={membershipLevelOptions}
                        />

                        <SelectInput
                            label="Order By"
                            value={orderBy}
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
                            value={pageSize.toString()}
                            onChange={handlePageSizeChange}
                            options={pageSizeOptions}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className={styles.loading}>
                        <SpinLoading size={50}/>
                        <p className={styles.loadingText}>Loading users, please wait...</p>
                    </div>
                ) : userList ? (
                    <>
                        <div className={styles.resultsInfo}>
                            Showing {(pageNumber * pageSize) + 1} -{" "}
                            {Math.min((pageNumber + 1) * pageSize, userList.totalItems)} of {userList.totalItems} users
                        </div>

                        <ul className={styles.userList}>
                            {userList.users.map((user) => (
                                <UserCard user={user} key={user.userId}/>
                            ))}
                        </ul>

                        <div className={styles.pagination}>
                            <ActionButton onClick={onPrevPage} disabled={pageNumber === 0}
                                          className={styles.paginationButton}>
                                Previous
                            </ActionButton>

                            <span className={styles.pageInfo}>
                           Page {pageNumber + 1} of {Math.ceil(userList.totalItems / pageSize)}
                        </span>

                            <ActionButton
                                onClick={onNextPage}
                                disabled={userList.totalItems <= (pageNumber + 1) * pageSize}
                                className={styles.paginationButton}
                            >
                                Next
                            </ActionButton>
                        </div>
                    </>
                ) : (
                    <div className={styles.noUsersMessage}>No users found.</div>
                )}


                {error && (
                    <AlertModal
                        title="Error"
                        message={error}
                        onConfirm={() => setError(null)}
                        buttonText="Close"
                        error
                    />
                )}
            </div>
        </>
    );
};

export default UserListPage;
