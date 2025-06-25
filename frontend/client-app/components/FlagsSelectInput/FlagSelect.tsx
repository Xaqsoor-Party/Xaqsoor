import React from 'react';
import ReactFlagsSelect from 'react-flags-select';
import styles from "./FlagSelect.module.css";

interface FlagSelectProps {
    label: string;
    value: string;
    onChange: (code: string) => void;
    options: { value: string; label: string }[];
    required?: boolean;
    errorMessage?: string;
    searchable?: boolean;
    placeholder?: string;
    searchPlaceholder?: string;
    disabled?: boolean;
    fullWidth?: boolean;
    showSelectedLabel?: boolean;
    showSecondarySelectedLabel?: boolean;
    customLabels?: Record<string, string | { primary: string; secondary?: string }>;
}

const FlagSelect: React.FC<FlagSelectProps> = ({
                                                   label,
                                                   value,
                                                   onChange,
                                                   options,
                                                   required = false,
                                                   errorMessage,
                                                   searchable = true,
                                                   placeholder = "Select a country",
                                                   searchPlaceholder = "Search countries",
                                                   disabled = false,
                                                   fullWidth = true,
                                                   showSelectedLabel = true,
                                                   showSecondarySelectedLabel = true,
                                                   customLabels,
                                               }) => {
    const countries = options.map(option => option.value);
    const labels = options.reduce((acc, option) => {
        acc[option.value] = option.label;
        return acc;
    }, {} as Record<string, string>);

    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.requiredAsterisk}>*</span>}
            </label>

            <div className={styles.selectWrapper}>
                <ReactFlagsSelect
                    selected={value}
                    onSelect={onChange}
                    countries={countries}
                    customLabels={customLabels || labels}
                    placeholder={placeholder}
                    searchable={searchable}
                    searchPlaceholder={searchPlaceholder}
                    disabled={disabled}
                    fullWidth={fullWidth}
                    showSelectedLabel={showSelectedLabel}
                    showSecondarySelectedLabel={showSecondarySelectedLabel}
                    selectButtonClassName={styles.menuFlagsButton}
                    optionsSize={14}
                    selectedSize={14}
                />
            </div>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        </div>
    );
};

export default FlagSelect;