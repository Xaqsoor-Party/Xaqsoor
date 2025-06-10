import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";
import { AcademicRecordDto, AcademicRecordRequest, AcademicRecordListDto } from "@/types/academic";

const BASE_URL = "/api/v1/user";

const useAcademicRecordApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const getAcademicRecords = async (
        userId: number
    ): Promise<ApiResponse<{ academicRecords: AcademicRecordListDto }>> => {
        const response = await axiosPrivate.get<ApiResponse<{ academicRecords: AcademicRecordListDto }>>(
            `${BASE_URL}/${userId}/academic-records`
        );
        return response.data;
    };

    const saveAcademicRecord = async (
        userId: number,
        data: AcademicRecordRequest
    ): Promise<ApiResponse<{ academicRecord: AcademicRecordDto }>> => {
        const response = await axiosPrivate.post<ApiResponse<{ academicRecord: AcademicRecordDto }>>(
            `${BASE_URL}/${userId}/academic-records`,
            data
        );
        return response.data;
    };

    return {
        getAcademicRecords,
        saveAcademicRecord,
    };
};

export default useAcademicRecordApi;
