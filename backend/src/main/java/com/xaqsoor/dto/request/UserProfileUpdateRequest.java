package com.xaqsoor.dto.request;

import jakarta.validation.Valid;

import java.util.List;

public record UserProfileUpdateRequest(
        @Valid UserUpdateDTO userUpdateDTO,
        @Valid List<AcademicRecordRequest> academicRecords,
        @Valid List<WorkExperienceRequest> workExperiences
) {}
