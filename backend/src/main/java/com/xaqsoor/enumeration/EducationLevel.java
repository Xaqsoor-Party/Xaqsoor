package com.xaqsoor.enumeration;

import com.xaqsoor.exception.ApiException;

public enum EducationLevel {
    HIGH_SCHOOL,
    DIPLOMA,
    BACHELORS,
    MASTERS,
    PHD,
    OTHER;

    public static EducationLevel fromString(String value) {
        if (value == null) {
            throw new ApiException("Value cannot be null");
        }

        try {
            return EducationLevel.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new ApiException("Invalid education level: " + value);
        }
    }
}
