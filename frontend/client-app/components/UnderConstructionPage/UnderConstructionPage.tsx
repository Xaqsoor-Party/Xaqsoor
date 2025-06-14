import React from 'react';
import styles from './UnderConstructionPage.module.css';
import { FiTool, FiClock } from 'react-icons/fi';

const UnderConstructionPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                <FiTool size={64} />
            </div>
            <h1 className={styles.title}>Page Under Construction</h1>
            <p className={styles.message}>
                We&apos;re working hard to bring this feature to you. Please check back later.
            </p>
            <div className={styles.footer}>
                <FiClock /> Estimated launch: Soon
            </div>
        </div>
    );
};

export default UnderConstructionPage;
