import React from 'react';
import styles from './ConfirmationModal.module.css';

interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    className?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
                                                                 message,
                                                                 onConfirm,
                                                                 onCancel,
                                                                 loading,
                                                                 title = 'Confirmation',
                                                                 confirmText = 'Yes',
                                                                 cancelText = 'Cancel',
                                                                 className,
                                                             }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modal} ${className}`}>
                <h3>{title}</h3>
                <p>{message}</p>
                <div className={styles.buttons}>
                    <button onClick={onConfirm} className={styles.confirmButton}>
                        {loading ? "Processing..." : confirmText}
                    </button>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
