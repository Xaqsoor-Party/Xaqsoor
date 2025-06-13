import React, {useState} from "react";
import SelectInput from "@/components/common/SelectInput/SelectInput";
import Input from "@/components/common/Input/Input";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import BubbleLoading from "@/components/common/BubbleLoading/BubbleLoading";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import useAuthApi from "@/api/hooks/useAuthApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import styles from "@/styles/AddNewMemberPage.module.css";

const RegistrationForm: React.FC = () => {

    const {language} = useLanguage();
    const translations = getTranslations(language, "authPages").AuthForms;

    const {registerUser} = useAuthApi();

    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        role: "",
        gender: ""
    });
    const [errors, setErrors] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        role: "",
        gender: "",
        general: ""
    });
    const [isLoading, setIsLoading] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [modalContent, setModalContent] = useState({
        title: "",
        message: "",
        buttonText: "OK"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({...prevState, [name]: value}));
        setErrors((prevState) => ({...prevState, [name]: "", general: ""}));
    };

    const roleOptions = [
        {value: "ADMIN", label: "Admin"},
        {value: "MEMBER", label: "Member"},
    ];
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const message = await registerUser(formData);
            setModalContent({
                title: "Registration Successful",
                message,
                buttonText: "OK"
            });
            setShowModal(true);
            setFormData({
                firstName: "",
                middleName: "",
                lastName: "",
                phone: "",
                email: "",
                role: "",
                gender: "",
            });
        } catch (error) {
            setModalContent({
                title: "Error",
                message: extractErrorMessage(error, "Registration failed. Please try again."),
                buttonText: "Close"
            });
            setShowModal(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalConfirm = () => {
        setShowModal(false);
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.loginContainer}>
                    <div className={styles.headerContainer}>
                        <h2 className={styles.title}>Add new member</h2>
                        <p className={styles.subtitle}>
                            Fill out the form below to add a new member.
                        </p>
                    </div>

                    <form className={styles.loginForm} onSubmit={handleSubmit}>
                        {errors.general && (
                            <div className={styles.errorMessage}>{errors.general}</div>
                        )}

                        <div className={styles.rowInputs}>
                            <Input
                                label={translations.firstName}
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                                type="text"
                                maxLength={15}
                                errorMessage={errors.firstName}
                                autoComplete="given-name"
                            />
                            <Input
                                label={translations.middleName}
                                name="middleName"
                                value={formData.middleName}
                                onChange={handleChange}
                                required
                                type="text"
                                maxLength={15}
                                errorMessage={errors.middleName}
                                autoComplete="additional-name"
                            />
                        </div>

                        <Input
                            label={translations.lastName}
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            type="text"
                            maxLength={15}
                            errorMessage={errors.lastName}
                            autoComplete="family-name"
                        />

                        <Input
                            label={translations.email}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            type="email"
                            errorMessage={errors.email}
                            autoComplete="email"
                            maxLength={150}
                        />

                        <Input
                            label={translations.phone}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            type="text"
                            errorMessage={errors.phone}
                            autoComplete="tel"
                            maxLength={15}
                        />
                        <div className={styles.rowInputs}>
                            <SelectInput
                                label={translations.gender}
                                name="gender"
                                value={formData.gender}
                                errorMessage={errors.gender}
                                onChange={handleChange}
                                options={translations.genderOptions}
                                required
                                placeholder={translations.genderPlaceholder}
                            />
                            <SelectInput
                                label="Role"
                                value={formData.role}
                                name={'role'}
                                onChange={handleChange}
                                options={roleOptions}
                                required
                                placeholder="select a role"
                            />
                        </div>

                        <ActionButton type="submit">{translations.register}</ActionButton>
                    </form>
                </div>

                {isLoading && <BubbleLoading/>}
                {showModal && (
                    <AlertModal
                        {...modalContent}
                        onConfirm={handleModalConfirm}
                        onClose={handleModalCancel}
                    />
                )}
            </div>
        </>
    );
};

export default RegistrationForm;
