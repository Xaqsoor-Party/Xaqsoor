type SettingsTranslation = {
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
type ProfileTranslation = {
    tabs: {
        about: string,
        work: string,
        education: string,
        contact: string
    },
    userData: {
        personalInformation: string;
        gender: string;
        dateOfBirth: string;
        placeOfBirth: string;
        accountCreatedDate: string;
        lastLoginDate: string;
        accountDetails: string;
        biography: string;
    },
    workExperience: {
        loadingMessage: string,
        noDataMessage: string,
        sectionTitle: string,
        errors: {
            noUser: string,
            noData: string,
            failedToLoad: string
        }
    },
    academicRecord: {
        loadingMessage: string,
        noDataMessage: string,
        sectionTitle: string,
        errors: {
            noData: string,
            failedToLoad: string
        }
    },
    contactInfo: {
        title: string,
        noContactInfo: string,
    }
}
type EditProfileTranslation = {
    title: string,
    subtitle: string,
    loading: string,
    buttons: {
        submit: string,
        submitting: string
    },
    alerts: {
        validationTitle: string,
        validationMessage: string,
        updateSuccessTitle: string,
        updateSuccessMessage: string,
        updateErrorTitle: string,
        updateErrorMessage: string,
        fetchErrorMessage: string,
        genericErrorMessage: string
    },
    sections: {
        personal: string,
        address: string,
        academic: string,
        work: string
    },
    fields: {
        firstName: {
            label: string,
            placeholder: string
        },
        middleName: {
            label: string,
            placeholder: string
        },
        lastName: {
            label: string,
            placeholder: string
        },
        gender: {
            label: string,
            placeholder: string,
            options: {
                male: string,
                female: string
            }
        },
        placeOfBirth: {
            label: string,
            placeholder: string
        },
        dateOfBirth: {
            label: string
        },
        street: {
            label: string,
            placeholder: string
        },
        city: {
            label: string,
            placeholder: string
        },
        state: {
            label: string,
            placeholder: string
        },
        country: {
            label: string,
            placeholder: string
        },
        bio: {
            label: string,
            placeholder: string
        }
    }
}
type AcademicRecordsForm = {
    sectionTitle: string,
    addButton: string,
    removeButton: string,
    entryTitle: string,
    fields: {
        institutionName: {
            label: string,
            placeholder: string
        },
        degree: {
            label: string,
            placeholder: string
        },
        fieldOfStudy: {
            label: string,
            placeholder: string
        },
        level: {
            label: string,
            placeholder: string,
            options: { value: string; label: string }[];
        },
        location: {
            label: string,
            placeholder: string
        },
        currentlyStudying: {
            label: string
        },
        startDate: {
            label: string
        },
        endDate: {
            label: string
        }
    }
}
type WorkExperienceForm = {
    sectionTitle: string;
    addButton: string;
    removeButton: string;
    entryTitle: string;
    fields: {
        jobTitle: {
            label: string;
            placeholder: string;
        };
        companyName: {
            label: string;
            placeholder: string;
        };
        location: {
            label: string;
            placeholder: string;
        };
        currentlyWorking: {
            label: string;
        };
        startDate: {
            label: string;
        };
        endDate: {
            label: string;
        };
        description: {
            label: string;
            placeholder: string;
        };
    };
};
type ChangePasswordPage = {
    title: string;
    subtitle: string;
    fields: {
        currentPassword: {
            label: string;
            placeholder: string;
        };
        newPassword: {
            label: string;
            placeholder: string;
        };
        confirmNewPassword: {
            label: string;
            placeholder: string;
        };
        showCurrentPassword: string;
        showNewPasswords: string;
    };
    buttons: {
        submit: string;
        submitting: string;
    };
    alerts: {
        validationTitle: string;
        validationMessage: string;
        updateSuccessTitle: string;
        updateSuccessMessage: string;
        updateErrorTitle: string;
        updateErrorMessage: string;
        genericErrorMessage: string;
    };
};
type MfaTranslation = {
    title: string;
    status: {
        enabled: {
            title: string;
            description: string;
        };
        disabled: {
            title: string;
            description: string;
        };
    };
    messages: {
        setupSuccess: string;
        setupError: string;
        disableSuccess: string;
        disableError: string;
        userNotFound: string;
    };
    qr: {
        instruction: string;
        alt: string;
        hideButton: string;
        showButton: string;
    };
    actions: {
        enable: string;
        disable: string;
    };
}

type SessionsTranslation = {
    title: string;
    infoText: string;
    errors: {
        userNotFound: string;
        fetchFailed: string;
        revokeFailed: string;
        noSessions: string;
    };
    successMessages: {
        revokeSuccess: (count: number) => string;
    };
    loading: {
        authenticating: string;
        sessionsLoading: string;
    };
    sessions: {
        unknownDevice: string;
        unknownIp: string;
        lastActiveLabel: string;
        revokeButton: string;
        revokeButtonHint: string;
        confirmModal: {
            title: string;
            message: string;
            confirmButtonText: string;
        };
    };
};

export type SettingsPage = {
    settings: SettingsTranslation;
    profile: ProfileTranslation;
    editProfile: EditProfileTranslation;
    academicRecordsForm: AcademicRecordsForm;
    workExperienceForm: WorkExperienceForm;
    changePasswordPage: ChangePasswordPage;
    mfa: MfaTranslation;
    sessions: SessionsTranslation;
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
                description: "Update your name, address, or other details"
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
    },
    profile: {
        tabs: {
            about: "About",
            work: "Work",
            education: "Education",
            contact: "Contact"
        },
        userData: {
            personalInformation: "Personal Information",
            gender: "Gender",
            dateOfBirth: "Date of Birth",
            placeOfBirth: "Place of Birth",
            accountCreatedDate: "Created Date",
            lastLoginDate: "Last Login:",
            accountDetails: "Account Details",
            biography: "Biography",
        },
        workExperience: {
            loadingMessage: "Loading work experience...",
            noDataMessage: "No work experience added yet.",
            sectionTitle: "Work Experience",
            errors: {
                noUser: "No user found.",
                noData: "No work experience data found.",
                failedToLoad: "Failed to load work experience. Please try again later."
            }
        },
        academicRecord: {
            loadingMessage: "Loading academic records...",
            noDataMessage: "No academic records added yet.",
            sectionTitle: "Academic Records",
            errors: {
                noData: "No academic record data found.",
                failedToLoad: "Failed to load academic records. Please try again later."
            }
        },
        contactInfo: {
            title: "Your Contact Details",
            noContactInfo: "No contact information available.",
        }
    },
    editProfile: {
        title: "Edit Profile",
        subtitle: "Update your name, contact details, and background information.",
        loading: "Loading profile...",
        buttons: {
            submit: "Submit",
            submitting: "Submitting..."
        },
        alerts: {
            validationTitle: "Validation Error",
            validationMessage: "Please correct the highlighted fields.",
            updateSuccessTitle: "Success",
            updateSuccessMessage: "Profile updated successfully!",
            updateErrorTitle: "Error",
            updateErrorMessage: "Failed to update profile.",
            fetchErrorMessage: "Error fetching user profile",
            genericErrorMessage: "An unexpected error occurred while updating your profile."
        },
        sections: {
            personal: "Personal Information",
            address: "Address Information",
            academic: "Academic Records",
            work: "Work Experience"
        },
        fields: {
            firstName: {
                label: "First Name",
                placeholder: "Enter your first name"
            },
            middleName: {
                label: "Middle Name",
                placeholder: "Enter your middle name"
            },
            lastName: {
                label: "Last Name",
                placeholder: "Enter your last name"
            },
            gender: {
                label: "Gender",
                placeholder: "Select your gender",
                options: {
                    male: "Male",
                    female: "Female"
                }
            },
            placeOfBirth: {
                label: "Place of Birth",
                placeholder: "Enter your place of birth"
            },
            dateOfBirth: {
                label: "Date of Birth"
            },
            street: {
                label: "Street",
                placeholder: "Enter your street"
            },
            city: {
                label: "City",
                placeholder: "Enter your city"
            },
            state: {
                label: "State",
                placeholder: "Enter your state"
            },
            country: {
                label: "Country",
                placeholder: "Enter your country"
            },
            bio: {
                label: "Bio",
                placeholder: "Tell us about yourself"
            }
        }
    },
    academicRecordsForm: {
        sectionTitle: "Academic Records",
        addButton: "Add Academic Record",
        removeButton: "Remove",
        entryTitle: "Education Entry",
        fields: {
            institutionName: {
                label: "Institution",
                placeholder: "Institution Name"
            },
            degree: {
                label: "Qualification Achieved",
                placeholder: "e.g., Bachelor of Science in Computer Engineering"
            },
            fieldOfStudy: {
                label: "Field of Study",
                placeholder: "Field of Study"
            },
            level: {
                label: "Education Level",
                placeholder: "Select your education level",
                options: [
                    {value: "HIGH_SCHOOL", label: "High school"},
                    {value: "DIPLOMA", label: "Diploma"},
                    {value: "BACHELORS", label: "Bachelor's"},
                    {value: "MASTERS", label: "Master's"},
                    {value: "PHD", label: "PhD"},
                    {value: "OTHER", label: "Other"}
                ]
            },
            location: {
                label: "Location",
                placeholder: "City, Country"
            },
            currentlyStudying: {
                label: "Currently Studying"
            },
            startDate: {
                label: "Start Date"
            },
            endDate: {
                label: "End Date"
            }
        }
    },
    workExperienceForm: {
        sectionTitle: "Work Experience",
        addButton: "Add Work Experience",
        removeButton: "Remove",
        entryTitle: "Work Experience",
        fields: {
            jobTitle: {
                label: "Job Title",
                placeholder: "e.g., Software Engineer"
            },
            companyName: {
                label: "Company Name",
                placeholder: "e.g., Tech Solutions Inc."
            },
            location: {
                label: "Location",
                placeholder: "City, Country"
            },
            currentlyWorking: {
                label: "Currently Working Here"
            },
            startDate: {
                label: "Start Date"
            },
            endDate: {
                label: "End Date"
            },
            description: {
                label: "Description (Optional)",
                placeholder: "Describe your responsibilities, achievements, and key projects."
            }
        }
    },
    changePasswordPage: {
        title: "Change Password",
        subtitle: "Update your account password to keep your account secure.",
        fields: {
            currentPassword: {
                label: "Current Password",
                placeholder: "Enter your current password"
            },
            newPassword: {
                label: "New Password",
                placeholder: "Enter your new password"
            },
            confirmNewPassword: {
                label: "Confirm New Password",
                placeholder: "Re-enter your new password"
            },
            showCurrentPassword: "Show Current Password",
            showNewPasswords: "Show New Passwords",
        },
        buttons: {
            submit: "Change Password",
            submitting: "Changing..."
        },
        alerts: {
            validationTitle: "Validation Error",
            validationMessage: "New password and confirmation do not match.",
            updateSuccessTitle: "Success",
            updateSuccessMessage: "Your password has been updated successfully!",
            updateErrorTitle: "Error",
            updateErrorMessage: "Failed to update password. Please try again.",
            genericErrorMessage: "An unexpected error occurred while changing your password."
        }
    },
    mfa: {
        title: "Multi-Factor Authentication (MFA)",
        status: {
            enabled: {
                title: "MFA is currently Enabled",
                description: "Your account is secured with an extra layer of protection"
            },
            disabled: {
                title: "MFA is currently Disabled",
                description: "For enhanced security, we recommend enabling MFA"
            }
        },
        messages: {
            setupSuccess: "MFA setup initiated. Scan the QR code with your authenticator app.",
            setupError: "Failed to generate MFA QR code. Please try again.",
            disableSuccess: "MFA disabled successfully.",
            disableError: "Failed to disable MFA. Please try again.",
            userNotFound: "User ID not found. Please log in."
        },
        qr: {
            instruction: "Scan this QR code with your authenticator app (e.g., Google Authenticator, Authy, Microsoft Authenticator)",
            alt: "MFA QR Code",
            hideButton: "Hide QR Code",
            showButton: "Show QR Code"
        },
        actions: {
            enable: "Enable MFA",
            disable: "Disable MFA"
        }
    },
    sessions: {
        title: "Active Sessions",
        infoText:
            "Here you can view all active login sessions for your account. This includes the device, location (IP address), and when it was last active. You can also revoke all other sessions except your current one for security.",
        errors: {
            userNotFound: "User ID not found. Please log in.",
            fetchFailed: "Failed to load sessions. Please try again later.",
            revokeFailed: "Failed to revoke sessions. Please try again.",
            noSessions: "No active sessions found (or only your current session is active).",
        },
        successMessages: {
            revokeSuccess: (count: number) => `Successfully revoked ${count} other session(s).`,
        },
        loading: {
            authenticating: "Authenticating user...",
            sessionsLoading: "Loading sessions...",
        },
        sessions: {
            unknownDevice: "Unknown Device",
            unknownIp: "Unknown IP",
            lastActiveLabel: "Last Active:",
            revokeButton: "Revoke All Other Sessions",
            revokeButtonHint: "You can only revoke other sessions if more than one is active.",
            confirmModal: {
                title: "Confirm Session Revocation",
                message:
                    "Are you sure you want to revoke all other active sessions? You will remain logged in.",
                confirmButtonText: "Yes, Revoke",
            },
        },
    }
}