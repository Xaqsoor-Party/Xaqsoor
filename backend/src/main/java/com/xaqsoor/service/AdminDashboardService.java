package com.xaqsoor.service;

import com.xaqsoor.dto.Dashboard.*;

public interface AdminDashboardService {
    DashboardSummaryDto getDashboardSummary(boolean forceRefresh);
    UserGrowthDto getUserGrowth(TimeRangeRequest request,boolean forceRefresh);
    RecentActivityListDto getRecentActivities(int page, int size,String orderBy);
    SystemHealthDto getSystemHealthMetrics(boolean forceRefresh);
}
