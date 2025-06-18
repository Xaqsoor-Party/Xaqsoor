package com.xaqsoor.dto.Dashboard;

import java.util.List;

public record UserGrowthDto (
        List<TimelineEntry> timeline,
        double percentageChange,
        String comparisonPeriod,
        String lastUpdated
) {
}
