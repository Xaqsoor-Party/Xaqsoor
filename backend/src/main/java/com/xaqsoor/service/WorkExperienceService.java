package com.xaqsoor.service;

import com.xaqsoor.dto.WorkExperienceDto;
import com.xaqsoor.dto.request.WorkExperienceRequest;
import com.xaqsoor.dto.response.WorkExperienceListDto;

public interface WorkExperienceService {
    WorkExperienceListDto getWorkExperiencesByUserId(Long userId);
    WorkExperienceDto saveOrUpdateWorkExperience(Long userId, WorkExperienceRequest workExperienceRequest);
}
