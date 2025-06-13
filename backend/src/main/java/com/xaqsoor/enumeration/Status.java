package com.xaqsoor.enumeration;

import com.xaqsoor.exception.ApiException;

public enum Status {
    ACTIVE,
    INACTIVE,
    SUSPENDED,
    LAPSED,
    PENDING;

    public static Status fromString(String value) {
        if (value == null) {
            throw new ApiException("Status value cannot be null");
        }
        try {
            return Status.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid status value: " + value);
        }
    }
}
