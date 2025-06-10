import React, { useEffect, useRef } from "react";
import Multiselect from "multiselect-react-dropdown";
import styles from "./MultiSelectDropdown.module.css";

interface Option {
    name: string;
    id: string;
}
interface MultiSelectDropdownProps {
    label: string;
    options: Option[];
    selectedValues?: Option[];
    onChange: (selectedList: Option[]) => void;
    required?: boolean;
    errorMessage?: string;
    placeholder?: string;
    showCheckbox?: boolean;
    selectionLimit?: number;
    singleSelect?: boolean;
    disabled?: boolean;
    closeOnSelect?: boolean;
    hidePlaceholder?: boolean;
    className?: string;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
                                                                     label,
                                                                     options,
                                                                     selectedValues = [],
                                                                     onChange,
                                                                     required = false,
                                                                     errorMessage,
                                                                     placeholder = "Select options",
                                                                     showCheckbox = false,
                                                                     selectionLimit = -1,
                                                                     singleSelect = false,
                                                                     disabled = false,
                                                                     closeOnSelect = true,
                                                                     hidePlaceholder = false,
                                                                     className = "",
                                                                 }) => {
    const multiSelectRef = useRef<Multiselect>(null);

    useEffect(() => {
        const updatedSelectedValues = selectedValues.map((selected) => {
            const option = options.find((opt) => opt.id === selected.id);
            if (option) {
                return { id: option.id, name: option.name };
            }
            return selected;
        });

        const valuesChanged = !updatedSelectedValues.every((value, index) =>
            value.id === selectedValues[index]?.id && value.name === selectedValues[index]?.name
        );

        if (valuesChanged) {
            onChange(updatedSelectedValues);
        }
    }, [options, selectedValues, onChange]);

    const handleSelect = (selectedList: { name: string; id: string }[]) => {
        onChange(selectedList);
    };

    const handleRemove = (selectedList: { name: string; id: string }[]) => {
        onChange(selectedList);
    };

    return (
        <div className={`${styles.container} ${className} ${errorMessage ? styles.error : ""}`}>
            <label className={styles.label}>
                {label}
                {required && <span className={styles.required}>*</span>}
            </label>

            <div className={styles.wrapper}>
                <Multiselect
                    ref={multiSelectRef}
                    options={options}
                    selectedValues={selectedValues}
                    onSelect={handleSelect}
                    onRemove={handleRemove}
                    displayValue="name"
                    showCheckbox={showCheckbox}
                    selectionLimit={selectionLimit}
                    singleSelect={singleSelect}
                    placeholder={placeholder}
                    disable={disabled}
                    showArrow={true}
                    closeOnSelect={closeOnSelect}
                    hidePlaceholder={hidePlaceholder}
                    avoidHighlightFirstOption={true}
                    isObject={true}
                    className={styles.multiselect}
                    style={{
                        searchBox: {
                            padding: "8px",
                            borderRadius: "4px",
                            border: errorMessage ? "1px solid #ff0000" : "1px solid #ccc"
                        }
                    }}
                />
            </div>

            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
        </div>
    );
};

export default MultiSelectDropdown;
