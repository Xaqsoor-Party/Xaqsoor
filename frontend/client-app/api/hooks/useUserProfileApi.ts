import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";
import {
    UserProfileResponse,
    UserProfileUpdateRequest
} from "@/types/user";

const BASE_URL = "/api/v1/users";

const useUserProfileApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const updateUserProfile = async (
        userId: number,
        updateRequest: UserProfileUpdateRequest
    ): Promise<ApiResponse<null>> => {
        const response = await axiosPrivate.put<ApiResponse<null>>(
            `${BASE_URL}/${userId}/profile`,
            updateRequest
        );
        return response.data;
    };

    const getUserProfile = async (
        userId: number
    ): Promise<ApiResponse<{ profile: UserProfileResponse }>> => {
        const response = await axiosPrivate.get<ApiResponse<{ profile: UserProfileResponse }>>(
            `${BASE_URL}/${userId}/profile`
        );
        return response.data;
    };

    return {
        updateUserProfile,
        getUserProfile
    };
};

export default useUserProfileApi;
