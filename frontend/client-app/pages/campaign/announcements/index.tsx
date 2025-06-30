import React, {useEffect, useState} from "react";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import ActionButton from "@/components/common/ActionButton/ActionButton";

import styles from "@/styles/AnnouncementsPage.module.css";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import {AnnouncementListDto} from "@/types/announcement";
import useAnnouncementApi from "@/api/hooks/useAnnouncementApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import {useRouter} from "next/router";
import {Status} from "@/pages/campaign/announcements/[id]";
import AnnouncementCard from "@/components/AnnouncementCard/AnnouncementCard";

interface Pagination {
    pageNumber: number;
    pageSize: number;
}

const Announcements = () => {

    const [pagination, setPagination] = useState<Pagination>({
        pageNumber: 0,
        pageSize: 20,
    });

    const [status, setStatus] = useState<Status>({
        loading: false,
        error: null,
    });

    const {getAnnouncements} = useAnnouncementApi();
    const [announcements, setAnnouncements] = useState<AnnouncementListDto | null>(null);
    const router = useRouter();

    const fetchAnnouncements = async () => {
        try {
            setStatus({loading: true, error: null});

            const response = await getAnnouncements(
                pagination.pageNumber + 1, // backend is 1-based
                pagination.pageSize,
            );
            if (response.data?.announcements) {
                setAnnouncements(response.data.announcements);
            }
        } catch (error) {
            setStatus({loading: false, error: extractErrorMessage(error, "Failed to load announcements.")});
        } finally {
            setStatus(prev => ({...prev, loading: false}));
        }
    };

    useEffect(() => {
        void fetchAnnouncements();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination]);

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        setPagination(prev => ({
            ...prev,
            pageSize: value,
            pageNumber: 0,
        }));
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

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Announcements</h1>
            <div className={styles.pageSizeRow}>
                <SelectInput
                    label=""
                    value={pagination.pageSize.toString()}
                    onChange={handlePageSizeChange}
                    options={pageSizeOptions}
                    placeholder="-- Page size --"
                />
            </div>


            {status.loading ? (
                <div className={styles.loading}>
                    <SpinLoading size={50}/>
                    <p className={styles.loadingText}>Fetching announcements... please hold tight.</p>
                </div>
            ) : announcements ? (
                <>
                    <div className={styles.resultsInfo}>
                        Showing {(pagination.pageNumber * pagination.pageSize) + 1} -{" "}
                        {Math.min((pagination.pageNumber + 1) * pagination.pageSize, announcements.totalItems)} of {announcements.totalItems} announcements
                    </div>

                    <ul className={styles.announcementsList}>
                        {announcements.announcements.map((announcement) => (
                            <AnnouncementCard announcement={announcement} onDetailClick={handleDetailClick}
                                              key={announcement.id}/>
                        ))}
                    </ul>

                    <div className={styles.pagination}>
                        <ActionButton onClick={onPrevPage} disabled={pagination.pageNumber === 0}
                                      className={styles.paginationButton}>
                            Previous
                        </ActionButton>

                        <span className={styles.pageInfo}>
                           Page {pagination.pageNumber + 1} of {Math.ceil(announcements.totalItems / pagination.pageSize)}
                        </span>

                        <ActionButton
                            onClick={onNextPage}
                            disabled={announcements.totalItems <= (pagination.pageNumber + 1) * pagination.pageSize}
                            className={styles.paginationButton}
                        >
                            Next
                        </ActionButton>
                    </div>
                </>
            ) : (
                <div className={styles.noAnnouncements}>
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
        </div>
    )
}
export default Announcements;