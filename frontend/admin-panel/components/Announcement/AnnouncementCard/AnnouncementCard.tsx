import styles from './AnnouncementCard.module.css';
import {AnnouncementDto} from "@/types/announcement";
import React from "react";

interface AnnouncementCardProps {
    announcement: AnnouncementDto;
    onDetailClick: (id: number) => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ announcement, onDetailClick }) => {


    const date = new Date(announcement.announcementDate!);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });

    return (
        <div className={styles.card}>
            <div className={styles.dateContainer}>
                <span className={styles.month}>{month}</span>
                <span className={styles.day}>{day}</span>
            </div>
            <div className={styles.contentContainer}>
                <h3 className={styles.title}>{announcement.title}</h3>
                <p className={styles.content}>{announcement.content}</p>
                <button
                    className={styles.detailButton}
                    onClick={() => announcement.id && onDetailClick(announcement.id)}
                >
                    Detail
                </button>
            </div>
        </div>
    );
};

export default AnnouncementCard;