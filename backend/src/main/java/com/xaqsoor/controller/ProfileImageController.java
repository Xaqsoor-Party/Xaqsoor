package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.AcademicRecordDto;
import com.xaqsoor.dto.WorkExperienceDto;
import com.xaqsoor.dto.request.AcademicRecordRequest;
import com.xaqsoor.dto.request.WorkExperienceRequest;
import com.xaqsoor.dto.response.AcademicRecordListDto;
import com.xaqsoor.dto.response.WorkExperienceListDto;
import com.xaqsoor.service.AcademicRecordService;
import com.xaqsoor.service.ProfileImageService;
import com.xaqsoor.service.WorkExperienceService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.URI;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class ProfileImageController {
    private final ProfileImageService profileImageService;
    private final WorkExperienceService workExperienceService;
    private final AcademicRecordService academicRecordService;

    @PostMapping("/{userId}/upload-profile-image")
    public ResponseEntity<Response> saveProfileImage(@PathVariable String userId,
                                                     @RequestParam("profileImage") MultipartFile profileImage,
                                                     HttpServletRequest request) {
        String imgUrl =profileImageService.uploadProfileImage(userId, profileImage);
        return ResponseEntity.created(getUri()).body(RequestUtils.getResponse(request, Collections.singletonMap("profileImageUrl", imgUrl), "Profile image uploaded successfully", HttpStatus.CREATED));
    }

    @DeleteMapping("/{userId}/delete-profile-image")
    public ResponseEntity<Response> deleteProfileImage(@PathVariable String userId,HttpServletRequest request) {
        profileImageService.deleteProfileImage(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(RequestUtils.getResponse(request, Collections.emptyMap(), "Profile image deleted successfully", HttpStatus.NO_CONTENT));
    }

    @GetMapping("/{userId}/work-experiences")
    public ResponseEntity<Response> getWorkExperiences(@PathVariable Long userId, HttpServletRequest request) {
        WorkExperienceListDto workExperiences = workExperienceService.getWorkExperiencesByUserId(userId);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("workExperiences", workExperiences),
                        "Work experiences fetched successfully",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/{userId}/work-experiences")
    public ResponseEntity<Response> saveWorkExperience(@PathVariable Long userId,
                                                       @Valid @RequestBody WorkExperienceRequest request,
                                                       HttpServletRequest httpRequest) {
        WorkExperienceDto saved = workExperienceService.saveOrUpdateWorkExperience(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                RequestUtils.getResponse(
                        httpRequest,
                        Collections.singletonMap("workExperience", saved),
                        "Work experience saved successfully",
                        HttpStatus.CREATED
                )
        );
    }

    @GetMapping("/{userId}/academic-records")
    public ResponseEntity<Response> getAcademicRecords(@PathVariable Long userId, HttpServletRequest request) {
        AcademicRecordListDto academicRecords = academicRecordService.getAllByUserId(userId);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        request,
                        Collections.singletonMap("academicRecords", academicRecords),
                        "Academic records fetched successfully",
                        HttpStatus.OK
                )
        );
    }

    @PostMapping("/{userId}/academic-records")
    public ResponseEntity<Response> saveAcademicRecord(@PathVariable Long userId,
                                                       @Valid @RequestBody AcademicRecordRequest request,
                                                       HttpServletRequest httpRequest) {
        AcademicRecordDto saved = academicRecordService.saveOrUpdate(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                RequestUtils.getResponse(
                        httpRequest,
                        Collections.singletonMap("academicRecord", saved),
                        "Academic record saved successfully",
                        HttpStatus.CREATED
                )
        );
    }

    private URI getUri() {
        return URI.create("/api/v1/users");
    }
}
