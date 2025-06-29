import {useRouter} from "next/router";
import React, {useEffect, useRef, useState} from "react";
import {AnnouncementDto} from "@/types/announcement";
import {Status} from "@/pages/membership/founders";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import useAnnouncementApi from "@/api/hooks/useAnnouncementApi";
import filterStyles from "@/styles/UserListPage.module.css";
import SpinLoading from "@/components/common/SpinLoading/SpinLoading";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import {FaRegCalendarAlt} from "react-icons/fa";
import styles from "@/styles/AnnouncementPage.module.css";
import {FiMoreVertical} from "react-icons/fi";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const AnnouncementPage = () => {
    const router = useRouter();
    const idParam = router.query.id;
    const id = typeof idParam === 'string' && /^\d+$/.test(idParam) ? parseInt(idParam, 10) : null;
    const {getAnnouncementById} = useAnnouncementApi();
    const [announcement, setAnnouncement] = useState<AnnouncementDto | null>(null);
    const [status, setStatus] = useState<Status>({
        loading: false,
        error: null,
    });
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchAnnouncement = async () => {
        if (!router.isReady) return;
        if (id === null) {
            setStatus({loading: true, error: "Invalid or missing announcement ID."});
            return;
        }
        try {
            setStatus({loading: true, error: null});
            const response = await getAnnouncementById(id);
            if (response.data?.announcement) {
                setAnnouncement(response.data.announcement);
            } else {
                setStatus({loading: false, error: "Announcement not found."});
            }
        } catch (error) {
            setStatus({loading: false, error: extractErrorMessage(error, "Failed to fetch the announcement.")});
        } finally {
            setStatus(prev => ({...prev, loading: false}));
        }
    };

    useEffect(() => {
        void fetchAnnouncement();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    const handleUpdate = () => {
        // TODO: Implement update logic
        console.log("Update clicked");
    };

    const handleDelete = () => {
        // TODO: Implement delete logic
        console.log("Delete clicked");
    };

    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Announcements', link: '/campaign/announcements'},
        {label: 'Announcement', link: `/campaign/announcements/${id}`},
    ];

    return (
        <div>
            {status.loading ? (
                <div className={filterStyles.loading}>
                    <SpinLoading size={50}/>
                    <p className={filterStyles.loadingText}>Fetching announcement... please hold tight.</p>
                </div>
            ) : announcement ? (
                <div className={styles.container}>
                    <Breadcrumb breadcrumbs={breadcrumbData}/>
                    <div className={styles.header}>
                        <h1 className={styles.title}>{announcement.title}</h1>
                        <button className={styles.moreBtn} onClick={() => setMenuOpen(prev => !prev)}>
                            <FiMoreVertical />
                        </button>
                        {menuOpen && (
                            <div className={styles.dropdown} ref={dropdownRef}>
                                <button onClick={handleUpdate}>Update</button>
                                <button onClick={handleDelete}>Delete</button>
                            </div>
                        )}
                    </div>
                    <p className={styles.date}>
                        <FaRegCalendarAlt className={styles.icon} /> {announcement.announcementDate || "N/A"}
                    </p>

                    <div className={styles.content}>
                        <p className={styles.contentText}>{announcement.content}</p>
                    </div>
                </div>
            ) : (
                <div>
                    <div className={filterStyles.noUsersMessage}>
                        No announcement data available.
                    </div>
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
};

export default AnnouncementPage;