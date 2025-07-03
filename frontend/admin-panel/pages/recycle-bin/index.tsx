import { useRouter } from "next/router";
import React from "react";
import styles from "@/styles/RecycleBin.module.css";
import {FaBullhorn, FaCalendarAlt, FaCogs, FaDonate, FaPhotoVideo, FaUser} from "react-icons/fa";

const entities = [
    { key: "user", label: "Users", icon: <FaUser size={40} color="#4a90e2" /> },
    { key: "announcement", label: "Announcements", icon: <FaBullhorn size={40} color="#e27a4a" /> },
    { key: "media", label: "Media Resources", icon: <FaPhotoVideo size={40} color="#9b59b6" /> },
    { key: "donation", label: "Donations", icon: <FaDonate size={40} color="#27ae60" /> },
    { key: "settings", label: "Settings", icon: <FaCogs size={40} color="#34495e" /> },
    { key: "events", label: "Events", icon: <FaCalendarAlt size={40} color="#2980b9" /> },
];

const RecycleBin = () => {
    const router = useRouter();

    const handleClick = (entityKey: string) => {
        void router.push(`/recycle-bin/${entityKey}`);
    };

    return (
        <div className={styles.pageContainer}> {}
            <h1 className={styles.pageTitle}>Recycle Bin Dashboard</h1>
            <p className={styles.pageSubtitle}>
                Easily view and manage all your deleted users, announcements, and more.
            </p>
            <div className={styles.cardContainer}> {}
                {entities.map(({ key, label, icon }) => (
                    <div
                        key={key}
                        className={styles.card}
                        onClick={() => handleClick(key)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                handleClick(key);
                            }
                        }}
                    >
                        <div className={styles.icon}>{icon}</div>
                        <div className={styles.cardTitle}>{label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecycleBin;