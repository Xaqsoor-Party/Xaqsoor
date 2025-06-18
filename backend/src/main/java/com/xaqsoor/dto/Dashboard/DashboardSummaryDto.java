package com.xaqsoor.dto.Dashboard;

import java.util.Map;

public record DashboardSummaryDto (
        long totalMembers,
        long maleCount,
        long femaleCount,
        double profileCompletionRate,
        String lastUpdated,

        Map<String, Long> membershipLevelDistribution,
        Map<String, Long> userStatusDistribution,

        long newMembersThisMonth,
        long lockedAccounts,
        long mfaEnabledUsers,
        long unverifiedEmails,
        long loginRestrictedUsers,

        Map<String, Long> roleDistribution
) {
}
