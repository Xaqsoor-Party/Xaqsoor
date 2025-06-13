import React, {useState} from "react";
import {useRouter} from "next/router";

import {AxiosError} from "axios";
import {useAuthentication} from "@/auth/AuthProvider";
import {UserCreateRequest, UserLoginRequest} from "@/types/auth";
import useAuthApi from "@/api/hooks/useAuthApi";

interface UseAuthProps {
    isRegistering: boolean;
}

export const useAuth = ({isRegistering}: UseAuthProps) => {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        gender: ""
    });
    const [errors, setErrors] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        phone: "",
        email: "",
        password: "",
        gender: "",
        general: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({title: "", message: "", buttonText: ""});
    const {setAuthToken} = useAuthentication();
    const {registerUser, loginUser} = useAuthApi();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData((prevState) => ({...prevState, [name]: value}));
        setErrors((prevState) => ({...prevState, [name]: "", general: ""}));
    };

    const handleTogglePassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        if (isRegistering) {
            await registerUserHandler();
        } else {
            await loginUserHandler();
        }
        setIsLoading(false);
    };

    const loginUserHandler = async () => {
        try {
            const credentials: UserLoginRequest = {
                email: formData.email,
                password: formData.password,
                adminLogin: true
            };

            const response = await loginUser(credentials);

            let redirectTo: string = typeof router.query.redirect === 'string'
                ? router.query.redirect
                : '/';

            if (response.data?.loginStatus === "SUCCESS") {
                const {accessToken, userDTO} = response.data;
                setAuthToken(accessToken, userDTO);
            } else if (response.data?.loginStatus === "UPDATE_PASSWORD") {
                const resetToken = response.data.securityToken;
                redirectTo = `/auth/reset-password/${resetToken}`
            } else if (response.data?.loginStatus === "MFA_REQUIRED") {
                const mfaToken = response.data.securityToken;
                redirectTo = `/auth/mfa/${mfaToken}`
            }
            window.location.href = redirectTo;
        } catch (error) {
            handleError(error, "Login failed");
        }
    };

    const registerUserHandler = async () => {
        try {
            const userData: UserCreateRequest = {
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                gender: formData.gender,
            };

            const message = await registerUser(userData);

            setModalContent({
                title: "Account Created",
                message: message || "Please check your email for verification.",
                buttonText: "OK",
            });
            setShowModal(true);

        } catch (error) {
            handleError(error, "Registration failed");
        }
    };

    const handleError = (error: unknown, defaultMessage: string) => {
        if (error instanceof AxiosError) {
            if (!isRegistering) {
                if (error.response?.data.status == "FORBIDDEN") {
                    if (error.response.data.message?.includes("Your account is not yet verified.")) {
                        setModalContent({
                            title: "Account Verification",
                            message: error.response.data.message || "Your account is not yet verified. Please check your email to verify your account.",
                            buttonText: "Resend"
                        })
                        setShowModal(true);
                        return;
                    }
                }
            }
            setErrors((prevState) => ({
                ...prevState,
                general: error.response?.data?.message || defaultMessage,
            }));
        } else {
            setErrors((prevState) => ({...prevState, general: "An unexpected error occurred."}));
        }
    };

    const handleModalConfirm = () => {
        setShowModal(false);
        if (isRegistering) {
            router.push("/auth/login").then();
        }
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    return {
        formData,
        errors,
        isLoading,
        showPassword,
        showModal,
        modalContent,
        handleChange,
        handleTogglePassword,
        handleSubmit,
        handleModalConfirm,
        handleModalCancel,
    };
};
