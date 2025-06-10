import React, {useState} from "react";

import styles from "@/styles/ChangePasswordPage.module.css";
import Input from "@/components/common/Input/Input";
import Checkbox from "@/components/common/Checkbox/Checkbox";
import ActionButton from "@/components/common/ActionButton/ActionButton";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const ChangePasswordPage: React.FC = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match.");
            return;
        }

        // TODO: Implement API call to change password
        console.log({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        setError("");
        alert("Password changed successfully!");
    };

    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Settings', link: '/settings' },
        { label: 'Change password', link: '/settings/change-password' },
    ];

    return (
        <>
            <Breadcrumb breadcrumbs={breadcrumbData} />

            <div className={styles.container}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.title}>Change Password</h2>
                    <div className={styles.inputGroup}>
                        <Input
                            label="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            type={showCurrentPassword ? "text" : "password"}
                            required
                            name="currentPassword"
                            placeholder="Enter current password"
                        />
                        <Checkbox
                            label="Show Passwords"
                            checked={showCurrentPassword}
                            onChange={(e) => setShowCurrentPassword(e.target.checked)}
                        />
                    </div>

                    <Input
                        label="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        type={showNewPassword ? "text" : "password"}
                        required
                        name="newPassword"
                        placeholder="Enter new password"
                    />

                    <Input
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type={showNewPassword ? "text" : "password"}
                        required
                        name="confirmPassword"
                        placeholder="Re-enter new password"
                        errorMessage={error}
                    />

                    <Checkbox
                        label="Show Passwords"
                        checked={showNewPassword}
                        onChange={(e) => setShowNewPassword(e.target.checked)}
                    />

                    <ActionButton className={styles.submitButton} type={"submit"}>
                        Change Password
                    </ActionButton>
                </form>
            </div>
        </>

    );
};

export default ChangePasswordPage;
