package com.xaqsoor.service;

import com.xaqsoor.dto.request.AcademicRecordRequest;
import com.xaqsoor.dto.request.UserUpdateDTO;
import com.xaqsoor.dto.request.WorkExperienceRequest;
import com.xaqsoor.dto.response.UserCardListDto;
import com.xaqsoor.dto.response.UserProfileResponse;

import java.util.List;

public interface UserProfileService {
    void updateUserProfile(Long userId, UserUpdateDTO userDTO,
                                  List<AcademicRecordRequest> academicRecords,
                                  List<WorkExperienceRequest> workExperiences);

    UserProfileResponse getUserProfile(Long userId);

    UserCardListDto searchUserCards(
            String searchTerm,
            String statusFilter,
            String roleFilter,
            String genderFilter,
            String membershipLevelFilter,
            String orderBy,
            int pageNumber,
            int pageSize
    );
}
