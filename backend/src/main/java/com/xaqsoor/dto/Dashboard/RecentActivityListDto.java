package com.xaqsoor.dto.Dashboard;

import java.util.List;

public record RecentActivityListDto(
        List<RecentActivityDto> activities,
        int pageSize,
        int pageNumber,
        long totalItems
) {
}
