package com.xaqsoor.projections;

import java.time.LocalDateTime;

public interface RecentActivityProjection {
    Long getUserId();

    String getFirstName();

    String getProfileImageKey();

    String getDescription();

    LocalDateTime getTimestamp();
}