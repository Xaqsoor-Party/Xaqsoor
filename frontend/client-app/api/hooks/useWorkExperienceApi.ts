import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";
import { WorkExperienceDto, WorkExperienceRequest, WorkExperienceListDto } from "@/types/work";

const BASE_URL = "/api/v1/user";

const useWorkExperienceApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getWorkExperiences = async (
        userId: number
    ): Promise<ApiResponse<{ workExperiences: WorkExperienceListDto }>> => {
        const response = await axiosPrivate.get<ApiResponse<{ workExperiences: WorkExperienceListDto }>>(
            `${BASE_URL}/${userId}/work-experiences`
        );
        return response.data;
    };

    const saveWorkExperience = async (
        userId: number,
        data: WorkExperienceRequest
    ): Promise<ApiResponse<{ workExperience: WorkExperienceDto }>> => {
        const response = await axiosPrivate.post<ApiResponse<{ workExperience: WorkExperienceDto }>>(
            `${BASE_URL}/${userId}/work-experiences`,
            data
        );
        return response.data;
    };

    return {
        getWorkExperiences,
        saveWorkExperience,
    };
};

export default useWorkExperienceApi;
