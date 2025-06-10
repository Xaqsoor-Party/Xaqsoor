import React from 'react';
import { FaEllipsisV } from 'react-icons/fa';
import styles from './Card.module.css';

interface CardProps {
    avatar: string;
    firstName: string;
    lastName: string;
    status: 'Pending' | 'Active' | 'Inactive' | 'Banned';
    city: string;
}

const Card: React.FC<CardProps> = ({ avatar, firstName, lastName, status, city }) => {
    const renderAvatar = () => {
        if (avatar) {
            return <img src={avatar} alt={`${firstName} ${lastName}`} />;
        } else {
            return <span className={styles.avatarLetter}>{firstName[0]}</span>;
        }
    };

    const getStatusClass = () => {
        switch (status) {
            case 'Active':
                return styles.active;
            case 'Pending':
                return styles.pending;
            case 'Inactive':
                return styles.inactive;
            case 'Banned':
                return styles.banned;
            default:
                return '';
        }
    };

    return (
        <div className={styles.card}>
            <div className={styles.avatar}>{renderAvatar()}</div>
            <div className={styles.details}>
                <div className={styles.header}>
                    <h3 className={styles.name}>
                        {firstName} {lastName}
                    </h3>
                    <FaEllipsisV className={styles.moreIcon} />
                </div>
                <p className={`${styles.status} ${getStatusClass()}`}>{status}</p>
                <p className={styles.city}>{city}</p>
            </div>
        </div>
    );
};

export default Card;
