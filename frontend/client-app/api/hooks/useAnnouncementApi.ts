import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";
import {
    AnnouncementDto,
    AnnouncementListDto
} from "@/types/announcement";

const BASE_URL = "/api/v1/announcements";

const useAnnouncementApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getAnnouncements = async (
        pageNumber = 1,
        pageSize = 10,
        keyword = "",
        status?: string
    ): Promise<ApiResponse<{ announcements: AnnouncementListDto }>> => {
        const params = new URLSearchParams({
            pageNumber: pageNumber.toString(),
            pageSize: pageSize.toString(),
            keyword: keyword || "",
        });

        if (status) {
            params.append("status", status);
        }

        const response = await axiosPrivate.get<
            ApiResponse<{ announcements: AnnouncementListDto }>
        >(`${BASE_URL}?${params.toString()}`);

        return response.data;
    };

    const getAnnouncementById = async (
        id: number
    ): Promise<ApiResponse<{ announcement: AnnouncementDto }>> => {
        const response = await axiosPrivate.get<
            ApiResponse<{ announcement: AnnouncementDto }>
        >(`${BASE_URL}/${id}`);
        return response.data;
    };


    return {
        getAnnouncements,
        getAnnouncementById,
    };
};

export default useAnnouncementApi;
