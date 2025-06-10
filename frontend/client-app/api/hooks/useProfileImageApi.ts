import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";

const BASE_URL = '/api/v1/user';

const useProfileImageApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const uploadProfileImage = async (userId: string, profileImage: File): Promise<string> => {
        const formData = new FormData();
        formData.append('profileImage', profileImage);

        const response = await axiosPrivate.post(
            `${BASE_URL}/${userId}/upload-profile-image`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data.data.profileImageUrl;
    };

    const deleteProfileImage = async (userId: string): Promise<string> => {
        const response = await axiosPrivate.delete(
            `${BASE_URL}/${userId}/delete-profile-image`
        );
        return response.data.message;
    };

    return {
        uploadProfileImage,
        deleteProfileImage,
    };
};

export default useProfileImageApi;
