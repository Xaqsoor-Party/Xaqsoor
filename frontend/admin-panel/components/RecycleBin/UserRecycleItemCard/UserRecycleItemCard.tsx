import React from 'react';
import { UserRecycleDto } from '@/types/recycleBin';
import styles from '../RecycleItemCard.module.css';
import { FaUserCircle, FaRegCalendarAlt } from "react-icons/fa";
import {FiMail, FiPhone, FiBriefcase, FiCheckCircle} from "react-icons/fi";
import { useRouter } from 'next/router';

interface UserRecycleItemCardProps {
    user: UserRecycleDto;
}

const UserRecycleItemCard: React.FC<UserRecycleItemCardProps> = ({ user }) => {
    const router = useRouter();

    const handleDeletedByUserClick = (deletedByUserId: number) => {
        if (deletedByUserId) {
            void router.push(`/membership/${deletedByUserId}`);
        }
    };

    return (
        <div className={styles.itemDetailsContent}>

            <p><strong><FaUserCircle className={styles.detailIcon} /> Full Name:</strong> {user.fullName}</p>
            <p><strong><FiMail className={styles.detailIcon} /> Email:</strong> {user.email}</p>
            <p><strong><FiPhone className={styles.detailIcon} /> Phone:</strong> {user.phone}</p>
            <p><strong><FiBriefcase className={styles.detailIcon} /> Role:</strong> {user.roleName}</p>
            <p><strong><FiCheckCircle  className={styles.detailIcon} /> Status:</strong> {user.status}</p>
            <p><strong><FaRegCalendarAlt className={styles.detailIcon} /> Deleted:</strong> {user.deletedDate}</p>
            <p>
                <strong><FaUserCircle className={styles.detailIcon} /> Deleted By:</strong>{' '}
                <span
                    className={styles.clickableText}
                    onClick={() => handleDeletedByUserClick(user.deletedByUserId)}
                >
                    {user.lastModifiedByName}
                </span>
            </p>
        </div>
    );
};

export default UserRecycleItemCard;