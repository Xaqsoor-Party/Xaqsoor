import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import {SessionDto } from "@/types/sessions";
import {ApiResponse} from "@/types/auth";

const BASE_URL = "/api/v1/sessions";

const useSessionsApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getActiveSessions = async (userId: number): Promise<ApiResponse<{ activeSessions: SessionDto[] }>> => {
        const response = await axiosPrivate.get<ApiResponse<{ activeSessions: SessionDto[] }>>(
            `${BASE_URL}/${userId}`
        );
        return response.data;
    };

    const revokeOtherSessions = async (userId: number): Promise<ApiResponse<{ revokedSessionsCount: number }>> => {
        const response = await axiosPrivate.post<ApiResponse<{ revokedSessionsCount: number }>>(
            `${BASE_URL}/${userId}/revoke-others`,
            {},
            { withCredentials: true }
        );
        return response.data;
    };

    return {
        getActiveSessions,
        revokeOtherSessions,
    };
};

export default useSessionsApi;
