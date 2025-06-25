package com.xaqsoor.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.util.List;

public record FounderRequestDto(
        @NotBlank(message = "First name is required")
        @Size(max = 15,message = "First name must be at most 15 characters")
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
        @NotBlank(message = "Place of birth is required")
        String placeOfBirth,

        @Past(message = "Date of birth must be in the past")
        @NotNull(message = "Date of birth is required")
        LocalDate dateOfBirth,

        @Email(message = "Invalid email format")
        @NotBlank(message = "Email is required")
        @Size(max = 255, message = "Email must be at most 255 characters")
        String email,

        @NotBlank(message = "Phone number is required")
        @Size(max = 15, message = "Phone number must be at most 15 characters")
        String phone,

        @NotBlank(message = "Network operator is required")
        @Size(max = 50,message = "Network Operator must be at most 50 characters")
        String networkOperator,

        @NotBlank(message = "Profile image is required")
        @Size(max = 255,message = "Profile image key must be at most 255 characters")
        String profileImageKey,

        @Size(max = 2_000_000, message = "Signature image is too large")
        @NotBlank(message = "Signature image is required")
        String signatureImageBase64,

        @NotBlank(message = "City is required")
        @Size(max = 100,message = "City must be at most 100 characters")
        String city,

        @NotBlank(message = "Country is required")
        @Size(max = 100, message = "Country must be at most 100 characters")
        String country,

        @NotEmpty(message = "At least one document is required")
        @Valid
        List<UserDocumentRequestDto> documents,

        @NotEmpty(message = "At least one document is required")
        @Valid
        List<WorkExperienceRequest> workExperienceRequestList,

        @NotEmpty(message = "At least one document is required")
        @Valid
        List<AcademicRecordRequest> academicRecordRequestList,

        @Size(max = 200, message = "Street must be at most 200 characters")
        String street,

        @Size(max = 100, message = "State must be at most 100 characters")
        String state
) {
}
