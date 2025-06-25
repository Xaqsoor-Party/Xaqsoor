import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";
import {FounderFormData} from "@/types/FounderFormData";

const BASE_URL = "/api/v1/founders";

const useFounderApi = () => {
  const axiosPrivate = useAxiosPrivate();

  const submitFounderProfile = async (
    data: FounderFormData
  ): Promise<ApiResponse<null>> => {
    const response = await axiosPrivate.post<ApiResponse<null>>(
      `${BASE_URL}/submit`,
      data,
      { withCredentials: true }
    );
    return response.data;
  };

  return {
    submitFounderProfile,
  };
};

export default useFounderApi;
