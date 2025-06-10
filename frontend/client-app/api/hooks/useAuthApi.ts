import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import {
    ApiResponse,
    AuthResponseData,
    MfaSetupResponseData,
    MfaVerificationRequest,
    RefreshTokenResponseData,
    SetPasswordRequest,
    UserCreateRequest,
    UserLoginRequest,
    UserVerificationResponse,
} from "@/types/auth";

import axios from "@/api/axios";

const BASE_URL = '/api/v1/auth';

const useAuthApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const registerUser = async (userData: UserCreateRequest): Promise<string> => {
        const response = await axios.post<ApiResponse<{}>>(
            `${BASE_URL}/register`,
            userData
        );
        return response.data.message;
    };

    const loginUser = async (loginData: UserLoginRequest): Promise<ApiResponse<AuthResponseData>> => {
        const response = await axios.post<ApiResponse<AuthResponseData>>(
            `${BASE_URL}/login`,
            loginData,
            {withCredentials: true}
        );
        return response.data;
    };

    const verifyMfa = async (mfaData: MfaVerificationRequest): Promise<ApiResponse<AuthResponseData>> => {
        const response = await axios.post<ApiResponse<AuthResponseData>>(`${BASE_URL}/verify-mfa`, mfaData,
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${mfaData.mfaToken}`,
                },
            },
        );
        return response.data;
    };

    const setupMfa = async (userId: string): Promise<ApiResponse<MfaSetupResponseData>> => {
        const response = await axiosPrivate.post<ApiResponse<MfaSetupResponseData>>(
            `${BASE_URL}/mfa/setup`,
            {},
            {params: {userId}}
        );
        return response.data;
    };

    const refreshToken = async (): Promise<ApiResponse<RefreshTokenResponseData>> => {
        const response = await axios.post<ApiResponse<RefreshTokenResponseData>>(
            `${BASE_URL}/refresh-token`,
            {},
            {
                withCredentials: true,
            }
        );
        return response.data;
    };

    const logout = async (): Promise<ApiResponse<{}>> => {
        const response = await axiosPrivate.post<ApiResponse<{}>>(
            `${BASE_URL}/logout`,
            {withCredentials: true}
        );
        return response.data;
    };

    const verifyConfirmationKey = async (key: string): Promise<ApiResponse<{ user: UserVerificationResponse }>> => {
        const response = await axios.get<ApiResponse<{ user: UserVerificationResponse }>>(
            `${BASE_URL}/verify`,
            {params: {key}}
        );
        return response.data;
    };

    const resetPassword = async (requestData: SetPasswordRequest): Promise<string> => {
        const response = await axios.post<ApiResponse<{}>>(
            `${BASE_URL}/reset-password`,
            requestData
        );
        return response.data.message;
    };

    const requestPasswordReset = async (email: string): Promise<string> => {
        const response = await axiosPrivate.post<ApiResponse<{}>>(
            `${BASE_URL}/request-password-reset`,
            {},
            {params: {email}}
        );
        return response.data.message;
    };

    return {
        registerUser,
        loginUser,
        verifyMfa,
        setupMfa,
        logout,
        verifyConfirmationKey,
        resetPassword,
        requestPasswordReset,
        refreshToken
    };
};

export default useAuthApi;