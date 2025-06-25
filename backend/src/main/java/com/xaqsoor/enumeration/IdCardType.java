package com.xaqsoor.enumeration;

import com.xaqsoor.exception.ApiException;
import lombok.Getter;

@Getter
public enum IdCardType {
    NATIONAL_ID("National ID"),
    PASSPORT("Passport");

    private final String value;

    IdCardType(String value) {
        this.value = value;
    }

    public static IdCardType fromString(String value) {
        if (value == null) {
            throw new ApiException("ID Card Type cannot be null");
        }
        for (IdCardType type : IdCardType.values()) {
            if (type.value.equalsIgnoreCase(value.trim())) {
                return type;
            }
        }
        throw new ApiException("Invalid ID Card Type: " + value);
    }
}
