import React from 'react';
import styles from './SearchInput.module.css';
import {FiSearch} from 'react-icons/fi';

interface SearchInputProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                     value,
                                                     onChange,
                                                     onKeyDown,
                                                     placeholder = "Search...",
                                                 }) => {
    return (
        <div className={styles.inputContainer}>
            <div className={styles.inputWrapper}>
                <input
                    className={styles.inputField}
                    type="text"
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    placeholder={placeholder}
                />
                <div className={styles.searchIcon}>
                    <FiSearch size={20}/>
                </div>
            </div>
        </div>
    );
};

export default SearchInput;
