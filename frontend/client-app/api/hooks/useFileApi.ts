import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";

const BASE_URL = "/api/v1/files";

const useFileStorageApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const uploadFile = async (
        file: File,
        folder: string
    ): Promise<{ key: string; url: string }> => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await axiosPrivate.post(`${BASE_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.data;
    };


    const deleteFile = async (fileKey: string): Promise<string> => {
        const response = await axiosPrivate.delete(`${BASE_URL}/delete`, {
            params: { fileKey },
        });
        return response.data.message;
    };

    return {
        uploadFile,
        deleteFile,
    };
};

export default useFileStorageApi;
