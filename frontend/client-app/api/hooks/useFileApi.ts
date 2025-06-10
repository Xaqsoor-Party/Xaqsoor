import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import {ApiResponse} from "@/types/auth";

const BASE_URL = "/api/v1/user";

const useFileApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const uploadFile = async (
        userId: string,
        file: File,
        fileType: string
    ): Promise<ApiResponse<{ fileKey: string }>> => {
        const formData = new FormData();
        formData.append("userId", userId);
        formData.append("file", file);
        formData.append("fileType", fileType);

        const response = await axiosPrivate.post<ApiResponse<{ fileKey: string }>>(
            `${BASE_URL}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        console.log(response.data);
        return response.data;
    };

    const deleteFile = async (
        userId: string,
        key: string
    ): Promise<ApiResponse<null>> => {
        const response = await axiosPrivate.delete<ApiResponse<null>>(`${BASE_URL}/delete`, {
            params: { userId, key },
        });

        return response.data;
    };

    return {
        uploadFile,
        deleteFile,
    };
};

export default useFileApi;
