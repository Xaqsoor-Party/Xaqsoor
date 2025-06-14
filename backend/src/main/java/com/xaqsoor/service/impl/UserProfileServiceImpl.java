package com.xaqsoor.service.impl;

import com.xaqsoor.dto.UserDto;
import com.xaqsoor.dto.request.AcademicRecordRequest;
import com.xaqsoor.dto.request.UserUpdateDTO;
import com.xaqsoor.dto.request.WorkExperienceRequest;
import com.xaqsoor.dto.response.UserCardDTO;
import com.xaqsoor.dto.response.UserCardListDto;
import com.xaqsoor.dto.response.UserProfileResponse;
import com.xaqsoor.entity.AcademicRecord;
import com.xaqsoor.entity.User;
import com.xaqsoor.entity.WorkExperience;
import com.xaqsoor.enumeration.EducationLevel;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.mapper.UserMapper;
import com.xaqsoor.repository.AcademicRecordRepository;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.repository.WorkExperienceRepository;
import com.xaqsoor.service.S3Service;
import com.xaqsoor.service.UserProfileService;
import com.xaqsoor.util.UserSortUtil;
import com.xaqsoor.util.UserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class UserProfileServiceImpl implements UserProfileService {
    private final UserRepository userRepository;
    private final AcademicRecordRepository academicRecordRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final S3Service s3Service;

    @Override
    public void updateUserProfile(Long userId, UserUpdateDTO userDTO, List<AcademicRecordRequest> academicRecords, List<WorkExperienceRequest> workExperiences) {
        User user = findUserById(userId);
        updateUserFromDTO(user, userDTO);
        userRepository.save(user);

        processAcademicRecords(user, academicRecords);
        processWorkExperiences(user, workExperiences);
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getUserProfile(Long userId) {
        User user = findUserById(userId);
        String profileImageUrl = UserUtil.resolveProfileImageUrl(user.getProfileImageKey(), s3Service);
        UserDto userDto = UserMapper.toDTO(user,profileImageUrl);
        List<AcademicRecordRequest> academicRecords = mapToAcademicRecordRequests(academicRecordRepository.findByUserIdOrderByStartDateDesc(userId));
        List<WorkExperienceRequest> workExperience = mapToWorkExperiences(workExperienceRepository.findByUserIdOrderByStartDateDesc(userId));

        return new UserProfileResponse(userDto, academicRecords, workExperience);
    }

    @Override
    @Transactional(readOnly = true)
    public UserCardListDto searchUserCards(String searchTerm,
                                           String statusFilter,
                                           String roleFilter,
                                           String genderFilter,
                                           String membershipLevelFilter,
                                           String orderBy,
                                           int pageNumber,
                                           int pageSize) {
        String status = UserSortUtil.parseStatusFilter(statusFilter);
        String membershipLevel = UserSortUtil.parseMembershipLevelFilter(membershipLevelFilter);
        if (!UserSortUtil.isValidOrderBy(orderBy)) {
            orderBy = "createdDateDesc";
        }

        Pageable pageable = UserSortUtil.createPageable(pageNumber, pageSize, orderBy);

        Page<User> userPage = userRepository.searchUserCardsNative(
                searchTerm,
                status,
                roleFilter,
                genderFilter,
                membershipLevel,
                pageable);

        return mapToUserCardListDto(userPage, s3Service);
    }

    private void updateUserFromDTO(User user, UserUpdateDTO userDTO) {
        user.setFirstName(userDTO.firstName());
        user.setMiddleName(userDTO.middleName());
        user.setLastName(userDTO.lastName());
        user.setGender(userDTO.gender());
        user.setPlaceOfBirth(userDTO.placeOfBirth());
        user.setDateOfBirth(userDTO.dateOfBirth());
        user.setBio(userDTO.bio());
        user.setStreet(userDTO.street());
        user.setCity(userDTO.city());
        user.setState(userDTO.state());
        user.setCountry(userDTO.country());
    }

    private void processAcademicRecords(User user, List<AcademicRecordRequest> academicRecords) {
        List<AcademicRecord> existingRecords = academicRecordRepository.findByUserIdOrderByStartDateDesc(user.getId());

        // Track IDs from the request for comparison
        List<Long> incomingIds = academicRecords.stream()
                .map(AcademicRecordRequest::id)
                .filter(Objects::nonNull)
                .toList();

        // Delete records that are not in the incoming request
        for (AcademicRecord record : existingRecords) {
            if (record.getId() != null && !incomingIds.contains(record.getId())) {
                academicRecordRepository.delete(record);
            }
        }

        for (AcademicRecordRequest dto : academicRecords) {
            AcademicRecord record;
            if (dto.id() != null) {
                record = academicRecordRepository.findById(dto.id())
                        .orElseThrow(() -> new ApiException("Academic record not found"));
            } else {
                record = new AcademicRecord();
            }

            record.setUser(user);
            record.setInstitutionName(dto.institutionName());
            record.setDegree(dto.degree());
            record.setFieldOfStudy(dto.fieldOfStudy());
            record.setLevel(EducationLevel.fromString(dto.level()));
            record.setLocation(dto.location());
            record.setCurrentlyStudying(dto.currentlyStudying());
            record.setStartDate(dto.startDate());
            record.setEndDate(dto.endDate());

            academicRecordRepository.save(record);
        }
    }

    private void processWorkExperiences(User user, List<WorkExperienceRequest> workExperiences) {
        List<WorkExperience> existingExperiences = workExperienceRepository.findByUserIdOrderByStartDateDesc(user.getId());

        List<Long> incomingIds = workExperiences.stream()
                .map(WorkExperienceRequest::id)
                .filter(Objects::nonNull)
                .toList();

        for (WorkExperience experience : existingExperiences) {
            if (experience.getId() != null && !incomingIds.contains(experience.getId())) {
                workExperienceRepository.delete(experience);
            }
        }

        for (WorkExperienceRequest dto : workExperiences) {
            WorkExperience exp;
            if (dto.id() != null) {
                exp = workExperienceRepository.findById(dto.id())
                        .orElseThrow(() -> new ApiException("Work experience not found"));
            } else {
                exp = new WorkExperience();
            }

            exp.setUser(user);
            exp.setJobTitle(dto.jobTitle());
            exp.setCompanyName(dto.companyName());
            exp.setLocation(dto.location());
            exp.setStartDate(dto.startDate());
            exp.setEndDate(dto.endDate());
            exp.setCurrentlyWorking(dto.currentlyWorking());
            exp.setDescription(dto.description());

            workExperienceRepository.save(exp);
        }
    }

    private User findUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found"));
    }

    private List<AcademicRecordRequest> mapToAcademicRecordRequests(List<AcademicRecord> records) {
        return records.stream()
                .map(record -> new AcademicRecordRequest(
                        record.getId(),
                        record.getInstitutionName(),
                        record.getDegree(),
                        record.getFieldOfStudy(),
                        record.getLevel().getValue(),
                        record.getLocation(),
                        record.getCurrentlyStudying(),
                        record.getStartDate(),
                        record.getEndDate()
                ))
                .toList();
    }

    private List<WorkExperienceRequest> mapToWorkExperiences(List<WorkExperience> experiences) {
        return experiences.stream()
                .map(experience -> new WorkExperienceRequest(
                        experience.getId(),
                        experience.getJobTitle(),
                        experience.getCompanyName(),
                        experience.getLocation(),
                        experience.getStartDate(),
                        experience.getEndDate(),
                        experience.getCurrentlyWorking(),
                        experience.getDescription()
                ))
                .toList();
    }

    public static UserCardListDto mapToUserCardListDto(Page<User> userPage, S3Service s3Service) {
        List<UserCardDTO> userCards = userPage.getContent().stream()
                .map(user -> {
                    String profileImageUrl;
                    if ("AsalGuardian".equals(user.getUserId())) {
                        profileImageUrl = user.getProfileImageKey();
                    } else {
                        profileImageUrl = UserUtil.resolveProfileImageUrl(user.getProfileImageKey(), s3Service);
                    }

                    return new UserCardDTO(
                            user.getId(),
                            buildFullName(user.getFirstName(), user.getMiddleName(), user.getLastName()),
                            user.getEmail(),
                            user.getPhone(),
                            profileImageUrl,
                            user.getRole() != null ? user.getRole().getName() : null,
                            user.getStatus().name()
                    );
                })
                .collect(Collectors.toList());

        return new UserCardListDto(
                (int) userPage.getTotalElements(),
                userPage.getNumber(),
                userPage.getSize(),
                userCards
        );
    }

    private static String buildFullName(String firstName, String middleName, String lastName) {
        StringBuilder fullName = new StringBuilder();
        if (firstName != null && !firstName.isBlank()) fullName.append(firstName.trim());
        if (middleName != null && !middleName.isBlank()) fullName.append(" ").append(middleName.trim());
        if (lastName != null && !lastName.isBlank()) fullName.append(" ").append(lastName.trim());
        return fullName.toString().trim();
    }

}
