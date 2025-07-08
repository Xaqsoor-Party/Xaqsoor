import React from 'react';
import { AnnouncementRecycleDto } from '@/types/recycleBin';
import styles from '../RecycleItemCard.module.css';
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiUser, FiInfo } from "react-icons/fi";
import { useRouter } from 'next/router';

interface AnnouncementRecycleItemCardProps {
    announcement: AnnouncementRecycleDto;
}

const AnnouncementRecycleItemCard: React.FC<AnnouncementRecycleItemCardProps> = ({ announcement }) => {
    const router = useRouter();

    const handleDeletedByUserClick = (userId: number) => {
        if (userId) {
            void router.push(`/membership/${userId}`);
        }
    };

    return (
        <div className={styles.itemDetailsContent}>
            <p><strong><FiInfo className={styles.detailIcon} /> Title:</strong> {announcement.title}</p>
            <p><strong><FiInfo className={styles.detailIcon} /> Content:</strong> {announcement.content}</p>
            <p><strong><FaRegCalendarAlt className={styles.detailIcon} /> Announcement Date:</strong> {announcement.announcementDate}</p>
            <p><strong><FiInfo className={styles.detailIcon} /> Status:</strong> {announcement.status}</p>
            <p><strong><FaRegCalendarAlt className={styles.detailIcon} /> Deleted Date:</strong> {announcement.deletedDate}</p>
            <p>
                <strong><FiUser className={styles.detailIcon} /> Deleted By:</strong>{' '}
                <span
                    className={styles.clickableText}
                    onClick={() => handleDeletedByUserClick(announcement.deletedByUserId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleDeletedByUserClick(announcement.deletedByUserId);
                    }}
                >
                    {announcement.lastModifiedByName}
                </span>
            </p>
        </div>
    );
};

export default AnnouncementRecycleItemCard;
