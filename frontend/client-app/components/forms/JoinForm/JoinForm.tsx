import React, {useState} from "react";
import Input from "@/components/common/Input/Input";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import {FiCheckCircle, FiMail} from "react-icons/fi";
import styles from "./JoinForm.module.css";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";

const JoinForm: React.FC = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phone: "",
        gender: "",
        agree: false,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, type, value} = e.target;
        if (type === "checkbox") {
            return;
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleAgreeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            agree: checked,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submitted Data:", formData);
        setIsSubmitted(true);
    };

    const {language} = useLanguage();
    const translations = getTranslations(language, "joinPage").joinForm;

    return (
        <div>
            {!isSubmitted ? (
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputRow}>
                        <Input
                            label={translations.firstName}
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label={translations.middleName}
                            type="text"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            autoComplete="additional-name"
                            required
                        />
                    </div>

                    <Input
                        label={translations.lastName}
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label={translations.email}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <Input
                        label={translations.phoneNumber}
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />

                    <SelectInput
                        label={translations.gender}
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        options={translations.genderOptions}
                        placeholder={translations.genderPlaceholder}
                    />

                    <Checkbox
                        label={translations.agree}
                        name="agree"
                        checked={formData.agree}
                        onChange={handleAgreeChange}
                        required
                    />

                    <div className={styles.buttonWrapper}>
                        <ActionButton
                            type="submit"
                            className={styles.submitButton}
                            disabled={!formData.agree}
                        >
                            {translations.submit}
                        </ActionButton>
                    </div>
                </form>
            ) : (
                <div className={styles.responseMessage}>
                    <div className={styles.iconWrapper}>
                        <FiCheckCircle size={48} color="var(--color-success)"/>
                    </div>

                    <div className={styles.successMessageText}>
                        <strong className={styles.successTitle}>{translations.successTitle}</strong>
                        <p className={styles.successMessage}>{translations.successMessage}</p>
                        <br/>
                        <div className={styles.emailWrapper}>
                            <FiMail className={styles.emailIcon} size={24}/>
                            <span>{translations.checkEmail}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JoinForm;