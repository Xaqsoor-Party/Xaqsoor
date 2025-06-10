import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./LanguageSwitcher.module.css";
import {FaGripLinesVertical} from "react-icons/fa";

interface LanguageSwitcherProps {
    mobile?: boolean;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ mobile = false }) => {
    const { language, setLanguage } = useLanguage();

    return (
        <div className={`${styles.langSwitcher} ${mobile ? styles.mobile : ''}`}>
            <button
                onClick={() => setLanguage('en')}
                className={`${styles.langButton} ${language === 'en' ? styles.activeLang : ''}`}
                aria-label={language === 'en' ? "English (selected)" : "Switch to English"}
            >
                EN
            </button>
            <FaGripLinesVertical className={styles.langDivider} aria-hidden="true" />
            <button
                onClick={() => setLanguage('so')}
                className={`${styles.langButton} ${language === 'so' ? styles.activeLang : ''}`}
                aria-label={language === 'so' ? "Soomaali (laga dooran)" : "U beddel Soomaali"}
            >
                SO
            </button>
        </div>
    );
};

export default LanguageSwitcher;