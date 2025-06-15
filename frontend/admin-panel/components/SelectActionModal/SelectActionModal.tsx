import React, { useState } from 'react';
import SelectInput from "@/components/common/SelectInput/SelectInput";
import styles from './SelectActionModal.module.css';

interface Option {
    label: string;
    value: string;
}

interface SelectActionModalProps {
    title?: string;
    message?: string;
    options: Option[];
    initialValue?: string;
    onConfirm: (selectedValue: string) => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    className?: string;
    label: string;
}

const SelectActionModal: React.FC<SelectActionModalProps> = ({
                                                                 title = 'Select Option',
                                                                 message,
                                                                 options,
                                                                 initialValue = '',
                                                                 onConfirm,
                                                                 onCancel,
                                                                 confirmText = 'Update',
                                                                 cancelText = 'Cancel',
                                                                 loading = false,
                                                                 className,
                                                                 label
                                                             }) => {
    const [selectedValue, setSelectedValue] = useState(initialValue);

    return (
        <div className={styles.modalOverlay}>
            <div className={`${styles.modal} ${className}`}>
                <h3>{title}</h3>
                {message && <p>{message}</p>}

                <SelectInput
                    label={label}
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    options={options}
                    required
                />

                <div className={styles.buttons}>
                    <button
                        onClick={() => onConfirm(selectedValue)}
                        className={styles.confirmButton}
                        disabled={!selectedValue || loading}
                    >
                        {loading ? 'Processing...' : confirmText}
                    </button>
                    <button onClick={onCancel} className={styles.cancelButton}>
                        {cancelText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectActionModal;
