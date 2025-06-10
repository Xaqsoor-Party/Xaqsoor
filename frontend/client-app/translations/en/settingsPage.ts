export type SettingsTranslation = {
    settingsTitle: string;
    options: {
        profile: {
            title: string;
            description: string;
        };
        editProfile: {
            title: string;
            description: string;
        };
        changePassword: {
            title: string;
            description: string;
        };
        mfa: {
            title: string;
            description: string;
        };
        activeSessions: {
            title: string;
            description: string;
        };
    };
};

export type SettingsPage = {
    settings: SettingsTranslation;
}
export const settingsPage: SettingsPage = {
    settings: {
        settingsTitle: "Settings",
        options: {
            profile: {
                title: "Profile",
                description: "View your profile information"
            },
            editProfile: {
                title: "Edit Profile",
                description: "Update your name, email, or other details"
            },
            changePassword: {
                title: "Change Password",
                description: "Update your account password"
            },
            mfa: {
                title: "MFA",
                description: "Manage two-factor authentication"
            },
            activeSessions: {
                title: "Active Sessions",
                description: "View all devices where you are currently logged in and manage your sessions"
            }
        }
    }
}