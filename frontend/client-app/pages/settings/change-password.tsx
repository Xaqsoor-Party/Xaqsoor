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

const ChangePasswordPage: React.FC = () => {
    const {user} = useAuthentication();
    const {changePassword} = useAuthApi();

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
                title: "Error",
                message: "New password and confirmation do not match.",
                error: true,
            });
            return;
        }
        setLoading(true);
        try {
            if (!user) {
                setModal({
                    open: true,
                    title: "Error",
                    message: "New password and confirmation do not match.",
                    error: true,
                });
                return;
            }
            const message = await changePassword(user.id, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });

            setModal({
                open: true,
                title: "Success",
                message,
                error: false,
            });

            setPasswords({currentPassword: "", newPassword: "", confirmPassword: ""});
        } catch (e) {
            setModal({
                open: true,
                title: "Error",
                message: extractErrorMessage(e, "Failed to change password."),
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
            <Breadcrumb breadcrumbs={breadcrumbData}/>

            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>Change Password</h2>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Current Password"
                            value={passwords.currentPassword}
                            onChange={(e) => setPasswords(prev => ({...prev, currentPassword: e.target.value}))}
                            type={showPasswords.current ? "text" : "password"}
                            required
                            name="currentPassword"
                            placeholder="Enter current password"
                        />
                        <Checkbox
                            label="Show Passwords"
                            checked={showPasswords.current}
                            onChange={(e) => setShowPasswords(prev => ({...prev, current: e.target.checked}))}/>
                    </div>

                    <Input
                        label="New Password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords(prev => ({...prev, newPassword: e.target.value}))}
                        type={showPasswords.new ? "text" : "password"}
                        required
                        name="newPassword"
                        placeholder="Enter new password"
                    />

                    <Input
                        label="Confirm New Password"
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords(prev => ({...prev, confirmPassword: e.target.value}))}
                        type={showPasswords.new ? "text" : "password"}
                        required
                        name="confirmPassword"
                        placeholder="Re-enter new password"
                    />

                    <Checkbox
                        label="Show Passwords"
                        checked={showPasswords.new}
                        onChange={(e) => setShowPasswords(prev => ({...prev, new: e.target.checked}))}
                    />

                    <ActionButton
                        className={styles.submitButton}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Changing..." : "Change Password"}
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
