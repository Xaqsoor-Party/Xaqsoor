import React, {useState} from "react";

import styles from "@/styles/ChangePasswordPage.module.css";
import Input from "@/components/common/Input/Input";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import {useAuthentication} from "@/auth/AuthProvider";
import useAuthApi from "@/api/hooks/useAuthApi";
import {extractErrorMessage} from "@/util/extractErrorMessage";
import AlertModal from "@/components/common/AlertModal/AlertModal";
import {useLanguage} from "@/context/LanguageContext";
import {getTranslations} from "@/translations";
import Head from "next/head";

const ChangePasswordPage: React.FC = () => {
    const {user} = useAuthentication();
    const {changePassword} = useAuthApi();
    const {language} = useLanguage();
    const t = getTranslations(language, "settingsPage").changePasswordPage;
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
    });

    const [modal, setModal] = useState({
        open: false,
        title: "",
        message: "",
        error: false,
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwords.newPassword !== passwords.confirmPassword) {
            setModal({
                open: true,
                title: t.alerts.validationTitle,
                message: t.alerts.validationMessage,
                error: true,
            });
            return;
        }
        setLoading(true);
        try {
            if (!user) {
                setModal({
                    open: true,
                    title: t.alerts.validationTitle,
                    message: t.alerts.genericErrorMessage,
                    error: true,
                });
                return;
            }
             await changePassword(user.id, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });

            setModal({
                open: true,
                title: t.alerts.updateSuccessTitle,
                message: t.alerts.updateSuccessMessage,
                error: false,
            });

            setPasswords({currentPassword: "", newPassword: "", confirmPassword: ""});
        } catch (e) {
            setModal({
                open: true,
                title: t.alerts.updateErrorTitle,
                message: extractErrorMessage(e, t.alerts.genericErrorMessage),
                error: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const breadcrumbData = [
        {label: 'Home', link: '/'},
        {label: 'Settings', link: '/settings'},
        {label: 'Change password', link: '/settings/change-password'},
    ];

    return (
        <>
            <Head>
                <title>{t.title} • Xaqsoor</title>
            </Head>

            <Breadcrumb breadcrumbs={breadcrumbData}/>

            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>{t.title}</h2>
                    <div className={styles.inputGroup}>
                        <Input
                            label={t.fields.currentPassword.label}
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords(prev => ({...prev, currentPassword: e.target.value}))}
                            type={showPasswords.current ? "text" : "password"}
                            required
                            name="currentPassword"
                            placeholder={t.fields.currentPassword.placeholder}
                        />
                        <Checkbox
                            label={t.fields.showCurrentPassword}
                            checked={showPasswords.current}
                            onChange={(e) => setShowPasswords(prev => ({...prev, current: e.target.checked}))}/>
                    </div>

                    <Input
                        label={t.fields.newPassword.label}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords(prev => ({...prev, newPassword: e.target.value}))}
                        type={showPasswords.new ? "text" : "password"}
                        required
                        name="newPassword"
                        placeholder={t.fields.newPassword.placeholder}
                    />

                    <Input
                        label={t.fields.confirmNewPassword.label}
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords(prev => ({...prev, confirmPassword: e.target.value}))}
                        type={showPasswords.new ? "text" : "password"}
                        required
                        name="confirmPassword"
                        placeholder={t.fields.confirmNewPassword.placeholder}
                    />

                    <Checkbox
                        label={t.fields.showNewPasswords}
                        checked={showPasswords.new}
                        onChange={(e) => setShowPasswords(prev => ({...prev, new: e.target.checked}))}
                    />

                    <ActionButton
                        className={styles.submitButton}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? t.buttons.submitting : t.buttons.submit}
                    </ActionButton>
                </form>
            </div>
            {modal.open && (
                <AlertModal
                    title={modal.title}
                    message={modal.message}
                    error={modal.error}
                    onConfirm={() => setModal(prev => ({...prev, open: false}))}
                    onClose={() => setModal(prev => ({...prev, open: false}))}
                    buttonText="OK"
                />
            )}
        </>

    );
};

export default ChangePasswordPage;
