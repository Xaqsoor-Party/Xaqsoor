import React from 'react';
import styles from './ContactInfo.module.css'; // Make sure this path is correct
import {FiMail, FiMapPin, FiPhone} from 'react-icons/fi'; // Added FiMapPin for address
import {useAuthentication} from "@/auth/AuthProvider";

const ContactInfo: React.FC = () => {
    const {user} = useAuthentication();

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
            <h2 className={styles.contactTitle}>Your Contact Details</h2>

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
                <p className={styles.noContactInfo}>No contact information available.</p>
            )}
        </div>
    );
};

export default ContactInfo;