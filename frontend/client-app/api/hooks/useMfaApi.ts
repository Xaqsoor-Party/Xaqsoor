import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import {ApiResponse, InitialMfaVerificationRequest, MfaSetupDetails} from "@/types/auth";

const BASE_URL = '/api/v1/auth';

const useMfaApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const setupMfa = async (
        userId: string
    ): Promise<ApiResponse<{mfaSetupDetails: MfaSetupDetails}>> => {
        const response = await axiosPrivate.post<ApiResponse<{mfaSetupDetails: MfaSetupDetails}>>(
            `${BASE_URL}/mfa/setup`,
            null,
            { params: { userId } }
        );
        return response.data;
    };

    const disableMfa = async (
        userId: string
    ): Promise<ApiResponse<null>> => {
        const response = await axiosPrivate.delete<ApiResponse<null>>(
            `${BASE_URL}/mfa/disable`,
            { params: { userId } }
        );
        return response.data;
    };

    const verifyInitialMfa = async (userId: string, mfaData: InitialMfaVerificationRequest): Promise<void> => {
        await axiosPrivate.post(
            `${BASE_URL}/mfa/verify-initial`,
            mfaData,
            { params: { userId } }
        );
    };


    return {
        setupMfa,
        verifyInitialMfa,
        disableMfa,
    };
};

export default useMfaApi;
