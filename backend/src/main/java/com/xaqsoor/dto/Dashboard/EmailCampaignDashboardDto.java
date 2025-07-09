package com.xaqsoor.dto.Dashboard;

import java.util.Map;

public record EmailCampaignDashboardDto(
        long verifiedEmails,
        long unverifiedEmails,
        long deletedEmails,
        Map<String, Long> domainCounts
) {}

