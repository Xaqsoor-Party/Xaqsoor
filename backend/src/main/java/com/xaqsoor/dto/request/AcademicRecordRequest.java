package com.xaqsoor.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record AcademicRecordRequest(
        Long id,
        @NotBlank(message = "Institution name is required.")
        @Size(max = 150, message = "Institution name must not exceed 150 characters.")
        String institutionName,

        @Size(max = 100, message = "Degree must not exceed 100 characters.")
        String degree,

        @NotBlank(message = "Field of study is required.")
        @Size(max = 100, message = "Field of study must not exceed 100 characters.")
        String fieldOfStudy,

        @NotBlank(message = "Level is required.")
        @Size(max = 50, message = "Level must not exceed 50 characters.")
        String level,

        @NotBlank(message = "Location is required.")
        @Size(max = 100, message = "Location must not exceed 100 characters.")
        String location,

        @NotNull(message = "Please specify whether you are currently studying.")
        Boolean currentlyStudying,

        @NotNull(message = "Start date is required.")
        LocalDate startDate,

        LocalDate endDate
) {
}
