package com.xaqsoor.dto.Dashboard;

public record RecentActivityDto(
        long userId,
        String firstName,
        String profileImageKey,
        String description,
        String timestamp
) {}
