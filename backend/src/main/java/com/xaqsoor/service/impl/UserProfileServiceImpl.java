package com.xaqsoor.service.impl;

import com.xaqsoor.dto.request.AcademicRecordRequest;
import com.xaqsoor.dto.request.UserUpdateDTO;
import com.xaqsoor.dto.request.WorkExperienceRequest;
import com.xaqsoor.dto.response.UserProfileResponse;
import com.xaqsoor.entity.AcademicRecord;
import com.xaqsoor.entity.User;
import com.xaqsoor.entity.WorkExperience;
import com.xaqsoor.enumeration.EducationLevel;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.AcademicRecordRepository;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.repository.WorkExperienceRepository;
import com.xaqsoor.service.UserProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class UserProfileServiceImpl implements UserProfileService {
    private final UserRepository userRepository;
    private final AcademicRecordRepository academicRecordRepository;
    private final WorkExperienceRepository workExperienceRepository;

    @Override
    public void updateUserProfile(Long userId, UserUpdateDTO userDTO, List<AcademicRecordRequest> academicRecords, List<WorkExperienceRequest> workExperiences) {
        User user = findUserById(userId);
        updateUserFromDTO(user, userDTO);
        userRepository.save(user);

        processAcademicRecords(user, academicRecords);
        processWorkExperiences(user, workExperiences);
    }

    @Override
    public UserProfileResponse getUserProfile(Long userId) {
        User user = findUserById(userId);
        UserUpdateDTO userDto = mapToUserUpdateDTO(user);
        List<AcademicRecordRequest> academicRecords = mapToAcademicRecordRequests(academicRecordRepository.findByUserIdOrderByStartDateDesc(userId));
        List<WorkExperienceRequest> workExperience = mapToWorkExperiences(workExperienceRepository.findByUserIdOrderByStartDateDesc(userId));

        return new UserProfileResponse(userDto, academicRecords, workExperience);
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
        for (AcademicRecordRequest dto : academicRecords) {
            AcademicRecord record = dto.id() != null ?
                    academicRecordRepository.findById(dto.id())
                            .orElseThrow(() -> new ApiException("Academic record not found")) :
                    new AcademicRecord();

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
        for (WorkExperienceRequest dto : workExperiences) {
            WorkExperience exp = dto.id() != null ?
                    workExperienceRepository.findById(dto.id())
                            .orElseThrow(() -> new ApiException("Work experience not found")) :
                    new WorkExperience();

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

    private UserUpdateDTO mapToUserUpdateDTO(User user) {
        return new UserUpdateDTO(
                user.getId(),
                user.getFirstName(),
                user.getMiddleName(),
                user.getLastName(),
                user.getGender(),
                user.getPlaceOfBirth(),
                user.getDateOfBirth(),
                user.getBio(),
                user.getStreet(),
                user.getCity(),
                user.getState(),
                user.getCountry()
        );
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
}
