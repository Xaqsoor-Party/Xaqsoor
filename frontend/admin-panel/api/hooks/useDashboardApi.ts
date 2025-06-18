import useAxiosPrivate from "@/api/hooks/useAxiosPrivate";
import { ApiResponse } from "@/types/auth";
import {
    DashboardSummaryDto,
    RecentActivityListDto,
    SystemHealthDto,
    TimeRangeRequest,
    UserGrowthDto
} from "@/types/dashboard";

const BASE_URL = '/api/v1/admin/dashboard';

const useDashboardApi = () => {
    const axiosPrivate = useAxiosPrivate();

    // Fetch the system health metrics
    const getSystemHealthMetrics = async (forceRefresh: boolean) => {
        const response = await axiosPrivate.get<ApiResponse<{ systemHealth: SystemHealthDto }>>(
            `${BASE_URL}/system-health`,
            { params: { forceRefresh } }
        );
        return response.data;
    };

    // Fetch the user growth data
    const getUserGrowth = async (timeRangeRequest: TimeRangeRequest, forceRefresh: boolean) => {
        const response = await axiosPrivate.post<ApiResponse<{ userGrowth: UserGrowthDto }>>(
            `${BASE_URL}/user-growth`,
            timeRangeRequest,
            { params: { forceRefresh } }
        );
        return response.data;
    };

    // Fetch the dashboard summary
    const getDashboardSummary = async (forceRefresh: boolean) => {
        const response = await axiosPrivate.get<ApiResponse<{ dashboardSummary: DashboardSummaryDto }>>(
            `${BASE_URL}/summary`,
            { params: { forceRefresh } }
        );
        return response.data;
    };

    const getRecentActivities = async (
        page: number = 0,
        size: number = 10,
        orderBy: 'asc' | 'desc' = 'desc'
    ) => {
        const response = await axiosPrivate.get<ApiResponse<{ recentActivities: RecentActivityListDto }>>(
            `${BASE_URL}/recent-activities`,
            {
                params: {
                    page,
                    size,
                    orderBy
                }
            }
        );
        return response.data;
    };

    // Return the methods as part of the hook
    return {
        getSystemHealthMetrics,
        getUserGrowth,
        getDashboardSummary,
        getRecentActivities,
    };
};

export default useDashboardApi;
