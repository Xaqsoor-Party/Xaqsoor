type authForms = {
    titleRegister: string;
    titleLogin: string;
    subtitleRegister: string;
    subtitleLogin: string;
    firstName: string;
    middleName: string;
    lastName: string;
    phone: string;
    gender: string;
    genderPlaceholder:string;
    genderOptions: { value: string; label: string }[];
    email: string;
    password: string;
    showPasswordText: string;
    resetPassword: string;
    register: string;
    login: string;
    signupLinkRegister: string;
    signupLinkLogin: string;
    signupTextRegister: string;
    signupTextLogin: string;

    country: string;
    state: string;
    city: string;
    district: string
}
type setPassword = {
    title: string;
    newPassword: string;
    confirmPassword: string;
    showPasswordText: string;
    resetPasswordText: string;
    backToLogin: string;
    greetingLine1: string;
    greetingLine2: string;
}
type passwordResetConfirmation = {
    title: string;
    message: (email: string) => string;
    backLinkText: string
}
type resetPasswordRequest = {
    title: string,
    buttonText: string,
    cancelText: string,
}

type mfaTranslations = {
    title: string;
    descriptionStart: string;
    mfaLinkText: string;
    instructions: string;
    inputLabel: string;
    inputPlaceholder: string;
    verifyButton: {
        default: string;
        submitting: string;
    };
    errorEmptyCode: string;
};

export type AuthPages = {
    AuthForms:authForms;
    SetPassword:setPassword;
    PasswordResetConfirmation:passwordResetConfirmation;
    ResetPasswordRequest:resetPasswordRequest;
    MfaTranslations: mfaTranslations;
}

export const authPages: AuthPages = {
    AuthForms: {
        titleRegister: "Create Your Account",
        titleLogin: "Welcome Back!",
        subtitleRegister: "Please fill in the details to create an account.",
        subtitleLogin: "Please sign in to continue.",
        firstName: "First Name",
        middleName: "Middle Name",
        lastName: "Last Name",
        phone: "Phone Number",
        gender: "Gender",
        genderPlaceholder: "-- Select Gender --",
        genderOptions: [
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
        ],
        email: "Email",
        password: "Password",
        showPasswordText: "Show Password",
        resetPassword: "Reset password",
        register: "Register",
        login: "Login",
        signupLinkRegister: "Login",
        signupLinkLogin: "Create one",
        signupTextRegister: "Already have an account?",
        signupTextLogin: "Don't have an account?",

        "country": "Country",
        "state": "State",
        "city": "City",
        "district": "District"
    },
    SetPassword: {
        title: "Choose a new Password",
        newPassword: "New Password",
        confirmPassword: "Confirm Password",
        showPasswordText: "Show Password",
        resetPasswordText: "Reset Password",
        backToLogin: "Back to Log in",
        greetingLine1: "Hello,",
        greetingLine2: "Please enter your new password below.",
    },
    PasswordResetConfirmation: {
        title: "Password Reset Requested",
        message: (email: string) => `If an account exists for ${email}, you will get an email with instructions on resetting your password. If it doesn't arrive, be sure to check your spam folder.`,
        backLinkText: "Back to Log in",
    },
    ResetPasswordRequest: {
        title: "Enter your email to reset password",
        buttonText: "Reset Password",
        cancelText: "Cancel",
    },
    MfaTranslations:{
        title: "Additional verification required",
        descriptionStart: "Your account is protected with multi-factor authentication",
        mfaLinkText: "(MFA)",
        instructions: "To finish signing in, enter the code from your MFA device below.",
        inputLabel: "MFA Code",
        inputPlaceholder: "123456",
        verifyButton: {
            default: "Verify",
            submitting: "Verifying..."
        },
        errorEmptyCode: "Please enter the MFA code."
    }
}