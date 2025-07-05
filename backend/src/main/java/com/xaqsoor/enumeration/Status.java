package com.xaqsoor.enumeration;

import com.xaqsoor.exception.ApiException;
import lombok.Getter;

@Getter
public enum Status {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    SUSPENDED("Suspended"),
    PENDING("Pending");

    private final String value;

    Status(String value) {
        this.value = value;
    }


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
