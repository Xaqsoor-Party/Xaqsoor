import axios from '../axios';
import {useAuthentication} from "@/auth/AuthProvider";
import {ApiResponse, RefreshTokenResponseData} from "@/types/auth";

const useRefreshToken = () => {
    const {setAuthToken} = useAuthentication();
    return async () => {
        try {

            const response = await axios.post<ApiResponse<RefreshTokenResponseData>>(
                '/api/v1/auth/refresh-token',
                {},
                {
                    withCredentials: true,
                }
            );
            const accessToken = response.data?.data?.accessToken;
            const user = response.data?.data?.userDTO;
            if (accessToken !== undefined && user !== undefined) {
                setAuthToken(accessToken, user);
            }
            return accessToken || null;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return null;
        }
    };
};

export default useRefreshToken;