import React from 'react';
import styles from './ContactInfo.module.css';
import {FiMail, FiMapPin, FiPhone} from 'react-icons/fi';
import {useAuthentication} from "@/auth/AuthProvider";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

const ContactInfo: React.FC = () => {
    const {user} = useAuthentication();
    const {language} = useLanguage();
    const t = getTranslations(language, 'settingsPage').profile.contactInfo;
    if (!user) {
        return null;
    }

    const formatAddress = () => {
        const addressParts = [
            user.street,
            user.city,
            user.state,
            user.country
        ].filter(Boolean);

        return addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
    };

    return (
        <div className={styles.contactContainer}>
            <h2 className={styles.contactTitle}>{t.title}</h2>

            {user.email && (
                <div className={styles.contactItem}>
                    <FiMail className={styles.contactIcon}/>
                    <a href={`mailto:${user.email}`} className={styles.contactLink}>
                        {user.email}
                    </a>
                </div>
            )}

            {user.phone && (
                <div className={styles.contactItem}>
                    <FiPhone className={styles.contactIcon}/>
                    <a href={`tel:${user.phone}`} className={styles.contactLink}>
                        {user.phone}
                    </a>
                </div>
            )}

            <div className={styles.contactItem}>
                <FiMapPin className={styles.contactIcon}/>
                <span className={styles.addressText}>
                        {formatAddress()}
                    </span>
            </div>

            {!user.email && !user.phone && !(user.street || user.city || user.state || user.country) && (
                <p className={styles.noContactInfo}>{t.noContactInfo}</p>
            )}
        </div>
    );
};

export default ContactInfo;