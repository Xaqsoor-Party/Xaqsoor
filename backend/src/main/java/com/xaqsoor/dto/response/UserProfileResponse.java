package com.xaqsoor.dto.response;

import com.xaqsoor.dto.UserDto;
import com.xaqsoor.dto.request.AcademicRecordRequest;
import com.xaqsoor.dto.request.WorkExperienceRequest;

import java.util.List;

public record UserProfileResponse(
        UserDto userData,
        List<AcademicRecordRequest> academicRecords,
        List<WorkExperienceRequest> workExperiences
) {
}
