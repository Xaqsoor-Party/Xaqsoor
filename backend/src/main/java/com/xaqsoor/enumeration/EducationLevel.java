package com.xaqsoor.enumeration;

import com.xaqsoor.exception.ApiException;
import lombok.Getter;

@Getter
public enum EducationLevel {
    HIGH_SCHOOL("High school"),
    DIPLOMA("Diploma"),
    BACHELORS("Bachelor's"),
    MASTERS("Master's"),
    PHD("PhD"),
    OTHER("Other");

    private final String value;

    EducationLevel(String value) {
        this.value = value;
    }

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
