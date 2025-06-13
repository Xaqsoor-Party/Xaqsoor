import React from 'react';
import styles from './UserDataDisplay.module.css';
import { FiUser, FiCalendar, FiMapPin, FiGlobe } from 'react-icons/fi';
import {useAuthentication} from "@/auth/AuthProvider";
import {formatDate, formatDateTime} from "@/util/dateUtils";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

const UserDataDisplay = () => {
    const notAvailableText = "N/A";
    const { user} = useAuthentication();
    const { language } = useLanguage();
    const t = getTranslations(language, "settingsPage").profile.userData;
    if (!user) {
        return null;
    }
    return (
        <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t.personalInformation}</h2>

            <div className={styles.detailItem}>
                <FiUser className={styles.detailIcon} />
                <span><strong>{t.gender}:</strong> {user.gender}</span>
            </div>

            <div className={styles.detailItem}>
                <FiCalendar className={styles.detailIcon} />
                <span><strong>{t.dateOfBirth}:</strong> {formatDate(user.dateOfBirth)}</span>
            </div>

            <div className={styles.detailItem}>
                <FiMapPin className={styles.detailIcon} />
                <span><strong>{t.placeOfBirth}:</strong> {user.placeOfBirth || notAvailableText}</span>
            </div>

            {user.bio && (
                <>
                    <h2 className={styles.cardTitle}>{t.biography}</h2>
                    <p className={styles.bioText}>{user.bio}</p>
                </>
            )}

            <h2 className={styles.cardTitle}>{t.accountDetails}</h2>
            <div className={styles.detailItem}>
                <FiGlobe className={styles.detailIcon} />
                <span><strong>{t.accountCreatedDate}:</strong> {formatDateTime(user.createdDate)}</span>
            </div>
            <div className={styles.detailItem}>
                <FiCalendar className={styles.detailIcon} />
                <span><strong>{t.lastLoginDate}:</strong> {formatDateTime(user.lastLogin)}</span>
            </div>
        </div>
    );
};

export default UserDataDisplay;