import {ApiResponse} from "@/types/auth";
import {UserCardListDto} from "@/types/user";
import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";

const BASE_URL = "/api/v1/founders";
const useFounderApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getAllFounders = async (
        params?: {
            searchTerm?: string;
            genderFilter?: string;
            statusFilter?: string;
            orderBy?: string;
            pageNumber?: number;
            pageSize?: number;
        }
    ): Promise<ApiResponse<{ founders: UserCardListDto }>> => {
        const response = await axiosPrivate.get<
            ApiResponse<{ founders: UserCardListDto }>
        >(BASE_URL + "/all", {
            params,
            withCredentials: true,
        });
        return response.data;
    };

    return {
        getAllFounders,
    };
}
export default useFounderApi;