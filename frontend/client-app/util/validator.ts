import React from "react";

export const validateEmail = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.trim()) {
        return 'Email is required.';
    } else if (!emailPattern.test(email)) {
        return 'Please enter a valid email.';
    }
    return '';
};

export const validatePassword = (password: string) => {
    if (!password.trim()) {
        return 'Password is required.';
    } else if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
    }
    return '';
};

export const validateName = (name: string) => {
    if (!name.trim()) {
        return 'Name is required.';
    } else if (name.startsWith(' ')) {
        return 'Name cannot start with a space.';
    } else if (name.length < 2) {
        return 'Name must be at least 2 characters long.';
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name can only contain letters and spaces.';
    }
    return '';
};

export const validateForm = (
    formData: { fullName: string; email: string; password: string },
    isRegistering: boolean,
    setErrors: React.Dispatch<React.SetStateAction<{
        fullName: string;
        email: string;
        password: string;
        userType: string,
        general: string
    }>>
): boolean => {
    const errors: { fullName: string; email: string; password: string; userType: string, general: string } = {
        fullName: "",
        email: "",
        password: "",
        userType: "",
        general: "",
    };

    let hasErrors = false;

    // Validate Full Name (only for registration)
    if (isRegistering) {
        const nameError = validateName(formData.fullName);
        if (nameError) {
            errors.fullName = nameError;
            hasErrors = true;
        }
    }

    // Validate Email
    const emailError = validateEmail(formData.email);
    if (emailError) {
        errors.email = emailError;
        hasErrors = true;
    }

    // Validate Password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
        errors.password = passwordError;
        hasErrors = true;
    }

    // Update errors state
    setErrors(errors);

    // Return whether there are errors
    return hasErrors;
};
