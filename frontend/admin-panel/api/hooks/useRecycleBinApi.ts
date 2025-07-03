import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";
import { RecycleItemsResponse } from "@/types/recycleBin";

const BASE_URL = "/api/v1/recycle-bin";

const useRecycleBinApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getDeletedItems = async <T = unknown>(
        entityType: string,
        page = 0,
        size = 20
    ): Promise<ApiResponse<{ [key: string]: RecycleItemsResponse<T> }>> => {
        const response = await axiosPrivate.get<ApiResponse<{ [key: string]: RecycleItemsResponse<T> }>>(
            `${BASE_URL}/${entityType}`,
            {
                params: { page, size },
            }
        );
        return response.data;
    };

    const restoreItem = async (
        entityType: string,
        id: number
    ): Promise<ApiResponse<null>> => {
        const response = await axiosPrivate.post<ApiResponse<null>>(
            `${BASE_URL}/${entityType}/${id}/restore`
        );
        return response.data;
    };

    const permanentlyDeleteItem = async (
        entityType: string,
        id: number
    ): Promise<ApiResponse<null>> => {
        const response = await axiosPrivate.delete<ApiResponse<null>>(
            `${BASE_URL}/${entityType}/${id}`
        );
        return response.data;
    };

    return {
        getDeletedItems,
        restoreItem,
        permanentlyDeleteItem,
    };
};

export default useRecycleBinApi;
