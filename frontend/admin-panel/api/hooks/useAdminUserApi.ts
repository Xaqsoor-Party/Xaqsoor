import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";

const BASE_URL = "/api/v1/admin/users";

const useAdminUserApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const resetMfa = async (userId: string): Promise<ApiResponse<null>> => {
        const res = await axiosPrivate.post(`${BASE_URL}/${userId}/reset-mfa`);
        return res.data;
    };

    const softDeleteUser = async (userId: number): Promise<ApiResponse<null>> => {
        const res = await axiosPrivate.delete(`${BASE_URL}/${userId}/soft-delete`);
        return res.data;
    };

    const permanentlyDeleteUser = async (userId: number): Promise<ApiResponse<null>> => {
        const res = await axiosPrivate.delete(`${BASE_URL}/${userId}/permanent-delete`);
        return res.data;
    };

    const setUserEnabled = async (userId: number, enabled: boolean): Promise<ApiResponse<null>> => {
        const res = await axiosPrivate.patch(`${BASE_URL}/${userId}/enabled`, null, {
            params: { enabled },
        });
        return res.data;
    };

    const setAccountNonLocked = async (userId: number, nonLocked: boolean): Promise<ApiResponse<null>> => {
        const res = await axiosPrivate.patch(`${BASE_URL}/${userId}/lock`, null, {
            params: { nonLocked },
        });
        return res.data;
    };

    const updateUserRole = async (userId: number, role: string): Promise<ApiResponse<null>> => {
        const res = await axiosPrivate.patch(`${BASE_URL}/${userId}/role`, null, {
            params: { role },
        });
        return res.data;
    };

    const updateMembershipLevel = async (userId: number, membershipLevel: string): Promise<ApiResponse<null>> => {
        const res = await axiosPrivate.patch(`${BASE_URL}/${userId}/membership-level`, null, {
            params: { membershipLevel },
        });
        return res.data;
    };

    const updateUserStatus = async (userId: number, status: string): Promise<ApiResponse<null>> => {
        const res = await axiosPrivate.patch(`${BASE_URL}/${userId}/status`, null, {
            params: { status },
        });
        return res.data;
    };

    return {
        resetMfa,
        softDeleteUser,
        permanentlyDeleteUser,
        setUserEnabled,
        setAccountNonLocked,
        updateUserRole,
        updateMembershipLevel,
        updateUserStatus,
    };
};

export default useAdminUserApi;
