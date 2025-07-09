import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
// @ts-ignore
import { saveAs } from "file-saver";
import {ApiResponse} from "@/types/auth";
import {EmailDashboardDto} from "@/types/dashboard";

const BASE_URL = "/api/v1/communications";

const useUserCommunicationApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const downloadPhoneAndOperatorCsv = async (params: {
        status?: string;
        gender?: string;
        operator?: string;
        membershipLevel?: string;
    }): Promise<void> => {
        const queryParams = new URLSearchParams();

        if (params.status) queryParams.append("status", params.status);
        if (params.gender) queryParams.append("gender", params.gender);
        if (params.operator) queryParams.append("operator", params.operator);
        if (params.membershipLevel) queryParams.append("membershipLevel", params.membershipLevel);

        const url = `${BASE_URL}/phones/export?${queryParams.toString()}`;

        const response = await axiosPrivate.get<Blob>(url, {
            responseType: "blob",
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
        const filename = `phone_operators_${timestamp}.xlsx`;
        saveAs(new Blob([response.data]), filename);
    };

    const getPhoneOperatorUserCount = async (): Promise<Record<string, number>> => {
        const url = `${BASE_URL}/operators/count`;

        const response = await axiosPrivate.get<{
            data: { operatorCounts: Record<string, number> };
        }>(url);

        return response.data.data.operatorCounts;
    };

    const getFilteredPhoneCount = async (params: {
        status?: string;
        gender?: string;
        operator?: string;
        membershipLevel?: string;
    }): Promise<number> => {
        const queryParams = new URLSearchParams();

        if (params.status) queryParams.append("status", params.status);
        if (params.gender) queryParams.append("gender", params.gender);
        if (params.operator) queryParams.append("operator", params.operator);
        if (params.membershipLevel) queryParams.append("membershipLevel", params.membershipLevel);

        const url = `${BASE_URL}/phones/count?${queryParams.toString()}`;

        const response = await axiosPrivate.get<{
            data: { count: number };
        }>(url);

        return response.data.data.count;
    };

    const getEmailCampaignDashboardData = async (): Promise<ApiResponse<{ emailDashboard: EmailDashboardDto }>> => {
        const response = await axiosPrivate.get<ApiResponse<{ emailDashboard: EmailDashboardDto }>>(
            `${BASE_URL}/emails/dashboard`
        );
        return response.data;
    }

    return {
        downloadPhoneAndOperatorCsv,
        getPhoneOperatorUserCount,
        getFilteredPhoneCount,
        getEmailCampaignDashboardData
    };
};

export default useUserCommunicationApi;
