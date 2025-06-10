package com.xaqsoor.service.impl;

import com.xaqsoor.dto.WorkExperienceDto;
import com.xaqsoor.dto.request.WorkExperienceRequest;
import com.xaqsoor.dto.response.WorkExperienceListDto;
import com.xaqsoor.entity.User;
import com.xaqsoor.entity.WorkExperience;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.mapper.WorkExperienceMapper;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.repository.WorkExperienceRepository;
import com.xaqsoor.service.WorkExperienceService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class WorkExperienceServiceImpl implements WorkExperienceService {
    private final WorkExperienceRepository workExperienceRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public WorkExperienceListDto getWorkExperiencesByUserId(Long userId) {
        List<WorkExperience> experiences = workExperienceRepository.findByUserIdOrderByStartDateDesc(userId);

        List<WorkExperienceDto> workExperienceDtoList = experiences.stream()
                .map(WorkExperienceMapper::toDto)
                .toList();

        return new WorkExperienceListDto(workExperienceDtoList);
    }

    @Override
    @Transactional
    public WorkExperienceDto saveOrUpdateWorkExperience(Long userId, WorkExperienceRequest request) {
        User user = getUserOrThrow(userId);

        WorkExperience workExperience = WorkExperience.builder()
                .user(user)
                .jobTitle(request.jobTitle())
                .companyName(request.companyName())
                .location(request.location())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .currentlyWorking(request.currentlyWorking())
                .description(request.description())
                .build();
        WorkExperience saved = workExperienceRepository.save(workExperience);
        return WorkExperienceMapper.toDto(saved);
    }

    private User getUserOrThrow(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found."));
    }
}
