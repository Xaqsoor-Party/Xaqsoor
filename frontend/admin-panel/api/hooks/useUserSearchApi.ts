import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";
import { UserCardListDto, UserSearchParams } from "@/types/user";

const BASE_URL = "/api/v1/users";

const useUserSearchApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const searchUserCards = async (
        params: UserSearchParams
    ): Promise<ApiResponse<{ users: UserCardListDto }>> => {
        const queryParams = new URLSearchParams();

        if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params.statusFilter) queryParams.append("statusFilter", params.statusFilter);
        if (params.roleFilter) queryParams.append("roleFilter", params.roleFilter);
        if (params.genderFilter) queryParams.append("genderFilter", params.genderFilter);
        if (params.membershipLevelFilter)
            queryParams.append("membershipLevelFilter", params.membershipLevelFilter);
        if (params.orderBy) queryParams.append("orderBy", params.orderBy);
        if (params.pageNumber !== undefined) queryParams.append("pageNumber", params.pageNumber.toString());
        if (params.pageSize !== undefined) queryParams.append("pageSize", params.pageSize.toString());

        const url = `${BASE_URL}/search?${queryParams.toString()}`;

        const response = await axiosPrivate.get<ApiResponse<{ users: UserCardListDto }>>(url);
        return response.data;
    };

    return { searchUserCards };
};

export default useUserSearchApi;
