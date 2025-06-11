import {useRouter} from "next/router";
import React, {useEffect, useState} from "react";
import {validatePassword} from "@/util/validator";
import Head from "next/head";
import Image from "next/image";
import Input from "@/components/common/Input/Input";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import Link from "next/link";
import BubbleLoading from "@/components/common/BubbleLoading/BubbleLoading";
import {AxiosError} from "axios";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import {useLanguage} from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher/LanguageSwitcher";
import useAuthApi from "@/api/hooks/useAuthApi";
import {SetPasswordRequest} from "@/types/auth";
import {getTranslations} from "@/translations";
import styles from "@/styles/ResetPassword.module.css";

export default function ResetPasswordPage() {
    const router = useRouter();
    const {token} = router.query;
    const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
    const {verifyConfirmationKey, resetPassword} = useAuthApi();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalMessage, setModalMessage] = useState("");
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [userFullName, setUserFullName] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const validateToken = async (token: string) => {
        try {
            const response = await verifyConfirmationKey(token);
            const user = response.data?.user;
            if (user) {
                setUserEmail(user.email);
                setUserFullName(user.fullName);
            }
            setIsTokenValid(true);

            setIsTokenValid(true);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            setIsTokenValid(false);
            void router.replace("/404");
        }
    };

    useEffect(() => {
        if (token) {
            void validateToken(token as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        newPassword: "",
        confirmPassword: "",
        general: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setErrors((prevState) => ({
            ...prevState,
            [name]: "",
        }));
    };

    const validateConfirmPassword = (password: string, confirmPassword: string) => {
        if (!confirmPassword.trim()) {
            return 'Please confirm your password.';
        } else if (password !== confirmPassword) {
            return 'Passwords do not match.';
        }
        return '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isTokenValid) return;
        setIsLoading(true);
        // Validate password and confirm password
        const newPasswordError = validatePassword(formData.newPassword);
        const confirmPasswordError = validateConfirmPassword(formData.newPassword, formData.confirmPassword);

        // Check if there are validation errors
        if (newPasswordError || confirmPasswordError) {
            setErrors({
                newPassword: newPasswordError,
                confirmPassword: confirmPasswordError,
                general: "",
            });
            setIsLoading(false);
            return;
        }

        void resetUserPassword();

    }

    const handleModalUpdate = (title: string, message: string, isError: boolean) => {
        setIsLoading(false);
        setModalTitle(title);
        setModalMessage(message);
        setIsError(isError);
        setIsModalVisible(true);
    };

    const resetUserPassword = async () => {
        const passwordResetData: SetPasswordRequest = {
            password: formData.newPassword,
            key: token as string,
        };
        try {
            const response = await resetPassword(passwordResetData);
            // Handle success
            handleModalUpdate("Success", response || "Your password has been successfully reset.", false);
        } catch (error) {
            // Handle error
            setIsLoading(false);

            if (error instanceof AxiosError) {
                const errorMessage = error.response?.data.message || "There was an issue resetting your password. Please try again.";
                handleModalUpdate("Error", errorMessage, true);
            } else {
                // In case the error is not an AxiosError
                handleModalUpdate("Error", "An unexpected error occurred. Please try again later.", true);
            }
        }
    }

    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    const {language} = useLanguage();
    const translations = getTranslations(language, "authPages").SetPassword;
    return (
        <>
            <Head>
                <title>Password Reset • Xaqsoor</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.logoContainer}>
                    <Link href="/">
                        <Image src="/images/Replace_Me.svg" alt="logo" width={120} height={40}/>
                    </Link>
                </div>

                <div className={styles.resetContainer}>
                    <div className={styles.languageSwitcherContainer}>
                        <LanguageSwitcher/>
                    </div>
                    <h2 className={styles.title}>{translations.title}</h2>
                    {userFullName && (
                        <div className={styles.userInfo}>
                            {/*<p>{translations.greetingLine1} <strong>{userFullName}</strong>!</p>*/}
                            <p>{translations.greetingLine2}</p>
                        </div>
                    )}
                    {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}
                    <form onSubmit={handleSubmit} className={styles.form}>
                        {userEmail && (
                            <Input
                                label={"Email"}
                                name="email"
                                value={userEmail}
                                onChange={() => {
                                }}
                                type={"email"}
                                required
                                disabled
                                maxLength={150}
                            />
                        )}
                        <Input
                            label={translations.newPassword}
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            required
                            errorMessage={errors.newPassword}
                            maxLength={150}
                        />

                        <Input
                            label={translations.confirmPassword}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            type={showPassword ? "text" : "password"}
                            required
                            errorMessage={errors.confirmPassword}
                            maxLength={150}
                        />

                        <Checkbox label={translations.showPasswordText} checked={showPassword}
                                  onChange={handleTogglePassword}/>
                        <ActionButton type="submit" disabled={isLoading} className={styles.customButton}>
                            {translations.resetPasswordText}
                        </ActionButton>

                        <Link href={"/auth/login"}
                              className={styles.returnToLogin}>
                            {translations.backToLogin}
                        </Link>
                    </form>
                </div>
                {isLoading && <BubbleLoading/>}
                {isModalVisible && (
                    <AlertModal
                        title={modalTitle}
                        message={modalMessage}
                        onConfirm={() => {
                            setIsModalVisible(false);
                            void router.push('/auth/login');
                        }}
                        error={isError}
                    />
                )}
            </div>
        </>
    );
};
