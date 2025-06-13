import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";

const BASE_URL = '/api/v1/auth';

const useMfaApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const setupMfa = async (
        userId: string
    ): Promise<ApiResponse<{ mfaQRCodeImageUri: string }>> => {
        const response = await axiosPrivate.post<ApiResponse<{ mfaQRCodeImageUri: string }>>(
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

    return {
        setupMfa,
        disableMfa,
    };
};

export default useMfaApi;
