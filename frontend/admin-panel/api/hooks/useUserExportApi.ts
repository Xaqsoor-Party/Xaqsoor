import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
// @ts-ignore
import { saveAs } from "file-saver";

const BASE_URL = "/api/v1/users/export";

const useUserExportApi = () => {
    const axiosPrivate = useAxiosPrivate();

    const downloadFile = async (
        format: "excel" | "pdf",
        params: {
            searchTerm?: string;
            statusFilter?: string;
            roleFilter?: string;
            genderFilter?: string;
            membershipLevelFilter?: string;
            colorCodeRows?: boolean;
        }
    ): Promise<void> => {
        const queryParams = new URLSearchParams();

        if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params.statusFilter) queryParams.append("statusFilter", params.statusFilter);
        if (params.roleFilter) queryParams.append("roleFilter", params.roleFilter);
        if (params.genderFilter) queryParams.append("genderFilter", params.genderFilter);
        if (params.membershipLevelFilter)
            queryParams.append("membershipLevelFilter", params.membershipLevelFilter);
        if (format === "excel" && params.colorCodeRows !== undefined)
            queryParams.append("colorCodeRows", String(params.colorCodeRows));

        const url = `${BASE_URL}/${format}?${queryParams.toString()}`;

        const response = await axiosPrivate.get<Blob>(url, {
            responseType: "blob"
        });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "_");
        const filename = `users_${timestamp}.${format === "excel" ? "xlsx" : "pdf"}`;

        saveAs(new Blob([response.data]), filename);
    };

    const getFilteredUserCount = async (params: {
        searchTerm?: string;
        statusFilter?: string;
        roleFilter?: string;
        genderFilter?: string;
        membershipLevelFilter?: string;
    }): Promise<number> => {
        const queryParams = new URLSearchParams();

        if (params.searchTerm) queryParams.append("searchTerm", params.searchTerm);
        if (params.statusFilter) queryParams.append("statusFilter", params.statusFilter);
        if (params.roleFilter) queryParams.append("roleFilter", params.roleFilter);
        if (params.genderFilter) queryParams.append("genderFilter", params.genderFilter);
        if (params.membershipLevelFilter)
            queryParams.append("membershipLevelFilter", params.membershipLevelFilter);

        const url = `${BASE_URL}/count?${queryParams.toString()}`;

        const response = await axiosPrivate.get<{ data: { totalUsers: number } }>(url);
        return response.data.data.totalUsers;
    };

    return {
        downloadExcel: (params: Parameters<typeof downloadFile>[1]) =>
            downloadFile("excel", params),
        downloadPdf: (params: Parameters<typeof downloadFile>[1]) =>
            downloadFile("pdf", params),
        getFilteredUserCount
    };
};

export default useUserExportApi;
