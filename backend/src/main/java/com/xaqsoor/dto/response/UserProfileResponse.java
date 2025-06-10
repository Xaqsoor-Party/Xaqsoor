package com.xaqsoor.dto.response;

import com.xaqsoor.dto.request.AcademicRecordRequest;
import com.xaqsoor.dto.request.UserUpdateDTO;
import com.xaqsoor.dto.request.WorkExperienceRequest;

import java.util.List;

public record UserProfileResponse(
        UserUpdateDTO userData,
        List<AcademicRecordRequest> academicRecords,
        List<WorkExperienceRequest> workExperiences
) {
}
