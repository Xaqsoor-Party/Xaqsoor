package com.xaqsoor.enumeration;

import com.xaqsoor.exception.ApiException;
import lombok.Getter;

@Getter
public enum MembershipLevel {
    NEW_MEMBER("New Member"),
    STUDENT("Student"),
    REGULAR("Regular"),
    FOUNDER("Founder"),
    LIFETIME("Lifetime");

    private final String value;

    MembershipLevel(String value) {
        this.value = value;
    }

    public static MembershipLevel fromString(String value) {
        if (value == null) {
            throw new ApiException("MembershipLevel value cannot be null");
        }
        try {
            return MembershipLevel.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid membership level: " + value);
        }
    }
}
