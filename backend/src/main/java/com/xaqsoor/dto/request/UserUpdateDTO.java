package com.xaqsoor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserUpdateDTO(
        Long id,

        @NotBlank(message = "First name is required")
        @Size(max = 15, message = "First name must be at most 15 characters")
        String firstName,

        @NotBlank(message = "Middle name is required")
        @Size(max = 15, message = "Middle name must be at most 15 characters")
        String middleName,

        @NotBlank(message = "Last name is required")
        @Size(max = 15, message = "Last name must be at most 15 characters")
        String lastName,

        @NotBlank(message = "Gender is required")
        @Size(max = 10, message = "Gender must be at most 10 characters")
        String gender,

        @Size(max = 50, message = "Place of birth must be at most 50 characters")
        String placeOfBirth,

        LocalDate dateOfBirth,

        @Size(max = 500, message = "Bio must be at most 500 characters")
        String bio,

        @Size(max = 200, message = "Street must be at most 200 characters")
        String street,

        @Size(max = 100, message = "City must be at most 100 characters")
        String city,

        @Size(max = 100, message = "State must be at most 100 characters")
        String state,

        @Size(max = 100, message = "Country must be at most 100 characters")
        String country
) {
}
