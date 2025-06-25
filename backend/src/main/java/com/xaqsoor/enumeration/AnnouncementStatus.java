package com.xaqsoor.enumeration;

import com.xaqsoor.exception.ApiException;
import lombok.Getter;

@Getter
public enum AnnouncementStatus {
    ACTIVE("Active"),
    ARCHIVED("Archived"),
    PENDING("Pending");

    private final String value;

    AnnouncementStatus(String value) {
        this.value = value;
    }

    public static AnnouncementStatus fromString(String value) {
        if (value == null) {
            throw new ApiException("Value cannot be null");
        }

        try {
            return AnnouncementStatus.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid Announcement Status: " + value);
        }
    }

}
