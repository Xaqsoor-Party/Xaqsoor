import React from 'react';
import styles from './ActionCard.module.css';

interface ActionCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    onClick: () => void;
    colorClass?: string;
}

const ActionCard: React.FC<ActionCardProps> = ({ title, subtitle, icon, onClick, colorClass }) => {
    return (
        <button className={`${styles.actionCard} ${colorClass || ''}`} onClick={onClick}>
            <div className={styles.cardIcon}>{icon}</div>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardSubtitle}>{subtitle}</p>
        </button>
    );
};

export default ActionCard;