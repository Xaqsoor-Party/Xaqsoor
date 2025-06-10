package com.xaqsoor.controller;

import com.xaqsoor.domain.Response;
import com.xaqsoor.dto.request.UserProfileUpdateRequest;
import com.xaqsoor.dto.response.UserProfileResponse;
import com.xaqsoor.service.UserProfileService;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;

    @PutMapping("/{userId}/profile")
    public ResponseEntity<Response> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserProfileUpdateRequest request,
            HttpServletRequest servletRequest) {

        userProfileService.updateUserProfile(userId, request.userUpdateDTO(), request.academicRecords(), request.workExperiences());

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        servletRequest,
                        null,
                        "User profile updated successfully",
                        HttpStatus.OK
                )
        );
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<Response> getUserProfile(
            @PathVariable Long userId,
            HttpServletRequest servletRequest) {

        UserProfileResponse userProfile = userProfileService.getUserProfile(userId);

        return ResponseEntity.ok(
                RequestUtils.getResponse(
                        servletRequest,
                        Collections.singletonMap("profile", userProfile),
                        "User profile retrieved successfully",
                        HttpStatus.OK
                )
        );
    }
}
