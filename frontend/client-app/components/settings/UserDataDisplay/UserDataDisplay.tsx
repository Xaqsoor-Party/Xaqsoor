import React from 'react';
import styles from './UserDataDisplay.module.css';
import { FiUser, FiCalendar, FiMapPin, FiGlobe } from 'react-icons/fi';
import {useAuthentication} from "@/auth/AuthProvider";

const UserDataDisplay = () => {
    const notAvailableText = "N/A";
    const { user} = useAuthentication();
    if (!user) {
        return null;
    }
    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return notAvailableText;
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }).format(date);
        } catch {
            return notAvailableText;
        }
    };

    const formatDateTime = (dateString: string | undefined) => {
        if (!dateString) return notAvailableText;
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            }).format(date);
        } catch {
            return notAvailableText;
        }
    };

    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>Personal Information</h2>

            <div className={styles.detailItem}>
                <FiUser className={styles.detailIcon} />
                <span><strong>Gender:</strong> {user.gender}</span>
            </div>

            <div className={styles.detailItem}>
                <FiCalendar className={styles.detailIcon} />
                <span><strong>Date of Birth:</strong> {formatDate(user.dateOfBirth)}</span>
            </div>

            <div className={styles.detailItem}>
                <FiMapPin className={styles.detailIcon} />
                <span><strong>Place of Birth:</strong> {user.placeOfBirth || notAvailableText}</span>
            </div>

            {user.bio && (
                <>
                    <h2 className={styles.cardTitle}>Biography</h2>
                    <p className={styles.bioText}>{user.bio}</p>
                </>
            )}

            <h2 className={styles.cardTitle}>Account Details</h2>
            <div className={styles.detailItem}>
                <FiGlobe className={styles.detailIcon} />
                <span><strong>Created Date:</strong> {formatDateTime(user.createdDate)}</span>
            </div>
            <div className={styles.detailItem}>
                <FiCalendar className={styles.detailIcon} />
                <span><strong>Last Login:</strong> {formatDateTime(user.lastLogin)}</span>
            </div>
        </div>
    );
};

export default UserDataDisplay;