import React from 'react';
import { UserCardDTO } from '@/types/user';
import styles from './UserCard.module.css';
import Image from "next/image";
import Link from "next/link";

interface UserCardProps {
    user: UserCardDTO;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const getInitial = (name: string) => name?.charAt(0).toUpperCase();

    // Status handling
    const getStatusClass = (status: string) => {
        const statusMap: Record<string, string> = {
            'ACTIVE': styles.statusActive,
            'INACTIVE': styles.statusInactive,
            'SUSPENDED': styles.statusSuspended,
            'PENDING': styles.statusPending
        };
        return statusMap[status] || '';
    };

    // Format status for display
    const formatStatus = (status: string) => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    return (
        <Link href={`/membership/${user.userId}`}  className={styles.card}>
            <div className={styles.avatarContainer}>
                {user.profileImageUrl ? (
                    <Image
                        src={user.profileImageUrl}
                        alt={`${user.fullName}'s profile`}
                        className={styles.image}
                        width={80}
                        height={80}
                    />
                ) : (
                    <div className={styles.avatar}>
                        {getInitial(user.fullName)}
                    </div>
                )}
            </div>

            <div className={styles.details}>
                <h3 className={styles.name}>{user.fullName}</h3>

                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{user.email}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Phone:</span>
                    <span className={styles.infoValue}>{user.phone || 'N/A'}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Membership Level:</span>
                    <span className={styles.infoValue}>{user.membershipLevel || 'N/A'}</span>
                </div>

                <div className={styles.infoRow}>
                    <span className={styles.infoLabel}>Status:</span>
                    <span className={`${styles.statusBadge} ${getStatusClass(user.status)}`}>
                        {formatStatus(user.status)}
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default UserCard;