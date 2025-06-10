import React from 'react';
import styles from './AlertModal.module.css';
import {FaTimes} from "react-icons/fa";

interface AlertModalProps {
    title: string;
    message: string;
    onConfirm: () => void;
    onClose?: () => void;
    error?: boolean;
    buttonText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
                                                   title,
                                                   message,
                                                   onConfirm,
                                                   onClose,
                                                   error = false,
                                                   buttonText = "OK",
                                               }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                {onClose && (
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes size={20} className={styles.closeIcon} />
                    </button>
                )}
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button
                        onClick={onConfirm}
                        className={error ? styles.errorButton : styles.confirmButton}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;