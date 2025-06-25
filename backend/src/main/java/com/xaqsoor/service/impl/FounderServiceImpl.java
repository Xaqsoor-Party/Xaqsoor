package com.xaqsoor.service.impl;

import com.xaqsoor.dto.request.FounderRequestDto;
import com.xaqsoor.entity.*;
import com.xaqsoor.enumeration.EducationLevel;
import com.xaqsoor.enumeration.IdCardType;
import com.xaqsoor.enumeration.MembershipLevel;
import com.xaqsoor.enumeration.Status;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.*;
import com.xaqsoor.service.FounderService;
import com.xaqsoor.util.UniqueIdGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static org.apache.commons.lang3.StringUtils.EMPTY;

@Service
@Transactional(rollbackOn = Exception.class)
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class FounderServiceImpl implements FounderService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserDocumentRepository userDocumentRepository;
    private final WorkExperienceRepository workExperienceRepository;
    private final AcademicRecordRepository academicRecordRepository;

    @Override
    public void submitFounderProfile(FounderRequestDto request) {
        validateUniqueFields(request.email(), request.phone());
        User user = createUserFromRequest(request);
        userRepository.save(user);
        saveUserDocuments(request, user);
        saveWorkExperiences(request, user);
        saveAcademicRecords(request, user);
    }

    private User createUserFromRequest(FounderRequestDto request) {
        return User.builder()
                .userId("XQ-" + UniqueIdGenerator.generateTimestampBased())
                .firstName(request.firstName())
                .middleName(request.middleName())
                .lastName(request.lastName())
                .gender(request.gender())
                .placeOfBirth(request.placeOfBirth())
                .dateOfBirth(request.dateOfBirth())
                .email(request.email().toLowerCase())
                .phone(request.phone())
                .networkOperator(request.networkOperator())
                .signatureImageBase64(request.signatureImageBase64())
                .role(getRole())
                .city(request.city())
                .country(request.country())
                .street(request.street())
                .state(request.state())
                .status(Status.PENDING)
                .membershipLevel(MembershipLevel.FOUNDER)
                .profileImageKey(request.profileImageKey())
                .bio(EMPTY)
                .mfaSecret(EMPTY)
                .mfaQrCodeImageUri(EMPTY)
                .failedLoginAttempts(0)
                .accountNonExpired(true)
                .accountNonLocked(true)
                .isLoginRestricted(false)
                .emailVerified(false)
                .enabled(true)
                .mfaEnabled(false)
                .build();
    }

    private void saveUserDocuments(FounderRequestDto request, User user) {
        request.documents().forEach(docRequest -> {
            UserDocument document = UserDocument.builder()
                    .documentType(IdCardType.valueOf(docRequest.documentType()))
                    .fileStorageKey(docRequest.fileStorageKey())
                    .verified(false)
                    .rejectionReason(EMPTY)
                    .country(docRequest.country())
                    .documentNumber(docRequest.documentNumber())
                    .issuedAt(docRequest.issuedAt())
                    .expiresAt(docRequest.expiresAt())
                    .user(user)
                    .build();
            userDocumentRepository.save(document);
        });
    }

    private void saveWorkExperiences(FounderRequestDto request, User user) {
        request.workExperienceRequestList().forEach(exp -> {
            WorkExperience workExperience = WorkExperience.builder()
                    .user(user)
                    .jobTitle(exp.jobTitle())
                    .companyName(exp.companyName())
                    .location(exp.location())
                    .startDate(exp.startDate())
                    .endDate(exp.endDate())
                    .currentlyWorking(exp.currentlyWorking())
                    .description(exp.description())
                    .build();
            workExperienceRepository.save(workExperience);
        });
    }

    private void saveAcademicRecords(FounderRequestDto request, User user) {
        request.academicRecordRequestList().forEach(record -> {
            AcademicRecord academicRecord = AcademicRecord.builder()
                    .user(user)
                    .institutionName(record.institutionName())
                    .degree(record.degree())
                    .fieldOfStudy(record.fieldOfStudy())
                    .level(EducationLevel.valueOf(record.level()))
                    .location(record.location())
                    .currentlyStudying(record.currentlyStudying())
                    .startDate(record.startDate())
                    .endDate(record.endDate())
                    .build();
            academicRecordRepository.save(academicRecord);
        });
    }

    private Role getRole() {
        return roleRepository.findByNameIgnoreCase("MEMBER")
                .orElseThrow(() -> new ApiException("Role with name 'MEMBER' not found"));
    }

    private void validateUniqueFields(String email, String phone) {
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiException("An account with this email already exists.");
        }
        if (userRepository.existsByPhoneIgnoreCase(phone)) {
            throw new ApiException("An account with this phone number already exists.");
        }
    }

}