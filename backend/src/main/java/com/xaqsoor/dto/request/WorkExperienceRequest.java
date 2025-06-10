package com.xaqsoor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record WorkExperienceRequest(
        Long id,

        @NotBlank(message = "Job title is required")
        @Size(max = 100, message = "Job title must be at most 100 characters")
        String jobTitle,

        @NotBlank(message = "Company name is required")
        @Size(max = 150, message = "Company name must be at most 150 characters")
        String companyName,

        @NotBlank(message = "Location is required")
        @Size(max = 100, message = "Location must be at most 100 characters")
        String location,

        @NotNull(message = "Start date is required")
        LocalDate startDate,

        LocalDate endDate,

        @NotNull(message = "Currently working must be specified")
        Boolean currentlyWorking,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description
) {
}
