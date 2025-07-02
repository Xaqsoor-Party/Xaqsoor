import SearchInput from "@/components/common/SearchInput/SearchInput";
import React, {useEffect, useState} from "react";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import filterStyles from "@/styles/UserListPage.module.css";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import {AnnouncementListDto, AnnouncementStatus} from "@/types/announcement";
import useAnnouncementApi from "@/api/hooks/useAnnouncementApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import AnnouncementCard from "@/components/Announcement/AnnouncementCard/AnnouncementCard";
import {useRouter} from "next/router";
import {Status} from "@/pages/campaign/announcements/[id]";
import AnnouncementForm from "@/components/Announcement/AnnouncementForm/AnnouncementForm";
import styles from "@/styles/AnnouncementsPage.module.css";

interface Filters {
    keyword: string;
    statusFilter: string;
}

interface Pagination {
    pageNumber: number;
    pageSize: number;
}

export const statusOptions = [
    {value: "Active", label: "Active"},
    {value: "Pending", label: "Pending"},
    {value: "Archived", label: "Archived"},
];

const Announcements = () => {
    const [filters, setFilters] = useState<Filters>({
        keyword: "",
        statusFilter: "",
    });

    const [pagination, setPagination] = useState<Pagination>({
        pageNumber: 0,
        pageSize: 20,
    });

    const [status, setStatus] = useState<Status>({
        loading: false,
        error: null,
    });

    const [showModal, setShowModal] = useState(false);

    const {getAnnouncements,createAnnouncement} = useAnnouncementApi();
    const [announcements, setAnnouncements] = useState<AnnouncementListDto | null>(null);
    const router = useRouter();

    const fetchAnnouncements = async () => {
        try {
            setStatus({loading: true, error: null});

            const response = await getAnnouncements(
                pagination.pageNumber + 1, // backend is 1-based
                pagination.pageSize,
                filters.keyword,
                filters.statusFilter || undefined
            );
            if (response.data?.announcements) {
                setAnnouncements(response.data.announcements);
            }
        } catch (error) {
            setStatus({loading: false, error: extractErrorMessage(error,"Failed to load announcements.")});
        } finally {
            setStatus(prev => ({...prev, loading: false}));
        }
    };

    useEffect(() => {
        void fetchAnnouncements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filters, pagination]);

    const setSearchTerm = (value: string) =>
        setFilters(prev => ({...prev, keyword: value}));

    const setStatusFilter = (value: string) =>
        setFilters(prev => ({...prev, statusFilter: value}));

    const handleResetFilters = () => {
        setFilters({
            keyword: "",
            statusFilter: "",
        });
        setPagination({
            pageNumber: 0,
            pageSize: 20,
        });
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        setPagination(prev => ({
            ...prev,
            pageSize: value,
            pageNumber: 0,
        }));
    };

    const handleCreateAnnouncement = () => {
        setShowModal(true);
    };

    const onPrevPage = () => {
        if (pagination.pageNumber > 0) {
            setPagination(prev => ({
                ...prev,
                pageNumber: Math.max(prev.pageNumber - 1, 0),
            }));
        }
    };

    const onNextPage = () => {
        if (!announcements) return;

        const totalPages = Math.ceil(announcements.totalItems / pagination.pageSize);
        setPagination(prev => ({
            ...prev,
            pageNumber: Math.min(prev.pageNumber + 1, totalPages - 1),
        }));
    };

    const pageSizeOptions = [
        {value: "20", label: "20"},
        {value: "40", label: "40"},
        {value: "80", label: "80"},
        {value: "120", label: "120"},
        {value: `${announcements?.totalItems || "0"}`, label: `All (${announcements?.totalItems || "0"})`},
    ];

    const handleDetailClick = (id: number) => {
        void router.push(`/campaign/announcements/${id}`);
    }

    const handleCreate = async (formData: {
        title: string;
        content: string;
        status: string;
    }) => {
        try {
            setStatus({ loading: true, error: null });

            const response = await createAnnouncement({
                title: formData.title,
                content: formData.content,
                status: formData.status as AnnouncementStatus,
                announcementDate:""
            });
            if (response.data?.announcement) {
                const newAnnouncement = response.data.announcement;
                setAnnouncements((prev) => {
                    if (!prev) return null;

                    return {
                        ...prev,
                        announcements: [newAnnouncement, ...prev.announcements],
                        totalItems: prev.totalItems + 1,
                    };
                });
                setShowModal(false);
            }
        } catch (error) {
            setStatus({ loading: false, error: extractErrorMessage(error, "Failed to create announcement.") });
        } finally {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
    };

    return (
        <div className={filterStyles.container}>
            <h1 className={filterStyles.title}>Manage Announcements</h1>
            <p className={filterStyles.subtitle}>
                Filter announcements by status or search by title and content to find relevant updates.
            </p>
            <div className={filterStyles.filters}>
                <div className={filterStyles.searchBar}>
                    <SearchInput
                        value={filters.keyword}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by title or content..."
                    />
                </div>

                <div className={filterStyles.filterRow}>
                    <SelectInput
                        label="Status"
                        value={filters.statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        options={statusOptions}
                        placeholder="-- Filter by status --"
                    />

                    <ActionButton onClick={handleResetFilters} className={filterStyles.resetButton}>
                        Reset Filters
                    </ActionButton>
                </div>
            </div>

            <div className={styles.announcementActions}>
                <ActionButton onClick={handleCreateAnnouncement} className={styles.createButton}>
                    Create New Announcement
                </ActionButton>

                <div className={styles.pageSize}>
                    <SelectInput
                        label=""
                        value={pagination.pageSize.toString()}
                        onChange={handlePageSizeChange}
                        options={pageSizeOptions}
                        placeholder="-- Page size --"
                    />
                </div>
            </div>

            {status.loading ? (
                <div className={filterStyles.loading}>
                    <SpinLoading size={50}/>
                    <p className={filterStyles.loadingText}>Fetching announcements... please hold tight.</p>
                </div>
            ) : announcements ? (
                <>
                    <div className={filterStyles.resultsInfo}>
                        Showing {(pagination.pageNumber * pagination.pageSize) + 1} -{" "}
                        {Math.min((pagination.pageNumber + 1) * pagination.pageSize, announcements.totalItems)} of {announcements.totalItems} announcements
                    </div>

                    <ul className={styles.announcementsList}>
                        {announcements.announcements.map((announcement) => (
                            <AnnouncementCard announcement={announcement} onDetailClick={handleDetailClick} key={announcement.id}/>
                        ))}
                    </ul>

                    <div className={filterStyles.pagination}>
                        <ActionButton onClick={onPrevPage} disabled={pagination.pageNumber === 0}
                                      className={filterStyles.paginationButton}>
                            Previous
                        </ActionButton>

                        <span className={filterStyles.pageInfo}>
                           Page {pagination.pageNumber + 1} of {Math.ceil(announcements.totalItems / pagination.pageSize)}
                        </span>

                        <ActionButton
                            onClick={onNextPage}
                            disabled={announcements.totalItems <= (pagination.pageNumber + 1) * pagination.pageSize}
                            className={filterStyles.paginationButton}
                        >
                            Next
                        </ActionButton>
                    </div>
                </>
            ) : (
                <div className={filterStyles.noUsersMessage}>
                    No announcements match the current filters. Try adjusting your search or filter criteria.
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

            {showModal &&
                <AnnouncementForm
                    onSubmit={handleCreate}
                    onCancel={() => setShowModal(false)}
                    loading={status.loading}
                    formTitle={"Create New Announcement"}
                    submitButtonText={"Create Announcement"}
                />
            }
        </div>
    )
}
export default Announcements;