import React from 'react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                 message,
                                                                 onConfirm,
                                                                 onCancel,
                                                                 title = 'Confirmation',
                                                                 confirmText = 'Yes',
                                                                 cancelText = 'Cancel'
                                                             }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button onClick={onConfirm} className={styles.confirmButton}>{confirmText}</button>
                    <button onClick={onCancel} className={styles.cancelButton}>{cancelText}</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
