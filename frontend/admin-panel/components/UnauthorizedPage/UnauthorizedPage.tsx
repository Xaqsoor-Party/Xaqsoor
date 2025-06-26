import React from 'react';
import styles from './UnauthorizedPage.module.css';
import { FiLock } from 'react-icons/fi';

const UnauthorizedPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                <FiLock size={64} />
            </div>
            <h1 className={styles.title}>Access Denied</h1>
            <p className={styles.message}>
                You do not have permission to view this page.
            </p>
            <div className={styles.footer}>
                Please contact your administrator if you believe this is a mistake.
            </div>
        </div>
    );
};

export default UnauthorizedPage;
